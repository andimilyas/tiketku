import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingState, PassengerDetail, ContactInfo, ProcessedFlight } from '@/types/flight';

export const fetchFlightById = createAsyncThunk<ProcessedFlight, string>(
  'booking/fetchFlightById',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Fetching flight with ID:', id);
      
      const response = await fetch(`/api/flights/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', response.status, errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch flight`);
      }
      
      const data = await response.json();
      console.log('✅ Flight data received:', data);
      
      // Handle both response formats
      const flight = data.data || data.flight || data;
      
      if (!flight) {
        throw new Error('No flight data in response');
      }
      
      return flight;
    } catch (error) {
      console.error('❌ fetchFlightById error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const initialState: BookingState = {
  currentStep: 'search',
  searchParams: null,
  selectedFlight: null,
  passengerDetails: [],
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    countryCode: '+62'
  },
  paymentInfo: null,
  totalAmount: 0,
  bookingId: null,
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<BookingState['currentStep']>) => {
      state.currentStep = action.payload;
    },

    setSearchParams: (state, action: PayloadAction<BookingState['searchParams']>) => {
      state.searchParams = action.payload;
      console.log('📝 Search params set:', action.payload);
    },

    selectFlight: (state, action: PayloadAction<ProcessedFlight>) => {
      state.selectedFlight = action.payload;
      state.currentStep = 'details';
      console.log('✈️ Flight selected:', action.payload.id);

      // Calculate total amount based on selected flight and passengers
      if (state.searchParams) {
        const { adults, children, infants } = state.searchParams.passengers;
        const flightClass = state.searchParams.class;
        const classKey = flightClass === 'first class' ? 'first' : flightClass;
        const pricePerPerson = action.payload.price[classKey] || action.payload.price.economy;

        state.totalAmount = (adults + children + infants ) * pricePerPerson; // Infants usually free
      }
    },

    updatePassengerDetail: (state, action: PayloadAction<{ index: number; passenger: PassengerDetail }>) => {
      const { index, passenger } = action.payload;
      state.passengerDetails[index] = passenger;
    },

    addPassenger: (state, action: PayloadAction<PassengerDetail>) => {
      state.passengerDetails.push(action.payload);
    },

    removePassenger: (state, action: PayloadAction<number>) => {
      state.passengerDetails.splice(action.payload, 1);
    },

    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },

    proceedToPayment: (state) => {
      state.currentStep = 'payment';
    },

    setPaymentInfo: (state, action: PayloadAction<BookingState['paymentInfo']>) => {
      state.paymentInfo = action.payload;
    },

    confirmBooking: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload;
      state.currentStep = 'confirmation';
    },

    resetBooking: (state) => {
      return { ...initialState };
    },

    clearError: (state) => {
      state.error = null;
    },

    goBackStep: (state) => {
      const steps: BookingState['currentStep'][] = ['search', 'select', 'details', 'payment', 'confirmation'];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = steps[currentIndex - 1];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Loading flight...');
      })
      .addCase(fetchFlightById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFlight = action.payload;
        state.error = null;
        console.log('✅ Flight loaded successfully:', action.payload.id);
      })
      .addCase(fetchFlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch flight';
        state.selectedFlight = null;
        console.error('❌ Flight loading failed:', state.error);
      });
  }
});

export const {
  setCurrentStep,
  setSearchParams,
  selectFlight,
  updatePassengerDetail,
  addPassenger,
  removePassenger,
  updateContactInfo,
  proceedToPayment,
  setPaymentInfo,
  confirmBooking,
  resetBooking,
  clearError,
  goBackStep
} = bookingSlice.actions;

export default bookingSlice.reducer;