import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProcessedFlight, FlightSearchParams, FlightSearchResponse } from '@/types/flight';

interface SearchFilters {
  airlines: string[];
  priceRange: {
    min: number;
    max: number;
  };
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
}

const initialState: SearchState = {
  isLoading: false,
  flights: [],
  error: null,
  filters: {
    airlines: [],
    priceRange: { min: 0, max: 10000000 },
    selectedAirlines: [],
    selectedPriceRange: { min: 0, max: 10000000 }
  },
  sortBy: 'departure',
  sortOrder: 'asc',
  searchParams: null
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
    state.flights = [];
    state.error = null;
    state.isLoading = false;
    state.searchParams = action.payload;
  },
    setSortBy: (state, action: PayloadAction<SearchState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<SearchState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    
    setSelectedAirlines: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedAirlines = action.payload;
    },
    
    setSelectedPriceRange: (state, action: PayloadAction<{min: number; max: number}>) => {
      state.filters.selectedPriceRange = action.payload;
    },
    
    clearFilters: (state) => {
      state.filters.selectedAirlines = [];
      state.filters.selectedPriceRange = state.filters.priceRange;
    },
    
    clearSearch: (state) => {
      return initialState;
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
        
        // Update filters based on search results with proper typing
        const airlines: string[] = [...new Set(action.payload.flights.map((f: ProcessedFlight) => f.airline.name))];
        const prices: number[] = action.payload.flights.map((f: ProcessedFlight) => f.price.economy);
        state.filters.selectedAirlines = [];
        state.filters.airlines = airlines;
        state.filters.priceRange = {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 10000000
        };
        
        // Initialize selected filters if not set
        if (state.filters.selectedPriceRange.min === 0 && state.filters.selectedPriceRange.max === 10000000) {
          state.filters.selectedPriceRange = state.filters.priceRange;
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
  setSelectedAirlines,
  setSelectedPriceRange,
  clearFilters,
  clearSearch,
  setSearchParams 
} = searchSlice.actions;

export default searchSlice.reducer;