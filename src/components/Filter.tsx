import { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, MenuItem, Button, Stack, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const categories = [
  { label: 'Kereta Api', icon: <TrainIcon />, discount: '-30%' },
  { label: 'Pesawat', icon: <FlightIcon /> },
  { label: 'Travel & Bus', icon: <DirectionsBusIcon />, discount: '-30%' },
  { label: 'Sewa Motor & Mobil', icon: <DirectionsCarIcon />, discount: '-30%' },
  { label: 'Hotel', icon: <HotelIcon /> },
  { label: 'Teater', icon: <TheatersIcon /> },
  { label: 'Konser', icon: <MusicNoteIcon /> },
  { label: 'Tempat Wisata', icon: <AttractionsIcon /> },
  { label: 'Tiket Stadion', icon: <SportsSoccerIcon /> },
  { label: 'Vila & Apt.', icon: <HolidayVillageIcon /> }
];

const Filter = () => {
  const [tripType, setTripType] = useState('one-way');
  const [fromLocation, setFromLocation] = useState('Jakarta JKTC');
  const [toLocation, setToLocation] = useState('Bandung BDO');

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  return (
    <Box width="100%">
      {/* Trip Type Selection */}
      <RadioGroup
        row
        value={tripType}
        onChange={(e) => setTripType(e.target.value)}
        sx={{ mb: 2, color: 'black' }}
      >
        <FormControlLabel
          value="one-way"
          control={<Radio />}
          label="Sekali jalan"
        />
        <FormControlLabel
          value="round-trip"
          control={<Radio />}
          label="Pulang-pergi"
        />
      </RadioGroup>

      {/* Flight Details */}
      <Stack spacing={2}>
        {/* From and To Row */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Dari"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontWeight: 'bold' } }}
          />
          <IconButton
            onClick={handleSwapLocations}
            sx={{
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
              width: 40,
              height: 40
            }}
          >
            <SwapHorizIcon />
          </IconButton>
          <TextField
            label="Ke"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontWeight: 'bold' } }}
          />
        </Stack>

        {/* Date and Passenger Row */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Pergi"
            type="date"
            defaultValue="2025-07-19"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiInputBase-input': { fontWeight: 'bold' } }}
          />
          <TextField
            label="Pulang - Lebih hemat"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={tripType === 'one-way'}
            placeholder="Pesan pulang-pergi"
            sx={{
              '& .MuiInputBase-input': {
                fontWeight: tripType === 'one-way' ? 'normal' : 'bold',
                color: tripType === 'one-way' ? 'text.disabled' : 'text.primary'
              }
            }}
          />
          <TextField
            select
            label="Penumpang, Kelas"
            defaultValue="1, Ekonomi"
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontWeight: 'bold' } }}
          >
            <MenuItem value="1, Ekonomi">1, Ekonomi</MenuItem>
            <MenuItem value="2, Bisnis">2, Bisnis</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: 150,
              height: 56,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Ayo Cari
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const TabSearchBox = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Filter />;
      case 1:
        return <Typography variant="body1">Form To Do</Typography>;
      case 2:
        return <Typography variant="body1">Form Hotel</Typography>;
      case 3:
        return <Typography variant="body1">Form Kereta Api</Typography>;
      case 4:
        return <Typography variant="body1">Form Vila & Apt.</Typography>;
      case 5:
        return <Typography variant="body1">Form Ferry</Typography>;
      case 6:
        return <Typography variant="body1">Form Bus & Travel</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', mx: 'auto' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          TabIndicatorProps={{ style: { display: 'none' } }} // Hilangkan garis bawah default
          sx={{
            flex: 1,
            zIndex: 999,
            padding: 1,
            borderRadius: 8,
            boxShadow: 2,
            '& .MuiTabs-scrollButtons': {
              color: 'primary.main',
              backgroundColor: '#f0f0f0',
              borderRadius: 2,
              mx: 0.5,
            },
            '& .MuiTabs-scrollButtons.Mui-disabled': {
              opacity: 0.3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: 48,
              borderRadius: 6,
              px: 2,
            },
            '& .Mui-selected': {
              bgcolor: '#e7f2ff',
              borderRadius: 6,
              transition: 'all 0.3s',
            },
          }}
        >
          {categories.map((cat, index) => (
            <Tab
              key={index}
              label={
                <Box display="flex" alignItems="center" gap={1} position="relative">
                  {cat.icon}
                  {cat.label}
                  {cat.discount && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        fontSize: '0.7rem',
                        px: 0.5,
                        py: 0.1,
                        borderRadius: 1,
                        fontWeight: 'bold'
                      }}
                    >
                      {cat.discount}
                    </Box>
                  )}
                </Box>
              }
              wrapped
            />
          ))}
        </Tabs>
      </Box>


      <Box mt={-3} sx={{ borderRadius: 4, backgroundColor: 'white', boxShadow: 2, padding: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', pt: 2, alignItems: 'center', flexDirection: 'column', width: '100%' }}>
          {renderTabContent()}
          <Typography fontSize={14} color="text.secondary" sx={{ flex: 1, mt: 4 }}>
            <span>🎫</span> Yuk, cek ada promo apa aja yang bisa kamu pakai biar pesan tiket pesawat jadi lebih hemat.
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer', ml: 1 }}>
              Cek promonya sekarang!
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TabSearchBox;
