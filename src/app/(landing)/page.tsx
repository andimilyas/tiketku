import React from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
  {
    icon: <EventSeatIcon fontSize="large" color="primary" />,
    title: 'Pesan Tiket Mudah',
    description: 'Dapatkan tiket event favoritmu hanya dalam beberapa klik, tanpa ribet.',
  },
  {
    icon: <SmartphoneIcon fontSize="large" color="primary" />,
    title: 'Akses Digital',
    description: 'Tiket langsung masuk ke aplikasi, tanpa perlu cetak fisik.',
  },
  {
    icon: <SecurityIcon fontSize="large" color="primary" />,
    title: 'Pembayaran Aman',
    description: 'Transaksi dijamin aman dengan berbagai metode pembayaran.',
  },
];

const testimonials = [
  {
    name: 'Andi',
    text: 'TixGo sangat membantu saya mendapatkan tiket konser favorit tanpa antri!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Siti',
    text: 'Aplikasinya mudah digunakan dan prosesnya cepat. Recommended!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Selamat Datang di TixGo
          </Typography>
          <Typography variant="h5" gutterBottom>
            Solusi mudah dan cepat untuk mendapatkan tiket event favoritmu!
          </Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }}>
            Mulai Sekarang
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Kenapa Pilih TixGo?
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {features.map((feature, idx) => (
            <Box key={idx} sx={{ flex: '1 1 300px', maxWidth: 400 }}>
              <Card elevation={3} sx={{ textAlign: 'center', py: 4 }}>
                <Box>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography color="textPrimary" variant="h4" align="center" fontWeight="bold" gutterBottom>
            Apa Kata Mereka?
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {testimonials.map((t, idx) => (
              <Box key={idx} sx={{ flex: '1 1 300px', maxWidth: 400 }}>
                <Card elevation={1} sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={t.avatar} alt={t.name} sx={{ mr: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    &quot;{t.text}&quot;
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Siap bergabung dengan TixGo?
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Daftar Sekarang
        </Button>
      </Container>
    </Box>
  );
};

export default Home;