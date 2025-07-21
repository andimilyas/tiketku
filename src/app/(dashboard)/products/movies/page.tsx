'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  DialogActions,
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  MenuItem,
} from '@mui/material'

type MovieStatus = 'SEDANG_TAYANG' | 'SEBENTAR_LAGI'

interface MovieDetail {
  id: string
  productId: string
  duration: number
  genre: string
  rating: string
  language?: string
  subtitle?: string
  posterUrl?: string
  status: MovieStatus
}

interface Vendor {
  id: string
  name: string
  // ...other vendor fields if needed
}

interface MovieProduct {
  id: string
  title: string
  description?: string
  location?: string
  price: number
  category: string
  movieDetail: MovieDetail
  vendor: Vendor
  // ...other product fields if needed
}

export default function MovieTicketsPage() {
  const [movies, setMovies] = useState<MovieProduct[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [genre, setGenre] = useState('')
  const [rating, setRating] = useState('')
  const [language, setLanguage] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [status, setStatus] = useState<MovieStatus>('SEDANG_TAYANG')
  const [vendorId, setVendorId] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<MovieProduct | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])

  // Fetch all movies
  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data))
  }, [])

  // Fetch vendor list for select input
  useEffect(() => {
    fetch('/api/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data))
  }, [])

  const handleAddMovie = async () => {
    if (!vendorId || !title || !price || !duration || !genre || !rating || !status) {
      alert('Field wajib: vendor, judul, harga, durasi, genre, rating, status')
      return
    }
    const payload = {
      vendorId,
      title,
      description,
      location,
      price: Number(price),
      duration: Number(duration),
      genre,
      rating,
      language,
      subtitle,
      posterUrl,
      status,
    }
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const data = await res.json()
      setMovies([data, ...movies])
      handleClose()
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal menambahkan film')
    }
  }

  const handleEditMovie = async () => {
    if (!selectedMovie) return
    if (!vendorId || !title || !price || !duration || !genre || !rating || !status) {
      alert('Field wajib: vendor, judul, harga, durasi, genre, rating, status')
      return
    }
    const payload = {
      vendorId,
      title,
      description,
      location,
      price: Number(price),
      duration: Number(duration),
      genre,
      rating,
      language,
      subtitle,
      posterUrl,
      status,
    }
    const res = await fetch(`/api/movies/${selectedMovie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = await res.json()
      setMovies(movies.map(m => m.id === updated.id ? updated : m))
      handleClose()
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal mengedit film')
    }
  }

  const handleDeleteMovie = async (id: string) => {
    const confirmed = confirm('Yakin ingin menghapus film ini?')
    if (!confirmed) return

    const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setMovies(movies.filter(m => m.id !== id))
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal menghapus film')
    }
  }

  const handleOpenEdit = (movie: MovieProduct) => {
    setSelectedMovie(movie)
    setTitle(movie.title)
    setPrice(movie.price.toString())
    setDuration(movie.movieDetail?.duration?.toString() || '')
    setGenre(movie.movieDetail?.genre || '')
    setRating(movie.movieDetail?.rating || '')
    setLanguage(movie.movieDetail?.language || '')
    setSubtitle(movie.movieDetail?.subtitle || '')
    setPosterUrl(movie.movieDetail?.posterUrl || '')
    setStatus(movie.movieDetail?.status || 'SEDANG_TAYANG')
    setVendorId(movie.vendor?.id || '')
    setDescription(movie.description || '')
    setLocation(movie.location || '')
    setEditMode(true)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setSelectedMovie(null)
    setTitle('')
    setPrice('')
    setDuration('')
    setGenre('')
    setRating('')
    setLanguage('')
    setSubtitle('')
    setPosterUrl('')
    setStatus('SEDANG_TAYANG')
    setVendorId('')
    setDescription('')
    setLocation('')
  }

  return (
    <Box p={4} sx={{ backgroundColor: '#fff' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography color='primary' variant="h4">Daftar Film (Produk Movie)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Tambah Data
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Judul</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Durasi (menit)</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.vendor?.name || '-'}</TableCell>
                <TableCell>{movie.movieDetail?.duration || '-'}</TableCell>
                <TableCell>{movie.movieDetail?.genre || '-'}</TableCell>
                <TableCell>{movie.movieDetail?.rating || '-'}</TableCell>
                <TableCell>
                  {movie.movieDetail?.status === 'SEDANG_TAYANG'
                    ? 'Sedang Tayang'
                    : movie.movieDetail?.status === 'SEBENTAR_LAGI'
                    ? 'Sebentar Lagi'
                    : '-'}
                </TableCell>
                <TableCell>Rp {movie.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEdit(movie)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Edit Film' : 'Tambah Film Baru'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Judul Film"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Vendor"
              select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              fullWidth
              required
            >
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Harga"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Durasi (menit)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
              required
              placeholder="Contoh: SU, R, PG-13"
            />
            <TextField
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value as MovieStatus)}
              fullWidth
              required
            >
              <MenuItem value="SEDANG_TAYANG">Sedang Tayang</MenuItem>
              <MenuItem value="SEBENTAR_LAGI">Sebentar Lagi</MenuItem>
            </TextField>
            <TextField
              label="Bahasa"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
            />
            <TextField
              label="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Poster URL"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              fullWidth
            />
            <TextField
              label="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button variant="contained" onClick={editMode ? handleEditMovie : handleAddMovie}>
            {editMode ? 'Simpan Perubahan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
