'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Dummy data travel & bus
const travelBusTickets = [
  {
    id: 1,
    operator: 'PO Sinar Jaya',
    type: 'Bus',
    from: 'Jakarta',
    to: 'Bandung',
    date: '2024-07-20',
    time: '08:00',
    price: 120000,
    class: 'Eksekutif',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 2,
    operator: 'XTrans',
    type: 'Travel',
    from: 'Jakarta',
    to: 'Bandung',
    date: '2024-07-20',
    time: '09:00',
    price: 150000,
    class: 'Travel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 3,
    operator: 'PO Rosalia Indah',
    type: 'Bus',
    from: 'Jakarta',
    to: 'Yogyakarta',
    date: '2024-07-21',
    time: '17:00',
    price: 350000,
    class: 'Eksekutif',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 4,
    operator: 'DayTrans',
    type: 'Travel',
    from: 'Bandung',
    to: 'Jakarta',
    date: '2024-07-22',
    time: '10:00',
    price: 140000,
    class: 'Travel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 5,
    operator: 'PO Harapan Jaya',
    type: 'Bus',
    from: 'Surabaya',
    to: 'Malang',
    date: '2024-07-23',
    time: '12:00',
    price: 90000,
    class: 'Ekonomi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 6,
    operator: 'Jackal Holidays',
    type: 'Travel',
    from: 'Bandung',
    to: 'Jakarta',
    date: '2024-07-24',
    time: '15:00',
    price: 160000,
    class: 'Travel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
  {
    id: 7,
    operator: 'PO Lorena',
    type: 'Bus',
    from: 'Jakarta',
    to: 'Semarang',
    date: '2024-07-25',
    time: '19:00',
    price: 280000,
    class: 'Bisnis',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bus_icon.svg',
  },
];

const allOrigins = Array.from(new Set(travelBusTickets.map((t) => t.from)));
const allDestinations = Array.from(new Set(travelBusTickets.map((t) => t.to)));
const allTypes = Array.from(new Set(travelBusTickets.map((t) => t.type)));
const allClasses = Array.from(new Set(travelBusTickets.map((t) => t.class)));

export default function TravelBusPage() {
  const [search, setSearch] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [type, setType] = useState('');
  const [busClass, setBusClass] = useState('');
  const [date, setDate] = useState('');

  // Filter logic
  const filteredTickets = travelBusTickets.filter((ticket) => {
    const matchSearch =
      ticket.operator.toLowerCase().includes(search.toLowerCase()) ||
      ticket.from.toLowerCase().includes(search.toLowerCase()) ||
      ticket.to.toLowerCase().includes(search.toLowerCase());
    const matchOrigin = origin ? ticket.from === origin : true;
    const matchDestination = destination ? ticket.to === destination : true;
    const matchType = type ? ticket.type === type : true;
    const matchClass = busClass ? ticket.class === busClass : true;
    const matchDate = date ? ticket.date === date : true;
    return matchSearch && matchOrigin && matchDestination && matchType && matchClass && matchDate;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <DirectionsBusIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Tiket Travel & Bus
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Temukan dan pesan tiket travel & bus dengan mudah dan cepat!
          </Typography>
        </Box>

        {/* Search & Filter */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ md: 4, xs: 12 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Cari operator, asal, atau tujuan"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ md: 2, xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Asal"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Semua</MenuItem>
                {allOrigins.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ md: 2, xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Tujuan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Semua</MenuItem>
                {allDestinations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ md: 2, xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Tipe"
                value={type}
                onChange={(e) => setType(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ md: 2, xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Kelas"
                value={busClass}
                onChange={(e) => setBusClass(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allClasses.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ md: 2, xs: 12 }}>
              <TextField
                fullWidth
                label="Tanggal"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* List Tiket Travel & Bus */}
        <Box sx={{ mt: 2 }}>
          {filteredTickets.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
              Tidak ada tiket travel atau bus yang ditemukan.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredTickets.map((ticket) => (
                <Grid size={{ xs:12, sm:6, md:4 }} key={ticket.id}>
                  <Card elevation={3} sx={{ borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <img
                          src={ticket.logo}
                          alt={ticket.operator}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: 'contain',
                            marginRight: 12,
                          }}
                        />
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {ticket.operator}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 2 }}
                        >
                          {ticket.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {ticket.from}
                        </Typography>
                        <span style={{ margin: '0 8px' }}>→</span>
                        <Typography variant="body1" fontWeight="bold">
                          {ticket.to}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {new Date(ticket.date).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        • {ticket.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Kelas: {ticket.class}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Rp {ticket.price.toLocaleString('id-ID')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        Pesan Sekarang
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}
