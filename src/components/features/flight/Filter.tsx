'use client';

import React from 'react';
import {
  Box,
  Button,
  Menu,
  Typography,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { Flight } from '@mui/icons-material';
import { ProcessedFlight } from '@/types/flight';
import { SearchState, setSelectedAirlines, setDepartureTimeSlots, setArrivalTimeSlots, setSortBy, setSortOrder, setSort } from '@/store/slices/searchSlice';
import { AppDispatch } from '@/store';
import { AirlineLogo } from './AirlineLogo'; // Assuming you have this component

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ icon, label, onClick }) => (
  <Button
    variant="outlined"
    startIcon={icon}
    onClick={onClick}
    sx={{ textTransform: 'none', borderRadius: 8 }}
  >
    {label}
  </Button>
);

interface AirlineFilterProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  flights: ProcessedFlight[];
  selectedAirlines: string[];
  dispatch: AppDispatch;
}

export const AirlineFilter: React.FC<AirlineFilterProps> = ({
  anchorEl,
  onClose,
  flights,
  selectedAirlines,
  dispatch
}) => {
  const handleAirlineFilterChange = (airline: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedAirlines, airline]
      : selectedAirlines.filter(a => a !== airline);
    dispatch(setSelectedAirlines(newSelected));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { minWidth: 320, maxHeight: 400, borderRadius: 3, p: 2 } }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Maskapai
      </Typography>
      <Box sx={{ maxHeight: 260, overflowY: 'auto', mb: 2 }}>
        {Array.from(new Set(flights.map(f => f.airline.name))).map((airlineName) => {
          const airlineFlights = flights.filter(f => f.airline.name === airlineName);
          const airline = airlineFlights[0]?.airline;
          const minPrice = Math.min(...airlineFlights.map(f => f.price.economy ?? 0));
          
          return (
            <Box key={airlineName} display="flex" alignItems="center" mb={1.5}>
              <Box mr={2}>
                <AirlineLogo airline={{
                  name: airline.name,
                  iata: airline.iata
                }} />
              </Box>
              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  {airlineName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mulai dari {minPrice > 0 ? minPrice.toLocaleString('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR', 
                    maximumFractionDigits: 0 
                  }) : '-'}
                </Typography>
              </Box>
              <Checkbox
                checked={selectedAirlines.includes(airlineName)}
                onChange={(_, checked) => handleAirlineFilterChange(airlineName, checked)}
              />
            </Box>
          );
        })}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          size="small"
          color="inherit"
          onClick={() => dispatch(setSelectedAirlines([]))}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Simpan
        </Button>
      </Box>
    </Menu>
  );
};

interface TimeFilterProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  departureTimeSlots: string[];
  arrivalTimeSlots: string[];
  dispatch: AppDispatch;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  anchorEl,
  onClose,
  departureTimeSlots,
  arrivalTimeSlots,
  dispatch
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { minWidth: 320, maxHeight: 400, borderRadius: 3, p: 2 } }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Waktu
      </Typography>
      <Box sx={{ maxHeight: 260, overflowY: 'auto', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Waktu Pergi
        </Typography>
        {[
          { label: '00:00 - 06:00', value: '00-06' },
          { label: '06:00 - 12:00', value: '06-12' },
          { label: '12:00 - 18:00', value: '12-18' },
          { label: '18:00 - 24:00', value: '18-24' }
        ].map((slot) => (
          <Box key={slot.value} display="flex" alignItems="center" mb={1}>
            <Checkbox
              checked={departureTimeSlots.includes(slot.value)}
              onChange={(_, checked) => {
                const newSlots = checked
                  ? [...departureTimeSlots, slot.value]
                  : departureTimeSlots.filter(v => v !== slot.value);
                dispatch(setDepartureTimeSlots(newSlots));
              }}
            />
            <Typography variant="body2">{slot.label}</Typography>
          </Box>
        ))}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Waktu Tiba
        </Typography>
        {[
          { label: '00:00 - 06:00', value: '00-06' },
          { label: '06:00 - 12:00', value: '06-12' },
          { label: '12:00 - 18:00', value: '12-18' },
          { label: '18:00 - 24:00', value: '18-24' }
        ].map((slot) => (
          <Box key={slot.value} display="flex" alignItems="center" mb={1}>
            <Checkbox
              checked={arrivalTimeSlots.includes(slot.value)}
              onChange={(_, checked) => {
                const newSlots = checked
                  ? [...arrivalTimeSlots, slot.value]
                  : arrivalTimeSlots.filter(v => v !== slot.value);
                dispatch(setArrivalTimeSlots(newSlots));
              }}
            />
            <Typography variant="body2">{slot.label}</Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          size="small"
          color="inherit"
          onClick={() => {
            dispatch(setDepartureTimeSlots([]));
            dispatch(setArrivalTimeSlots([]));
          }}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Simpan
        </Button>
      </Box>
    </Menu>
  );
};

interface SortFilterProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  sortBy: SearchState['sortBy'];
  sortOrder: SearchState['sortOrder'];
  dispatch: AppDispatch;
}

export const SortFilter: React.FC<SortFilterProps> = ({
  anchorEl,
  onClose,
  sortBy,
  sortOrder,
  dispatch
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { minWidth: 320, maxHeight: 400, borderRadius: 3, p: 2 } }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Urutkan berdasarkan
      </Typography>
      <RadioGroup
        value={`${sortBy}-${sortOrder}`}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const [by, order] = e.target.value.split('-') as [SearchState['sortBy'], SearchState['sortOrder']];
          dispatch(setSort({ by, order }));
          onClose();
        }}
      >
        <FormControlLabel
          value="price-asc"
          control={<Radio />}
          label="Harga terendah"
        />
        <FormControlLabel
          value="departure-asc"
          control={<Radio />}
          label="Keberangkatan paling awal"
        />
        <FormControlLabel
          value="departure-desc"
          control={<Radio />}
          label="Keberangkatan paling akhir"
        />
        <FormControlLabel
          value="arrival-asc"
          control={<Radio />}
          label="Kedatangan paling awal"
        />
        <FormControlLabel
          value="arrival-desc"
          control={<Radio />}
          label="Kedatangan paling akhir"
        />
        <FormControlLabel
          value="duration-asc"
          control={<Radio />}
          label="Durasi terpendek"
        />
      </RadioGroup>
    </Menu>
  );
};