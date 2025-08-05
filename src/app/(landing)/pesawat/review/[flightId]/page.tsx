'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchFlightById, setSearchParams } from '@/store/slices/bookingSlice';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { FlightSearchParams } from '@/types/flight';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  Skeleton,
  Stack,
  Divider
} from '@mui/material';

import TicketDetailModal from '@/components/features/flight/Modal/TicketClassModal';
import TicketDetailCard from '@/components/features/flight/TicketDetailCard';

const POPULAR_CITIES = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];

const formatCurrency = (amount: number) =>
  Number(amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

const LoadingSkeleton = () => (
  <Box
    sx={{
      backgroundColor: '#ffffff',
      position: 'relative',
      py: 4,
      overflow: 'hidden',
      minHeight: '100vh'
    }}
  >
    {/* Background */}
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />

      {/* Flight Card Skeleton */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="text" width="40%" height={20} />
            <Box display="flex" gap={1}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={100} height={24} />
            </Box>
            <Divider />
            <Skeleton variant="text" width="30%" height={20} />
          </Stack>
        </CardContent>
      </Card>

      {/* Ticket Selection Skeleton */}
      <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="40%" height={24} />
            <Box display="flex" gap={1}>
              <Skeleton variant="rounded" width={90} height={24} />
              <Skeleton variant="rounded" width={110} height={24} />
            </Box>
            <Skeleton variant="text" width="30%" height={20} />
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={150} height={28} />
              </Box>
              <Skeleton variant="rounded" width={120} height={36} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Info Alert Skeleton */}
      <Skeleton variant="rounded" width="100%" height={60} sx={{ mt: 3 }} />
    </Container>
  </Box>
);

export default function FlightReviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketDetailOpen, setTicketDetailOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const flight = useSelector((state: RootState) => state.booking.selectedFlight);
  const flightId = params.flightId as string;

  // Memoized computed values
  const passengerCounts = useMemo(() => {
    const adults = parseInt(searchParams.get('adults') ?? searchParams.get('adult') ?? '1', 10);
    const children = parseInt(searchParams.get('child') ?? '0', 10);
    const infants = parseInt(searchParams.get('infant') ?? '0', 10);
    return { adults, children, infants, total: adults + children + infants };
  }, [searchParams]);

  const cityNames = useMemo(() => ({
    departure: POPULAR_CITIES.find(city => city.code === flight?.departure.iata)?.name || flight?.departure.iata || '',
    arrival: POPULAR_CITIES.find(city => city.code === flight?.arrival.iata)?.name || flight?.arrival.iata || ''
  }), [flight?.departure.iata, flight?.arrival.iata]);

  const tripType = useMemo(() => searchParams.get('tripType') || 'one-way', [searchParams]);
  const travelClass = useMemo(() => (
    (searchParams.get('class') || searchParams.get('travelClass') || 'economy') as 'economy' | 'business' | 'first'
  ), [searchParams]);

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
            class: travelClass === 'first' ? 'first class' : travelClass,
            tripType: tripType as 'one-way' | 'round-trip'
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
  }, [flightId, flight, dispatch, searchParams, error, passengerCounts, tripType, travelClass]);

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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Flight not found'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/pesawat')}
          sx={{ mt: 2 }}
        >
          Kembali ke Pencarian
        </Button>
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
        minHeight: '100vh'
      }}
    >
      {/* Background */}
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

        <TicketDetailCard
          flight={flight}
          passengerText={passengerText}
          tripType={tripType as 'one-way' | 'round-trip'}
        />

        <Typography variant="subtitle1" color='text.primary' fontWeight="bold" gutterBottom mt={3}>
          Pilih Jenis Tiket
        </Typography>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" mb={1}>
              {travelClass === 'first' ? 'First Class' : travelClass.charAt(0).toUpperCase() + travelClass.slice(1)}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip label="Bisa refund" color='default' size="small" />
              <Chip label="Bisa reschedule" color="default" size="small" />
            </Box>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600, my: 2 }}
              onClick={() => setTicketDetailOpen(true)}
            >
              Lihat Detail
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(flight.price?.[travelClass] ?? 0)}/pax
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error">
                  Total {formatCurrency((flight.price?.[travelClass] ?? 0) * (passengerCounts?.total ?? 0))}
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

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Tiket 100% Refund hanya tersedia untuk penerbangan dengan keberangkatan <strong>lebih dari 24 jam</strong> dari saat pemesanan.
          </Typography>
        </Alert>
      </Container>

      <TicketDetailModal
        open={ticketDetailOpen}
        onClose={() => setTicketDetailOpen(false)}
        flight={flight}
        travelClass={travelClass}
        passengerCounts={{
          adult: passengerCounts.adults,
          child: passengerCounts.children,
          infant: passengerCounts.infants,
          total: passengerCounts.total
        }}
        formatCurrency={formatCurrency}
        onSelectTicket={handleProceedToBooking}
      />
    </Box>
  );
}