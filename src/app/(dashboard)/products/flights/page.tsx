"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Vendor = {
  id: string;
  name: string;
};

type FlightDetail = {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightClass: string;
};

type Flight = {
  id: string;
  title: string;
  price: string;
  location?: string;
  vendor: Vendor;
  flightDetail: FlightDetail;
};

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // State untuk modal tambah penerbangan
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addVendorId, setAddVendorId] = useState("");
  const [addAirline, setAddAirline] = useState("");
  const [addFlightNumber, setAddFlightNumber] = useState("");
  const [addDeparture, setAddDeparture] = useState("");
  const [addArrival, setAddArrival] = useState("");
  const [addDepartureTime, setAddDepartureTime] = useState("");
  const [addArrivalTime, setAddArrivalTime] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addingFlight, setAddingFlight] = useState(false);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);
  // Tambah state untuk kelas penerbangan
  const [flightClasses, setFlightClasses] = useState([
    { className: '', price: '', seatCount: '' }
  ]);

  useEffect(() => {
    const fetchVendors = async () => {
      setVendorLoading(true);
      try {
        const res = await fetch("/api/vendors");
        const data = await res.json();
        setVendorList(data);
      } catch (err) {
        setVendorList([]);
      }
      setVendorLoading(false);
    };
    fetchVendors();
  }, []);

  // Fungsi untuk menambah penerbangan baru
  const handleAddFlight = async () => {
    if (
      !addTitle ||
      !addPrice ||
      !addVendorId ||
      !addAirline ||
      !addFlightNumber ||
      !addDeparture ||
      !addArrival ||
      !addDepartureTime ||
      !addArrivalTime
    ) {
      alert("Semua field wajib diisi");
      return;
    }
    if (flightClasses.some(fc => !fc.className || !fc.price || !fc.seatCount)) {
      alert("Semua data kelas wajib diisi");
      return;
    }
    setAddingFlight(true);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: addVendorId,
          title: addTitle,
          description: addDescription,
          location: addLocation,
          price: addPrice,
          airline: addAirline,
          flightNumber: addFlightNumber,
          departure: addDeparture,
          arrival: addArrival,
          departureTime: addDepartureTime,
          arrivalTime: addArrivalTime,
          flightClasses,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFlights([data, ...flights]);
        setOpenAddModal(false);
        setAddTitle("");
        setAddPrice("");
        setAddLocation("");
        setAddVendorId("");
        setAddAirline("");
        setAddFlightNumber("");
        setAddDeparture("");
        setAddArrival("");
        setAddDepartureTime("");
        setAddArrivalTime("");
        setAddDescription("");
        setFlightClasses([{ className: '', price: '', seatCount: '' }]); // Reset flightClasses
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menambah penerbangan");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menambah penerbangan");
    }
    setAddingFlight(false);
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flights");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await fetch(`/api/flights/${id}`, { method: "DELETE" });
      setDeleteId(null);
      fetchFlights();
    } catch (err) {
      // handle error
    }
    setDeleting(false);
  };

  // Tambah handler untuk tambah/hapus kelas
  const handleAddClassRow = () => {
    setFlightClasses([...flightClasses, { className: '', price: '', seatCount: '' }]);
  };
  const handleRemoveClassRow = (idx: number) => {
    setFlightClasses(flightClasses.filter((_, i) => i !== idx));
  };
  const handleClassChange = (idx: number, field: string, value: string) => {
    setFlightClasses(flightClasses.map((fc, i) => i === idx ? { ...fc, [field]: value } : fc));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Daftar Penerbangan
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Tambah Penerbangan
        </Button>
        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Tambah Penerbangan</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Judul"
                value={addTitle}
                onChange={e => setAddTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Harga"
                type="number"
                value={addPrice}
                onChange={e => setAddPrice(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Lokasi"
                value={addLocation}
                onChange={e => setAddLocation(e.target.value)}
                fullWidth
              />
              <TextField
                label="Maskapai"
                value={addAirline}
                onChange={e => setAddAirline(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Nomor Penerbangan"
                value={addFlightNumber}
                onChange={e => setAddFlightNumber(e.target.value)}
                fullWidth
                required
              />
              {/* Ganti TextField select vendor dengan Autocomplete */}
              <Autocomplete
                options={vendorList}
                getOptionLabel={(option) => `${option.name} (${option.type})${option.contact ? ` - ${option.contact}` : ""}`}
                loading={vendorLoading}
                value={vendorList.find(v => v.id === addVendorId) || null}
                onChange={(_, newValue) => setAddVendorId(newValue ? newValue.id : "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pilih Vendor (Maskapai)"
                    fullWidth
                    required
                    helperText="Pilih maskapai/vendor dari daftar"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              <TextField
                label="Keberangkatan (Bandara/Kota)"
                value={addDeparture}
                onChange={e => setAddDeparture(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Tujuan (Bandara/Kota)"
                value={addArrival}
                onChange={e => setAddArrival(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Waktu Berangkat"
                type="datetime-local"
                value={addDepartureTime}
                onChange={e => setAddDepartureTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Waktu Tiba"
                type="datetime-local"
                value={addArrivalTime}
                onChange={e => setAddArrivalTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Deskripsi"
                value={addDescription}
                onChange={e => setAddDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
              {/* Pilih Flight Class (opsional, untuk filter atau preselect kelas utama) */}
              <TextField
                select
                label="Pilih Kelas Utama"
                value={flightClasses[0]?.className || ""}
                onChange={e => handleClassChange(0, 'className', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                helperText="Pilih kelas utama untuk penerbangan ini (bisa diubah di bawah)"
              >
                <MenuItem value="">Pilih kelas</MenuItem>
                <MenuItem value="Ekonomi">Ekonomi</MenuItem>
                <MenuItem value="Bisnis">Bisnis</MenuItem>
                <MenuItem value="First Class">First Class</MenuItem>
              </TextField>
              {/* Kelas Penerbangan Dinamis */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1}>
                  Kelas Penerbangan
                </Typography>
                {flightClasses.map((fc, idx) => (
                  <Box key={idx} display="flex" gap={2} alignItems="center" mb={1}>
                    <TextField
                      label="Nama Kelas"
                      value={fc.className}
                      onChange={e => handleClassChange(idx, 'className', e.target.value)}
                      required
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Harga"
                      type="number"
                      value={fc.price}
                      onChange={e => handleClassChange(idx, 'price', e.target.value)}
                      required
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Jumlah Kursi"
                      type="number"
                      value={fc.seatCount}
                      onChange={e => handleClassChange(idx, 'seatCount', e.target.value)}
                      required
                      sx={{ flex: 1 }}
                    />
                    <Button color="error" onClick={() => handleRemoveClassRow(idx)} disabled={flightClasses.length === 1}>
                      Hapus
                    </Button>
                  </Box>
                ))}
                <Button onClick={handleAddClassRow} sx={{ mt: 1 }}>
                  Tambah Kelas
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} disabled={addingFlight}>
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleAddFlight}
              disabled={addingFlight}
            >
              {addingFlight ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Maskapai</TableCell>
                <TableCell>Nomor Penerbangan</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Rute</TableCell>
                <TableCell>Waktu Berangkat</TableCell>
                <TableCell>Waktu Tiba</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : flights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Tidak ada data penerbangan.
                  </TableCell>
                </TableRow>
              ) : (
                flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.flightDetail?.airline || "-"}</TableCell>
                    <TableCell>{flight.flightDetail?.flightNumber || "-"}</TableCell>
                    <TableCell>{flight.title}</TableCell>
                    <TableCell>{flight.vendor?.name || "-"}</TableCell>
                    <TableCell>
                      {flight.flightDetail
                        ? `${flight.flightDetail.departure} → ${flight.flightDetail.arrival}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {flight.flightDetail?.departureTime
                        ? new Date(flight.flightDetail.departureTime).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {flight.flightDetail?.arrivalTime
                        ? new Date(flight.flightDetail.arrivalTime).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {flight.price
                        ? Number(flight.price).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/products/flights/${flight.id}/edit`}>
                        <IconButton color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(flight.id)}
                        disabled={deleting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Hapus Penerbangan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus data penerbangan ini? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Batal
          </Button>
          <Button
            onClick={() => deleteId && handleDelete(deleteId)}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
