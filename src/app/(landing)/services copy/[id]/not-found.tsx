'use client';
import { Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <Container sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Layanan tidak ditemukan
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Maaf, layanan yang Anda cari tidak tersedia atau telah dihapus.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/services')}>
        Kembali ke Daftar Layanan
      </Button>
    </Container>
  );
}

export default NotFound
