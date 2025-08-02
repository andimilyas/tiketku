// services/external/aviation-stack.ts
import { AviationStackFlight, ProcessedFlight, FlightSearchParams } from '@/types/flight';
import { unknown } from 'zod';

class AviationStackService {
  private baseUrl = 'http://api.aviationstack.com/v1';
  private apiKey = process.env.AVIATIONSTACK_API_KEY!;

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('access_key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AviationStack API request failed:', error);
      throw error;
    }
  }

  async searchFlights(searchParams: FlightSearchParams): Promise<ProcessedFlight[]> {
    try {
      // For real-time flights (current/recent flights)
      const params = {
        dep_iata: searchParams.departure,
        arr_iata: searchParams.arrival,
        flight_status: 'scheduled',
        limit: 50
      };

      const response = await this.makeRequest<{
        pagination: any;
        data: AviationStackFlight[];
      }>('/flights', params);

      return response.data.map(flight => this.transformFlight(flight));
    } catch (error) {
      console.error('Flight search failed:', error);
      throw new Error('Failed to search flights');
    }
  }

  async getFlightDetails(flightNumber: string, date: string): Promise<ProcessedFlight | null> {
    try {
      const params = {
        flight_iata: flightNumber,
        flight_date: date
      };

      const response = await this.makeRequest<{
        data: AviationStackFlight[];
      }>('/flights', params);

      if (response.data.length === 0) {
        return null;
      }

      return this.transformFlight(response.data[0]);
    } catch (error) {
      console.error('Get flight details failed:', error);
      return null;
    }
  }

  async getAirlines(): Promise<Array<{name: string; iata: string; icao: string}>> {
    try {
      const response = await this.makeRequest<{
        data: Array<{
          airline_name: string;
          iata_code: string;
          icao_code: string;
        }>;
      }>('/airlines', { limit: 100 });

      return response.data.map(airline => ({
        name: airline.airline_name,
        iata: airline.iata_code,
        icao: airline.icao_code
      }));
    } catch (error) {
      console.error('Get airlines failed:', error);
      return [];
    }
  }

  private transformFlight(flight: AviationStackFlight): ProcessedFlight {
    // Calculate duration
    const depTime = new Date(flight.departure.scheduled);
    const arrTime = new Date(flight.arrival.scheduled);
    const durationMs = arrTime.getTime() - depTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours}h ${minutes}m`;

    // Generate mock pricing (since AviationStack doesn't provide pricing)
    const basePrice = this.generateMockPrice(flight.departure.iata, flight.arrival.iata);

    return {
      id: `${flight.flight.iata}-${flight.flight_date}`,
      flightNumber: flight.flight.iata,
      airline: {
        name: flight.airline.name,
        iata: flight.airline.iata,
        logo: `/airlines/${flight.airline.iata.toLowerCase()}.png`
      },
      departure: {
        airport: flight.departure.airport,
        iata: flight.departure.iata,
        time: flight.departure.scheduled,
        terminal: flight.departure.terminal,
        gate: flight.departure.gate
      },
      arrival: {
        airport: flight.arrival.airport,
        iata: flight.arrival.iata,
        time: flight.arrival.scheduled,
        terminal: flight.arrival.terminal,
        gate: flight.arrival.gate
      },
      duration,
      aircraft: flight.aircraft?.iata || 'unknown',
      price: {
        economy: basePrice,
        business: Math.round(basePrice * 2.5),
        first: Math.round(basePrice * 4)
      },
      availability: {
        economy: Math.floor(Math.random() * 50) + 10,
        business: Math.floor(Math.random() * 20) + 5,
        first: Math.floor(Math.random() * 10) + 2
      },
      status: this.mapFlightStatus(flight.flight_status)
    };
  }

  private generateMockPrice(depIata: string, arrIata: string): number {
    // Simple mock pricing based on route
    const basePrice = 500000; // IDR
    const hash = (depIata + arrIata).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variation = Math.abs(hash % 1000000);
    return basePrice + variation;
  }

  private mapFlightStatus(status: string): ProcessedFlight['status'] {
    const statusMap: Record<string, ProcessedFlight['status']> = {
      'scheduled': 'scheduled',
      'active': 'active',
      'landed': 'landed',
      'cancelled': 'cancelled',
      'incident': 'incident',
      'diverted': 'diverted'
    };
    
    return statusMap[status] || 'scheduled';
  }
}

export const aviationStackService = new AviationStackService();