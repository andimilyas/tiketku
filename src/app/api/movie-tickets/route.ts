import { NextResponse } from 'next/server';
import { movieTickets } from '@/data/movie-tickets';

export async function GET() {
    return NextResponse.json(movieTickets);
}

export async function POST(req: Request) {
    const body = await req.json();

    const newTicket = {
        id: Date.now(),
        ...body
    };

    movieTickets.push(newTicket);

    return NextResponse.json(newTicket, { status: 201 });
}