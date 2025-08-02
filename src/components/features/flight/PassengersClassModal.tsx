// components/features/flight/PassengersClassModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelClass: 'economy' | 'business' | 'first';
  onChangePassenger: (type: 'adults' | 'children' | 'infants', increment: boolean) => void;
  onChangeClass: (cls: 'economy' | 'business' | 'first') => void;
}

const PassengersClassModal: React.FC<Props> = ({
  open,
  onClose,
  passengers,
  travelClass,
  onChangePassenger,
  onChangeClass
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Atur Penumpang & Kelas</DialogTitle>
      <DialogContent dividers>
      <Typography variant="h6" mb={1}>Penumpang</Typography>
        {(['adults', 'children', 'infants'] as const).map((type) => (
          <Box key={type} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography>
                {type === 'adults' ? 'Dewasa' : type === 'children' ? 'Anak' : 'Bayi'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {type === 'adults' ? '12+ tahun' : type === 'children' ? '2-11 tahun' : '<2 tahun'}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                size="small"
                onClick={() => onChangePassenger(type, false)}
                disabled={type === 'adults' && passengers[type] <= 1}
              >
                <Remove />
              </IconButton>
              <Typography sx={{ mx: 2 }}>{passengers[type]}</Typography>
              <IconButton
                size="small"
                onClick={() => onChangePassenger(type, true)}
                disabled={passengers[type] >= 9}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Typography variant="h6" mt={3} mb={1}>Kelas Penerbangan</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { value: 'economy', label: 'Ekonomi' },
            { value: 'business', label: 'Bisnis' },
            { value: 'first', label: 'First Class' }
          ].map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              clickable
              onClick={() => onChangeClass(opt.value as any)}
              color={travelClass === opt.value ? 'primary' : 'default'}
              variant={travelClass === opt.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Selesai</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PassengersClassModal;
