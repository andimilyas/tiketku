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

interface MovieTicket {
  id: number
  title: string
  price: number
  cinema: string
  showtime: string
  thumbnail?: string
}

export default function MovieTicketsPage() {
  const [tickets, setTickets] = useState<MovieTicket[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [cinema, setCinema] = useState('')
  const [showtime, setShowtime] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<MovieTicket | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Optionally, you can fetch cinema/showtime options from API if needed
  // For now, just use some static options for demo
  const cinemaOptions = [
    'XXI Plaza Indonesia',
    'CGV Grand Indonesia',
    'Cinepolis Senayan City',
    'IMAX Kelapa Gading',
  ]
  const showtimeOptions = [
    '10:00',
    '12:30',
    '15:00',
    '17:30',
    '20:00',
  ]

  useEffect(() => {
    fetch('/api/movie-tickets')
      .then((res) => res.json())
      .then((data) => setTickets(data))
  }, [])

  const handleAddTicket = async () => {
    // Data sesuai prisma: title, price, cinema, showtime
    if (!title || !price || !cinema || !showtime) {
      alert('Semua field harus diisi')
      return
    }
    const newTicket = { title, price: Number(price), cinema, showtime }

    const res = await fetch('/api/movie-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    })

    if (res.ok) {
      const data = await res.json()
      setTickets([...tickets, data])
      setTitle('')
      setPrice('')
      setCinema('')
      setShowtime('')
      setOpen(false)
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal menambahkan tiket')
    }
  }

  const handleEditTicket = async () => {
    if (!selectedTicket) return
    if (!title || !price || !cinema || !showtime) {
      alert('Semua field harus diisi')
      return
    }

    const res = await fetch(`/api/movie-tickets/${selectedTicket.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price: Number(price), cinema, showtime }),
    })

    if (res.ok) {
      const updated = await res.json()
      setTickets(tickets.map(t => t.id === updated.id ? updated : t))
      setSelectedTicket(null)
      setEditMode(false)
      setOpen(false)
      setTitle('')
      setPrice('')
      setCinema('')
      setShowtime('')
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal mengedit tiket')
    }
  }

  const handleDeleteTicket = async (id: number) => {
    const confirmed = confirm('Yakin ingin menghapus tiket ini?')
    if (!confirmed) return

    const res = await fetch(`/api/movie-tickets/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setTickets(tickets.filter(t => t.id !== id))
    } else {
      const err = await res.json()
      alert(err.message || 'Gagal menghapus tiket')
    }
  }

  const handleOpenEdit = (ticket: MovieTicket) => {
    setSelectedTicket(ticket)
    setTitle(ticket.title)
    setPrice(ticket.price.toString())
    setCinema(ticket.cinema)
    setShowtime(ticket.showtime)
    setEditMode(true)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setSelectedTicket(null)
    setTitle('')
    setPrice('')
    setCinema('')
    setShowtime('')
  }

  return (
    <Box p={4} sx={{ backgroundColor: '#fff' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography color='primary' variant="h4">Daftar Tiket Bioskop</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Tambah Data
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Judul</TableCell>
              <TableCell>Bioskop</TableCell>
              <TableCell>Showtime</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.cinema}</TableCell>
                <TableCell>{ticket.showtime}</TableCell>
                <TableCell>Rp {ticket.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEdit(ticket)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteTicket(ticket.id)}
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
        <DialogTitle>{editMode ? 'Edit Tiket' : 'Tambah Tiket Baru'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nama Film"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Harga"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
            <TextField
              label="Bioskop"
              select
              value={cinema}
              onChange={(e) => setCinema(e.target.value)}
              fullWidth
            >
              {cinemaOptions.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Showtime"
              select
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
              fullWidth
            >
              {showtimeOptions.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button variant="contained" onClick={editMode ? handleEditTicket : handleAddTicket}>
            {editMode ? 'Simpan Perubahan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
