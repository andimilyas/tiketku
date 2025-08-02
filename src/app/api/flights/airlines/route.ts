import { NextResponse } from 'next/server';
import { aviationStackService } from '@/services/external/aviations-stack';

export async function GET() {
  try {
    const airlines = await aviationStackService.getAirlines();
    
    return NextResponse.json({
      success: true,
      airlines
    });
    
  } catch (error) {
    console.error('Get airlines API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get airlines' },
      { status: 500 }
    );
  }
}