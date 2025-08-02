import { prisma } from '@/lib/prisma';
import { FlightSearchParams, FlightSearchResponse } from '@/types/flight';
import { aviationStackService } from '@/services/external/aviations-stack';
import crypto from 'crypto';

// Cache TTL in minutes
const CACHE_TTL_MINUTES = 30; // 30 minutes for flight data

export class FlightCacheService {
  /**
   * Generate hash from search parameters for cache lookup
   */
  private static generateSearchHash(params: FlightSearchParams): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key as keyof FlightSearchParams];
        return result;
      }, {} as any);
    
    return crypto
      .createHash('md5')
      .update(JSON.stringify(sortedParams))
      .digest('hex');
  }

  /**
   * Check if cache is expired
   */
  private static isCacheExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Get cached flight search results
   */
  static async getCachedSearchResults(params: FlightSearchParams): Promise<FlightSearchResponse | null> {
    try {
      const searchHash = this.generateSearchHash(params);
      
      const cached = await prisma.flightSearchCache.findUnique({
        where: { searchHash }
      });

      if (!cached) {
        return null;
      }

      // Check if cache is expired
      if (this.isCacheExpired(cached.expiresAt)) {
        // Delete expired cache
        await prisma.flightSearchCache.delete({
          where: { id: cached.id }
        });
        return null;
      }

      return cached.results as unknown as FlightSearchResponse;
    } catch (error) {
      console.error('Error getting cached search results:', error);
      return null;
    }
  }

  /**
   * Cache flight search results
   */
  static async cacheSearchResults(params: FlightSearchParams, results: FlightSearchResponse): Promise<void> {
    try {
      const searchHash = this.generateSearchHash(params);
      const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);

      await prisma.flightSearchCache.upsert({
        where: { searchHash },
        update: {
          results: results as any,
          cachedAt: new Date(),
          expiresAt
        },
        create: {
          searchHash,
          searchParams: params as any,
          results: results as any,
          expiresAt
        }
      });
    } catch (error) {
      console.error('Error caching search results:', error);
    }
  }

  /**
   * Cache individual flight data
   */
  static async cacheFlightData(flightData: any, searchParams: FlightSearchParams): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);

      await prisma.flightCache.create({
        data: {
          flightNumber: flightData.flightNumber,
          airlineName: flightData.airline.name,
          airlineIata: flightData.airline.iata,
          airlineIcao: flightData.airline.icao || '',
          airlineLogo: flightData.airline.logo || '',
          originAirportCode: flightData.departure.iata,
          destinationAirportCode: flightData.arrival.iata,
          originAirportName: flightData.departure.airport,
          destinationAirportName: flightData.arrival.airport,
          departureTime: new Date(flightData.departure.time),
          arrivalTime: new Date(flightData.arrival.time),
          duration: flightData.duration,
          price: flightData.price.economy || 0,
          availableSeats: flightData.availability.economy || 100,
          class: searchParams.class || 'economy',
          searchParams: searchParams as any,
          expiresAt
        }
      });
    } catch (error) {
      console.error('Error caching flight data:', error);
    }
  }

  /**
   * Clean expired cache entries
   */
  static async cleanExpiredCache(): Promise<void> {
    try {
      const now = new Date();
      
      await prisma.flightSearchCache.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });

      await prisma.flightCache.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
    }
  }

  /**
   * Main search method with hybrid approach
   */
  static async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      // 1. Check cache first
      const cachedResults = await this.getCachedSearchResults(params);
      if (cachedResults) {
        console.log('📦 Returning cached flight results');
        return cachedResults;
      }

      // 2. Fetch from AviationStack API
      console.log('🌐 Fetching fresh flight data from AviationStack');
      const flights = await aviationStackService.searchFlights(params);
      const freshResults: FlightSearchResponse = {
        flights,
        pagination: {
          total: flights.length,
          page: 1,
          limit: 50,
          hasNext: false,
          hasPrevious: false
        },
        filters: {
          airlines: [...new Set(flights.map(f => f.airline.name))],
          priceRange: {
            min: flights.length > 0 ? Math.min(...flights.map(f => f.price.economy)) : 0,
            max: flights.length > 0 ? Math.max(...flights.map(f => f.price.economy)) : 0
          },
          departureTimeRange: {
            earliest: flights.length > 0 ? flights[0].departure.time : '',
            latest: flights.length > 0 ? flights[flights.length - 1].departure.time : ''
          }
        }
      };

      // 3. Cache the results
      await this.cacheSearchResults(params, freshResults);

      // 4. Cache individual flight data for future use
      if (freshResults.flights && Array.isArray(freshResults.flights)) {
        for (const flight of freshResults.flights) {
          await this.cacheFlightData(flight, params);
        }
      }

      return freshResults;
    } catch (error) {
      console.error('Error in hybrid flight search:', error);
      throw error;
    }
  }
} 