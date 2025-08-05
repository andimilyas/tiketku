'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AirlineSeatReclineNormal, Flight } from '@mui/icons-material';
import { ProcessedFlight } from '@/types/flight';
import { useSearchParams } from 'next/navigation';

const STATUS_CONFIG = {
  scheduled: { color: 'success' as const, text: 'Terjadwal' },
  active: { color: 'primary' as const, text: 'Aktif' },
  landed: { color: 'info' as const, text: 'Mendarat' },
  cancelled: { color: 'error' as const, text: 'Dibatalkan' },
  incident: { color: 'warning' as const, text: 'Insiden' },
  diverted: { color: 'warning' as const, text: 'Dialihkan' },
} as const;

function getStatusConfig(status: ProcessedFlight['status']) {
  return STATUS_CONFIG[status] || { color: 'default' as const, text: 'Tidak Diketahui' };
}

const AirlineLogo = React.memo(({ airline }: { airline: { name: string; iata: string } }) => {
  const [imageError, setImageError] = React.useState(false);
  const [svgError, setSvgError] = React.useState(false);

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

function formatDuration(duration: string) {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}j ${minutes}m`;
  }
  return duration;
}

export default function FlightDetailsCard({ flight }: { flight: ProcessedFlight }) {
  const statusConfig = getStatusConfig(flight.status);
  const searchParams = useSearchParams();
  const travelClass = useMemo(() => (
    (searchParams.get('class') || searchParams.get('travelClass') || 'economy') as 'economy' | 'business' | 'first'
  ), [searchParams]);

  return (
    <Card
      variant="elevation"
      elevation={2}
      sx={{
        backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0.92) 30%, rgba(0,123,255,0.10) 100%), url('/background/map.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 2,
        width: '100%',
        height: '100%',
        boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={3} gap={2}>
          <AirlineLogo airline={flight.airline} />
          <Box>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              {flight.airline.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {flight.flightNumber} • {travelClass === 'first' ? 'First Class' : travelClass.charAt(0).toUpperCase() + travelClass.slice(1)} • {formatDuration(flight.duration)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip label={statusConfig.text} color={statusConfig.color} size="small" />
          <Box display="flex" alignItems="center" gap={0.5}>
            <AirlineSeatReclineNormal fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {flight.availability.economy} kursi tersedia
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" fontWeight={600} mb={0.5}>
          Tiket Sudah Termasuk
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={1} display="block">
          Kabin: 7 kg, Bagasi: 20 kg
        </Typography>

        <Box display="flex" gap={1}>
          <Chip variant="outlined" label="Gratis makanan" color="default" size="small" />
          <Chip variant="outlined" label="Gratis wifi" color="default" size="small" />
        </Box>
      </CardContent>
    </Card>
  );
}
