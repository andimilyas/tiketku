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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HotelIcon from "@mui/icons-material/Hotel";

// Dummy data hotel
const hotelList = [
  {
    id: 1,
    name: "Hotel Indonesia Kempinski",
    location: "Jakarta",
    address: "Jl. M.H. Thamrin No.1, Jakarta",
    price: 1800000,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-20",
  },
  {
    id: 2,
    name: "The Trans Luxury Hotel",
    location: "Bandung",
    address: "Jl. Gatot Subroto No.289, Bandung",
    price: 1400000,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-21",
  },
  {
    id: 3,
    name: "Grand Inna Kuta",
    location: "Bali",
    address: "Jl. Pantai Kuta No.1, Bali",
    price: 950000,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-22",
  },
  {
    id: 4,
    name: "JW Marriott Surabaya",
    location: "Surabaya",
    address: "Jl. Embong Malang No.85-89, Surabaya",
    price: 1200000,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-23",
  },
  {
    id: 5,
    name: "Aryaduta Medan",
    location: "Medan",
    address: "Jl. Kapten Maulana Lubis No.8, Medan",
    price: 800000,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-24",
  },
  {
    id: 6,
    name: "Swiss-Belhotel Makassar",
    location: "Makassar",
    address: "Jl. Ujung Pandang No.8, Makassar",
    price: 700000,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=600&q=80",
    type: "Hotel",
    availableDate: "2024-07-25",
  },
];

const allLocations = Array.from(new Set(hotelList.map((h) => h.location)));
const allTypes = Array.from(new Set(hotelList.map((h) => h.type)));
const allRatings = Array.from(new Set(hotelList.map((h) => h.rating)));

export default function HotelPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState("");
  const [date, setDate] = useState("");

  // Filter logic
  const filteredHotels = hotelList.filter((hotel) => {
    const matchSearch =
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase()) ||
      hotel.address.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location ? hotel.location === location : true;
    const matchType = type ? hotel.type === type : true;
    const matchRating = rating ? hotel.rating === Number(rating) : true;
    const matchDate = date ? hotel.availableDate === date : true;
    return matchSearch && matchLocation && matchType && matchRating && matchDate;
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
          <HotelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Sewa Hotel
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Temukan dan pesan hotel terbaik untuk perjalananmu!
        </Typography>
        {/* Search & Filter */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ md: 4, xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari nama hotel, kota, atau alamat"
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
              label="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              size="small"
            >
              <MenuItem value="">Semua</MenuItem>
              {allRatings.map((r) => (
                <MenuItem key={r} value={r}>
                  {r} ⭐
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
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

      {/* List Hotel */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 2,
        }}
      >
        {filteredHotels.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Tidak ada hotel yang ditemukan.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredHotels.map((hotel) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} key={hotel.id}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 12,
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {hotel.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <LocationOnIcon fontSize="small" color="action" />
                          {hotel.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {hotel.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Rating: {hotel.rating} ⭐
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Tersedia:{" "}
                      {new Date(hotel.availableDate).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Rp {hotel.price.toLocaleString("id-ID")} / malam
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
    </Box>
  );
}
