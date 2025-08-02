'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  Typography,
  Paper,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Search,
  SwapHoriz,
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  Person,
  Add,
  Remove
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
import { setSearchParams, searchFlights } from '@/store/slices/searchSlice';
import { FlightSearchParams } from '@/types/flight';

const popularCities = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar-Bali', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];

const classLabels = {
  economy: 'Ekonomi',
  business: 'Bisnis',
  first: 'First Class'
};

interface HorizontalFlightSearchProps {
  onSearch?: (params: FlightSearchParams) => void;
}

export default function HorizontalFlightSearch({ onSearch }: HorizontalFlightSearchProps) {
  const dispatch = useDispatch<AppDispatch>();
  const previousSearchParams = useSelector((state: RootState) => state.search.searchParams);

  // Read URL parameters
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlDeparture = searchParams.get('d');
  const urlArrival = searchParams.get('a');
  const urlDate = searchParams.get('date');
  const urlReturnDate = searchParams.get('returnDate');
  const urlAdult = searchParams.get('adult');
  const urlChild = searchParams.get('child');
  const urlInfant = searchParams.get('infant');
  const urlClass = searchParams.get('class');

  // State untuk form
  const [departure, setDeparture] = useState(urlDeparture || previousSearchParams?.departure || 'CGK');
  const [arrival, setArrival] = useState(urlArrival || previousSearchParams?.arrival || 'DPS');
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(() => {
    if (urlDate) {
      const date = dayjs(urlDate);
      return date.isValid() ? date : dayjs().add(1, 'day');
    }
    if (previousSearchParams?.departureDate) {
      const date = dayjs(previousSearchParams.departureDate);
      return date.isValid() ? date : dayjs().add(1, 'day');
    }
    return dayjs().add(1, 'day');
  });
  const [returnDate, setReturnDate] = useState<Dayjs | null>(() => {
    if (urlReturnDate) {
      const date = dayjs(urlReturnDate);
      return date.isValid() ? date : null;
    }
    if (previousSearchParams?.returnDate) {
      const date = dayjs(previousSearchParams.returnDate);
      return date.isValid() ? date : null;
    }
    return null;
  });
  const [passengers, setPassengers] = useState({
    adults: parseInt(urlAdult || '') || previousSearchParams?.passengers?.adults || 1,
    children: parseInt(urlChild || '') || previousSearchParams?.passengers?.children || 0,
    infants: parseInt(urlInfant || '') || previousSearchParams?.passengers?.infants || 0
  });
  const [travelClass, setTravelClass] = useState<'economy' | 'business' | 'first'>(
    (urlClass as 'economy' | 'business' | 'first') || previousSearchParams?.class || 'economy'
  );
  const [tripType] = useState<'one-way' | 'round-trip'>(
    urlReturnDate ? 'round-trip' : previousSearchParams?.tripType || 'one-way'
  );

  // State untuk dropdowns
  const [departureAnchor, setDepartureAnchor] = useState<null | HTMLElement>(null);
  const [arrivalAnchor, setArrivalAnchor] = useState<null | HTMLElement>(null);
  const [passengerAnchor, setPassengerAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSearch = async () => {
    if (!departureDate || !departureDate.isValid()) return;

    const searchParams: FlightSearchParams = {
      departure,
      arrival,
      departureDate: departureDate.format('YYYY-MM-DD'),
      returnDate: returnDate?.isValid() ? returnDate.format('YYYY-MM-DD') : undefined,
      passengers,
      class: travelClass,
      tripType
    };

    dispatch(setSearchParams(searchParams));
    await dispatch(searchFlights(searchParams));

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const swapCities = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const updatePassengerCount = (type: keyof typeof passengers, increment: boolean) => {
    setPassengers(prev => {
      const current = prev[type];
      const newValue = increment ? current + 1 : Math.max(0, current - 1);

      if (type === 'adults' && newValue < 1) return prev;
      if (newValue > 9) return prev;

      return { ...prev, [type]: newValue };
    });
  };

  const getCityDisplay = (code: string) => {
    const city = popularCities.find(c => c.code === code);
    return city ? `${city.name}, ${city.code}` : code;
  };

  const getDateDisplay = () => {
    if (!departureDate || !departureDate.isValid()) return '';

    const date = departureDate;
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dayName = dayNames[date.day()];
    const dateStr = date.format('DD MMM YY');

    if (tripType === 'one-way') {
      return `${dayName}, ${dateStr} (Sekali Jalan)`;
    } else {
      // Round trip - show both dates
      if (returnDate && returnDate.isValid()) {
        const returnDayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const returnDayName = returnDayNames[returnDate.day()];
        const returnDateStr = returnDate.format('DD MMM YY');
        return `${dayName}, ${dateStr} - ${returnDayName}, ${returnDateStr} (Pulang Pergi)`;
      } else {
        return `${dayName}, ${dateStr} (Pulang Pergi)`;
      }
    }
  };

  const getPassengerDisplay = () => {
    const classStr = classLabels[travelClass];
    return `${totalPassengers} penumpang, ${classStr}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'white',
          borderRadius: 3,
          p: 2
        }}
      >
        {/* Departure City */}
        <TextField
          value={getCityDisplay(departure)}
          onClick={(e) => setDepartureAnchor(e.currentTarget)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <FlightTakeoff sx={{ color: 'action.active', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { cursor: 'pointer' }
          }}
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              border: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }
          }}
        />

        {/* Swap Button */}
        <IconButton
          onClick={swapCities}
          sx={{
            backgroundColor: 'white',
            padding: 0,
            borderRadius: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'grey.50'
            }
          }}
        >
          <SwapHoriz sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Arrival City */}
        <TextField
          value={getCityDisplay(arrival)}
          onClick={(e) => setArrivalAnchor(e.currentTarget)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <FlightLand sx={{ color: 'action.active', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { cursor: 'pointer' }
          }}
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }
          }}
        />

        {/* Date */}
        <TextField
          value={getDateDisplay()}
          onClick={(e) => setDateAnchor(e.currentTarget)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday sx={{ color: 'action.active', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { cursor: 'pointer' }
          }}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }
          }}
        />

        {/* Passengers & Class */}
        <TextField
          value={getPassengerDisplay()}
          onClick={(e) => setPassengerAnchor(e.currentTarget)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: 'action.active', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { cursor: 'pointer' }
          }}
          sx={{
            minWidth: 180,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }
          }}
        />

        {/* Search Button */}
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            fontSize: 16,
            textTransform: 'none',
            height: '56px',
            borderRadius: 2,
            px: 5,
            py: 1.5,
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Cari
        </Button>
      </Box>

      {/* Departure City Menu */}
      <Menu
        anchorEl={departureAnchor}
        open={Boolean(departureAnchor)}
        onClose={() => setDepartureAnchor(null)}
        PaperProps={{
          sx: { maxHeight: 300 }
        }}
      >
        {popularCities.map((city) => (
          <MenuItem
            key={city.code}
            onClick={() => {
              setDeparture(city.code);
              setDepartureAnchor(null);
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {city.name} ({city.code})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {city.airport}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Arrival City Menu */}
      <Menu
        anchorEl={arrivalAnchor}
        open={Boolean(arrivalAnchor)}
        onClose={() => setArrivalAnchor(null)}
        PaperProps={{
          sx: { maxHeight: 300 }
        }}
      >
        {popularCities.map((city) => (
          <MenuItem
            key={city.code}
            onClick={() => {
              setArrival(city.code);
              setArrivalAnchor(null);
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {city.name} ({city.code})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {city.airport}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Date Selection Menu */}
      <Menu
        anchorEl={dateAnchor}
        open={Boolean(dateAnchor)}
        onClose={() => setDateAnchor(null)}
        PaperProps={{
          sx: { minWidth: 400, p: 2 }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pilih Tanggal
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Tanggal Berangkat
          </Typography>
          <DatePicker
            value={departureDate}
            onChange={(date) => {
              setDepartureDate(date);
              setDateAnchor(null);
            }}
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small'
              }
            }}
          />
        </Box>

        {tripType === 'round-trip' && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tanggal Pulang
            </Typography>
            <DatePicker
              value={returnDate}
              onChange={(date) => {
                setReturnDate(date);
                setDateAnchor(null);
              }}
              minDate={departureDate ? departureDate.add(1, 'day') : dayjs().add(1, 'day')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small'
                }
              }}
            />
          </Box>
        )}
      </Menu>

      {/* Passenger & Class Menu */}
      <Menu
        anchorEl={passengerAnchor}
        open={Boolean(passengerAnchor)}
        onClose={() => setPassengerAnchor(null)}
        PaperProps={{
          sx: { minWidth: 300, p: 2 }
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Atur Penumpang & Kelas
        </Typography>

        {/* Passengers */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Penumpang
          </Typography>
          {(['adults', 'children', 'infants'] as const).map((type) => (
            <Box key={type} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography fontSize="small">
                  {type === 'adults' ? 'Dewasa' : type === 'children' ? 'Anak' : 'Bayi'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {type === 'adults' ? '12+ tahun' : type === 'children' ? '2-11 tahun' : '<2 tahun'}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton
                  size="small"
                  onClick={() => updatePassengerCount(type, false)}
                  disabled={type === 'adults' && passengers[type] <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{passengers[type]}</Typography>
                <IconButton
                  size="small"
                  onClick={() => updatePassengerCount(type, true)}
                  disabled={passengers[type] >= 9}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Travel Class */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Kelas Penerbangan
          </Typography>
          {[
            { value: 'economy', label: 'Ekonomi' },
            { value: 'business', label: 'Bisnis' },
            { value: 'first', label: 'First Class' }
          ].map((classType) => (
            <Chip
              sx={{ mr: 0.5 }}
              key={classType.value}
              label={classType.label}
              clickable
              onClick={() => {
                setTravelClass(classType.value as 'economy' | 'business' | 'first');
                setPassengerAnchor(null);
              }}
              color={travelClass === classType.value ? 'primary' : 'default'}
              variant={travelClass === classType.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Menu>
    </LocalizationProvider>
  );
}
