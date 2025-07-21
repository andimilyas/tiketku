import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Edit flight (beserta detail flight)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    // Update product and flightDetail
    const updatedFlight = await prisma.product.update({
      where: { id },
      data: {
        vendorId,
        title,
        description,
        location,
        price: parseFloat(price),
        flightDetail: {
          update: {
            airline,
            flightNumber,
            departure,
            arrival,
            departureTime: new Date(departureTime),
            arrivalTime: new Date(arrivalTime),
          },
        },
      },
      include: {
        flightDetail: true,
        vendor: true,
      },
    });

    return NextResponse.json(updatedFlight);
  } catch (error) {
    console.error('PUT /api/flights/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// DELETE: Hapus flight (beserta detail flight)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Hapus flightDetail terlebih dahulu (karena relasi 1-1)
    await prisma.flightDetail.deleteMany({
      where: { productId: id },
    });

    // Hapus product (flight)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Flight berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/flights/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
