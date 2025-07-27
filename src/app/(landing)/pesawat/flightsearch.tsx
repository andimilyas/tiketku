'use client';

import { useState } from 'react';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';

interface FlightSearchFormProps {
  onResults: (data: any[]) => void;
}

export default function FlightSearchForm({ onResults }: FlightSearchFormProps) {
  const [origin, setOrigin] = useState('CGK');
  const [destination, setDestination] = useState('DPS');
  const [date, setDate] = useState('2025-08-01');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flights/search?origin=${origin}&destination=${destination}&date=${date}`
      );
      const data = await res.json();
      onResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} borderRadius={2} boxShadow={2} bgcolor="white">
      <Typography variant="h6" mb={2}>
        Search Flights
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <TextField
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextField
          label="Departure Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </Stack>
    </Box>
  );
}
