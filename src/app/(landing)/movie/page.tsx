'use client'

import { Box, Typography, Button, TextField, InputAdornment, Paper, Card, CardContent, CardMedia, Grid, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';

interface MovieTicket {
  id: number;
  title: string;
  cinema: string;
  showtime: string;
  thumbnail?: string;
  price: number;
}

const categories = [
  { label: 'Bioskop', icon: '🎬' },
  { label: 'Film', icon: '🎞️' },
  { label: 'Food', icon: '🍿' },
];

function MovieCard({ movie }: { movie: MovieTicket }) {
  return (
    <Card>
      <CardMedia
        image={movie.thumbnail || '/public/globe.svg'}
        title={movie.title}
      />
      <CardContent>
        <Typography>{movie.title}</Typography>
        <Typography>{movie.cinema}</Typography>
        <Typography>Rp {movie.price.toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
}

export default function MovieLandingPage() {
  const [movieTickets, setMovieTickets] = useState<MovieTicket[]>([]);

  useEffect(() => {
    fetch('/api/movie-tickets')
      .then(res => res.json())
      .then(setMovieTickets);
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fafc", py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 4,
          px: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Cari Tiket Bioskop & Film
        </Typography>
        {/* Navigasi Menu: Search & Filter */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari judul film, bioskop, atau genre"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
              // (Optional: add value/onChange for search if needed)
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              {categories.map((cat) => (
                <Button
                  key={cat.label}
                  variant="outlined"
                  sx={{
                    bgcolor: "#fff",
                    color: "#181f2a",
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    fontSize: 15,
                    borderColor: "#cbd5e1",
                    boxShadow: 0,
                    textTransform: "none",
                  }}
                  startIcon={<span style={{ fontSize: 20 }}>{cat.icon}</span>}
                >
                  {cat.label}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 4,
          px: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            minHeight: 80,
            bgcolor: "#1e293b",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
            px: 2,
          }}
        >
          <Typography color="#fff" fontWeight={600} fontSize={20}>
            Nikmati promo spesial nonton bareng teman!
          </Typography>
        </Paper>
      </Box>

      {/* Sedang Tayang Section */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 2,
        }}
      >
        <Box mb={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Sedang Tayang
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: "#2563eb",
                borderColor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Lihat semua
            </Button>
          </Box>
          {movieTickets.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Tidak ada film yang sedang tayang.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {movieTickets.slice(0, 4).map((movie) => (
                <Grid size={{ xs: 12, md: 3, sm: 6 }} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Sedang Trend Section */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 2,
        }}
      >
        <Box mb={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Sedang Trend
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: "#2563eb",
                borderColor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Lihat semua
            </Button>
          </Box>
          {movieTickets.length <= 1 ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Tidak ada film trending saat ini.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {movieTickets.slice(1, 5).map((movie) => (
                <Grid size={{ xs: 12, md: 3, sm: 6 }} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}
