import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TicketDetailCard from '../TicketDetailCard';
import { ProcessedFlight } from '@/types/flight';

interface TicketDetailCardModalProps {
  open: boolean;
  onClose: () => void;
  flight: ProcessedFlight;
  passengerText: string;
  tripType: 'one-way' | 'round-trip';
}

const TicketDetailCardModal: React.FC<TicketDetailCardModalProps> = ({
  open,
  onClose,
  flight,
  passengerText,
  tripType,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h6' fontWeight="bold" flex={1}>
                        Detail Tiket
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
      <DialogContent sx={{ pt: 2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <TicketDetailCard
          flight={flight}
          passengerText={passengerText}
          tripType={tripType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailCardModal;
