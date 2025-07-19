import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tickets = await prisma.movie.findMany();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  try {
    const { title, price, cinema, showtime } = await req.json();
    if (!title || !price || !cinema || !showtime) {
      return NextResponse.json({ message: 'Semua field harus diisi' }, { status: 400 });
    }

    const newTicket = await prisma.movie.create({
      data: { 
        title, 
        price: parseFloat(price),
        cinema,
        showtime: new Date(showtime)
      },
    });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('POST /api/movie-tickets error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
