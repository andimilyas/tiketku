import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProcessedFlight, FlightSearchParams, FlightSearchResponse } from '@/types/flight';

interface SearchFilters {
  airlines: string[];
  priceRange: {
    min: number;
    max: number;
  };
  departureTimeSlots: string[];
  arrivalTimeSlots: string[];
  selectedAirlines: string[];
  selectedPriceRange: {
    min: number;
    max: number;
  };
}

interface SearchState {
  isLoading: boolean;
  flights: ProcessedFlight[];
  error: string | null;
  filters: SearchFilters;
  sortBy: 'price' | 'departure' | 'duration' | 'arrival';
  sortOrder: 'asc' | 'desc';
  searchParams: FlightSearchParams | null;
  hasUserInteractedWithFilters: boolean; // NEW: Track user interaction
}

const initialState: SearchState = {
  isLoading: false,
  flights: [],
  error: null,
  filters: {
    airlines: [],
    priceRange: { min: 0, max: 10000000 },
    departureTimeSlots: [],
    arrivalTimeSlots: [],
    selectedAirlines: [], // This should remain empty until user selects
    selectedPriceRange: { min: 0, max: 10000000 }
  },
  sortBy: 'departure',
  sortOrder: 'asc',
  searchParams: null,
  hasUserInteractedWithFilters: false // NEW
};

// Async thunk for searching flights
export const searchFlights = createAsyncThunk<
  FlightSearchResponse,
  FlightSearchParams,
  { rejectValue: string }
>(
  'search/searchFlights',
  async (searchParams: FlightSearchParams, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching flights with params:', searchParams);
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data as FlightSearchResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Search failed');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<FlightSearchParams>) => {
      state.searchParams = action.payload;
    },
    
    setSortBy: (state, action: PayloadAction<SearchState['sortBy']>) => {
      state.sortBy = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },

    setSort: (state, action: PayloadAction<{by: SearchState['sortBy'], order: SearchState['sortOrder']}>) => {
      state.sortBy = action.payload.by;
      state.sortOrder = action.payload.order;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },
    
    setSortOrder: (state, action: PayloadAction<SearchState['sortOrder']>) => {
      state.sortOrder = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },
    
    setSelectedAirlines: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedAirlines = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },
    
    setSelectedPriceRange: (state, action: PayloadAction<{min: number; max: number}>) => {
      state.filters.selectedPriceRange = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },

    setDepartureTimeSlots: (state, action: PayloadAction<string[]>) => {
      state.filters.departureTimeSlots = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },
    
    setArrivalTimeSlots: (state, action: PayloadAction<string[]>) => {
      state.filters.arrivalTimeSlots = action.payload;
      state.hasUserInteractedWithFilters = true; // Mark user interaction
    },
    
    clearFilters: (state) => {
      state.filters.selectedAirlines = [];
      state.filters.selectedPriceRange = state.filters.priceRange;
      state.filters.departureTimeSlots = [];
      state.filters.arrivalTimeSlots = [];
      state.sortBy = 'departure';
      state.sortOrder = 'asc';
      state.hasUserInteractedWithFilters = false; // Reset user interaction
    },
    
    clearSearch: (state) => {
      return initialState;
    },
    
    resetSearchState: (state) => {
      state.flights = [];
      state.error = null;
      state.isLoading = false;
      // Reset filters completely for new search
      state.filters = {
        airlines: [],
        priceRange: { min: 0, max: 10000000 },
        departureTimeSlots: [],
        arrivalTimeSlots: [],
        selectedAirlines: [],
        selectedPriceRange: { min: 0, max: 10000000 }
      };
      state.hasUserInteractedWithFilters = false;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        console.log('✅ Search fulfilled with:', action.payload);
        state.isLoading = false;
        state.flights = action.payload.flights;
        
        // Update available filter options based on search results
        const airlines: string[] = [...new Set(action.payload.flights.map((f: ProcessedFlight) => f.airline.name))];
        const prices: number[] = action.payload.flights.map((f: ProcessedFlight) => f.price.economy);
        
        state.filters.airlines = airlines;
        const newPriceRange = {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 10000000
        };
        state.filters.priceRange = newPriceRange;
        
        // Only reset selected filters if user hasn't interacted with them
        if (!state.hasUserInteractedWithFilters) {
          state.filters.selectedAirlines = []; // Keep empty - no filter applied
          state.filters.selectedPriceRange = newPriceRange; // Use full range
          state.filters.departureTimeSlots = [];
          state.filters.arrivalTimeSlots = [];
        }
      })
      .addCase(searchFlights.rejected, (state, action) => {
        console.error('❌ Search failed:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.flights = [];
      });
  }
});

export const {
  setSortBy,
  setSortOrder,
  setSort,
  setSelectedAirlines,
  setSelectedPriceRange,
  setDepartureTimeSlots,
  setArrivalTimeSlots,
  clearFilters,
  clearSearch,
  setSearchParams,
  resetSearchState
} = searchSlice.actions;

export default searchSlice.reducer;
export type { SearchState };