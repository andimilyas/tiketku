import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchFlights, clearSearch } from '@/store/slices/searchSlice';
import { FlightSearchParams } from '@/types/flight';

export const useFlightSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchState = useSelector((state: RootState) => state.search);
  
  const [searchHistory, setSearchHistory] = useState<FlightSearchParams[]>([]);

  const search = useCallback(async (params: FlightSearchParams) => {
    try {
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [params, ...prev.slice(0, 4)]; // Keep only last 5 searches
        return newHistory;
      });

      // Dispatch search action
      const result = await dispatch(searchFlights(params));
      return result;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }, [dispatch]);

  const clearResults = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const retryLastSearch = useCallback(() => {
    if (searchHistory.length > 0) {
      search(searchHistory[0]);
    }
  }, [search, searchHistory]);

  return {
    ...searchState,
    search,
    clearResults,
    retryLastSearch,
    searchHistory
  };
};