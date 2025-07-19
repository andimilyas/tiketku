import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tickets = await prisma.movie.findMany();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const { title, price } = await req.json();
  if (!title || !price) {
    return NextResponse.json({ message: 'Title and price required' }, { status: 400 });
  }

  const { cinema, showtime } = await req.json();
  if (!cinema || !showtime) {
    return NextResponse.json({ message: 'Cinema and showtime required' }, { status: 400 });
  }

  const newTicket = await prisma.movie.create({
    data: { 
      title, 
      price: parseFloat(price),
      cinema,
      showtime
    },
  });
  return NextResponse.json(newTicket, { status: 201 });
}
