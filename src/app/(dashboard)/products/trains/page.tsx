"use client";

import React, { useEffect, useState } from "react";
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
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Vendor = {
  id: string;
  name: string;
  type: string;
};

type TrainClass = {
  className: string;
  price: string;
  seatCount: string;
};

type TrainDetail = {
  trainName: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  classes?: TrainClass[];
};

type Train = {
  id: string;
  title: string;
  price: string;
  location?: string;
  vendor: Vendor;
  trainDetail: TrainDetail;
};

export default function TrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // State untuk modal tambah/edit kereta
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addVendorId, setAddVendorId] = useState("");
  const [addTrainName, setAddTrainName] = useState("");
  const [addTrainNumber, setAddTrainNumber] = useState("");
  const [addDeparture, setAddDeparture] = useState("");
  const [addArrival, setAddArrival] = useState("");
  const [addDepartureTime, setAddDepartureTime] = useState("");
  const [addArrivalTime, setAddArrivalTime] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [trainClasses, setTrainClasses] = useState<TrainClass[]>([
    { className: "", price: "", seatCount: "" },
  ]);
  const [addingTrain, setAddingTrain] = useState(false);

  // State untuk edit
  const [editId, setEditId] = useState<string | null>(null);

  // Vendor
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [vendorLoading, setVendorLoading] = useState(false);

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

  // Fetch trains
  const fetchTrains = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trains");
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // Add Train
  const handleAddTrain = async () => {
    if (
      !addTitle ||
      !addPrice ||
      !addVendorId ||
      !addTrainName ||
      !addTrainNumber ||
      !addDeparture ||
      !addArrival ||
      !addDepartureTime ||
      !addArrivalTime
    ) {
      alert("Semua field wajib diisi");
      return;
    }
    if (trainClasses.some((tc) => !tc.className || !tc.price || !tc.seatCount)) {
      alert("Semua data kelas wajib diisi");
      return;
    }
    setAddingTrain(true);
    try {
      const res = await fetch("/api/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: addVendorId,
          title: addTitle,
          description: addDescription,
          location: addLocation,
          price: addPrice,
          trainName: addTrainName,
          trainNumber: addTrainNumber,
          departure: addDeparture,
          arrival: addArrival,
          departureTime: addDepartureTime,
          arrivalTime: addArrivalTime,
          trainClass: trainClasses,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrains([data, ...trains]);
        setOpenAddModal(false);
        resetForm();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menambah kereta");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menambah kereta");
    }
    setAddingTrain(false);
  };

  // Edit Train
  const handleEditTrain = async () => {
    if (
      !addTitle ||
      !addPrice ||
      !addVendorId ||
      !addTrainName ||
      !addTrainNumber ||
      !addDeparture ||
      !addArrival ||
      !addDepartureTime ||
      !addArrivalTime
    ) {
      alert("Semua field wajib diisi");
      return;
    }
    if (trainClasses.some((tc) => !tc.className || !tc.price || !tc.seatCount)) {
      alert("Semua data kelas wajib diisi");
      return;
    }
    setAddingTrain(true);
    try {
      const res = await fetch(`/api/trains/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: addVendorId,
          title: addTitle,
          description: addDescription,
          location: addLocation,
          price: addPrice,
          trainName: addTrainName,
          trainNumber: addTrainNumber,
          departure: addDeparture,
          arrival: addArrival,
          departureTime: addDepartureTime,
          arrivalTime: addArrivalTime,
          trainClass: trainClasses,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrains(trains.map((t) => (t.id === editId ? data : t)));
        setOpenEditModal(false);
        resetForm();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal mengedit kereta");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengedit kereta");
    }
    setAddingTrain(false);
  };

  // Delete Train
  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await fetch(`/api/trains/${id}`, { method: "DELETE" });
      setTrains(trains.filter((t) => t.id !== id));
      setDeleteId(null);
    } catch (error) {
      alert("Gagal menghapus kereta");
    }
    setDeleting(false);
  };

  // Reset form
  const resetForm = () => {
    setAddTitle("");
    setAddPrice("");
    setAddLocation("");
    setAddVendorId("");
    setAddTrainName("");
    setAddTrainNumber("");
    setAddDeparture("");
    setAddArrival("");
    setAddDepartureTime("");
    setAddArrivalTime("");
    setAddDescription("");
    setTrainClasses([{ className: "", price: "", seatCount: "" }]);
    setEditId(null);
  };

  // Open edit modal and fill form
  const openEdit = (train: Train) => {
    setEditId(train.id);
    setAddTitle(train.title || "");
    setAddPrice(train.price || "");
    setAddLocation(train.location || "");
    setAddVendorId(train.vendor?.id || "");
    setAddTrainName(train.trainDetail?.trainName || "");
    setAddTrainNumber(train.trainDetail?.trainNumber || "");
    setAddDeparture(train.trainDetail?.departureStation || "");
    setAddArrival(train.trainDetail?.arrivalStation || "");
    setAddDepartureTime(
      train.trainDetail?.departureTime
        ? train.trainDetail.departureTime.slice(0, 16)
        : ""
    );
    setAddArrivalTime(
      train.trainDetail?.arrivalTime
        ? train.trainDetail.arrivalTime.slice(0, 16)
        : ""
    );
    setTrainClasses(
      Array.isArray(train.trainDetail?.classes) && train.trainDetail.classes.length > 0
        ? train.trainDetail.classes.map((c) => ({
            className: c.className,
            price: c.price,
            seatCount: c.seatCount,
          }))
        : [{ className: "", price: "", seatCount: "" }]
    );
    setOpenEditModal(true);
  };

  // Dynamic class row handlers
  const handleClassChange = (idx: number, field: keyof TrainClass, value: string) => {
    setTrainClasses((prev) =>
      prev.map((tc, i) => (i === idx ? { ...tc, [field]: value } : tc))
    );
  };
  const handleAddClassRow = () => {
    setTrainClasses((prev) => [...prev, { className: "", price: "", seatCount: "" }]);
  };
  const handleRemoveClassRow = (idx: number) => {
    setTrainClasses((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Data Kereta
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenAddModal(true);
          }}
        >
          Tambah Kereta
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Kereta</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Rute</TableCell>
              <TableCell>Waktu Berangkat</TableCell>
              <TableCell>Waktu Tiba</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : trains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Tidak ada data kereta.
                </TableCell>
              </TableRow>
            ) : (
              trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell>
                    {train.trainDetail?.trainName || train.title}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {train.trainDetail?.trainNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{train.vendor?.name}</TableCell>
                  <TableCell>
                    {train.trainDetail?.departureStation} → {train.trainDetail?.arrivalStation}
                  </TableCell>
                  <TableCell>
                    {train.trainDetail?.departureTime
                      ? new Date(train.trainDetail.departureTime).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {train.trainDetail?.arrivalTime
                      ? new Date(train.trainDetail.arrivalTime).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    Rp {Number(train.price).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => openEdit(train)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteId(train.id)}
                      size="small"
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

      {/* Modal Tambah Kereta */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Kereta</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Vendor"
              value={addVendorId}
              onChange={(e) => setAddVendorId(e.target.value)}
              fullWidth
              required
              disabled={vendorLoading}
            >
              <MenuItem value="">Pilih Vendor</MenuItem>
              {vendorList
                .filter((vendor) => vendor.type === "kereta-api")
                .map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Judul Produk"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Deskripsi"
              value={addDescription}
              onChange={(e) => setAddDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Lokasi"
              value={addLocation}
              onChange={(e) => setAddLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Harga"
              type="number"
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nama Kereta"
              value={addTrainName}
              onChange={(e) => setAddTrainName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nomor Kereta"
              value={addTrainNumber}
              onChange={(e) => setAddTrainNumber(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Stasiun Keberangkatan"
              value={addDeparture}
              onChange={(e) => setAddDeparture(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Stasiun Tujuan"
              value={addArrival}
              onChange={(e) => setAddArrival(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Waktu Berangkat"
              type="datetime-local"
              value={addDepartureTime}
              onChange={(e) => setAddDepartureTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Waktu Tiba"
              type="datetime-local"
              value={addArrivalTime}
              onChange={(e) => setAddArrivalTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            {/* Kelas Kereta Dinamis */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1}>
                Kelas Kereta
              </Typography>
              {trainClasses.map((tc, idx) => (
                <Box key={idx} display="flex" gap={2} alignItems="center" mb={1}>
                  <TextField
                    label="Nama Kelas"
                    value={tc.className}
                    onChange={(e) => handleClassChange(idx, "className", e.target.value)}
                    required
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Harga"
                    type="number"
                    value={tc.price}
                    onChange={(e) => handleClassChange(idx, "price", e.target.value)}
                    required
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Jumlah Kursi"
                    type="number"
                    value={tc.seatCount}
                    onChange={(e) => handleClassChange(idx, "seatCount", e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <Button
                    color="error"
                    onClick={() => handleRemoveClassRow(idx)}
                    disabled={trainClasses.length === 1}
                  >
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
          <Button onClick={() => setOpenAddModal(false)} disabled={addingTrain}>
            Batal
          </Button>
          <Button
            onClick={handleAddTrain}
            variant="contained"
            disabled={addingTrain}
          >
            {addingTrain ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Edit Kereta */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Kereta</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Vendor"
              value={addVendorId}
              onChange={(e) => setAddVendorId(e.target.value)}
              fullWidth
              required
              disabled={vendorLoading}
            >
              <MenuItem value="">Pilih Vendor</MenuItem>
              {vendorList
                .filter((vendor: any) => vendor.type === "kereta-api")
                .map((vendor: any) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Judul Produk"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Deskripsi"
              value={addDescription}
              onChange={(e) => setAddDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Lokasi"
              value={addLocation}
              onChange={(e) => setAddLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Harga"
              type="number"
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nama Kereta"
              value={addTrainName}
              onChange={(e) => setAddTrainName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nomor Kereta"
              value={addTrainNumber}
              onChange={(e) => setAddTrainNumber(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Stasiun Keberangkatan"
              value={addDeparture}
              onChange={(e) => setAddDeparture(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Stasiun Tujuan"
              value={addArrival}
              onChange={(e) => setAddArrival(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Waktu Berangkat"
              type="datetime-local"
              value={addDepartureTime}
              onChange={(e) => setAddDepartureTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Waktu Tiba"
              type="datetime-local"
              value={addArrivalTime}
              onChange={(e) => setAddArrivalTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            {/* Kelas Kereta Dinamis */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1}>
                Kelas Kereta
              </Typography>
              {trainClasses.map((tc, idx) => (
                <Box key={idx} display="flex" gap={2} alignItems="center" mb={1}>
                  <TextField
                    label="Nama Kelas"
                    value={tc.className}
                    onChange={(e) => handleClassChange(idx, "className", e.target.value)}
                    required
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Harga"
                    type="number"
                    value={tc.price}
                    onChange={(e) => handleClassChange(idx, "price", e.target.value)}
                    required
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Jumlah Kursi"
                    type="number"
                    value={tc.seatCount}
                    onChange={(e) => handleClassChange(idx, "seatCount", e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <Button
                    color="error"
                    onClick={() => handleRemoveClassRow(idx)}
                    disabled={trainClasses.length === 1}
                  >
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
          <Button onClick={() => setOpenEditModal(false)} disabled={addingTrain}>
            Batal
          </Button>
          <Button
            onClick={handleEditTrain}
            variant="contained"
            disabled={addingTrain}
          >
            {addingTrain ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Hapus Kereta</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus data kereta ini?
          </Typography>
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
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
