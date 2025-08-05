// components/features/flight/FlightSearchForm.tsx
'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Typography,
  IconButton,
  Switch,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FlightTakeoff, FlightLand, SwapHoriz, Person } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { setSearchParams, searchFlights } from '@/store/slices/searchSlice';

import { AppDispatch } from '@/store';
import { FlightSearchParams } from '@/types/flight';

import PassengersClassModal from './Modal/PassengersClassModal';

const searchSchema = z.object({
  departure: z.string().min(1, 'Departure city is required'),
  arrival: z.string().min(1, 'Arrival city is required'),
  departureDate: z.date(),
  returnDate: z.date().optional(),
  passengers: z.object({
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(9),
    infants: z.number().min(0).max(9)
  }),
  class: z.enum(['economy', 'business', 'first']),
  tripType: z.enum(['one-way', 'round-trip'])
});

type SearchFormData = z.infer<typeof searchSchema>;

const popularCities = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];

interface FlightSearchFormProps {
  onSearch?: (params: FlightSearchParams) => void;
}

export default function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      departure: '',
      arrival: '',
      departureDate: new Date(),
      returnDate: undefined,
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      class: 'economy',
      tripType: 'one-way'
    }
  });

  const tripType = watch('tripType');
  const passengers = watch('passengers');

  const onSubmit = async (data: SearchFormData) => {
    const searchParams: FlightSearchParams = {
      ...data,
      class: data.class === 'first' ? 'first class' : data.class,
      departureDate: dayjs(data.departureDate).format('YYYY-MM-DD'),
      returnDate: data.returnDate ? dayjs(data.returnDate).format('YYYY-MM-DD') : undefined
    };

    dispatch(setSearchParams(searchParams));
    await dispatch(searchFlights(searchParams));

    // Call onSearch callback if provided (for new flow)
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const swapCities = () => {
    const departure = watch('departure');
    const arrival = watch('arrival');
    setValue('departure', arrival);
    setValue('arrival', departure);
  };

  const updatePassengerCount = (type: keyof typeof passengers, increment: boolean) => {
    const current = passengers[type];
    const newValue = increment ? current + 1 : Math.max(0, current - 1);

    if (type === 'adults' && newValue < 1) return;
    if (newValue > 9) return;

    setValue(`passengers.${type}`, newValue);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Trip Type */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="tripType"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value === 'round-trip'}
                          onChange={(_, checked) => {
                            field.onChange(checked ? 'round-trip' : 'one-way');
                          }}
                          color="primary"
                        />
                      }
                      label={field.value === 'round-trip' ? 'Pulang Pergi' : 'Sekali Jalan'}
                    />
                  )}
                />
              </Grid>

              {/* Origin and Destination */}
              <Grid size={{ xs: 12, md: 5.5 }}>
                <Controller
                  name="departure"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.departure}>
                      <InputLabel>Dari</InputLabel>
                      <Select
                        label="Dari"
                        {...field}
                        startAdornment={<FlightTakeoff sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        {popularCities.map((city) => (
                          <MenuItem key={city.code} value={city.code}>
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
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 1 }} display="flex" alignItems="center" justifyContent="center">
                <IconButton onClick={swapCities} color="primary">
                  <SwapHoriz />
                </IconButton>
              </Grid>

              <Grid size={{ xs: 12, md: 5.5 }}>
                <Controller
                  name="arrival"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.arrival}>
                      <InputLabel>Ke</InputLabel>
                      <Select
                        label="Ke"
                        {...field}
                        startAdornment={<FlightLand sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        {popularCities.map((city) => (
                          <MenuItem key={city.code} value={city.code}>
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
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Dates */}
              <Grid size={{ xs: 12, md: tripType === 'round-trip' ? 6 : 12 }}>
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Tanggal Berangkat"
                      value={dayjs(field.value)}
                      onChange={(date) => field.onChange(date?.toDate())}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.departureDate
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              {tripType === 'round-trip' && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Tanggal Pulang"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date?.toDate())}
                        minDate={dayjs(watch('departureDate')).add(1, 'day')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.returnDate
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, md: 12 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setModalOpen(true)}
                  sx={{ height: 56, justifyContent: 'flex-start', borderRadius: 2, borderColor: 'primary.main' }}
                >
                  <Box display="flex" alignItems="center" gap={0}>

                    <InputAdornment position="start">
                      <Person sx={{ color: 'primary.main', fontSize: 25 }} />
                    </InputAdornment>
                    <Typography variant="body1" fontWeight="bold">
                      {totalPassengers} penumpang, {watch('class') === 'economy' ? 'Ekonomi' : watch('class') === 'business' ? 'Bisnis' : 'First Class'}
                    </Typography>
                  </Box>
                </Button>
              </Grid>

              <PassengersClassModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                passengers={passengers}
                travelClass={watch('class')}
                onChangePassenger={(type, inc) => updatePassengerCount(type, inc)}
                onChangeClass={(val) => setValue('class', val)}
              />

              {/* Search Button */}
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    height: 56,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Cari Penerbangan
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

