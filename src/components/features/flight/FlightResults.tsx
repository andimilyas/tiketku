'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, Alert, Typography } from '@mui/material';
import { RootState, AppDispatch } from '@/store';
import { selectFlight } from '@/store/slices/bookingSlice';
import { ProcessedFlight } from '@/types/flight';
import FlightCard from '@/components/features/flight/FlightCard';

export default function FlightResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { flights, error, filters, sortBy, sortOrder, isLoading, hasUserInteractedWithFilters } = useSelector((state: RootState) => state.search);

  // Get search params
  const departure = searchParams.get('d') || '';
  const arrival = searchParams.get('a') || '';
  const departureDate = searchParams.get('date') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const travelClass = searchParams.get('class') || 'economy';
  const adult = searchParams.get('adult') || '1';
  const child = searchParams.get('child') || '0';
  const infant = searchParams.get('infant') || '0';

  // Filter flights with proper logic - only apply filters if user has interacted with them
  const filteredFlights = React.useMemo(() => {    
    if (!flights || flights.length === 0) {
      return [];
    }

    // If user hasn't interacted with filters, return all flights
    if (!hasUserInteractedWithFilters) {
      return flights;
    }

    return flights.filter(flight => {
      try {
        // Filter by airlines - only if user has selected specific airlines
        if (filters.selectedAirlines.length > 0) {
          if (!filters.selectedAirlines.includes(flight.airline.name)) {
            return false;
          }
        }

        // Filter by price range - only if user has changed from default range
        const price = flight.price.economy;
        const isDefaultPriceRange = filters.selectedPriceRange.min === filters.priceRange.min && 
                                   filters.selectedPriceRange.max === filters.priceRange.max;
        
        if (!isDefaultPriceRange) {
          if (price < filters.selectedPriceRange.min || price > filters.selectedPriceRange.max) {
            return false;
          }
        }

        // Filter by departure time slots - only if user has selected time slots
        if (filters.departureTimeSlots && filters.departureTimeSlots.length > 0) {
          const departureHour = new Date(flight.departure.time).getHours();
          const matchesDeparture = filters.departureTimeSlots.some(slot => {
            const [start, end] = slot.split('-').map(Number);
            return departureHour >= start && departureHour < end;
          });
          if (!matchesDeparture) return false;
        }

        // Filter by arrival time slots - only if user has selected time slots
        if (filters.arrivalTimeSlots && filters.arrivalTimeSlots.length > 0) {
          const arrivalHour = new Date(flight.arrival.time).getHours();
          const matchesArrival = filters.arrivalTimeSlots.some(slot => {
            const [start, end] = slot.split('-').map(Number);
            return arrivalHour >= start && arrivalHour < end;
          });
          if (!matchesArrival) return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    });
  }, [flights, filters, hasUserInteractedWithFilters]);

  // Sort flights with better error handling
  const sortedFlights = React.useMemo(() => {    
    if (!filteredFlights || filteredFlights.length === 0) {
      return [];
    }

    try {
      const sorted = [...filteredFlights].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'price':
            comparison = (a.price.economy || 0) - (b.price.economy || 0);
            break;
          case 'departure':
            comparison = new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
            break;
          case 'arrival':
            comparison = new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime();
            break;
          case 'duration':
            const getDurationMinutes = (duration: string) => {
              const match = duration.match(/(\d+)h\s*(\d+)m/);
              if (match) {
                return parseInt(match[1]) * 60 + parseInt(match[2]);
              }
              return 0;
            };
            comparison = getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
            break;
          default:
            comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      console.log("✅ Sorted flights:", sorted.length);
      return sorted;
    } catch (error) {
      console.error("❌ Error sorting flights:", error);
      return filteredFlights;
    }
  }, [filteredFlights, sortBy, sortOrder]);

  const handleSelectFlight = (flight: ProcessedFlight) => {
    const flightId = `${flight.flightNumber}-${departureDate}`;
    dispatch(selectFlight(flight));

    const params = new URLSearchParams({
      d: departure,
      a: arrival,
      date: departureDate,
      returnDate,
      adult,
      child,
      infant,
      class: travelClass,
    });

    router.push(`/pesawat/review/${flightId}?${params.toString()}`);
  };

  // Debug logging
  useEffect(() => {
    console.log('[FlightResults] State update:', {
      flightsCount: flights.length,
      filteredCount: filteredFlights.length,
      sortedCount: sortedFlights.length,
      hasUserInteractedWithFilters,
      filters,
      sortBy,
      sortOrder,
      isLoading
    });
  }, [flights, filteredFlights, sortedFlights, filters, sortBy, sortOrder, isLoading, hasUserInteractedWithFilters]);

  // Show loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography>Loading flights...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Show no results from search
  if (flights.length === 0) {
    return (
      <Box py={10}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
          <Box display="flex" flexDirection="column" width={380} alignItems="center">
            <img
              src="/icons/no-data.svg"
              alt="Tidak ada data"
              style={{ width: 180, height: 180, marginBottom: 24, opacity: 0.85 }}
            />
            <Typography variant='h5' color='text.primary' align="center" fontWeight={800} gutterBottom>
              Penerbangan yang kamu cari nggak ketemu :(
            </Typography>
            <Typography variant='h6' color='textDisabled' align='center'>
              Ayo coba ganti tanggal atau destinasi lainnya untuk menemukan perjalanan seru.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Show filtered results message - only if user has interacted with filters
  if (filteredFlights.length === 0 && flights.length > 0 && hasUserInteractedWithFilters) {
    return (
      <Box py={10}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
          <Typography variant='h6' color='text.primary' align="center" fontWeight={600} gutterBottom>
            Tidak ada penerbangan yang sesuai dengan filter
          </Typography>
          <Typography variant='body1' color='textDisabled' align='center'>
            Coba ubah filter atau hapus beberapa kriteria pencarian
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid size={{ xs: 12 }}>
        {sortedFlights.map((flight) => (
          <FlightCard
            key={`${flight.id}-${flight.flightNumber}-${departureDate}`}
            flight={flight}
            onSelect={() => handleSelectFlight(flight)}
            travelClass={travelClass as 'economy' | 'business' | 'first'}
          />
        ))}
      </Grid>
    </Grid>
  );
}