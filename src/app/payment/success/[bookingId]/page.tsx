'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { CheckCircle, FlightTakeoff, Download, Email, Print } from '@mui/icons-material';
import dayjs from 'dayjs';
import { RootState } from '@/store';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  // Ambil data booking dari redux store
  // Asumsi: booking detail sudah ada di redux, misal di state.booking.latestSuccess atau state.booking.byId[bookingId]
  // Silakan sesuaikan selector sesuai struktur redux-mu
  const bookingData = useSelector((state: RootState) => {
    // Coba cari di byId, fallback ke latestSuccess jika ada
    if (state.booking && state.booking.byId && state.booking.byId[bookingId]) {
      return state.booking.byId[bookingId];
    }
    if (state.booking && state.booking.latestSuccess && state.booking.latestSuccess.id === bookingId) {
      return state.booking.latestSuccess;
    }
    return null;
  });

  const handleDownloadTicket = () => {
    // In a real app, generate and download PDF ticket
    console.log('Downloading ticket for booking:', bookingId);
  };

  const handleEmailTicket = () => {
    // In a real app, send ticket via email
    console.log('Sending ticket via email for booking:', bookingId);
  };

  const handlePrintTicket = () => {
    // In a real app, print ticket
    window.print();
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)?M?/);
    if (match) {
      const hours = match[1];
      const minutes = match[2] || '0';
      return `${hours}j ${minutes}m`;
    }
    return duration;
  };

  if (!bookingData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Success Alert */}
      <Alert 
        severity="success" 
        icon={<CheckCircle />}
        sx={{ mb: 4 }}
      >
        <Typography variant="h6">
          Pembayaran Berhasil!
        </Typography>
        <Typography>
          Pesanan Anda telah dikonfirmasi. E-ticket telah dikirim ke email Anda.
        </Typography>
      </Alert>

      <Typography variant="h4" component="h1" gutterBottom>
        Konfirmasi Pemesanan
      </Typography>

      {/* Booking Summary */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Detail Pemesanan
            </Typography>
            <Chip 
              label={bookingData.status} 
              color="success" 
              icon={<CheckCircle />}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Booking ID
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {bookingData.id}
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tanggal Pemesanan
              </Typography>
              <Typography variant="h6">
                {dayjs(bookingData.bookingDate).format('DD MMM YYYY HH:mm')}
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Metode Pembayaran
              </Typography>
              <Typography variant="h6">
                {bookingData.paymentMethod}
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Pembayaran
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Rp {bookingData.totalAmount?.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Flight Details */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detail Penerbangan
          </Typography>
          
          <Box display="flex" alignItems="center" mb={3}>
            <FlightTakeoff sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              {bookingData.flight?.airline} - {bookingData.flight?.number}
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {bookingData.flight?.departure?.scheduled && dayjs(bookingData.flight.departure.scheduled).format('HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.flight?.departure?.iata}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bookingData.flight?.departure?.airport}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 2 }}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {bookingData.flight?.duration && formatDuration(bookingData.flight.duration)}
                </Typography>
                <Box sx={{ position: 'relative', height: 2, bgcolor: 'grey.300', borderRadius: 1 }}>
                  <Box sx={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)' }}>
                    <FlightTakeoff sx={{ fontSize: 16, color: 'primary.main' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 5 }}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {bookingData.flight?.arrival?.scheduled && dayjs(bookingData.flight.arrival.scheduled).format('HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.flight?.arrival?.iata}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bookingData.flight?.arrival?.airport}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Passenger List */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daftar Penumpang
          </Typography>
          
          {Array.isArray(bookingData.passengers) && bookingData.passengers.map((passenger: any) => (
            <Box key={passenger.passport || passenger.name} mb={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {passenger.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Passport: {passenger.passport}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Chip label={`Seat ${passenger.seat}`} color="primary" size="small" />
                </Grid>
              </Grid>
              {/* Divider jika bukan penumpang terakhir */}
              {bookingData.passengers[bookingData.passengers.length - 1] !== passenger && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownloadTicket}
        >
          Download E-Ticket
        </Button>
        <Button
          variant="outlined"
          startIcon={<Email />}
          onClick={handleEmailTicket}
        >
          Kirim Email
        </Button>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={handlePrintTicket}
        >
          Cetak
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push('/pesanan')}
          sx={{ ml: 'auto' }}
        >
          Lihat Pesanan Saya
        </Button>
      </Box>
    </Container>
  );
} 