import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Cek session user
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }
  // Cek emailVerified
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.emailVerified) {
    return NextResponse.json({ error: 'Email belum diverifikasi.' }, { status: 403 });
  }
  // Ambil data booking dari body
  const { productId, quantity } = await req.json();
  if (!productId || !quantity) {
    return NextResponse.json({ error: 'Data booking tidak lengkap.' }, { status: 400 });
  }
  // Ambil data produk film
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { movieDetail: true } });
  if (!product || !product.movieDetail) {
    return NextResponse.json({ error: 'Film tidak ditemukan.' }, { status: 404 });
  }
  // Hitung total harga
  const totalAmount = Number(product.price) * Number(quantity);
  // Simpan booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      totalAmount,
      status: 'PENDING',
      items: {
        create: {
          productId: product.id,
          quantity,
          price: product.price,
        },
      },
    },
    include: {
      items: true,
    },
  });
  return NextResponse.json({ message: 'Booking berhasil', booking });
} 