import React, { useState } from "react";
import { ProcessedFlight } from "@/types/flight";
import { AirlineSeatReclineNormal, Flight } from "@mui/icons-material";
import { Card, CardContent, Grid, Box, Typography, Chip } from "@mui/material";

import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';

// Flight Card Component
interface FlightCardProps {
    flight: ProcessedFlight;
    onSelect: () => void;
    travelClass: 'economy' | 'business' | 'first';
}

export default function FlightCard({ flight, onSelect, travelClass }: FlightCardProps) {
    const getPriceByClass = (priceObj: ProcessedFlight['price']) => {
        switch (travelClass) {
            case 'business':
                return priceObj.business;
            case 'first':
                return priceObj.first;
            default:
                return priceObj.economy;
        }
    };

    const formatTime = (time: string) => {
        return new Date(time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatDate = (time: string) => {
        return new Date(time).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
        });
    };

    const getStatusColor = (status: ProcessedFlight['status']) => {
        switch (status) {
            case 'scheduled':
                return 'success' as const;
            case 'active':
                return 'primary' as const;
            case 'landed':
                return 'info' as const;
            case 'cancelled':
                return 'error' as const;
            case 'incident':
                return 'warning' as const;
            case 'diverted':
                return 'warning' as const;
            default:
                return 'default' as const;
        }
    };

    const getStatusText = (status: ProcessedFlight['status']) => {
        switch (status) {
            case 'scheduled':
                return 'Terjadwal';
            case 'active':
                return 'Aktif';
            case 'landed':
                return 'Mendarat';
            case 'cancelled':
                return 'Dibatalkan';
            case 'incident':
                return 'Insiden';
            case 'diverted':
                return 'Dialihkan';
            default:
                return 'Tidak Diketahui';
        }
    };

    return (
        <Card
            onClick={() => {
                if (flight.status !== 'cancelled' && flight.availability.economy > 0) {
                    onSelect(); // aksi ketika diklik
                }
            }}
            sx={{
                boxShadow: 'rgba(153, 153, 153, 0.22) 0px 5px 10px',
                borderRadius: 2,
                mb: 2,
                p: 2,
                cursor:
                    flight.status === 'cancelled' || flight.availability.economy === 0
                        ? 'not-allowed'
                        : 'pointer',
                opacity:
                    flight.status === 'cancelled' || flight.availability.economy === 0
                        ? 0.6
                        : 1,
                pointerEvents:
                    flight.status === 'cancelled' || flight.availability.economy === 0
                        ? 'none'
                        : 'auto',
            }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* Airline Info */}
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <AirlineLogo airline={flight.airline} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {flight.airline.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {flight.flightNumber}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Flight Details */}
                <Grid size={{ xs: 12, sm: 6 }} borderRight='2px dashed' borderLeft='2px dashed' borderColor='divider' px={1}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Departure */}
                        <Grid size={{ xs: 4 }}>
                            <Box textAlign="center">
                                <Typography variant="h6" fontWeight="bold">
                                    {formatTime(flight.departure.time)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {flight.departure.iata}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(flight.departure.time)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Duration & Aircraft */}
                        <Grid size={{ xs: 4 }}>
                            <Box textAlign="center">
                                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                                    <Box sx={{ flexGrow: 1, height: 1, bgcolor: 'divider' }} />
                                    <TimelapseOutlinedIcon sx={{ mx: 1, color: 'text.secondary' }} />
                                    <Box sx={{ flexGrow: 1, height: 1, bgcolor: 'divider' }} />
                                </Box>
                                <Typography variant="body2" fontWeight="bold">
                                    {flight.duration}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {flight.aircraft}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Arrival */}
                        <Grid size={{ xs: 4 }}>
                            <Box textAlign="center">
                                <Typography variant="h6" fontWeight="bold">
                                    {formatTime(flight.arrival.time)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {flight.arrival.iata}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(flight.arrival.time)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Status & Availability */}
                    <Box display="flex" alignItems="center" justifyContent='center' gap={1} mt={2}>
                        <Chip
                            label={getStatusText(flight.status)}
                            color={getStatusColor(flight.status)}
                            size="small"
                        />
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <AirlineSeatReclineNormal fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                                {flight.availability[travelClass]} kursi tersedia
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Price & Select Button */}
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Box textAlign="right">
                        <Typography variant="h5" color='error' fontWeight="bold">
                            {getPriceByClass(flight.price) !== undefined
                                ? getPriceByClass(flight.price)!.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                })
                                : '-'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            /pax
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}


// Airline Logo Component with fallback
function AirlineLogo({ airline }: { airline: { name: string; iata: string } }) {
    const [imageError, setImageError] = useState(false);
    const [svgError, setSvgError] = useState(false);

    if (!imageError) {
        return (
            <Box
                component="img"
                src={`/airlines/${airline.iata.toLowerCase()}.png`}
                alt={airline.name}
                sx={{ width: 40, height: 40, objectFit: 'cover' }}
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

    // Final fallback to icon
    return <Flight sx={{ width: 40, height: 40, color: 'primary.main' }} />;
}