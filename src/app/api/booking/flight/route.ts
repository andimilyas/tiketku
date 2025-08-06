import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createBookingSchema = z.object({
  flightId: z.string(),
  passengers: z.array(z.object({
    type: z.enum(['adult', 'child', 'infant']),
    title: z.enum(['Tuan', 'Nyonya', 'Nona']),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string(),
    nationality: z.string(),
    documentType: z.enum(['passport', 'ktp']),
    documentNumber: z.string(),
    documentExpiry: z.string().optional(),
    seatPreference: z.string().optional(),
    mealPreference: z.string().optional()
  })),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    countryCode: z.string()
  }),
  totalAmount: z.number().positive()
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        totalAmount: validatedData.totalAmount,
        status: 'PENDING',
        items: {
          create: {
            productId: validatedData.flightId, // This would be your cached flight product ID
            quantity: validatedData.passengers.length,
            price: validatedData.totalAmount
          }
        },
        passengers: {
          create: validatedData.passengers.map(p => ({
            type: p.type,
            title: p.title,
            firstName: p.firstName,
            lastName: p.lastName,
            dateOfBirth: new Date(p.dateOfBirth),
            nationality: p.nationality,
            documentType: p.documentType,
            documentNumber: p.documentNumber,
            documentExpiry: p.documentExpiry ? new Date(p.documentExpiry) : null,
            seat: p.seatPreference,
            mealPreference: p.mealPreference
          }))
        }
      },
      include: {
        items: true,
        passengers: true
      }
    });

    // Generate ticket
    const ticket = await prisma.ticket.create({
      data: {
        bookingId: booking.id,
        ticketCode: `TXG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        qrCodeUrl: null // Generate QR code URL here
      }
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        ticketCode: ticket.ticketCode,
        status: booking.status,
        totalAmount: booking.totalAmount,
        passengers: booking.passengers
      }
    });

  } catch (error) {
    console.error('Create booking API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid booking data',
          details: error.issues // Use 'issues' instead of 'errors'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        passengers: true,
        tickets: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Get bookings API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get bookings' },
      { status: 500 }
    );
  }
}
