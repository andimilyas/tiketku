'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, CircularProgress, Typography } from '@mui/material';
import { store, persistor } from '@/store';
import { theme } from '@/lib/theme';
import FlightSearchForm from '@/components/features/flight/FlightSearchForm';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FlightSearchParams } from '@/types/flight';

function FlightSearchPage() {
  const router = useRouter();

  const handleSearch = (params: FlightSearchParams) => {
    // Build URL with search parameters
    const urlParams = new URLSearchParams({
      d: params.departure,
      a: params.arrival,
      date: params.departureDate,
      adult: params.passengers.adults.toString(),
      child: params.passengers.children.toString(),
      infant: params.passengers.infants.toString(),
      class: params.class,
      dType: 'CITY',
      aType: 'CITY',
      dLabel: params.departure,
      aLabel: params.arrival,
      type: 'depart',
      flexiFare: 'true'
    });

    if (params.returnDate) {
      urlParams.append('returnDate', params.returnDate);
    }

    // Navigate to search page with parameters
    router.push(`/pesawat/search?${urlParams.toString()}`);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `url('/background/plane.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '65vh',
        px: 2,
        py: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0,0,0,0.0) 100%)',
          zIndex: 1,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, justifyContent: 'space-between' }}>
        <Box flex={1} sx={{ maxWidth: 500 }}>
          <Typography variant="h3" fontWeight="bold" color="white">
            Pesan tiket pesawat
            dan jadwal
            penerbangan hari ini
          </Typography>
        </Box>
        <Box
          flex={1}
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 600,
          }}
        >
          <FlightSearchForm onSearch={handleSearch} />
        </Box>
      </Container>
    </Box>
  );
}

export default function FlightsPage() {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
            </Box>
          }
          persistor={persistor}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <FlightSearchPage />
            </SnackbarProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

// lib/validations/flight.ts
import { z } from 'zod';

export const flightSearchSchema = z.object({
  departure: z.string().min(3).max(3, 'Kode bandara harus 3 karakter'),
  arrival: z.string().min(3).max(3, 'Kode bandara harus 3 karakter'),
  departureDate: z.date().refine(
    (val) => val instanceof Date && !isNaN(val.getTime()),
    { message: 'Tanggal keberangkatan wajib diisi' }
  ),
  returnDate: z.date().optional(),
  passengers: z.object({
    adults: z.number().min(1, 'Minimal 1 dewasa').max(9, 'Maksimal 9 penumpang'),
    children: z.number().min(0).max(9, 'Maksimal 9 anak'),
    infants: z.number().min(0).max(9, 'Maksimal 9 bayi'),
  }),
  class: z.enum(['economy', 'business', 'first']),
  tripType: z.enum(['one-way', 'round-trip']),
}).refine((data) => {
  if (data.tripType === 'round-trip' && !data.returnDate) {
    return false;
  }
  if (data.returnDate && data.departureDate >= data.returnDate) {
    return false;
  }
  return true;
}, {
  message: 'Tanggal pulang harus setelah tanggal berangkat',
  path: ['returnDate'],
});

export const passengerDetailSchema = z.object({
  type: z.enum(['adult', 'child', 'infant']),
  title: z.enum(['Tuan', 'Nyonya', 'Nona']),
  firstName: z.string().min(1, 'Nama depan wajib diisi').max(50, 'Nama terlalu panjang'),
  lastName: z.string().min(1, 'Nama belakang wajib diisi').max(50, 'Nama terlalu panjang'),
  dateOfBirth: z.date().refine(
    (val) => val instanceof Date && !isNaN(val.getTime()),
    { message: 'Tanggal lahir wajib diisi' }
  ),
  nationality: z.string().min(1, 'Kewarganegaraan wajib diisi'),
  documentType: z.enum(['passport', 'ktp']),
  documentNumber: z.string().min(1, 'Nomor dokumen wajib diisi'),
  documentExpiry: z.date().optional(),
  seatPreference: z.string().optional(),
  mealPreference: z.string().optional(),
});

export const contactInfoSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  phone: z.string()
    .min(8, 'Nomor telepon minimal 8 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .regex(/^\d+$/, 'Nomor telepon hanya boleh angka'),
  countryCode: z.string().min(1, 'Kode negara wajib dipilih'),
});

// constants/airports.ts
export const INDONESIAN_AIRPORTS = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai International Airport', city: 'Bali' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto Airport', city: 'Yogyakarta' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani Airport', city: 'Semarang' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh Airport', city: 'Malang' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara Airport', city: 'Bandung' },
  { code: 'MDN', name: 'Medan', airport: 'Kualanamu International Airport', city: 'Medan' },
  { code: 'PLM', name: 'Palembang', airport: 'Sultan Mahmud Badaruddin II Airport', city: 'Palembang' },
  { code: 'PKU', name: 'Pekanbaru', airport: 'Sultan Syarif Kasim II Airport', city: 'Pekanbaru' },
  { code: 'BTH', name: 'Batam', airport: 'Hang Nadim Airport', city: 'Batam' },
  { code: 'BPN', name: 'Balikpapan', airport: 'Sultan Aji Muhammad Sulaiman Airport', city: 'Balikpapan' },
  { code: 'PKY', name: 'Palangkaraya', airport: 'Tjilik Riwut Airport', city: 'Palangkaraya' },
  { code: 'UPG', name: 'Makassar', airport: 'Sultan Hasanuddin Airport', city: 'Makassar' },
  { code: 'KDI', name: 'Kendari', airport: 'Haluoleo Airport', city: 'Kendari' },
  { code: 'AMQ', name: 'Ambon', airport: 'Pattimura Airport', city: 'Ambon' },
  { code: 'DJJ', name: 'Jayapura', airport: 'Sentani Airport', city: 'Jayapura' },
];

export const FLIGHT_CLASSES = [
  { value: 'economy', label: 'Ekonomi', description: 'Kursi standar dengan layanan dasar' },
  { value: 'business', label: 'Bisnis', description: 'Kursi lebih luas dengan layanan premium' },
  { value: 'first', label: 'First Class', description: 'Kursi terbaik dengan layanan mewah' },
];

export const MEAL_PREFERENCES = [
  { value: '', label: 'Standar' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'diabetic', label: 'Diabetik' },
  { value: 'low-sodium', label: 'Rendah Garam' },
  { value: 'gluten-free', label: 'Bebas Gluten' },
];

export const SEAT_PREFERENCES = [
  { value: '', label: 'Tidak ada preferensi' },
  { value: 'window', label: 'Jendela' },
  { value: 'aisle', label: 'Lorong' },
  { value: 'middle', label: 'Tengah' },
];

export const COUNTRY_CODES = [
  { value: '+62', label: '+62 (Indonesia)', flag: '🇮🇩' },
  { value: '+65', label: '+65 (Singapore)', flag: '🇸🇬' },
  { value: '+60', label: '+60 (Malaysia)', flag: '🇲🇾' },
  { value: '+1', label: '+1 (US/Canada)', flag: '🇺🇸' },
  { value: '+44', label: '+44 (UK)', flag: '🇬🇧' },
  { value: '+61', label: '+61 (Australia)', flag: '🇦🇺' },
];

// utils/date.ts
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale('id');

export const formatDate = (date: string | Date, format = 'DD MMM YYYY') => {
  return dayjs(date).format(format);
};

export const formatTime = (time: string | Date, format = 'HH:mm') => {
  return dayjs(time).format(format);
};

export const formatDateTime = (datetime: string | Date, format = 'DD MMM YYYY, HH:mm') => {
  return dayjs(datetime).format(format);
};

export const getRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const calculateDuration = (start: string | Date, end: string | Date) => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  const diff = endTime.diff(startTime);

  const duration = dayjs.duration(diff);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  return `${hours}h ${minutes}m`;
};

export const isValidDate = (date: any) => {
  return dayjs(date).isValid();
};

export const addDays = (date: string | Date, days: number) => {
  return dayjs(date).add(days, 'day');
};

export const isBefore = (date1: string | Date, date2: string | Date) => {
  return dayjs(date1).isBefore(dayjs(date2));
};

export const isAfter = (date1: string | Date, date2: string | Date) => {
  return dayjs(date1).isAfter(dayjs(date2));
};

// utils/currency.ts
export const formatCurrency = (amount: number, currency = 'IDR') => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const parseCurrency = (value: string) => {
  return parseInt(value.replace(/[^0-9]/g, ''));
};

// utils/flight.ts
export const generateFlightId = (flightNumber: string, date: string) => {
  return `${flightNumber}-${dayjs(date).format('YYYY-MM-DD')}`;
};

export const parseFlightId = (flightId: string) => {
  const parts = flightId.split('-');
  const flightNumber = parts[0];
  const date = parts.slice(1).join('-');

  return { flightNumber, date };
};

export const getFlightStatus = (departureTime: string | Date, arrivalTime: string | Date) => {
  const now = dayjs();
  const departure = dayjs(departureTime);
  const arrival = dayjs(arrivalTime);

  if (now.isBefore(departure)) {
    return 'scheduled';
  } else if (now.isAfter(departure) && now.isBefore(arrival)) {
    return 'active';
  } else if (now.isAfter(arrival)) {
    return 'landed';
  }

  return 'scheduled';
};

export const calculateFlightDuration = (departureTime: string | Date, arrivalTime: string | Date) => {
  return calculateDuration(departureTime, arrivalTime);
};