// types/flight.ts
export interface FlightSearchParams {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  class: 'economy' | 'business' | 'first class';
  tripType: 'one-way' | 'round-trip';
}

export interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: null;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live: null;
}

export interface ProcessedFlight {
  class: any;
  id: string;
  flightNumber: string;
  airline: {
    name: string;
    iata: string;
    logo?: string;
  };
  departure: {
    airport: string;
    iata: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  duration: string;
  aircraft: string;
  price: {
    economy: number;
    business?: number;
    first?: number;
  };
  availability: {
    economy: number;
    business?: number;
    first?: number;
  };
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted';
}

export interface FlightSearchResponse {
  flights: ProcessedFlight[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    airlines: string[];
    priceRange: {
      min: number;
      max: number;
    };
    departureTimeRange: {
      earliest: string;
      latest: string;
    };
  };
}

// types/booking.ts
export interface BookingState {
  byId?: Record<string, any>;
  latestSuccess?: any;
  currentStep: 'search' | 'select' | 'details' | 'payment' | 'confirmation';
  searchParams: FlightSearchParams | null;
  selectedFlight: ProcessedFlight | null;
  passengerDetails: PassengerDetail[];
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo | null;
  totalAmount: number;
  bookingId: string | null;
  loading: boolean;  // Add this
  error: string | null;  // Add this
}

export interface PassengerDetail {
  id?: string;
  type: 'adults' | 'children' | 'infants';
  title: 'Tuan' | 'Nyonya' | 'Nona';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  documentType?: 'passport' | 'ktp';
  documentNumber?: string;
  documentExpiry?: Date;
  seatPreference?: string;
  mealPreference?: string;
  passportNumber?: string;
}

export interface ContactInfo {
  title: string;
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'bank_transfer' | 'ewallet';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
}