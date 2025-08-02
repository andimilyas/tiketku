'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchFlightById, setSearchParams } from '@/store/slices/bookingSlice';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { FlightSearchParams, ProcessedFlight } from '@/types/flight';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { FlightTakeoff, AirlineSeatReclineNormal, Flight } from '@mui/icons-material';
import dayjs from 'dayjs';

// Memoized constants
const STATUS_CONFIG = {
  scheduled: { color: 'success' as const, text: 'Terjadwal' },
  active: { color: 'primary' as const, text: 'Aktif' },
  landed: { color: 'info' as const, text: 'Mendarat' },
  cancelled: { color: 'error' as const, text: 'Dibatalkan' },
  incident: { color: 'warning' as const, text: 'Insiden' },
  diverted: { color: 'warning' as const, text: 'Dialihkan' },
} as const;

const POPULAR_CITIES = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];

// Utility functions
const getStatusConfig = (status: ProcessedFlight['status']) => 
  STATUS_CONFIG[status] || { color: 'default' as const, text: 'Tidak Diketahui' };

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}j ${minutes}m`;
  }
  return duration;
};

const formatCurrency = (amount: number) => 
  Number(amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

// Memoized components
const AirlineLogo = React.memo(({ airline }: { airline: { name: string; iata: string } }) => {
  const [imageError, setImageError] = useState(false);
  const [svgError, setSvgError] = useState(false);

  const handleImageError = useCallback(() => setImageError(true), []);
  const handleSvgError = useCallback(() => setSvgError(true), []);

  if (!imageError) {
    return (
      <Box
        component="img"
        src={`/airlines/${airline.iata.toLowerCase()}.png`}
        alt={airline.name}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={handleImageError}
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
        onError={handleSvgError}
      />
    );
  }

  return <Flight sx={{ width: 40, height: 40, color: 'primary.main' }} />;
});

const FlightTimeline = React.memo(({ flight }: { flight: ProcessedFlight }) => (
  <Box display="flex" flexDirection="row" alignItems="stretch" mt={1}>
    {/* Stepper Line and Icons */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 40,
        mr: 2,
      }}
    >
      {/* Departure Dot */}
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#888',
          mb: 0.5,
          border: '2px solid #fff',
          zIndex: 1,
        }}
      />
      {/* Vertical Line */}
      <Box
        sx={{
          flex: 1,
          width: 0,
          minHeight: 32,
          borderRight: '1px dashed #888',
          mx: 'auto',
        }}
      />
      {/* Flight Icon */}
      <FlightTakeoff sx={{ fontSize: 24, color: 'GrayText', my: 0.5 }} />
      {/* Vertical Line */}
      <Box
        sx={{
          flex: 1,
          width: 0,
          minHeight: 32,
          borderRight: '1px dashed #888',
          mx: 'auto',
        }}
      />
      {/* Arrival Dot */}
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#888',
          mt: 0.5,
          border: '2px solid #fff',
          zIndex: 1,
        }}
      />
    </Box>
    {/* Stepper Content */}
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Departure Info */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold">
          {dayjs(flight.departure.time).format('HH:mm')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {flight.departure.airport}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {flight.departure.iata}
        </Typography>
      </Box>
      {/* Duration Info */}
      <Box mb={3} display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="text.secondary">
          Durasi: {formatDuration(flight.duration)}
        </Typography>
      </Box>
      {/* Arrival Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {dayjs(flight.arrival.time).format('HH:mm')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {flight.arrival.airport}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {flight.arrival.iata}
        </Typography>
      </Box>
    </Box>
  </Box>
));

const FlightDetailsCard = React.memo(({ flight }: { flight: ProcessedFlight }) => {
  const statusConfig = getStatusConfig(flight.status);

  return (
    <Card
      variant='elevation'
      elevation={2}
      sx={{
        backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0.92) 30%, rgba(0,123,255,0.10) 100%), url('/background/map.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        borderRadius: 2,
        width: '100%',
        height: '100%',
        boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
      }}>
      <CardContent>
        <Box display={'flex'} alignItems='center' mb={3} gap={2}>
          <AirlineLogo airline={flight.airline} />
          <Box>
            <Typography variant='h6' fontWeight={700} mb={0.5}>
              {flight.airline.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {flight.flightNumber} • Ekonomi • {formatDuration(flight.duration)}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip
            label={statusConfig.text}
            color={statusConfig.color}
            size="small"
          />
          <Box display="flex" alignItems="center" gap={0.5}>
            <AirlineSeatReclineNormal fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {flight.availability.economy} kursi tersedia
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" fontWeight={600} mb={0.5}>
          Tiket Sudah Termasuk
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={1} display="block">
          Kabin: 7 kg, Bagasi: 20 kg
        </Typography>

        <Box display="flex" gap={1}>
          <Chip variant='outlined' label="Gratis makanan" color="info" size="small" />
          <Chip variant='outlined' label="Gratis wifi" color="info" size="small" />
        </Box>
      </CardContent>
    </Card>
  );
});

const LoadingSkeleton = React.memo(() => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Skeleton variant="text" height={60} width={300} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={300} sx={{ mb: 3, borderRadius: 2 }} />
    <Skeleton variant="text" height={40} width={200} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
  </Container>
));

export default function FlightReviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const flight = useSelector((state: RootState) => state.booking.selectedFlight);
  
  const flightId = params.flightId as string;

  // Memoized computed values
  const passengerCounts = useMemo(() => {
    const adults = parseInt(searchParams.get('adults') || searchParams.get('adult') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    return { adults, children, infants, total: adults + children + infants };
  }, [searchParams]);

  const cityNames = useMemo(() => ({
    departure: POPULAR_CITIES.find(city => city.code === flight?.departure.iata)?.name,
    arrival: POPULAR_CITIES.find(city => city.code === flight?.arrival.iata)?.name
  }), [flight?.departure.iata, flight?.arrival.iata]);

  const tripType = useMemo(() => searchParams.get('tripType'), [searchParams]);

  const totalPrice = useMemo(() => 
    flight ? flight.price.economy * passengerCounts.total : 0,
    [flight, passengerCounts.total]
  );

  // Memoized passenger display text
  const passengerText = useMemo(() => {
    const parts = [];
    if (passengerCounts.adults > 0) parts.push(`${passengerCounts.adults} Dewasa`);
    if (passengerCounts.children > 0) parts.push(`${passengerCounts.children} Anak`);
    if (passengerCounts.infants > 0) parts.push(`${passengerCounts.infants} Bayi`);
    return parts.join(', ');
  }, [passengerCounts]);

  // Validation effect
  useEffect(() => {
    if (!flightId || !searchParams) return;

    try {
      const parts = flightId.split('-');
      if (parts.length < 4) {
        throw new Error('Format ID penerbangan tidak valid');
      }

      const flightDate = parts.slice(-3).join('-');
      const searchDate = searchParams.get('date');

      if (flightDate !== searchDate) {
        throw new Error(
          `Tanggal penerbangan (${flightDate}) tidak sesuai dengan tanggal pencarian (${searchDate}). ` +
          `Silakan lakukan pencarian ulang.`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat validasi tanggal.');
      setLoading(false);
    }
  }, [flightId, searchParams]);

  // Data fetching effect
  useEffect(() => {
    if (error || !flightId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (!flight) {
          await dispatch(fetchFlightById(flightId)).unwrap();
        }

        // Set search params ke Redux
        if (searchParams) {
          const parsedSearchParams: FlightSearchParams = {
            departure: searchParams.get('d') || '',
            arrival: searchParams.get('a') || '',
            departureDate: searchParams.get('date') || '',
            returnDate: searchParams.get('returnDate') || undefined,
            passengers: {
              adults: passengerCounts.adults,
              children: passengerCounts.children,
              infants: passengerCounts.infants,
            },
            class: (searchParams.get('travelClass') || 'economy') as 'economy' | 'business' | 'first',
            tripType: (tripType || 'one-way') as 'one-way' | 'round-trip'
          };
          dispatch(setSearchParams(parsedSearchParams));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data penerbangan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [flightId, flight, dispatch, searchParams, error, passengerCounts, tripType]);

  // Memoized handlers
  const handleProceedToBooking = useCallback(() => {
    const bookingUrl = `/pesawat/booking/${flightId}/passengers?${searchParams.toString()}`;
    router.push(bookingUrl);
  }, [flightId, searchParams, router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !flight) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Flight not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        position: 'relative',
        py: 4,
        overflow: 'hidden',
      }}
    >
      {/* Simplified background */}
      <Box
        sx={{
          position: 'absolute',
            inset: 0,
            width: '100%',
            height: 200,
            backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0.92) 30%, rgba(0,123,255,0.10) 100%), url('/background/plane.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h5" color='text.primary' fontWeight="bold" gutterBottom mb={2}>
          {cityNames.departure} <ArrowCircleRightRoundedIcon sx={{ color: 'primary.main' }} /> {cityNames.arrival}
        </Typography>

        <Card
          elevation={2}
          sx={{
            p: 1,
            mb: 3,
            borderRadius: 2,
            boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
            backgroundColor: 'rgba(255,255,255,0.95)',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" color='text.primary' fontWeight={600}>
                {passengerText}
              </Typography>
              <Chip 
                label={tripType === 'round-trip' ? 'Pulang Pergi' : 'Sekali Jalan'} 
                size="small" 
                color={tripType === 'round-trip' ? 'warning' : 'info'} 
              />
            </Box>

            <Typography variant="subtitle1" fontWeight="medium" mb={2}>
              {dayjs(flight.departure.time).format('ddd, DD MMM YYYY')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
              <FlightTimeline flight={flight} />
              <FlightDetailsCard flight={flight} />
            </Box>
          </CardContent>
        </Card>

        <Typography variant="subtitle1" color='text.primary' fontWeight="bold" gutterBottom>
          Pilih Jenis Tiket
        </Typography>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" mb={1}>
              Ekonomi
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip label="Bisa refund" color="success" size="small" />
              <Chip label="Bisa reschedule" color="info" size="small" />
            </Box>
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600, mb: 2 }}>
              Lihat Detail
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(flight.price.economy)} /pax
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error">
                  Total {formatCurrency(totalPrice)}
                </Typography>
              </Box>
              <Button 
                sx={{ borderRadius: 2, textTransform: 'none' }} 
                variant="contained" 
                onClick={handleProceedToBooking}
              >
                Pilih Tiket
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info">
          <Typography variant="body2">
            Tiket 100% Refund hanya tersedia untuk penerbangan dengan keberangkatan <strong>lebih dari 24 jam</strong> dari saat pemesanan.
          </Typography>
        </Alert>
      </Container>
    </Box>
  );
}