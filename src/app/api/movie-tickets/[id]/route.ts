import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, price } = await req.json();
  const updated = await prisma.movie.update({
    where: { id: String(params.id) },
    data: { title, price: parseFloat(price) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.movie.delete({ where: { id: String(params.id) } });
  return NextResponse.json({ message: 'Deleted' });
}
