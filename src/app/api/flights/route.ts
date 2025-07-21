import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: Ambil semua produk dengan kategori "flight" beserta detail flight-nya
export async function GET(req: NextRequest) {
  // Cek apakah ada query param flightDetailId
  const { searchParams } = new URL(req.url);
  const flightDetailId = searchParams.get('flightDetailId');
  if (flightDetailId) {
    try {
      const classes = await prisma.flightClass.findMany({
        where: { flightDetailId },
        orderBy: { className: 'asc' },
      });
      return NextResponse.json(classes);
    } catch (error) {
      return NextResponse.json({ message: 'Internal server error', error: `${error}` }, { status: 500 });
    }
  }
  // Jika tidak ada param, kembalikan semua flight (default behavior lama)
  try {
    const flights = await prisma.product.findMany({
      where: { category: 'flight' },
      include: {
        flightDetail: { include: { classes: true } },
        vendor: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(flights);
  } catch (error) {
    console.error('GET /api/flights error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// POST: Tambah flight baru (beserta detail flight)
export async function POST(req: Request) {
  try {
    const {
      vendorId,
      title,
      description,
      location,
      price,
      airline,
      flightNumber,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      flightClasses = [],
    } = await req.json();

    if (
      !vendorId ||
      !title ||
      !price ||
      !airline ||
      !flightNumber ||
      !departure ||
      !arrival ||
      !departureTime ||
      !arrivalTime
    ) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    const newFlight = await prisma.product.create({
      data: {
        vendorId,
        category: 'flight',
        title,
        description,
        location,
        price: parseFloat(price),
        flightDetail: {
          create: {
            airline,
            flightNumber,
            departure,
            arrival,
            departureTime: new Date(departureTime),
            arrivalTime: new Date(arrivalTime),
            classes: {
              create: (flightClasses as Array<{ className: string; price: string; seatCount: string }>).map((fc) => ({
                className: fc.className,
                price: parseFloat(fc.price),
                seatCount: parseInt(fc.seatCount, 10),
              })),
            },
          },
        },
      },
      include: {
        flightDetail: { include: { classes: true } },
        vendor: true,
      },
    });

    return NextResponse.json(newFlight, { status: 201 });
  } catch (error) {
    console.error('POST /api/flights error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
