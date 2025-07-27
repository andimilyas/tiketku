"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';

export default function PesananPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/booking")
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setBookings(data.bookings || []);
      })
      .catch(() => setError("Gagal mengambil data pesanan"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box maxWidth="md" mx="auto" my={6}>
      <Typography variant="h5" fontWeight={700} mb={3} align="center">
        Pesananmu
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {loading ? (
        <Box display="flex" justifyContent="center" my={6}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Alert severity="info">Belum ada pesanan.</Alert>
      ) : (
        <Stack spacing={3}>
          {bookings.map((booking) => (
            <Paper key={booking.id} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <MovieIcon color="primary" sx={{ fontSize: 40 }} />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {booking.items[0]?.product?.title || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.items[0]?.product?.location || ""}
                  </Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <Chip label={`Jumlah: ${booking.items[0]?.quantity || 1}`} />
                    <Chip label={`Total: Rp ${Number(booking.totalAmount).toLocaleString()}`} color="success" />
                    <Chip label={booking.status} color={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'CANCELLED' ? 'error' : 'warning'} />
                  </Stack>
                </Box>
                <Box minWidth={120} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.createdAt).toLocaleString()}
                  </Typography>
                  {/* (Opsional) Tombol detail pesanan */}
                  {/* <Button size="small" variant="outlined" sx={{ mt: 1 }}>Detail</Button> */}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
} 