import { NextRequest, NextResponse } from 'next/server';
import { FlightSearchParams } from '@/types/flight';
import { FlightCacheService } from '@/services/cache/flightCache';
import { z } from 'zod';

// Validation schema
const searchParamsSchema = z.object({
  departure: z.string().min(3).max(3),
  arrival: z.string().min(3).max(3),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.object({
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(9),
    infants: z.number().min(0).max(9)
  }),
  class: z.enum(['economy', 'business', 'first']),
  tripType: z.enum(['one-way', 'round-trip'])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedParams = searchParamsSchema.parse(body) as FlightSearchParams;
    
    console.log('🔍 Flight search request:', validatedParams);
    
    // Use hybrid cache service
    const searchResults = await FlightCacheService.searchFlights(validatedParams);
    
    if (!searchResults.flights || searchResults.flights.length === 0) {
      return NextResponse.json({
        success: true,
        flights: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 50,
          hasNext: false,
          hasPrevious: false
        },
        filters: {
          airlines: [],
          priceRange: { min: 0, max: 0 }
        }
      });
    }
    
    // Apply filters and sorting (basic implementation)
    const sortedFlights = searchResults.flights.sort((a: any, b: any) => {
      return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
    });
    
    // Extract unique airlines and price range
    const airlines = [...new Set(sortedFlights.map((f: any) => f.airline.name))];
    const prices = sortedFlights.map((f: any) => f.price?.economy || 0).filter((p: number) => p > 0);
    
    return NextResponse.json({
      success: true,
      flights: sortedFlights,
      pagination: {
        total: sortedFlights.length,
        page: 1,
        limit: 50,
        hasNext: false,
        hasPrevious: false
      },
      filters: {
        airlines,
        priceRange: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0
        }
      }
    });
    
  } catch (error) {
    console.error('Flight search API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid search parameters', 
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search flights' 
      },
      { status: 500 }
    );
  }
}