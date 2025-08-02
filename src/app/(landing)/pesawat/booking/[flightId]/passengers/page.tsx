'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Link,
  Switch,
  FormHelperText,
  Skeleton
} from '@mui/material';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Flight } from '@mui/icons-material';

// Memoized schema untuk menghindari re-creation
const passengerSchema = z.object({
  passengers: z.array(z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    passportNumber: z.string().min(1, 'Passport number is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    title: z.enum(['Tuan', 'Nyonya', 'Nona'])
  })),
  contactInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    title: z.enum(['Tuan', 'Nyonya', 'Nona'])
  })
});

type PassengerFormData = z.infer<typeof passengerSchema>;

// Memoized constants
const popularCities = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];

const nationalities = [
  'Indonesia', 'Malaysia', 'Singapore', 'Thailand',
  'Australia', 'United States', 'Japan', 'South Korea'
];

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}j ${minutes}m`;
  }
  return duration;
};

// Memoized component untuk menghindari re-render
const AirlineLogo = React.memo(({ airline }: { airline: { name: string; iata: string } }) => {
  const [imageError, setImageError] = useState(false);
  const [svgError, setSvgError] = useState(false);

  if (!imageError) {
    return (
      <Box
        component="img"
        src={`/airlines/${airline.iata.toLowerCase()}.png`}
        alt={airline.name}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={() => setImageError(true)}
      />
    );
  }

  if (!svgError) {
    return (
      <Box
        component="img"
        src={`/airlines/${airline.iata.toLowerCase()}.svg`}
        alt={airline.name}
        sx={{ width: 40, height: 40, objectFit: 'contain' }}
        onError={() => setSvgError(true)}
      />
    );
  }

  return <Flight sx={{ width: 40, height: 40, color: 'primary.main' }} />;
});

// Memoized PassengerInput component
const PassengerInput = React.memo(({
  index,
  control,
  errors,
  type
}: {
  index: number;
  control: any;
  errors: any;
  type: string;
}) => (
  <Box mb={3}>
    <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
      <Typography variant="subtitle1">
        Penumpang {index + 1} ({type})
      </Typography>
      <FormControlLabel
        control={<Switch color="primary" />}
        label="Sama dengan pemesan"
        sx={{ ml: 2 }}
      />
    </Box>

    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name={`passengers.${index}.title`}
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                {...field}
                value={field.value || 'Tuan'}
              >
                <FormControlLabel value="Tuan" control={<Radio />} label="Tuan" />
                <FormControlLabel value="Nyonya" control={<Radio />} label="Nyonya" />
                <FormControlLabel value="Nona" control={<Radio />} label="Nona" />
              </RadioGroup>
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name={`passengers.${index}.firstName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nama Depan"
              fullWidth
              error={!!errors.passengers?.[index]?.firstName}
              helperText={errors.passengers?.[index]?.firstName?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name={`passengers.${index}.lastName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nama Belakang"
              fullWidth
              error={!!errors.passengers?.[index]?.lastName}
              helperText={errors.passengers?.[index]?.lastName?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name={`passengers.${index}.dateOfBirth`}
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Tanggal Lahir"
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                field.onChange(date ? date.format('YYYY-MM-DD') : '');
              }}
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.passengers?.[index]?.dateOfBirth,
                  helperText: errors.passengers?.[index]?.dateOfBirth?.message,
                }
              }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name={`passengers.${index}.nationality`}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.passengers?.[index]?.nationality}>
              <InputLabel>Kewarganegaraan</InputLabel>
              <Select
                {...field}
                label="Kewarganegaraan"
                value={field.value || ''}
              >
                {nationalities.map((nationality) => (
                  <MenuItem key={nationality} value={nationality}>
                    {nationality}
                  </MenuItem>
                ))}
              </Select>
              {errors.passengers?.[index]?.nationality && (
                <FormHelperText>
                  {errors.passengers?.[index]?.nationality?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name={`passengers.${index}.passportNumber`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nomor Paspor"
              fullWidth
              error={!!errors.passengers?.[index]?.passportNumber}
              helperText={errors.passengers?.[index]?.passportNumber?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  </Box>
));

export default function PassengerDetailsPage() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const flightId = params.flightId as string;
  const adults = parseInt(searchParams.get('adult') || '1');
  const children = parseInt(searchParams.get('child') || '0');
  const infants = parseInt(searchParams.get('infant') || '0');

  // Memoized selector
  const selectedFlight = useSelector((state: RootState) => state.booking.selectedFlight);

  // Memoized passenger types
  const passengerTypes = useMemo(() => {
    const types = [];
    for (let i = 0; i < adults + children + infants; i++) {
      if (i < adults) types.push('Dewasa');
      else if (i < adults + children) types.push('Anak');
      else types.push('Bayi');
    }
    return types;
  }, [adults, children, infants]);

  // Memoized default values
  const defaultValues = useMemo(() => ({
    passengers: Array(adults + children + infants).fill(null).map(() => ({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      nationality: '',
      title: 'Tuan' as const
    })),
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      title: 'Tuan' as const
    }
  }), [adults, children, infants]);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues
  });

  // Memoized submit handler
  const onSubmit = useCallback(async (data: PassengerFormData) => {
    try {
      console.log('Form submitted!');
      console.log('Passenger data:', data);

      if (!selectedFlight) {
        console.error('No selected flight found');
        return;
      }

      const paymentUrl = `/payment/checkout/${flightId}?${searchParams.toString()}`;
      console.log('Navigating to:', paymentUrl);
      router.push(paymentUrl);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }, [selectedFlight, flightId, searchParams, router]);

  // Simulate loading untuk memberikan feedback
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoized city names
  const departureCity = useMemo(() =>
    popularCities.find(city => city.code === selectedFlight?.departure?.iata)?.name,
    [selectedFlight?.departure?.iata]
  );

  const arrivalCity = useMemo(() =>
    popularCities.find(city => city.code === selectedFlight?.arrival?.iata)?.name,
    [selectedFlight?.arrival?.iata]
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="text" height={40} width={200} />
            <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ backgroundColor: '#ffffff', position: 'relative', py: 4,  }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: 200,
            backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0.92) 30%, rgba(0,123,255,0.10) 100%), url('/background/plane.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant='h5' sx={{ mb: 2 }} color='textPrimary' fontWeight={600}>
                Detail Penumpang
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px', borderRadius: 2, mb: 3 }}>
                  <CardContent>
                    {Object.keys(errors).length > 0 && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Mohon lengkapi semua field yang diperlukan
                      </Alert>
                    )}

                    <Box sx={{ p: 1.5 }}>
                      {passengerTypes.map((type, index) => (
                        <React.Fragment key={index}>
                          <PassengerInput
                            index={index}
                            control={control}
                            errors={errors}
                            type={type}
                          />
                          {index < passengerTypes.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                <Typography variant='h5' color='textPrimary' fontWeight={600} gutterBottom>
                  Detail Pemesan
                </Typography>
                <Typography variant='body2' color='textSecondary' gutterBottom sx={{ mb: 2 }}>
                  Detail kontak ini akan digunakan untuk pengiriman e-tiket dan keperluan refund/reschedule.
                </Typography>

                <Card sx={{ boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px' , borderRadius: 2 }}>
                  <CardContent>
                  <Box sx={{ p: 1.5 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="contactInfo.title"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup row {...field} value={field.value || 'Tuan'}>
                              <FormControlLabel value="Tuan" control={<Radio />} label="Tuan" />
                              <FormControlLabel value="Nyonya" control={<Radio />} label="Nyonya" />
                              <FormControlLabel value="Nona" control={<Radio />} label="Nona" />
                            </RadioGroup>
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="contactInfo.name"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nama Lengkap"
                              fullWidth
                              error={!!errors.contactInfo?.name}
                              helperText={errors.contactInfo?.name?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="contactInfo.phone"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nomor Telepon"
                              fullWidth
                              error={!!errors.contactInfo?.phone}
                              helperText={errors.contactInfo?.phone?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="contactInfo.email"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Alamat Email"
                              fullWidth
                              error={!!errors.contactInfo?.email}
                              helperText={errors.contactInfo?.email?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid></Box>

                  </CardContent>
                </Card>
                    <Box display="flex" gap={2} mt={3}>
                      <Button
                        sx={{ textTransform: 'none', flex: 1, borderRadius: 2 }}
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Lanjut ke Pembayaran'}
                      </Button>
                    </Box>
              </form>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ position: 'sticky', top: 20, borderRadius: 2, boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    {departureCity} <ArrowCircleRightRoundedIcon sx={{ color: 'primary.main', mx: 1 }} /> {arrivalCity}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <Chip
                      label={searchParams.get('tripType') === 'round-trip' ? 'Pulang Pergi' : 'Sekali Jalan'}
                      size="small"
                      color={searchParams.get('tripType') === 'round-trip' ? 'warning' : 'info'}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(selectedFlight?.arrival.time).format('ddd, DD MMM YYYY')}
                    </Typography>
                    <Box flex={1} />
                    <Link href="#" fontSize={14} underline="hover" color="primary">
                      Detail
                    </Link>
                  </Box>

                  {selectedFlight && (
                    <Box bgcolor="#F8F9FB" borderRadius={2} p={2} mb={2}>
                      <Box display="flex" alignItems="center">
                        <Box mr={2}>
                          <AirlineLogo airline={{
                            name: selectedFlight.airline.name,
                            iata: selectedFlight.airline.iata
                          }} />
                        </Box>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Typography fontWeight={700} mr={1}>
                              {dayjs(selectedFlight.departure.time).format('HH:mm')}
                            </Typography>
                            <Typography variant="caption" mr={0}>
                              {selectedFlight.departure.iata}
                            </Typography>
                            <Box sx={{ borderBottom: '1px dashed #bdbdbd', width: '100%', mx: 1 }} />
                            <Typography fontWeight={700} mr={1}>
                              {dayjs(selectedFlight.arrival.time).format('HH:mm')}
                            </Typography>
                            <Typography variant="caption">
                              {selectedFlight.arrival.iata}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                            {formatDuration(selectedFlight.duration)} • {selectedFlight.aircraft}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                    <Typography fontWeight={600}>
                      Total Pembayaran
                    </Typography>
                    <Typography fontWeight={700} fontSize={18} color="primary">
                      {Number(selectedFlight?.price.economy).toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}