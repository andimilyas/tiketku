import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil detail produk kereta tertentu (beserta detail train)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const train = await prisma.product.findUnique({
      where: { id },
      include: {
        trainDetail: true,
        vendor: true,
        reviews: true,
      },
    });
    if (!train) {
      return NextResponse.json({ message: 'Kereta tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(train);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// PUT: Edit produk kereta tertentu (beserta detail train)
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
      trainName,
      trainNumber,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      trainClass,
    } = await req.json();

    if (
      !vendorId ||
      !title ||
      !price ||
      !trainName ||
      !trainNumber ||
      !departure ||
      !arrival ||
      !departureTime ||
      !arrivalTime ||
      !trainClass
    ) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Update product dan trainDetail
    const updatedTrain = await prisma.product.update({
      where: { id },
      data: {
        vendor: { connect: { id: vendorId } },
        title,
        description,
        location,
        price,
        trainDetail: {
          update: {
            trainName,
            trainNumber,
            departureStation: departure,
            arrivalStation: arrival,
            departureTime,
            arrivalTime,
            classes: trainClass,
          },
        },
      },
      include: {
        trainDetail: true,
        vendor: true,
      },
    });

    return NextResponse.json(updatedTrain);
  } catch (error) {
    console.error('PUT /api/trains/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// DELETE: Hapus produk kereta tertentu
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Hapus trainDetail terlebih dahulu (jika ada relasi onDelete: Cascade, ini bisa di-skip)
    await prisma.trainDetail.deleteMany({
      where: { productId: id },
    });

    // Hapus produk kereta
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kereta berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/trains/[id] error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
