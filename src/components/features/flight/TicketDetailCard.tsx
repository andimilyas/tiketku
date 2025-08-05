import React from 'react';
import dayjs from 'dayjs';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { ProcessedFlight } from '@/types/flight';
import FlightTimeline from './FlightTimeline';
import FlightDetailsCard from './FlightDetailsCard';

interface TicketDetailCardProps {
  flight: ProcessedFlight;
  passengerText: string;
  tripType: 'one-way' | 'round-trip';
}

export default function TicketDetailCard({ flight, passengerText, tripType }: TicketDetailCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        p: 1,
        borderRadius: 2,
        boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
        backgroundColor: 'rgba(255,255,255,0.95)',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" color='text.primary' fontWeight={600}>
            {passengerText}
          </Typography>
          <Chip
            label={tripType === 'round-trip' ? 'Pulang Pergi' : 'Sekali Jalan'}
            size="small"
            color={tripType === 'round-trip' ? 'warning' : 'info'}
          />
        </Box>

        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
          {dayjs(flight.departure.time).format('ddd, DD MMM YYYY')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
          <FlightTimeline flight={flight} />
          <FlightDetailsCard flight={flight} />
        </Box>
      </CardContent>
    </Card>
  );
} 
