"use client"

import React from 'react';
import { Box, Container } from '@mui/material';
import ImageBannerCarousel, { BannerItem } from '@/components/ImageBannerCarousel';
import Filter from '@/components/Filter'
import CardProduct from '@/components/CardProduct';

import travelBusData from '@/data/travel-bus'

const banners: BannerItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Promo Tiket Konser 50% Off!',
    description: 'Dapatkan diskon spesial untuk tiket konser pilihan minggu ini.',
    cta: 'Lihat Promo',
    href: '/promo/konser',
  },
  {
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    title: 'Event Olahraga Terbaru',
    description: 'Jangan lewatkan pertandingan seru dan booking tiketnya sekarang!',
    cta: 'Jadwal Event',
    href: '/olahraga',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Liburan Hemat Bareng TixGo',
    description: 'Nikmati berbagai destinasi wisata dengan harga terjangkau.',
    cta: 'Cari Tiket',
    href: '/wisata',
  }
];

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'white', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <ImageBannerCarousel banners={banners} />
          <Filter />
          <CardProduct />
          <Box mt={6}>
            {/* Section Travel & Bus */}
            <CardProduct
              title="Travel & Bus Favorit"
              data={travelBusData.map(item => ({
                ...item,
                rating: String(item.rating),
              }))}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;