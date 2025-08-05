'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Slider,
    Checkbox,
    FormControlLabel,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    ListItem,
    RadioGroup,
    Radio
} from '@mui/material';
import { Flight } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { RootState, AppDispatch } from '@/store';
import {
    setSortBy,
    setSortOrder,
    setSelectedAirlines,
    setSelectedPriceRange,
    setDepartureTimeSlots,
    setArrivalTimeSlots
} from '@/store/slices/searchSlice';
import { SearchState } from '@/store/slices/searchSlice';

const categories = [
    { key: 'sort', label: 'Urutkan' },
    { key: 'price', label: 'Harga' },
    { key: 'airlines', label: 'Maskapai' },
    { key: 'time', label: 'Waktu' }
];

const AirlineLogo = React.memo(({ airline }: { airline: { name: string; iata: string } }) => {
    const [imageError, setImageError] = useState(false);
    const [svgError, setSvgError] = useState(false);

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

export function FilterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const {
        filters,
        sortBy,
        sortOrder,
        flights
    } = useSelector((state: RootState) => state.search);

    const [selectedCategory, setSelectedCategory] = useState<string>('sort');
    const [showAllAirlines, setShowAllAirlines] = useState(false);

    const handleAirlineFilterChange = (airline: string, checked: boolean) => {
        const currentSelected = filters.selectedAirlines;
        const newSelected = checked
            ? [...currentSelected, airline]
            : currentSelected.filter(a => a !== airline);

        dispatch(setSelectedAirlines(newSelected));
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case 'sort':
                return (
                    <Box>
                        <RadioGroup
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const [by, order] = e.target.value.split('-') as [SearchState['sortBy'], SearchState['sortOrder']];
                                dispatch(setSortBy(by));
                                dispatch(setSortOrder(order));
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
                    </Box>
                );

            case 'price':
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Rentang Harga
                        </Typography>
                        <Slider
                            value={[filters.selectedPriceRange.min, filters.selectedPriceRange.max]}
                            onChange={(_, newValue) => {
                                const [min, max] = newValue as number[];
                                dispatch(setSelectedPriceRange({ min, max }));
                            }}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `Rp ${value.toLocaleString()}`}
                            min={filters.priceRange.min}
                            max={filters.priceRange.max}
                            step={50000}
                        />
                        <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption">
                                Rp {filters.selectedPriceRange.min.toLocaleString()}
                            </Typography>
                            <Typography variant="caption">
                                Rp {filters.selectedPriceRange.max.toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                );

            case 'airlines':
                return (
                    <Box>
                        <Box sx={{ overflowY: 'auto' }}>
                            {(() => {
                                const airlineNames = Array.from(new Set(flights.map(f => f.airline.name)));
                                const visibleAirlines = showAllAirlines ? airlineNames : airlineNames.slice(0, 3);

                                return (
                                    <>
                                        {visibleAirlines.map((airlineName) => {
                                            const airlineFlights = flights.filter(f => f.airline.name === airlineName);
                                            const airline = airlineFlights[0]?.airline;
                                            const minPrice = Math.min(...airlineFlights.map(f => f.price.economy ?? 0));

                                            return (
                                                <Box key={airlineName} display="flex" alignItems="center" mb={2}>
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
                                                        checked={filters.selectedAirlines.includes(airlineName)}
                                                        onChange={(_, checked) => handleAirlineFilterChange(airlineName, checked)}
                                                    />
                                                </Box>
                                            );
                                        })}
                                        {airlineNames.length > 3 && !showAllAirlines && (
                                            <Box display="flex" justifyContent="center" mt={3}>
                                                <Button
                                                    variant='text'
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => setShowAllAirlines(true)}
                                                >
                                                    Tampilkan semua
                                                </Button>
                                            </Box>
                                        )}
                                    </>
                                );
                            })()}
                        </Box>
                    </Box>
                );

            case 'time':
                return (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Waktu Pergi
                        </Typography>
                        <Box>
                            {[
                                { label: '00:00 - 06:00', value: '00-06' },
                                { label: '06:00 - 12:00', value: '06-12' },
                                { label: '12:00 - 18:00', value: '12-18' },
                                { label: '18:00 - 24:00', value: '18-24' }
                            ].map((slot) => (
                                <Box key={slot.value} display="flex" alignItems="center" mb={1}>
                                    <Checkbox
                                        checked={filters.departureTimeSlots?.includes(slot.value)}
                                        onChange={(_, checked) => {
                                            let newSlots = filters.departureTimeSlots ? [...filters.departureTimeSlots] : [];
                                            if (checked) {
                                                newSlots.push(slot.value);
                                            } else {
                                                newSlots = newSlots.filter(v => v !== slot.value);
                                            }
                                            dispatch(setDepartureTimeSlots(newSlots));
                                        }}
                                    />
                                    <Typography variant="body2">{slot.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Waktu Tiba
                        </Typography>
                        <Box>
                            {[
                                { label: '00:00 - 06:00', value: '00-06' },
                                { label: '06:00 - 12:00', value: '06-12' },
                                { label: '12:00 - 18:00', value: '12-18' },
                                { label: '18:00 - 24:00', value: '18-24' }
                            ].map((slot) => (
                                <Box key={slot.value} display="flex" alignItems="center" mb={1}>
                                    <Checkbox
                                        checked={filters.arrivalTimeSlots?.includes(slot.value)}
                                        onChange={(_, checked) => {
                                            let newSlots = filters.arrivalTimeSlots ? [...filters.arrivalTimeSlots] : [];
                                            if (checked) {
                                                newSlots.push(slot.value);
                                            } else {
                                                newSlots = newSlots.filter(v => v !== slot.value);
                                            }
                                            dispatch(setArrivalTimeSlots(newSlots));
                                        }}
                                    />
                                    <Typography variant="body2">{slot.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
            sx: { borderRadius: 2 }
        }}>
            <DialogTitle sx={{ pb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h6' fontWeight="bold" flex={1}>
                        Filter Penerbangan
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" sx={{ minHeight: 400 }}>
                    {/* Sidebar */}
                    <Box width="30%" pr={2} borderRight="1px solid #eee">
                        <List>
                            {categories.map((cat) => (
                                <ListItem disablePadding key={cat.key}>
                                    <ListItemButton
                                        selected={selectedCategory === cat.key}
                                        onClick={() => setSelectedCategory(cat.key)}
                                    >
                                        <ListItemText primary={cat.label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Content */}
                    <Box flex={1} pl={3}>
                        {renderContent()}
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                            dispatch(setSelectedAirlines([]));
                            dispatch(setSelectedPriceRange(filters.priceRange));
                            dispatch(setDepartureTimeSlots([]));
                            dispatch(setArrivalTimeSlots([]));
                            dispatch(setSortBy('price'));
                            dispatch(setSortOrder('asc'));
                        }}
                    >
                        Reset
                    </Button>
                    <Button sx={{ borderRadius: 2, textTransform: 'none' }} variant="contained" onClick={onClose}>
                        Simpan
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}