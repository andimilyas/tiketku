'use client'

import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { useSession } from 'next-auth/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';

type MovieStatus = 'SEDANG_TAYANG' | 'SEBENTAR_LAGI';

interface MovieDetail {
  id: string;
  productId: string;
  duration: number;
  genre: string;
  rating: string;
  language?: string;
  subtitle?: string;
  posterUrl?: string;
  status: MovieStatus;
}

interface Vendor {
  id: string;
  name: string;
}

interface MovieProduct {
  id: string;
  title: string;
  description?: string;
  location?: string;
  price: number;
  category: string;
  movieDetail: MovieDetail;
  vendor: Vendor;
  reviews?: any[];
}

const categories = [
  { label: 'Bioskop', icon: '🎬' },
  { label: 'Film', icon: '🎞️' },
  { label: 'Food', icon: '🍿' },
];

function AddToCartButton({ id, name, price }: { id: string, name: string, price: number }) {
  const dispatch = useDispatch();
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 1, borderRadius: 2 }}
      onClick={() => dispatch(addToCart({ id, name, price, quantity: 1 }))}
    >
      Tambah ke Keranjang
    </Button>
  );
}

function MovieCard({ movie }: { movie: MovieProduct }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBooking = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch('/api/booking/movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: movie.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal booking');
      setSuccess('Booking berhasil!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={movie.movieDetail?.posterUrl || '/globe.svg'}
        alt={movie.title}
        sx={{ height: 220, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {movie.location || movie.vendor?.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={movie.movieDetail?.genre || '-'}
            sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}
          />
          <Chip
            size="small"
            label={movie.movieDetail?.rating || '-'}
            sx={{ bgcolor: '#fef9c3', color: '#b45309', fontWeight: 600 }}
          />
          {movie.movieDetail?.status === 'SEDANG_TAYANG' && (
            <Chip
              size="small"
              label="Sedang Tayang"
              color="success"
              sx={{ fontWeight: 600 }}
            />
          )}
          {movie.movieDetail?.status === 'SEBENTAR_LAGI' && (
            <Chip
              size="small"
              label="Segera Tayang"
              color="warning"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary" mt={2}>
          Rp {movie.price.toLocaleString()}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
          Beli Tiket
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Beli Tiket: {movie.title}</DialogTitle>
          <DialogContent>
            <TextField
              label="Jumlah Tiket"
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              fullWidth
              inputProps={{ min: 1 }}
              sx={{ my: 2 }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            {status !== 'authenticated' && <Alert severity="warning" sx={{ mt: 2 }}>Login & verifikasi email untuk booking.</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleBooking} variant="contained" disabled={loading || status !== 'authenticated'}>Pesan</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function MovieLandingPage() {
  const [movies, setMovies] = useState<MovieProduct[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then((data) => setMovies(Array.isArray(data) ? data : []));
  }, []);

  // Filter logic
  const filteredMovies = movies.filter((movie) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      movie.title.toLowerCase().includes(searchLower) ||
      (movie.location && movie.location.toLowerCase().includes(searchLower)) ||
      (movie.movieDetail?.genre && movie.movieDetail.genre.toLowerCase().includes(searchLower));
    // For now, category filter is not implemented (since backend only has 'movie' category)
    return matchesSearch;
  });

  // Group movies by status
  const sedangTayang = filteredMovies.filter(
    (movie) => movie.movieDetail?.status === 'SEDANG_TAYANG'
  );
  const sebentarLagi = filteredMovies.filter(
    (movie) => movie.movieDetail?.status === 'SEBENTAR_LAGI'
  );

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
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              {categories.map((cat) => (
                <Button
                  key={cat.label}
                  variant={selectedCategory === cat.label ? "contained" : "outlined"}
                  sx={{
                    bgcolor: selectedCategory === cat.label ? "#2563eb" : "#fff",
                    color: selectedCategory === cat.label ? "#fff" : "#181f2a",
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    fontSize: 15,
                    borderColor: "#cbd5e1",
                    boxShadow: 0,
                    textTransform: "none",
                  }}
                  startIcon={<span style={{ fontSize: 20 }}>{cat.icon}</span>}
                  onClick={() => setSelectedCategory(cat.label)}
                  disabled // kategori filter belum diimplementasi di backend
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
              // onClick: bisa diarahkan ke halaman semua film sedang tayang
            >
              Lihat semua
            </Button>
          </Box>
          {sedangTayang.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Tidak ada film yang sedang tayang.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sedangTayang.slice(0, 4).map((movie) => (
                <Grid size={{ xs: 12, sm: 6, md: 3}} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Segera Tayang Section */}
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
              Segera Tayang
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: "#2563eb",
                borderColor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
              }}
              // onClick: bisa diarahkan ke halaman semua film segera tayang
            >
              Lihat semua
            </Button>
          </Box>
          {sebentarLagi.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Tidak ada film yang akan tayang dalam waktu dekat.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sebentarLagi.slice(0, 4).map((movie) => (
                <Grid size={{ xs: 12, sm: 6, md: 3}} key={movie.id}>
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
