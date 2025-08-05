import React, { useState } from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Divider,
    IconButton,
    Box,
    Button,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ProcessedFlight } from '@/types/flight';

interface TicketDetailModalProps {
    open: boolean;
    onClose: () => void;
    flight: ProcessedFlight;
    travelClass: 'economy' | 'business' | 'first';
    passengerCounts: {
        adult: number;
        child: number;
        infant: number;
        total: number;
    };
    formatCurrency: (amount: number) => string;
    onSelectTicket: () => void;
}

// Modal Komponen
export default function TicketDetailModal({
    open,
    onClose,
    flight,
    travelClass,
    passengerCounts,
    formatCurrency,
    onSelectTicket
}: TicketDetailModalProps) {
    const [tab, setTab] = useState(2); // Default ke "Detail Harga"

    // Hitung harga per tipe penumpang
    const price = flight.price?.[travelClass] ?? 0;
    const total = price * (passengerCounts?.total ?? 0);

    const travelClassLabel = {
        economy: 'Economy',
        business: 'Business',
        first: 'First Class'
      }[travelClass];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
            sx: { borderRadius: 2 }
        }}>
            <DialogTitle sx={{ pb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h6' fontWeight="bold" flex={1}>
                        {travelClassLabel}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2, minHeight: 36 }}
                >
                    <Tab label="Refund" value={0} sx={{ minWidth: 100, minHeight: 36 }} />
                    <Tab label="Reschedule" value={1} sx={{ minWidth: 120, minHeight: 36 }} />
                    <Tab label="Detail Harga" value={2} sx={{ minWidth: 120, minHeight: 36 }} />
                </Tabs>
                {tab === 0 && (
                    <Box minHeight={260} display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="body2" color="text.secondary">
                            Belum ada informasi refund.
                        </Typography>
                    </Box>
                )}
                {tab === 1 && (
                    <Box minHeight={260} display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="body2" color="text.secondary">
                            Belum ada informasi reschedule.
                        </Typography>
                    </Box>
                )}
                {tab === 2 && (
                    <Box>
                        <Typography variant="subtitle2" mb={2}>
                            Detail Harga
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">
                                Dewasa
                                {passengerCounts?.adult > 1 ? ` (x${passengerCounts.adult})` : ' (x1)'}
                            </Typography>
                            <Typography variant="body2">
                                {formatCurrency(price * (passengerCounts?.adult ?? 1))}
                            </Typography>
                        </Box>
                        {passengerCounts?.child > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">
                                    Anak (x{passengerCounts.child})
                                </Typography>
                                <Typography variant="body2">
                                    {formatCurrency(price * passengerCounts.child)}
                                </Typography>
                            </Box>
                        )}
                        {passengerCounts?.infant > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">
                                    Bayi (x{passengerCounts.infant})
                                </Typography>
                                <Typography variant="body2">
                                    {formatCurrency(0)}
                                </Typography>
                            </Box>
                        )}
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Pajak</Typography>
                            <Typography variant="body2">Gratis</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Total
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                {formatCurrency(total)}
                            </Typography>
                        </Box>
                        {/* Tombol Pilih */}
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onSelectTicket}
                                fullWidth
                                size="large"
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Pilih Tiket Ini
                            </Button>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}