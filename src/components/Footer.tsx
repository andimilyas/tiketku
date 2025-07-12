"use client"

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, Stack, Divider, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Simple Logo component
const Logo = ({ height = 40 }: { height?: number }) => (
  <Typography
    variant="h5"
    component="div"
    sx={{
      fontWeight: 'bold',
      color: 'primary.main',
      fontSize: `${height * 0.4}px`
    }}
  >
    TixGo
  </Typography>
);

const menu = [
  {
    title: 'Perusahaan',
    items: ['Blog', 'Karier', 'Afiliasi', 'Perlindungan'],
  },
  {
    title: 'Layanan',
    items: ['Event', 'Hotel', 'Pesawat', 'Kereta', 'Bus dan Travel', 'Sewa Kendaraan'],
  },
  {
    title: 'Dukungan',
    items: ['Pusat Bantuan', 'Kebijakan Privasi', 'Syarat dan Ketentuan', 'Menjadi Partner'],
  },
];

const Footer: React.FC = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <Box sx={{ bgcolor: 'grey.100', pt: 6, pb: 2 }}>
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
          {/* Kiri: Logo & Kontak */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Stack spacing={2}>
              <Logo height={40} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <WhatsAppIcon color="primary" fontSize="small" />
                <Typography color='textPrimary' variant="body2">+62 812-3456-7890</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon color="primary" fontSize="small" />
                <Typography color='textPrimary' variant="body2">info@tixgo.co.id</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography color='textPrimary' variant="body2">
                  Jl. Contoh No. 123, Jakarta, Indonesia
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Menu */}
          {menu.map((section) => (
            <Box key={section.title} sx={{ flex: '1 1 200px' }}>
              <Typography color='black' variant="subtitle1" fontWeight={700} gutterBottom>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.items.map((item) => (
                  <Link href="#" key={item} underline="hover" color="text.secondary" variant="body2">
                    {item}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {/* Metode Pembayaran */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography color='textPrimary' variant="body2" fontWeight={700} gutterBottom>
              Metode Pembayaran
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Box sx={{ width: 40, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
              <Box sx={{ width: 40, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
              <Box sx={{ width: 40, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
            </Stack>
          </Box>

          {/* Penghargaan */}
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography color='textPrimary' variant="body2" fontWeight={700} gutterBottom>
              Penghargaan
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Box sx={{ width: 40, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
              <Box sx={{ width: 40, height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
            </Stack>
          </Box>

          {/* Social Media */}
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography color='textPrimary' variant="body2" fontWeight={700} gutterBottom>
              Ikuti Kami di
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <IconButton color="primary" size="small"><FacebookIcon /></IconButton>
              <IconButton color="primary" size="small"><InstagramIcon /></IconButton>
              <IconButton color="primary" size="small"><TwitterIcon /></IconButton>
              <IconButton color="primary" size="small"><YouTubeIcon /></IconButton>
            </Stack>
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            &copy; {year ?? '…'} TixGo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;