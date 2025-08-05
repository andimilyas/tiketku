'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import dayjs from 'dayjs';
import { ProcessedFlight } from '@/types/flight';

function formatDuration(duration: string) {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (match) {
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}j ${minutes}m`;
  }
  return duration;
}

export default function FlightTimeline({ flight }: { flight: ProcessedFlight }) {
  return (
    <Box display="flex" flexDirection="row" alignItems="stretch" mt={1}>
      {/* Stepper Line and Icons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 40,
          mr: 2,
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#888',
            mb: 0.5,
            border: '2px solid #fff',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            flex: 1,
            width: 0,
            minHeight: 32,
            borderRight: '1px dashed #888',
            mx: 'auto',
          }}
        />
        <FlightTakeoff sx={{ fontSize: 24, color: 'GrayText', my: 0.5 }} />
        <Box
          sx={{
            flex: 1,
            width: 0,
            minHeight: 32,
            borderRight: '1px dashed #888',
            mx: 'auto',
          }}
        />
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#888',
            mt: 0.5,
            border: '2px solid #fff',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Stepper Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box mb={3}>
          <Typography variant="h6" fontWeight="bold">
            {dayjs(flight.departure.time).format('HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {flight.departure.airport}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {flight.departure.iata}
          </Typography>
        </Box>
        <Box mb={3} display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Durasi: {formatDuration(flight.duration)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {dayjs(flight.arrival.time).format('HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {flight.arrival.airport}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {flight.arrival.iata}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
