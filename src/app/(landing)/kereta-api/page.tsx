'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, InputAdornment, IconButton, Button, MenuItem, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrainIcon from '@mui/icons-material/Train';

const trainTickets = [
  {
    id: 1,
    train: 'Argo Bromo Anggrek',
    from: 'Gambir',
    to: 'Surabaya Pasar Turi',
    departure: '2024-07-20T08:00:00',
    arrival: '2024-07-20T16:00:00',
    price: 450000,
    class: 'Eksekutif'
  },
  {
    id: 2,
    train: 'Taksaka',
    from: 'Gambir',
    to: 'Yogyakarta',
    departure: '2024-07-21T09:30:00',
    arrival: '2024-07-21T15:30:00',
    price: 350000,
    class: 'Eksekutif'
  },
  {
    id: 3,
    train: 'Serayu',
    from: 'Pasar Senen',
    to: 'Purwokerto',
    departure: '2024-07-22T06:00:00',
    arrival: '2024-07-22T13:00:00',
    price: 180000,
    class: 'Ekonomi'
  },
  {
    id: 4,
    train: 'Gaya Baru Malam Selatan',
    from: 'Pasar Senen',
    to: 'Surabaya Gubeng',
    departure: '2024-07-23T12:00:00',
    arrival: '2024-07-23T23:00:00',
    price: 220000,
    class: 'Ekonomi'
  }
];

function formatDateTime(dt: string) {
  const date = new Date(dt);
  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function KeretaApiPage() {
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('');
  const [origin, setOrigin] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };

  const filteredTickets = trainTickets.filter(ticket =>
    ticket.train.toLowerCase().includes(search.toLowerCase()) ||
    ticket.from.toLowerCase().includes(search.toLowerCase()) ||
    ticket.to.toLowerCase().includes(search.toLowerCase())
  );

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
                {[...new Set(trainTickets.map(t => t.from))].map(st => (
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
                {[...new Set(trainTickets.map(t => t.to))].map(st => (
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
                {[...new Set(trainTickets.map(t => t.class))].map(cls => (
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
          {filteredTickets.length === 0 ? (
            <Typography color="text.secondary" align="center">
              Tidak ada tiket ditemukan.
            </Typography>
          ) : (
            filteredTickets.map(ticket => (
              <Card key={ticket.id} elevation={2}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrainIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {ticket.train}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {ticket.class}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {ticket.from} &rarr; {ticket.to}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berangkat: {formatDateTime(ticket.departure)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiba: {formatDateTime(ticket.arrival)}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h6" color="primary">
                      Rp {ticket.price.toLocaleString('id-ID')}
                    </Typography>
                    <Button variant="contained" color="primary" size="small">
                      Pesan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
