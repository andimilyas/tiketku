'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrainIcon from '@mui/icons-material/Train';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [anchorCategory, setAnchorCategory] = useState<null | HTMLElement>(null);
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);

  // Dummy notification count
  const notificationCount = 2;

  // Kategori menu
  const categories = [
    {
      label: 'Kereta',
      icon: <TrainIcon fontSize="small" color="primary" />,
      href: '/kereta-api',
    },
    {
      label: 'Hotel',
      icon: <HotelIcon fontSize="small" color="primary" />,
      href: '/hotel',
    },
    {
      label: 'Pesawat',
      icon: <FlightIcon fontSize="small" color="primary" />,
      href: '/pesawat',
    },
    {
      label: 'Sewa Motor & Mobil',
      icon: <DirectionsCarIcon fontSize="small" color="primary" />,
      href: '/rental',
    },
    {
      label: 'Travel & Bus',
      icon: <DirectionsBusIcon fontSize="small" color="primary" />,
      href: '/travel-bus',
    },
    {
      label: 'Hiburan',
      icon: <TheatersIcon fontSize="small" color="primary" />,
      sub: [
        { label: 'Teater', icon: <TheatersIcon fontSize="small" />, href: '/hiburan/teater' },
        { label: 'Konser', icon: <MusicNoteIcon fontSize="small" />, href: '/hiburan/konser' },
        { label: 'Tempat Wisata', icon: <AttractionsIcon fontSize="small" />, href: '/hiburan/wisata' },
      ],
    },
    {
      label: 'Activity',
      icon: <SportsTennisIcon fontSize="small" color="primary" />,
      sub: [
        { label: 'Futsal', icon: <SportsSoccerIcon fontSize="small" />, href: '/activity/futsal' },
        { label: 'Minisoccer', icon: <SportsSoccerIcon fontSize="small" />, href: '/activity/minisoccer' },
        { label: 'Lainnya', icon: <SportsTennisIcon fontSize="small" />, href: '/activity/other' },
      ],
    },
    {
      label: 'Olahraga',
      icon: <SportsSoccerIcon fontSize="small" color="primary" />,
      sub: [
        { label: 'Tiket Stadion', icon: <SportsSoccerIcon fontSize="small" />, href: '/olahraga/stadion' },
        { label: 'Tiket Nonton Olahraga Lainnya', icon: <SportsTennisIcon fontSize="small" />, href: '/olahraga/lainnya' },
      ],
    },
  ];

  // User menu
  const userMenu = [
    { label: 'Pesananmu', icon: <AssignmentIcon fontSize="small" />, href: '/pesanan' },
    { label: 'Wishlist', icon: <FavoriteBorderIcon fontSize="small" />, href: '/wishlist' },
    { label: 'Profile', icon: <PersonOutlineIcon fontSize="small" />, href: '/profile' },
    { label: 'Pengaturan', icon: <SettingsIcon fontSize="small" />, href: '/pengaturan' },
    { label: 'Reviewmu', icon: <RateReviewIcon fontSize="small" />, href: '/review' },
    { label: 'Logout', icon: <LogoutIcon fontSize="small" />, href: '/logout' },
  ];

  // Popover handlers
  const handleCategoryOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorCategory(event.currentTarget);
  };
  const handleCategoryClose = () => {
    setAnchorCategory(null);
  };

  const handleUserOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUser(event.currentTarget);
  };
  const handleUserClose = () => {
    setAnchorUser(null);
  };

  // Render submenus for categories
  const renderCategoryMenu = () => {
    const sidebarCategories = [
      { label: 'Transportasi' },
      { label: 'Akomodasi' },
      { label: 'Hiburan' },
      { label: 'Activity' },
      { label: 'Pertandingan' },
    ];
    const contentByCategory = [
      // Transportasi
      [
        { label: 'Pesawat', icon: <FlightIcon fontSize="small" />, href: '/pesawat' },
        { label: 'Kereta', icon: <TrainIcon fontSize="small" />, href: '/kereta-api' },
        { label: 'Travel & Bus', icon: <DirectionsBusIcon fontSize="small" />, href: '/travel-bus' },
        { label: 'Sewa Motor & Mobil', icon: <TwoWheelerIcon fontSize="small" />, href: '/sewa-motor-mobil' },
      ],
      // Akomodasi
      [
        { label: 'Hotel', icon: <HotelIcon fontSize="small" />, href: '/akomodasi/hotel' },
        { label: 'Villa', icon: <HolidayVillageIcon fontSize="small" />, href: '/akomodasi/villa' },
      ],
      // Hiburan
      [
        { label: 'Teater', icon: <TheaterComedyIcon fontSize="small" />, href: '/hiburan/teater' },
        { label: 'Konser', icon: <MusicNoteIcon fontSize="small" />, href: '/hiburan/konser' },
        { label: 'Tempat Wisata', icon: <AttractionsIcon fontSize="small" />, href: '/hiburan/wisata' },
      ],
      // Activity
      [
        { label: 'Futsal', icon: <SportsSoccerIcon fontSize="small" />, href: '/activity/futsal' },
        { label: 'Minisoccer', icon: <SportsSoccerIcon fontSize="small" />, href: '/activity/minisoccer' },
        { label: 'Basket', icon: <SportsSoccerIcon fontSize="small" />, href: '/activity/basket' },
        { label: 'Lainnya', icon: <SportsTennisIcon fontSize="small" />, href: '/activity/other' },
      ],
      // Pertandingan
      [
        { label: 'Sepak Bola', icon: <SportsSoccerIcon fontSize="small" />, href: '/pertandingan/sepakbola' },
        { label: 'Badminton', icon: <SportsTennisIcon fontSize="small" />, href: '/pertandingan/badminton' },
        { label: 'Lainnya', icon: <EmojiEventsIcon fontSize="small" />, href: '/pertandingan/lainnya' },
      ],
    ];
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          minWidth: 420,
          maxWidth: 520,
          maxHeight: 260,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Dashboard Mini Category Menu */}
        <Box
          sx={{
            width: 150,
            bgcolor: 'grey.100',
            borderRight: 1,
            borderColor: 'divider',
            py: 1,
          }}
        >
          <List dense>
            {sidebarCategories.map((cat, idx) => (
              <ListItemButton
                key={cat.label}
                selected={selectedCategoryIdx === idx}
                onClick={() => setSelectedCategoryIdx(idx)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  px: 2,
                  py: 1,
                  bgcolor: selectedCategoryIdx === idx ? 'primary.50' : 'inherit',
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      color={selectedCategoryIdx === idx ? 'primary.main' : 'text.secondary'}
                    >
                      {cat.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
        {/* Konten Kategori */}
        <Box sx={{ flex: 1, py: 1, px: 2, overflowY: 'auto' }}>
          <List dense>
            {contentByCategory[selectedCategoryIdx].map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                href={item.href}
                onClick={handleCategoryClose}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    );
  };

  // Render user menu
  const renderUserMenu = () => (
    <Box sx={{ minWidth: 280, py: 1 }}>
      <List dense>
        {userMenu.map((item, idx) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.href}
            onClick={handleUserClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* Left: Logo + Center: Search (spaced with gap) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
              >
                TixGo
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Kategori */}
            <Button
              onClick={handleCategoryOpen}
              aria-label="Kategori"
              sx={{ borderRadius: 2, textTransform: 'none', fontSize: 14, fontWeight: 500, pl: 1, pr: 1.5 }}
              startIcon={<WidgetsIcon />}
            >
              Kategori
            </Button>
            <Popover
              open={Boolean(anchorCategory)}
              anchorEl={anchorCategory}
              onClose={handleCategoryClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 260 } }}
            >
              {renderCategoryMenu()}
            </Popover>
          </Box>
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari maskapai, kota asal, tujuan, event, dll"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'grey.100', borderRadius: 2 },
              }}
            />
          </Box>
        </Box>

        {/* Right: Kategori, Notifikasi, User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifikasi */}
          <IconButton color="primary" sx={{ borderRadius: 2 }}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* User */}
          <IconButton
            color="primary"
            onClick={handleUserOpen}
            aria-label="User"
            sx={{ borderRadius: 2, ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              <PersonOutlineIcon />
            </Avatar>
          </IconButton>
          <Popover
            open={Boolean(anchorUser)}
            anchorEl={anchorUser}
            onClose={handleUserClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 220 } }}
          >
            {renderUserMenu()}
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
