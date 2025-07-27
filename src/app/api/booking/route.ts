import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.emailVerified) {
    return NextResponse.json({ error: 'Email belum diverifikasi.' }, { status: 403 });
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { product: true } },
      payment: true,
      tickets: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, flight, passengers } = body;

    // Simpan FlightDetail (atau update jika flightNumber sama)
    const flightDetail = await prisma.flightDetail.upsert({
      where: { flightNumber: flight.flightNumber },
      update: {},
      create: {
        product: {
          create: {
            vendor: { create: { name: flight.airline, type: 'airline' } },
            category: 'flight',
            title: `${flight.airline} ${flight.flightNumber}`,
            price: flight.price,
          },
        },
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        originAirportCode: flight.origin,
        destinationAirportCode: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        departureTime: new Date(flight.departureTime),
        arrivalTime: new Date(flight.arrivalTime),
        duration: flight.duration,
      },
      include: { product: true },
    });

    // Buat Booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        totalAmount: flight.price,
        status: 'CONFIRMED',
        items: {
          create: {
            productId: flightDetail.product.id,
            price: flight.price,
            quantity: 1,
          },
        },
        passengers: {
          create: passengers.map((p: any) => ({
            fullName: p.fullName,
            document: p.document,
          })),
        },
      },
      include: { passengers: true, items: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
