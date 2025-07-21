import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: Ambil semua produk dengan kategori "movie" beserta detail movie-nya
export async function GET(req: NextRequest) {
  try {
    const movies = await prisma.product.findMany({
      where: { category: 'movie' },
      include: {
        movieDetail: true,
        vendor: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(movies);
  } catch (error) {
    console.error('GET /api/movies error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// POST: Tambah movie baru (beserta detail movie)
export async function POST(req: Request) {
  try {
    const {
      vendorId,
      title,
      description,
      location,
      price,
      duration,
      genre,
      rating,
      language,
      subtitle,
      posterUrl,
      status,
    } = await req.json();

    if (
      !vendorId ||
      !title ||
      !price ||
      !duration ||
      !genre ||
      !rating ||
      !status
    ) {
      return NextResponse.json(
        { message: 'Field wajib: vendorId, title, price, duration, genre, rating, status' },
        { status: 400 }
      );
    }

    const newMovie = await prisma.product.create({
      data: {
        vendor: { connect: { id: vendorId } },
        title,
        description,
        location,
        price,
        category: 'movie',
        movieDetail: {
          create: {
            duration: parseInt(duration, 10),
            genre,
            rating,
            language,
            subtitle,
            posterUrl,
            status,
          },
        },
      },
      include: {
        movieDetail: true,
        vendor: true,
      },
    });

    return NextResponse.json(newMovie);
  } catch (error) {
    console.error('POST /api/movies error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
