'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ExpandMore, Person, Email, Phone } from '@mui/icons-material';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '@/store';
import { 
  updatePassengerDetail, 
  updateContactInfo, 
  proceedToPayment,
  goBackStep
} from '@/store/slices/bookingSlice';
import { PassengerDetail, ContactInfo } from '@/types/flight';

const passengerSchema = z.object({
  type: z.enum(['adult', 'child', 'infant']),
  title: z.enum(['Tuan', 'Nyonya', 'Nona']),
  firstName: z.string().min(1, 'Nama depan wajib diisi'),
  lastName: z.string().min(1, 'Nama belakang wajib diisi'),
  dateOfBirth: z.date(),
  nationality: z.string().min(1, 'Kewarganegaraan wajib diisi'),
  documentType: z.enum(['passport', 'ktp']),
  documentNumber: z.string().min(1, 'Nomor dokumen wajib diisi'),
  documentExpiry: z.date().optional(),
  seatPreference: z.string().optional(),
  mealPreference: z.string().optional()
});

const contactSchema = z.object({
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  countryCode: z.string()
});

const formSchema = z.object({
  passengers: z.array(passengerSchema),
  contact: contactSchema
});

type FormData = z.infer<typeof formSchema>;

export default function PassengerDetailsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    searchParams, 
    selectedFlight, 
    passengerDetails, 
    contactInfo 
  } = useSelector((state: RootState) => state.booking);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: generateDefaultPassengers(),
      contact: contactInfo
    }
  });

  const { fields } = useFieldArray({
    control,
    name: 'passengers'
  });

  function generateDefaultPassengers(): PassengerDetail[] {
    if (!searchParams) return [];
    
    const passengers: PassengerDetail[] = [];
    const { adults, children, infants } = searchParams.passengers;
    
    // Add adults
    for (let i = 0; i < adults; i++) {
      passengers.push({
        id: `adult-${i}`,
        type: 'adult',
        title: 'Tuan',
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        nationality: 'Indonesia',
        documentType: 'ktp',
        documentNumber: '',
        documentExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
        seatPreference: '',
        mealPreference: ''
      });
    }
    
    // Add children
    for (let i = 0; i < children; i++) {
      passengers.push({
        id: `child-${i}`,
        type: 'child',
        title: 'Tuan',
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        nationality: 'Indonesia',
        documentType: 'ktp',
        documentNumber: '',
        seatPreference: '',
        mealPreference: ''
      });
    }
    
    // Add infants
    for (let i = 0; i < infants; i++) {
      passengers.push({
        id: `infant-${i}`,
        type: 'infant',
        title: 'Tuan',
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        nationality: 'Indonesia',
        documentType: 'ktp',
        documentNumber: '',
        mealPreference: ''
      });
    }
    
    return passengers;
  }

  const onSubmit = (data: FormData) => {
    // Update passengers in store
    data.passengers.forEach((passenger, index) => {
      dispatch(updatePassengerDetail({ 
        index, 
        passenger: {
            ...passenger,
            dateOfBirth: typeof passenger.dateOfBirth === 'string'
                ? new Date(passenger.dateOfBirth)
                : passenger.dateOfBirth,
            documentExpiry: passenger.documentExpiry
                ? (typeof passenger.documentExpiry === 'string'
                    ? new Date(passenger.documentExpiry)
                    : passenger.documentExpiry)
                : undefined,
            id: ''
        }
      }));
    });
    
    // Update contact info
    dispatch(updateContactInfo(data.contact));
    
    // Proceed to payment
    dispatch(proceedToPayment());
  };

  const getPassengerTypeLabel = (type: string) => {
    const labels = {
      adult: 'Dewasa',
      child: 'Anak',
      infant: 'Bayi'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPassengerTypeColor = (type: string) => {
    const colors = {
      adult: 'primary',
      child: 'secondary',
      infant: 'success'
    } as const;
    return colors[type as keyof typeof colors] || 'default';
  };

  if (!selectedFlight) {
    return (
      <Alert severity="error">
        Tidak ada penerbangan yang dipilih. Silakan kembali ke halaman pencarian.
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Flight Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ringkasan Penerbangan
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedFlight.departure.iata} → {selectedFlight.arrival.iata}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFlight.airline.name} - {selectedFlight.flightNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(selectedFlight.departure.time).format('DD MMM YYYY, HH:mm')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" color="primary" textAlign="right">
                  Rp {selectedFlight.price.economy.toLocaleString()}
                  <Typography variant="body2" color="text.secondary">
                    per orang
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Passenger Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Penumpang
              </Typography>
              
              {fields.map((field, index) => (
                <Accordion key={field.id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person />
                      <Typography variant="subtitle1">
                        Penumpang {index + 1}
                      </Typography>
                      <Chip
                        label={getPassengerTypeLabel(field.type)}
                        color={getPassengerTypeColor(field.type)}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {/* Title */}
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`passengers.${index}.title`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth size="small">
                              <InputLabel>Gelar</InputLabel>
                              <Select {...field}>
                                <MenuItem value="Tuan">Tuan</MenuItem>
                                <MenuItem value="Nyonya">Nyonya</MenuItem>
                                <MenuItem value="Nona">Nona</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      {/* First Name */}
                      <Grid size={{ xs: 12, sm: 4.5 }}>
                        <Controller
                          name={`passengers.${index}.firstName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nama Depan *"
                              fullWidth
                              size="small"
                              error={!!errors.passengers?.[index]?.firstName}
                              helperText={errors.passengers?.[index]?.firstName?.message}
                            />
                          )}
                        />
                      </Grid>

                      {/* Last Name */}
                      <Grid size={{ xs: 12, sm: 4.5 }}>
                        <Controller
                          name={`passengers.${index}.lastName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nama Belakang *"
                              fullWidth
                              size="small"
                              error={!!errors.passengers?.[index]?.lastName}
                              helperText={errors.passengers?.[index]?.lastName?.message}
                            />
                          )}
                        />
                      </Grid>

                      {/* Date of Birth */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`passengers.${index}.dateOfBirth`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              label="Tanggal Lahir *"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => field.onChange(date?.toDate())}
                              maxDate={dayjs()}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  error: !!errors.passengers?.[index]?.dateOfBirth
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Nationality */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`passengers.${index}.nationality`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Kewarganegaraan *"
                              fullWidth
                              size="small"
                              error={!!errors.passengers?.[index]?.nationality}
                              helperText={errors.passengers?.[index]?.nationality?.message}
                            />
                          )}
                        />
                      </Grid>

                      {/* Document Type */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`passengers.${index}.documentType`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth size="small">
                              <InputLabel>Jenis Dokumen</InputLabel>
                              <Select {...field}>
                                <MenuItem value="ktp">KTP</MenuItem>
                                <MenuItem value="passport">Paspor</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      {/* Document Number */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`passengers.${index}.documentNumber`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nomor Dokumen *"
                              fullWidth
                              size="small"
                              error={!!errors.passengers?.[index]?.documentNumber}
                              helperText={errors.passengers?.[index]?.documentNumber?.message}
                            />
                          )}
                        />
                      </Grid>

                      {/* Document Expiry (for passport) */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`passengers.${index}.documentExpiry`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              label="Masa Berlaku Dokumen"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => field.onChange(date?.toDate())}
                              minDate={dayjs()}
                              disabled={field.value === undefined}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small'
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Optional Preferences */}
                      {field.type !== 'infant' && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Controller
                            name={`passengers.${index}.seatPreference`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <InputLabel>Preferensi Kursi</InputLabel>
                                <Select {...field}>
                                  <MenuItem value="">Tidak ada preferensi</MenuItem>
                                  <MenuItem value="window">Jendela</MenuItem>
                                  <MenuItem value="aisle">Lorong</MenuItem>
                                  <MenuItem value="middle">Tengah</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      )}

                    <Grid size={{ xs: 12, sm: 6 }}> 
                        <Controller
                          name={`passengers.${index}.mealPreference`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth size="small">
                              <InputLabel>Preferensi Makanan</InputLabel>
                              <Select {...field}>
                                <MenuItem value="">Standar</MenuItem>
                                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                                <MenuItem value="halal">Halal</MenuItem>
                                <MenuItem value="kosher">Kosher</MenuItem>
                                <MenuItem value="diabetic">Diabetik</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Email />
                <Typography variant="h6">
                  Informasi Kontak
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="contact.email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email *"
                        type="email"
                        fullWidth
                        error={!!errors.contact?.email}
                        helperText={errors.contact?.email?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name="contact.countryCode"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Kode Negara</InputLabel>
                        <Select {...field}>
                          <MenuItem value="+62">+62 (Indonesia)</MenuItem>
                          <MenuItem value="+65">+65 (Singapore)</MenuItem>
                          <MenuItem value="+60">+60 (Malaysia)</MenuItem>
                          <MenuItem value="+1">+1 (US/Canada)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name="contact.phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nomor Telepon *"
                        fullWidth
                        error={!!errors.contact?.phone}
                        helperText={errors.contact?.phone?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => dispatch(goBackStep())}
            >
              Kembali
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Lanjut ke Pembayaran
            </Button>
          </Box>
        </form>
      </Box>
    </LocalizationProvider>
  );
}