import { NextRequest, NextResponse } from 'next/server';
import { aviationStackService } from '@/services/external/aviations-stack';

export async function GET(
  request: NextRequest,
  { params }: { params: { flightId: string } }
) {
  try {
    const { flightId } = params;
    
    console.log('🔍 Received flightId:', flightId);
    
    // Extract flight number and date from flightId
    // Format: FLIGHT_NUMBER-YYYY-MM-DD (e.g., "VN3878-2025-08-01")
    const parts = flightId.split('-');
    
    if (parts.length < 4) {
      console.error('❌ Invalid flight ID format. Expected: FLIGHT_NUMBER-YYYY-MM-DD');
      return NextResponse.json(
        { success: false, error: 'Invalid flight ID format. Expected: FLIGHT_NUMBER-YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Flight number adalah bagian pertama
    const flightNumber = parts[0];
    // Date adalah 3 bagian terakhir yang digabung
    const date = parts.slice(-3).join('-'); // Ambil YYYY-MM-DD
    
    console.log('✈️ Parsed - Flight Number:', flightNumber, 'Date:', date);
    
    if (!flightNumber || !date) {
      return NextResponse.json(
        { success: false, error: 'Invalid flight ID format' },
        { status: 400 }
      );
    }
    
    // Validasi format tanggal
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Expected: YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    const flight = await aviationStackService.getFlightDetails(flightNumber, date);

    console.log('🔎 Flight data from API:', flight);
    
    if (!flight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: flight // Tambahkan wrapper 'data'
    });
    
  } catch (error) {
    console.error('❌ Get flight details API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get flight details' },
      { status: 500 }
    );
  }
}