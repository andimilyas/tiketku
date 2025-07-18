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
  Container,
} from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageBannerCarousel, { BannerItem } from "@/components/ImageBannerCarousel";

const banners: BannerItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Promo Tiket Konser 50% Off!',
    description: 'Dapatkan diskon spesial untuk tiket konser pilihan minggu ini.',
    cta: 'Lihat Promo',
    href: '/promo/konser',
  },
  {
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: 'Event Olahraga Terbaru',
    description: 'Jangan lewatkan pertandingan seru dan booking tiketnya sekarang!',
    cta: 'Jadwal Event',
    href: '/olahraga',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Liburan Hemat Bareng TixGo',
    description: 'Nikmati berbagai destinasi wisata dengan harga terjangkau.',
    cta: 'Cari Tiket',
    href: '/wisata',
  }
];

// Dummy data tiket pesawat
const flightTickets = [
  {
    id: 1,
    airline: "Garuda Indonesia",
    from: "Jakarta (CGK)",
    to: "Bali (DPS)",
    date: "2024-07-20",
    time: "08:00",
    price: 1200000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Garuda_Indonesia_logo.svg",
    class: "Ekonomi",
  },
  {
    id: 2,
    airline: "AirAsia",
    from: "Jakarta (CGK)",
    to: "Surabaya (SUB)",
    date: "2024-07-21",
    time: "10:30",
    price: 950000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/AirAsia_New_Logo.svg",
    class: "Ekonomi",
  },
  {
    id: 3,
    airline: "Citilink",
    from: "Jakarta (CGK)",
    to: "Yogyakarta (YIA)",
    date: "2024-07-22",
    time: "13:15",
    price: 800000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo_Citilink.svg",
    class: "Ekonomi",
  },
  {
    id: 4,
    airline: "Batik Air",
    from: "Jakarta (CGK)",
    to: "Medan (KNO)",
    date: "2024-07-23",
    time: "09:45",
    price: 1350000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Batik_Air_logo.svg",
    class: "Bisnis",
  },
  {
    id: 5,
    airline: "Lion Air",
    from: "Jakarta (CGK)",
    to: "Makassar (UPG)",
    date: "2024-07-24",
    time: "15:00",
    price: 1100000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Lion_Air_logo.svg",
    class: "Ekonomi",
  },
  {
    id: 6,
    airline: "Super Air Jet",
    from: "Jakarta (CGK)",
    to: "Padang (PDG)",
    date: "2024-07-25",
    time: "17:30",
    price: 1050000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Super_Air_Jet_logo.svg",
    class: "Ekonomi",
  },
];

const allOrigins = Array.from(new Set(flightTickets.map((t) => t.from)));
const allDestinations = Array.from(new Set(flightTickets.map((t) => t.to)));
const allClasses = Array.from(new Set(flightTickets.map((t) => t.class)));

export default function PesawatPage() {
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [flightClass, setFlightClass] = useState("");
  const [date, setDate] = useState("");

  // Filter logic
  const filteredTickets = flightTickets.filter((ticket) => {
    const matchSearch =
      ticket.airline.toLowerCase().includes(search.toLowerCase()) ||
      ticket.from.toLowerCase().includes(search.toLowerCase()) ||
      ticket.to.toLowerCase().includes(search.toLowerCase());
    const matchOrigin = origin ? ticket.from === origin : true;
    const matchDestination = destination ? ticket.to === destination : true;
    const matchClass = flightClass ? ticket.class === flightClass : true;
    const matchDate = date ? ticket.date === date : true;
    return matchSearch && matchOrigin && matchDestination && matchClass && matchDate;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7fafc", py: 4 }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 320, md: 500 },
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          mb: 6,
          px: 4,
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center"
            },
          }}
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1661962354730-cda54fa4f9f1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Pesawat"
          />
        </Box>

        {/* Overlay gradient for better text contrast */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(33,150,243,0.2) 70%, rgba(255,255,255,0.0) 100%)",
            zIndex: 1,
          }}
        />

        {/* Left: Headline */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            textAlign: { xs: "center", md: "left" },
            maxWidth: 420,
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2.2rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            Pesan tiket pesawat<br />
            dan jadwal<br />
            penerbangan hari ini
          </Typography>
        </Box>

        {/* Right: Search Card */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: { xs: "90%", sm: 400 },
            maxWidth: 420,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: 6,
            p: { xs: 2, sm: 3 },
            ml: { xs: 0, md: 8 },
            mt: { xs: 4, md: 0 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Simulasi notifikasi promo */}
          <Box
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 1,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1
              }}
            >
              <LocalOfferIcon />
            </Box>
            <span>
              Promo tiket pesawat! Dapatkan diskon hingga <b>Rp150.000</b> untuk rute tertentu 🎉
            </span>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Dari"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlightTakeoffIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Pilih asal</MenuItem>
                {allOrigins.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Ke"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlightLandIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Pilih tujuan</MenuItem>
                {allDestinations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
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
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Kelas"
                value={flightClass}
                onChange={(e) => setFlightClass(e.target.value)}
                size="small"
              >
                <MenuItem value="">Semua</MenuItem>
                {allClasses.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, borderRadius: 2, fontWeight: "bold" }}
            fullWidth
          >
            Ayo Cari!
          </Button>
        </Box>
      </Box>

      {/* Grid List Tiket Pesawat */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 2,
        }}
      >
        {filteredTickets.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Tidak ada tiket pesawat yang ditemukan.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTickets.map((ticket) => (
              <Grid size={{ md: 4, sm: 6, xs: 12 }} key={ticket.id}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <img
                        src={ticket.logo}
                        alt={ticket.airline}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "contain",
                          marginRight: 12,
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {ticket.airline}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {ticket.from}
                      </Typography>
                      <span style={{ margin: "0 8px" }}>→</span>
                      <Typography variant="body1" fontWeight="bold">
                        {ticket.to}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(ticket.date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {ticket.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Kelas: {ticket.class}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Rp {ticket.price.toLocaleString("id-ID")}
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

      <Box sx={{ bgcolor: 'white', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
        <ImageBannerCarousel banners={banners} />
        </Container>
      </Box>
    </Box>
  );
}
