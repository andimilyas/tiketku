'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, InputAdornment, IconButton, Button, MenuItem, Grid } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';

export default function KeretaApiPage() {
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('');
  const [origin, setOrigin] = useState('');
  const [trainTickets, setTrainTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/trains');
        const data = await res.json();
        setTrainTickets(data);
      } catch (err) {
        setTrainTickets([]);
      }
      setLoading(false);
    };
    fetchTrains();
  }, []);

  // Generate filter options dari data dinamis
  const allOrigins = Array.from(new Set(trainTickets.map((t) => t.trainDetail?.departureStation)));
  const allDestinations = Array.from(new Set(trainTickets.map((t) => t.trainDetail?.arrivalStation)));
  const allClasses = Array.from(new Set(trainTickets.flatMap((t) => (t.trainDetail?.classes || []).map((c: any) => c.className))));

  // Filter logic
  const filteredTickets = trainTickets.filter(ticket => {
    const matchSearch =
      (ticket.trainDetail?.trainName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (ticket.trainDetail?.departureStation?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (ticket.trainDetail?.arrivalStation?.toLowerCase() || '').includes(search.toLowerCase());
    const matchOrigin = origin ? ticket.trainDetail?.departureStation === origin : true;
    const matchDestination = destination ? ticket.trainDetail?.arrivalStation === destination : true;
    const matchClass = trainClass ? (ticket.trainDetail?.classes || []).some((c: any) => c.className === trainClass) : true;
    const matchDate = date ? (ticket.trainDetail?.departureTime?.slice(0,10) === date) : true;
    return matchSearch && matchOrigin && matchDestination && matchClass && matchDate;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };

  function formatDateTime(dt: string) {
    const date = new Date(dt);
    return date.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', py: 4 }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 320, md: 500 },
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          mb: 6,
          px: 4,
          overflow: "hidden",
        }}
      >
        {/* Background Image: Kereta Api */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center"
            },
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1715236815005-3031ce39cdb7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Kereta Api"
          />
        </Box>
        {/* Overlay gradient for better text contrast */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(33,150,243,0.2) 70%, rgba(255,255,255,0.0) 100%)",
            zIndex: 1,
          }}
        />
        {/* Left: Headline */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            textAlign: { xs: "center", md: "left" },
            maxWidth: 420,
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography variant="h4"
            fontWeight="bold"
            sx={{
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2.2rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}>
            Pesan tiket kereta api<br />
            dan jadwal<br />
            perjalanan hari ini
          </Typography>
        </Box>
        {/* Right: Search Card */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: { xs: "90%", sm: 400 },
            maxWidth: 420,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: 6,
            p: { xs: 2, sm: 3 },
            ml: { xs: 0, md: 8 },
            mt: { xs: 4, md: 0 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Simulasi notifikasi promo */}
          <Box
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 1,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1
              }}
            >
              <TrainIcon fontSize="small" />
            </Box>
            <span>
              Promo tiket kereta! Dapatkan diskon hingga <b>Rp100.000</b> untuk rute tertentu 🚄
            </span>
          </Box>
          {/* Filter Spesifik: Asal, Tujuan, Kelas, Tanggal Berangkat */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Stasiun Asal"
                value={origin || ''}
                onChange={e => setOrigin(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allOrigins.map(st => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Stasiun Tujuan"
                value={destination || ''}
                onChange={e => setDestination(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allDestinations.map(st => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Kelas"
                value={trainClass || ''}
                onChange={e => setTrainClass(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allClasses.map(cls => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Tanggal Berangkat"
                type="date"
                value={date || ''}
                onChange={e => setDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
            fullWidth
          >
            Ayo Cari!
          </Button>
        </Box>
      </Box>
      <Container maxWidth="md">
        {/* List Tiket Kereta */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {loading ? (
            <Typography color="text.secondary" align="center">
              Memuat data kereta...
            </Typography>
          ) : filteredTickets.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Tidak ada tiket ditemukan.
            </Typography>
          ) : (
            filteredTickets.map(ticket => {
              return (
                <Card key={ticket.id} elevation={2}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrainIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {ticket.trainDetail?.trainName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {Array.isArray(ticket.trainDetail?.classes) && ticket.trainDetail.classes.length > 0
                          ? ticket.trainDetail.classes.map((cls: any) => `${cls.className} (Rp ${Number(cls.price).toLocaleString('id-ID')}, kursi ${cls.seatCount})`).join(', ')
                          : '-'}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {ticket.trainDetail?.departureStation} &rarr; {ticket.trainDetail?.arrivalStation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Berangkat: {formatDateTime(ticket.trainDetail?.departureTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tiba: {formatDateTime(ticket.trainDetail?.arrivalTime)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h6" color="primary">
                        Rp {ticket.price ? Number(ticket.price).toLocaleString('id-ID') : '-'}
                      </Typography>
                      <Button variant="contained" color="primary" size="small">
                        Pesan
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Container>
    </Box>
  );
}
