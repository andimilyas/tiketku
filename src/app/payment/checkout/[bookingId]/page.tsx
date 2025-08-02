'use client';

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  TextField,
  Chip,
  Link
} from '@mui/material';
import { CreditCard, AccountBalance, Payment, Flight } from '@mui/icons-material';
import dayjs from 'dayjs';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}j ${minutes}m`;
  }
  return duration;
};

// Memoized constants
const popularCities = [
  { code: 'CGK', name: 'Jakarta', airport: 'Soekarno-Hatta' },
  { code: 'DPS', name: 'Denpasar', airport: 'Ngurah Rai' },
  { code: 'JOG', name: 'Yogyakarta', airport: 'Adisutcipto' },
  { code: 'SRG', name: 'Semarang', airport: 'Ahmad Yani' },
  { code: 'MLG', name: 'Malang', airport: 'Abdul Rachman Saleh' },
  { code: 'BDO', name: 'Bandung', airport: 'Husein Sastranegara' }
];



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

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Kartu Kredit/Debit',
    icon: <CreditCard />,
    description: 'Visa, Mastercard, JCB'
  },
  {
    id: 'bank_transfer',
    name: 'Transfer Bank',
    icon: <AccountBalance />,
    description: 'BCA, Mandiri, BNI, BRI'
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    icon: <Payment />,
    description: 'GoPay, OVO, DANA, LinkAja'
  }
];

export default function PaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const bookingId = params.bookingId as string;


  const order = useSelector((state: RootState) => state.booking.selectedFlight);

  // Memoized city names
  const departureCity = useMemo(() =>
    popularCities.find(city => city.code === order?.departure?.iata)?.name,
    [order?.departure?.iata]
  );

  const arrivalCity = useMemo(() =>
    popularCities.find(city => city.code === order?.arrival?.iata)?.name,
    [order?.arrival?.iata]
  );

  // Mock order data - in real app, fetch from API
  // const orderData = {
  //   id: bookingId,
  //   type: 'flight', // flight, train, movie, etc.
  //   items: [
  //     {
  //       name: 'Jakarta → Bali',
  //       description: 'Garuda Indonesia GA-123',
  //       quantity: 2,
  //       price: 1500000,
  //       total: 3000000
  //     }
  //   ],
  //   subtotal: 3000000,
  //   tax: 300000,
  //   total: 3300000
  // };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    try {
      // In a real app, you'd process payment here
      console.log('Processing payment with method:', selectedPaymentMethod);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to success page
      router.push(`/payment/success/${bookingId}`);
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle payment error
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', position: 'relative', py: 4, }}>
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
          {/* Payment Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant='h5' sx={{ mb: 2 }} color='textPrimary' fontWeight={600}>
              Metode Pembayaran
            </Typography>
            <Card elevation={3} sx={{ boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <RadioGroup value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
                  {paymentMethods.map((method) => (
                    <Card key={method.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent sx={{ py: 2 }}>
                        <FormControlLabel
                          value={method.id}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Box sx={{ mr: 2, color: 'primary.main' }}>
                                {method.icon}
                              </Box>
                              <Box>
                                <Typography variant="subtitle1">
                                  {method.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {method.description}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>

                {/* Credit Card Form */}
                {selectedPaymentMethod === 'credit_card' && (
                  <Box mt={3}>
                    <Typography variant='h6' color='textPrimary' fontWeight={600} mb={2}>
                      Detail Kartu
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Nomor Kartu"
                          fullWidth
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          inputProps={{ maxLength: 19 }}
                        />
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Tanggal Kadaluarsa"
                          fullWidth
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          inputProps={{ maxLength: 5 }}
                        />
                      </Grid>

                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="CVV"
                          fullWidth
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          inputProps={{ maxLength: 4 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Bank Transfer Info */}
                {selectedPaymentMethod === 'bank_transfer' && (
                  <Box mt={3}>
                    <Alert severity="info">
                      Setelah memilih transfer bank, Anda akan menerima instruksi pembayaran
                      melalui email. Pembayaran harus diselesaikan dalam 24 jam.
                    </Alert>
                  </Box>
                )}

                {/* E-Wallet Info */}
                {selectedPaymentMethod === 'ewallet' && (
                  <Box mt={3}>
                    <Alert severity="info">
                      Anda akan diarahkan ke aplikasi e-wallet untuk menyelesaikan pembayaran.
                    </Alert>
                  </Box>
                )}

                {/* Action Buttons */}
                <Box display="flex" gap={2} mt={4}>
                  {/* <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    sx={{ flex: 1 }}
                  >
                    Kembali
                  </Button> */}
                  <Button
                    variant="contained"
                    onClick={handlePayment}
                    sx={{ textTransform: 'none', flex: 2, borderRadius: 2 }}
                    size="large"
                    disabled={selectedPaymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv)}
                  >
                    Bayar Sekarang
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
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
                    {dayjs(order?.arrival.time).format('ddd, DD MMM YYYY')}
                  </Typography>
                  <Box flex={1} />
                  <Link href="#" fontSize={14} underline="hover" color="primary">
                    Detail
                  </Link>
                </Box>

                {order && (
                  <Box bgcolor="#F8F9FB" borderRadius={2} p={2} mb={2}>
                    <Box display="flex" alignItems="center">
                      <Box mr={2}>
                        <AirlineLogo airline={{
                          name: order?.airline.name,
                          iata: order?.airline.iata
                        }} />
                      </Box>
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <Typography fontWeight={700} mr={1}>
                            {dayjs(order?.departure.time).format('HH:mm')}
                          </Typography>
                          <Typography variant="caption" mr={0}>
                            {order?.departure.iata}
                          </Typography>
                          <Box sx={{ borderBottom: '1px dashed #bdbdbd', width: '100%', mx: 1 }} />
                          <Typography fontWeight={700} mr={1}>
                            {dayjs(order?.arrival.time).format('HH:mm')}
                          </Typography>
                          <Typography variant="caption">
                            {order?.arrival.iata}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                          {formatDuration(order?.duration)} • {order?.aircraft}
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
                    {Number(order?.price.economy).toLocaleString('id-ID', {
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
  );
} 