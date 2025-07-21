import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil detail movie tertentu berdasarkan id produk
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const movie = await prisma.product.findUnique({
      where: { id, category: 'movie' },
      include: {
        movieDetail: true,
        vendor: true,
        reviews: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('GET /api/movies/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// PUT: Edit movie tertentu (beserta detail movie)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Cek apakah movie ada
    const existing = await prisma.product.findUnique({
      where: { id, category: 'movie' },
      include: { movieDetail: true },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    // Update product dan movieDetail
    const updated = await prisma.product.update({
      where: { id },
      data: {
        vendor: vendorId ? { connect: { id: vendorId } } : undefined,
        title,
        description,
        location,
        price,
        movieDetail: {
          update: {
            duration: duration !== undefined ? parseInt(duration, 10) : undefined,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/movies/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// DELETE: Hapus movie tertentu (beserta detail movie)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Cek apakah movie ada
    const existing = await prisma.product.findUnique({
      where: { id, category: 'movie' },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    // Prisma cascade delete movieDetail jika relasi onDelete: Cascade (atau manual delete)
    await prisma.movieDetail.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/movies/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
