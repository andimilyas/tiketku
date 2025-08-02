'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Skeleton
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  AirlineSeatReclineNormal,
  Flight
} from '@mui/icons-material';
import { RootState, AppDispatch } from '@/store';
import { selectFlight } from '@/store/slices/bookingSlice';
import {
  setSortBy,
  setSortOrder,
  setSelectedAirlines,
  setSelectedPriceRange
} from '@/store/slices/searchSlice';
import { ProcessedFlight } from '@/types/flight';
import dayjs from 'dayjs';
import { useState } from 'react';

// Airline Logo Component with fallback
function AirlineLogo({ airline }: { airline: { name: string; iata: string } }) {
  const [imageError, setImageError] = useState(false);
  const [svgError, setSvgError] = useState(false);

  if (!imageError) {
    return (
      <Box
        component="img"
        src={`/airlines/${airline.iata.toLowerCase()}.png`}
        alt={airline.name}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={() => setImageError(true)}
      />
    );
  }

  if (!svgError) {
    return (
      <Box
        component="img"
        src={`/airlines/${airline.iata.toLowerCase()}.svg`}
        alt={airline.name}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={() => setSvgError(true)}
      />
    );
  }

  // Final fallback to icon
  return <Flight sx={{ width: 40, height: 40, color: 'primary.main' }} />;
}

export default function FlightResults() {
  const searchParams = useSearchParams();

  const departure = searchParams.get('d') || '';
  const arrival = searchParams.get('a') || '';
  const departureDate = searchParams.get('date') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const travelClass = searchParams.get('class') || 'economy';
  const adult = searchParams.get('adult') || '1';
  const child = searchParams.get('child') || '0';
  const infant = searchParams.get('infant') || '0';
  
  const dispatch = useDispatch<AppDispatch>();
  const {
    flights,
    isLoading,
    error,
    filters,
    sortBy,
    sortOrder
  } = useSelector((state: RootState) => state.search);

  // Filter flights based on selected filters
  const filteredFlights = React.useMemo(() => {
    return flights.filter(flight => {
      // Filter by airlines
      if (
        filters.selectedAirlines.length > 0 &&
        !filters.selectedAirlines.includes(flight.airline.name)
      ) {
        return false;
      }

      // Filter by price range
      const price = flight.price.economy;
      if (price < filters.selectedPriceRange.min || price > filters.selectedPriceRange.max) {
        return false;
      }

      return true;
    });
  }, [flights, filters]);

  // Sort flights
  const sortedFlights = React.useMemo(() => {
    const sorted = [...filteredFlights].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.price.economy - b.price.economy;
          break;
        case 'departure':
          comparison = new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
          break;
        case 'arrival':
          comparison = new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime();
          break;
        case 'duration':
          // Parse duration string to minutes for comparison
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

    return sorted;
  }, [filteredFlights, sortBy, sortOrder]);

  const router = useRouter();

  const handleSelectFlight = (flight: ProcessedFlight) => {
    console.log('🎯 Selecting flight:', flight);
    
    // Gunakan tanggal dari URL search params, bukan dari flight.departure.time
    const searchDate = departureDate; // Gunakan tanggal pencarian
    
    // Pastikan format konsisten: FLIGHT_NUMBER-YYYY-MM-DD
    const flightId = `${flight.flightNumber}-${searchDate}`;
    
    console.log('🔗 Generated flight ID:', flightId);
    console.log('📅 Using search date:', searchDate);
    
    // Set flight ke Redux store terlebih dahulu
    dispatch(selectFlight(flight));
    
    const params = new URLSearchParams({
      d: departure,
      a: arrival,
      date: searchDate, // Gunakan tanggal pencarian
      returnDate: returnDate,
      adult: adult,
      child: child,
      infant: infant,
      class: travelClass,
    });
    
    const reviewUrl = `/pesawat/review/${flightId}?${params.toString()}`;
    console.log('🚀 Navigating to:', reviewUrl);
    
    router.push(reviewUrl);
  };

  const handleAirlineFilterChange = (airline: string, checked: boolean) => {
    const currentSelected = filters.selectedAirlines;
    const newSelected = checked
      ? [...currentSelected, airline]
      : currentSelected.filter(a => a !== airline);

    dispatch(setSelectedAirlines(newSelected));
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" minHeight={400} justifyContent="center" width="100%">
        <Box width="90%" maxWidth={700} mb={2}>
          <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (flights.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Tidak ada penerbangan ditemukan. Silakan coba dengan parameter pencarian yang berbeda.
      </Alert>
    );
  }

  console.log('flights', flights, 'isLoading', isLoading, 'error', error, 'filters', filters);

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Filters Sidebar */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Card sx={{ boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px', borderRadius: 2, p: 2 }}>
          <CardContent>
            {/* Sort Options */}
            <Box mb={3}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Urutkan berdasarkan</InputLabel>
                <Select
                  label='urutkan berdasarkan'
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                >
                  <MenuItem value="price">Harga</MenuItem>
                  <MenuItem value="departure">Waktu Berangkat</MenuItem>
                  <MenuItem value="arrival">Waktu Tiba</MenuItem>
                  <MenuItem value="duration">Durasi</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Urutan</InputLabel>
                <Select
                  label='urutan'
                  value={sortOrder}
                  onChange={(e) => dispatch(setSortOrder(e.target.value as any))}
                >
                  <MenuItem value="asc">Terendah ke Tertinggi</MenuItem>
                  <MenuItem value="desc">Tertinggi ke Terendah</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Price Range Filter */}
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Rentang Harga
              </Typography>
              <Slider
                value={[filters.selectedPriceRange.min, filters.selectedPriceRange.max]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  dispatch(setSelectedPriceRange({ min, max }));
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `Rp ${value.toLocaleString()}`}
                min={filters.priceRange.min}
                max={filters.priceRange.max}
                step={50000}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption">
                  Rp {filters.selectedPriceRange.min.toLocaleString()}
                </Typography>
                <Typography variant="caption">
                  Rp {filters.selectedPriceRange.max.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Airlines Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Maskapai
              </Typography>
              <FormGroup>
                {filters.airlines.map(airline => (
                  <FormControlLabel
                    key={airline}
                    control={
                      <Checkbox
                        checked={filters.selectedAirlines.includes(airline)}
                        onChange={(e) => handleAirlineFilterChange(airline, e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {airline}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {flights.filter(f => f.airline.name === airline).length} penerbangan
                        </Typography>
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Flight Results */}
      <Grid size={{ xs: 12, md: 9 }}>
        {sortedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={() => handleSelectFlight(flight)}
          />
        ))}
      </Grid>
    </Grid>
  );
}

// Flight Card Component
interface FlightCardProps {
  flight: ProcessedFlight;
  onSelect: () => void;
}

function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (time: string) => {
    return new Date(time).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getStatusColor = (status: ProcessedFlight['status']) => {
    switch (status) {
      case 'scheduled':
        return 'success' as const;
      case 'active':
        return 'primary' as const;
      case 'landed':
        return 'info' as const;
      case 'cancelled':
        return 'error' as const;
      case 'incident':
        return 'warning' as const;
      case 'diverted':
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  const getStatusText = (status: ProcessedFlight['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Terjadwal';
      case 'active':
        return 'Aktif';
      case 'landed':
        return 'Mendarat';
      case 'cancelled':
        return 'Dibatalkan';
      case 'incident':
        return 'Insiden';
      case 'diverted':
        return 'Dialihkan';
      default:
        return 'Tidak Diketahui';
    }
  };

  return (
    <Card
      onClick={() => {
        if (flight.status !== 'cancelled' && flight.availability.economy > 0) {
          onSelect(); // aksi ketika diklik
        }
      }}
      sx={{
        boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
        p: 1,
        borderRadius: 2,
        mb: 3,
        cursor:
          flight.status === 'cancelled' || flight.availability.economy === 0
            ? 'not-allowed'
            : 'pointer',
        opacity:
          flight.status === 'cancelled' || flight.availability.economy === 0
            ? 0.6
            : 1,
        pointerEvents:
          flight.status === 'cancelled' || flight.availability.economy === 0
            ? 'none'
            : 'auto',
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Airline Info */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <AirlineLogo airline={flight.airline} />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {flight.airline.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.flightNumber}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Flight Details */}
          <Grid size={{ xs: 12, sm: 6 }} borderRight='2px dashed' borderLeft='2px dashed' borderColor='divider' px={1}>
            <Grid container spacing={2} alignItems="center">
              {/* Departure */}
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {formatTime(flight.departure.time)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.departure.iata}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(flight.departure.time)}
                  </Typography>
                </Box>
              </Grid>              

              {/* Duration & Aircraft */}
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    <Box sx={{ flexGrow: 1, height: 1, bgcolor: 'divider' }} />
                    <FlightTakeoff sx={{ mx: 1, color: 'primary.main' }} />
                    <Box sx={{ flexGrow: 1, height: 1, bgcolor: 'divider' }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {flight.duration}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {flight.aircraft}
                  </Typography>
                </Box>
              </Grid>

              {/* Arrival */}
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {formatTime(flight.arrival.time)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.arrival.iata}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(flight.arrival.time)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Status & Availability */}
            <Box display="flex" alignItems="center" justifyContent='center' gap={1} mt={2}>
              <Chip
                label={getStatusText(flight.status)}
                color={getStatusColor(flight.status)}
                size="small"
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <AirlineSeatReclineNormal fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {flight.availability.economy} kursi tersedia
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Price & Select Button */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box textAlign="right">
              <Typography variant="h5" color='error' fontWeight="bold">
                  IDR {Number(flight.price.economy).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                / pax
              </Typography>
              {flight.price.business && (
                <Typography variant="caption" display="block" mt={1} color="text.secondary">
                  Bisnis: IDR {Number(flight.price.business).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}