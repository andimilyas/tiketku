import { NextResponse } from 'next/server';
import { movieTickets } from '@/data/movie-tickets';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = movieTickets.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const body = await req.json();
  movieTickets[index] = { ...movieTickets[index], ...body };

  return NextResponse.json(movieTickets[index]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = movieTickets.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const removed = movieTickets.splice(index, 1);

  return NextResponse.json(removed[0]);
}
