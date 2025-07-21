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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Vendor = {
  id: string;
  name: string;
  type: string;
  contact?: string;
  address?: string;
};

const vendorTypes = [
  { value: "hotel", label: "Hotel" },
  { value: "maskapai", label: "Maskapai" },
  { value: "bioskop", label: "Bioskop" },
  { value: "kereta-api", label: "Kereta Api" },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal tambah vendor
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("");
  const [addContact, setAddContact] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendors");
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      }
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle add vendor
  const handleAddVendor = async () => {
    if (!addName || !addType) {
      alert("Nama dan tipe vendor wajib diisi");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          type: addType,
          contact: addContact,
          address: addAddress,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVendors([data, ...vendors]);
        setOpenAddModal(false);
        setAddName("");
        setAddType("");
        setAddContact("");
        setAddAddress("");
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menambah vendor");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menambah vendor");
    }
    setAdding(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Daftar Vendor
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Tambah Vendor
        </Button>
      </Box>

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Vendor</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nama Vendor"
              value={addName}
              onChange={e => setAddName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Tipe Vendor"
              value={addType}
              onChange={e => setAddType(e.target.value)}
              select
              fullWidth
              required
            >
              {vendorTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Kontak"
              value={addContact}
              onChange={e => setAddContact(e.target.value)}
              fullWidth
            />
            <TextField
              label="Alamat"
              value={addAddress}
              onChange={e => setAddAddress(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)} disabled={adding}>
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleAddVendor}
            disabled={adding}
          >
            {adding ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Tipe</TableCell>
                <TableCell>Kontak</TableCell>
                <TableCell>Alamat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Tidak ada data vendor.
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>
                      {vendorTypes.find(t => t.value === vendor.type)?.label || vendor.type}
                    </TableCell>
                    <TableCell>{vendor.contact || "-"}</TableCell>
                    <TableCell>{vendor.address || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

