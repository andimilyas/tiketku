'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import FlightSearchForm from '@/components/features/flight/FlightSearchForm';
import FlightResults from '@/components/features/flight/FlightResults';
import { FlightSearchParams } from '@/types/flight';
import HorizontalFlightSearch from '@/components/features/flight/HorizontalFlightSearch';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { searchFlights } from '@/store/slices/searchSlice';

export default function FlightSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Cek apakah ada parameter pencarian di URL
  const hasSearchParams = searchParams.get('d') && searchParams.get('a') && searchParams.get('date');

  useEffect(() => {
    // Jika ada parameter pencarian di URL dan belum pernah search, langsung tampilkan hasil
    if (hasSearchParams && !hasSearched) {
      const loadInitialSearch = async () => {
        setIsSearching(true);
        const searchParamObj: FlightSearchParams = {
          departure: searchParams.get('d') || '',
          arrival: searchParams.get('a') || '',
          departureDate: searchParams.get('date') || '',
          returnDate: searchParams.get('returnDate') || '',
          passengers: {
            adults: parseInt(searchParams.get('adult') || '0'),
            children: parseInt(searchParams.get('child') || '0'),
            infants: parseInt(searchParams.get('infant') || '0'),
          },
          class: searchParams.get('class') as 'economy' | 'business' | 'first',
          tripType: searchParams.get('returnDate') ? 'round-trip' : 'one-way'
        };

        try{
          await dispatch(searchFlights(searchParamObj));
          setIsSearching(false);
          setHasSearched(true);
        } catch (error) {
          console.error('Error searching flights:', error);
        } finally {
          setIsSearching(false);
        }
      };
      
      loadInitialSearch();
    }
  }, [hasSearchParams, hasSearched, searchParams, dispatch]);

  const handleSearch = (params: FlightSearchParams) => {
    setIsSearching(true);

    // Bangun parameter URL dari data form
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

    // Update URL (tanpa reload)
    router.push(`/pesawat/search?${urlParams.toString()}`, { scroll: false });

    setHasSearched(true);
    setIsSearching(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (hasSearchParams) {
        // Reload data when user clicks back button
        setHasSearched(false);
        setHasSearched(true); // Ini akan memicu useEffect untuk load data
      }
    };
  
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasSearchParams]);

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
        {/* Hasil Pencarian */}
        {hasSearched && (
          <Box sx={{ mt: 4 }}>
            {isSearching ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <FlightResults />
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}