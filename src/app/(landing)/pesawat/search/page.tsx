'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  CircularProgress,
  Grid,
  Skeleton
} from '@mui/material';
import FlightResults from '@/components/features/flight/FlightResults';
import { FlightSearchParams } from '@/types/flight';
import HorizontalFlightSearch from '@/components/features/flight/HorizontalFlightSearch';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { resetSearchState, searchFlights } from '@/store/slices/searchSlice';

import {
  FilterButton,
  AirlineFilter,
  TimeFilter,
  SortFilter
} from '@/components/features/flight/Filter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AirplanemodeActiveOutlinedIcon from '@mui/icons-material/AirplanemodeActiveOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { FilterModal } from '@/components/features/flight/Modal/FilterModal';

const FilterSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    {[1, 2, 3, 4].map((item) => (
      <Skeleton
        key={item}
        variant="rounded"
        width={100}
        height={36}
        sx={{ borderRadius: 8 }}
      />
    ))}
  </Box>
);

const FlightCardSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2, mb: 2 }} />
    <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2, mb: 2 }} />
    <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
  </Box>
);

export default function FlightSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [hasSearched, setHasSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [airlineAnchor, setAirlineAnchor] = useState<null | HTMLElement>(null);
  const [timeAnchor, setTimeAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  // Get state from Redux
  const { isLoading, flights, filters, sortBy, sortOrder } = useSelector((state: RootState) => state.search);

  // Check if we have search parameters
  const hasSearchParams = searchParams.get('d') && searchParams.get('a') && searchParams.get('date');

  // Handle search when URL parameters change
  useEffect(() => {
    const d = searchParams.get('d');
    const a = searchParams.get('a');
    const date = searchParams.get('date');
    const adult = searchParams.get('adult');
    const child = searchParams.get('child');
    const infant = searchParams.get('infant');
    const cls = searchParams.get('class');
    const returnDate = searchParams.get('returnDate');

    console.log('[FlightSearchPage] URL Params changed:', { d, a, date, returnDate, adult, child, infant, cls });

    if (d && a && date) {
      const searchParamObj: FlightSearchParams = {
        departure: d,
        arrival: a,
        departureDate: date,
        returnDate: returnDate || '',
        passengers: {
          adults: parseInt(adult || '1'),
          children: parseInt(child || '0'),
          infants: parseInt(infant || '0')
        },
        class: (cls as 'economy' | 'business' | 'first class') || 'economy',
        tripType: returnDate ? 'round-trip' : 'one-way'
      };

      console.log('[FlightSearchPage] Dispatching search with params:', searchParamObj);
      
      // Reset search state first
      dispatch(resetSearchState());
      
      // Then perform search
      dispatch(searchFlights(searchParamObj))
        .unwrap()
        .then(() => {
          console.log('[FlightSearchPage] Search completed successfully');
          setHasSearched(true);
        })
        .catch((error) => {
          console.error('[FlightSearchPage] Search failed:', error);
          setHasSearched(true); // Still set to true to show error state
        });
    } else {
      console.log('[FlightSearchPage] Incomplete search params, not searching');
      setHasSearched(false);
    }
  }, [
    searchParams.get('d'),
    searchParams.get('a'),
    searchParams.get('date'),
    searchParams.get('returnDate'),
    searchParams.get('adult'),
    searchParams.get('child'),
    searchParams.get('infant'),
    searchParams.get('class'),
    dispatch
  ]);

  const handleSearch = async (params: FlightSearchParams) => {
    console.log('[FlightSearchPage] Manual search triggered:', params);
    
    setHasSearched(false);

    // Build URL parameters
    const urlParams = new URLSearchParams({
      d: params.departure,
      a: params.arrival,
      date: params.departureDate,
      adult: params.passengers.adults.toString(),
      child: params.passengers.children.toString(),
      infant: params.passengers.infants.toString(),
      class: params.class,
      dType: 'CITY',
      aType: 'CITY',
      dLabel: params.departure,
      aLabel: params.arrival,
      type: 'depart',
      flexiFare: 'true'
    });

    if (params.returnDate) {
      urlParams.append('returnDate', params.returnDate);
    }

    // Update URL - this will trigger the useEffect above
    router.push(`/pesawat/search?${urlParams.toString()}`, { scroll: false });
  };

  console.log('[FlightSearchPage] Render state:', {
    isLoading,
    hasSearched,
    flightsCount: flights.length,
    hasSearchParams
  });

  return (
    <Box sx={{ backgroundColor: '#fff', py: 4 }}>
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 4,
          justifyContent: 'space-between'
        }}
      >
        <HorizontalFlightSearch onSearch={handleSearch} />
      </Container>

      <Container maxWidth="lg" sx={{ mt: 4, position: 'relative', zIndex: 2 }}>
        {/* Filter Section */}
        {isLoading ? (
          <FilterSkeleton />
        ) : hasSearched && flights.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: 2 }} mb={2}>
                <FilterButton
                  icon={<FilterAltIcon />}
                  label="Filter"
                  onClick={() => setOpen(true)}
                />
                <FilterButton
                  icon={<AirplanemodeActiveOutlinedIcon />}
                  label="Maskapai"
                  onClick={(e) => setAirlineAnchor(e.currentTarget)}
                />
                <FilterButton
                  icon={<AccessTimeOutlinedIcon />}
                  label="Waktu"
                  onClick={(e) => setTimeAnchor(e.currentTarget)}
                />
                <FilterButton
                  icon={<FilterListOutlinedIcon />}
                  label="Urutkan"
                  onClick={(e) => setSortAnchor(e.currentTarget)}
                />
              </Box>
            </Grid>

            <AirlineFilter
              anchorEl={airlineAnchor}
              onClose={() => setAirlineAnchor(null)}
              flights={flights}
              selectedAirlines={filters.selectedAirlines}
              dispatch={dispatch}
            /> 

            <TimeFilter
              anchorEl={timeAnchor}
              onClose={() => setTimeAnchor(null)}
              departureTimeSlots={filters.departureTimeSlots}
              arrivalTimeSlots={filters.arrivalTimeSlots}
              dispatch={dispatch}
            />

            <SortFilter
              anchorEl={sortAnchor}
              onClose={() => setSortAnchor(null)}
              sortBy={sortBy}
              sortOrder={sortOrder}
              dispatch={dispatch}
            />
          </Grid>
        ) : null}
      </Container>

      <Container maxWidth="lg" sx={{ mt: 4, position: 'relative', zIndex: 2 }}>
        {/* Results Section */}
        {isLoading ? (
          <FlightCardSkeleton />
        ) : hasSearched ? (
          <FlightResults />
        ) : null}
      </Container>

      <FilterModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}