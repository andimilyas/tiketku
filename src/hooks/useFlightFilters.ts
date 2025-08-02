import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProcessedFlight } from '@/types/flight';

export const useFlightFilters = () => {
  const { flights, filters, sortBy, sortOrder } = useSelector((state: RootState) => state.search);

  const filteredAndSortedFlights = useMemo(() => {
    // First, apply filters
    let filtered = flights.filter(flight => {
      // Airline filter
      if (filters.selectedAirlines.length > 0 && 
          !filters.selectedAirlines.includes(flight.airline.name)) {
        return false;
      }

      // Price filter
      const price = flight.price.economy;
      if (price < filters.selectedPriceRange.min || price > filters.selectedPriceRange.max) {
        return false;
      }

      return true;
    });

    // Then, apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price.economy - b.price.economy;
          break;
        case 'departure':
          comparison = new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
          break;
        case 'arrival':
          comparison = new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime();
          break;
        case 'duration':
          const getDurationMinutes = (duration: string) => {
            const match = duration.match(/(\d+)h\s*(\d+)m/);
            return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
          };
          comparison = getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [flights, filters, sortBy, sortOrder]);

  const filterStats = useMemo(() => {
    const total = flights.length;
    const filtered = filteredAndSortedFlights.length;
    
    const priceRange = filteredAndSortedFlights.reduce(
      (range, flight) => ({
        min: Math.min(range.min, flight.price.economy),
        max: Math.max(range.max, flight.price.economy)
      }),
      { min: Infinity, max: -Infinity }
    );

    const averagePrice = filteredAndSortedFlights.length > 0
      ? filteredAndSortedFlights.reduce((sum, flight) => sum + flight.price.economy, 0) / filteredAndSortedFlights.length
      : 0;

    const airlines = Array.from(new Set(filteredAndSortedFlights.map(f => f.airline.name)));

    return {
      total,
      filtered,
      priceRange: priceRange.min === Infinity ? { min: 0, max: 0 } : priceRange,
      averagePrice,
      airlines,
      hasFilters: filters.selectedAirlines.length > 0 || 
                  filters.selectedPriceRange.min !== filters.priceRange.min ||
                  filters.selectedPriceRange.max !== filters.priceRange.max
    };
  }, [flights, filteredAndSortedFlights, filters]);

  return {
    flights: filteredAndSortedFlights,
    stats: filterStats
  };
};