'use client'

import { Box, Typography, Button, TextField, InputAdornment, Paper, Card, CardContent, CardMedia, Grid, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';

const categories = [
  { label: 'Bioskop', icon: '🎬' },
  { label: 'Film', icon: '🎞️' },
  { label: 'Food', icon: '🍿' },
];

function MovieCard({ movie }: { movie: import('../../../data/movie-tickets').MovieTicket }) {
  return (
    <Card sx={{ width: '100%', bgcolor: '#181f2a', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        sx={{ height: 280, bgcolor: '#222', borderRadius: 3 }}
        image={movie.thumbnail || '/public/globe.svg'}
        title={movie.title}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} noWrap>{movie.title}</Typography>
        <Typography variant="body2" color="#aaa">{movie.cinema}</Typography>
        <Typography variant="body2" color="#90caf9">Rp {movie.price.toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
}

interface MovieTicket {
  showtime: string;
  id: number
  title: string
  cinema: string
  price: number
  thumbnail?: string
}

export default function MovieLandingPage() {
  const [movieTickets, setMovieTickets] = useState<MovieTicket[]>([]);

  useEffect(() => {
    fetch('/api/movie-tickets')
      .then(res => res.json())
      .then(setMovieTickets);
  }, []);
  return (
    <Box sx={{ bgcolor: '#0a1929', minHeight: '100vh', pb: 8 }}>
      {/* Jumbotron */}
      <Box sx={{ position: 'relative', height: 320, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'url(/public/globe.svg) center/cover, #181f2a', borderRadius: 4 }}>
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(10,25,41,0.7)', borderRadius: 4 }} />
          {/* Search Bar */}
          <Box display="flex" justifyContent="center" mb={3}>
            <TextField
              placeholder="Mau nonton apa hari ini?"
              variant="outlined"
              sx={{ width: 400, bgcolor: '#fff', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* Category Menu */}
          <Box display="flex" justifyContent="center" gap={3} mb={4}>
          {categories.map((cat) => (
            <Button key={cat.label} variant="contained" sx={{ bgcolor: '#181f2a', color: '#fff', borderRadius: 3, px: 4, py: 2, fontWeight: 600, fontSize: 16, boxShadow: 2 }}>
              <span style={{ fontSize: 22, marginRight: 8 }}>{cat.icon}</span> {cat.label}
            </Button>
          ))}
        </Box>
      </Box>
      {/* Banner */}
      <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center" mb={5}>
        <Paper sx={{ width: 700, height: 100, bgcolor: '#1e293b', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
          <Typography color="#fff" fontWeight={600} fontSize={22}>Nikmati promo spesial nonton bareng teman!</Typography>
        </Paper>
      </Box>
      </Container>
      {/* Sedang Tayang Section */}
      <Container sx={{ py: 4 }}>
        <Box mb={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" color="#fff" fontWeight={700}>Sedang Tayang</Typography>
            <Button variant="outlined" sx={{ color: '#90caf9', borderColor: '#90caf9' }}>Lihat semua</Button>
          </Box>
          <Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={2}>
            {movieTickets.slice(0, 4).map((movie) => (
              <Grid size={{ xs: 12, sm: 9, md: 6, lg: 3 }} key={movie.id}>
                <MovieCard movie={{ ...movie, showtime: movie.showtime ?? '' }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      {/* Sedang Trend Section */}
      <Container sx={{ py: 4 }}>
        <Box mb={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" color="#fff" fontWeight={700}>Sedang Trend</Typography>
          <Button variant="outlined" sx={{ color: '#90caf9', borderColor: '#90caf9' }}>Lihat semua</Button>
        </Box>
        <Grid container={true} columns={{ xs: 12, sm: 12, md: 12 }} spacing={2}>
          {movieTickets.slice(1, 5).map((movie) => (
            <Grid size={{ xs: 12, sm: 9, md: 6, lg: 2.5 }} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
    </Box>
  );
}
