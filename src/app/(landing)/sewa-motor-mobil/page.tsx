"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Dummy data kendaraan sewa
const rentalVehicles = [
  {
    id: 1,
    type: "Mobil",
    brand: "Toyota Avanza",
    year: 2022,
    price: 350000,
    location: "Jakarta",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/2019_Toyota_Avanza_1.3_E_1.3L_front_view.jpg",
    transmission: "Manual",
    availableDate: "2024-07-20",
  },
  {
    id: 2,
    type: "Mobil",
    brand: "Honda Brio",
    year: 2021,
    price: 300000,
    location: "Bandung",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/2018_Honda_Brio_RS_1.2_Front.jpg",
    transmission: "Automatic",
    availableDate: "2024-07-21",
  },
  {
    id: 3,
    type: "Motor",
    brand: "Yamaha NMAX",
    year: 2023,
    price: 120000,
    location: "Jakarta",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Yamaha_NMAX_155_VVA_2020.jpg",
    transmission: "Automatic",
    availableDate: "2024-07-20",
  },
  {
    id: 4,
    type: "Motor",
    brand: "Honda Vario",
    year: 2022,
    price: 100000,
    location: "Surabaya",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Honda_Vario_125_2018.jpg",
    transmission: "Automatic",
    availableDate: "2024-07-22",
  },
  {
    id: 5,
    type: "Mobil",
    brand: "Daihatsu Xenia",
    year: 2020,
    price: 320000,
    location: "Surabaya",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/2019_Daihatsu_Xenia_1.3_X_front_view.jpg",
    transmission: "Manual",
    availableDate: "2024-07-23",
  },
  {
    id: 6,
    type: "Motor",
    brand: "Suzuki Satria F150",
    year: 2021,
    price: 90000,
    location: "Bandung",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Suzuki_Satria_F150.jpg",
    transmission: "Manual",
    availableDate: "2024-07-21",
  },
];

const allTypes = Array.from(new Set(rentalVehicles.map((v) => v.type)));
const allBrands = Array.from(new Set(rentalVehicles.map((v) => v.brand)));
const allLocations = Array.from(new Set(rentalVehicles.map((v) => v.location)));
const allTransmissions = Array.from(
  new Set(rentalVehicles.map((v) => v.transmission))
);

export default function SewaMotorMobilPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [transmission, setTransmission] = useState("");
  const [date, setDate] = useState("");

  // Filter logic
  const filteredVehicles = rentalVehicles.filter((vehicle) => {
    const matchSearch =
      vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(search.toLowerCase());
    const matchType = type ? vehicle.type === type : true;
    const matchBrand = brand ? vehicle.brand === brand : true;
    const matchLocation = location ? vehicle.location === location : true;
    const matchTransmission = transmission
      ? vehicle.transmission === transmission
      : true;
    const matchDate = date ? vehicle.availableDate === date : true;
    return (
      matchSearch &&
      matchType &&
      matchBrand &&
      matchLocation &&
      matchTransmission &&
      matchDate
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fafc", py: 4 }}>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 4,
          px: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sewa Motor & Mobil
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Temukan dan sewa kendaraan sesuai kebutuhanmu dengan mudah!
        </Typography>
        {/* Search & Filter */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ md: 4, xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari merk, tipe, atau lokasi"
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
              label="Tipe"
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {type === "Mobil" ? (
                      <DirectionsCarIcon fontSize="small" color="action" />
                    ) : type === "Motor" ? (
                      <TwoWheelerIcon fontSize="small" color="action" />
                    ) : (
                      <DirectionsCarIcon fontSize="small" color="action" />
                    )}
                  </InputAdornment>
                ),
              }}
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
              label="Merk"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              size="small"
            >
              <MenuItem value="">Semua</MenuItem>
              {allBrands.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <TextField
              select
              fullWidth
              label="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              size="small"
            >
              <MenuItem value="">Semua</MenuItem>
              {allLocations.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <TextField
              select
              fullWidth
              label="Transmisi"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              size="small"
            >
              <MenuItem value="">Semua</MenuItem>
              {allTransmissions.map((tr) => (
                <MenuItem key={tr} value={tr}>
                  {tr}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ md: 2, xs: 12 }}>
            <TextField
              fullWidth
              label="Tanggal Tersedia"
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

      {/* List Kendaraan */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 2,
        }}
      >
        {filteredVehicles.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Tidak ada kendaraan yang ditemukan.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredVehicles.map((vehicle) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} key={vehicle.id}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <img
                        src={vehicle.image}
                        alt={vehicle.brand}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 12,
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {vehicle.brand}
                      </Typography>
                      <Box sx={{ ml: 1 }}>
                        {vehicle.type === "Mobil" ? (
                          <DirectionsCarIcon color="primary" fontSize="small" />
                        ) : (
                          <TwoWheelerIcon color="primary" fontSize="small" />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {vehicle.type} • {vehicle.year} • {vehicle.transmission}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Lokasi: {vehicle.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Tersedia:{" "}
                      {new Date(vehicle.availableDate).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Rp {vehicle.price.toLocaleString("id-ID")} / hari
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Sewa Sekarang
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
