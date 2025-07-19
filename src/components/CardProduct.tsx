import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface HotelItem {
  id: number;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
}

const sampleHotels: HotelItem[] = [
  {
    id: 1,
    name: 'The Gaia Hotel Bandung',
    location: 'Cidadap, Bandung',
    rating: '4,7/5',
    reviews: '(2.493)',
    price: 'IDR 2.450.413',
    oldPrice: 'IDR 2.462.000',
    image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Top Hotel 9',
  },
  {
    id: 2,
    name: 'Infinity8 Bali',
    location: 'Jimbaran, Badung',
    rating: '4,5/5',
    reviews: '(3.593)',
    price: 'IDR 365.026',
    image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Top Hotel 6',
  },
  {
    id: 3,
    name: 'Ashley Wahid Hasyim Jakarta',
    location: 'Menteng, Jakarta Pusat',
    rating: '4,5/5',
    reviews: '(3.022)',
    price: 'IDR 1.025.048',
    image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Senyum World Hotel',
    location: 'Batu, Malang',
    rating: '4,5/5',
    reviews: '(7.803)',
    price: 'IDR 852.891',
    oldPrice: 'IDR 1.081.010',
    image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: 'Top Hotel 2',
  },
  {
    id: 5,
    name: 'Janevalla Bandung',
    location: 'Bandung Wetan, Bandung',
    rating: '4,5/5',
    reviews: '(6.823)',
    price: 'IDR 1.047.512',
    image: 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const CardProduct = ({ title = 'Hotel paling favorit saat ini', data = sampleHotels }: { title?: string; data?: HotelItem[] }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(prev - 1, 0));
  };

  const scrollRight = () => {
    setScrollPosition((prev) => Math.min(prev + 1, data.length - 1));
  };

  return (
    <Box>
      <Typography color='primary' variant="h6" fontWeight={700} mb={0.5}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Biar lebih hemat, pesan hotelnya pake kode promo TIKETNEW, ya!
      </Typography>

      {/* Button Tabs Domestik/Internasional */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button variant="contained" size="medium" color="primary" sx={{ textTransform: 'none', borderRadius: 4 }}>
          Domestik
        </Button>
        <Button variant="outlined" size="medium" sx={{ textTransform: 'none', borderRadius: 4 }}>
          Internasional
        </Button>
      </Stack>

      {/* Carousel */}
      <Box position="relative">
        <Stack direction="row" spacing={2} sx={{ overflow: 'hidden' }}>
          {data.slice(scrollPosition, scrollPosition + 4).map((hotel) => (
            <Card key={hotel.id} sx={{ minWidth: 220, borderRadius: 3, boxShadow: 1 }}>
              <Box position="relative">
                <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} />
                {hotel.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.3,
                      fontSize: '0.75rem',
                      borderRadius: 1,
                    }}
                  >
                    {hotel.badge}
                  </Box>
                )}
              </Box>
              <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: 'column', mb: 4 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {hotel.name}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {hotel.location}
                        </Typography>
                    </Box>
                    <Typography fontSize={13} fontWeight={500} mt={0.5}>
                        ⭐ {hotel.rating} {hotel.reviews}
                        </Typography>
                    {hotel.oldPrice && (
                        <Typography fontSize={12} color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {hotel.oldPrice}
                        </Typography>
                        )}
                    <Typography fontSize={14} fontWeight={600} color="error.main">
                        {hotel.price}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary">
                        Belum termasuk pajak
                        </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Scroll Buttons */}
        {scrollPosition > 0 && (
          <Button
            onClick={scrollLeft}
            sx={{ position: 'absolute', top: '40%', left: -20, minWidth: 'auto', p: 1, bgcolor: 'white', borderRadius: '50%', boxShadow: 2 }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </Button>
        )}
        {scrollPosition + 4 < data.length && (
          <Button
            onClick={scrollRight}
            sx={{ position: 'absolute', top: '40%', right: -20, minWidth: 'auto', p: 1, bgcolor: 'white', borderRadius: '50%', boxShadow: 2 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CardProduct;
