import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET: Ambil semua produk dengan kategori "train" beserta detail train-nya
export async function GET(req: NextRequest) {
  try {
    const trains = await prisma.product.findMany({
      where: { category: 'train' },
      include: {
        trainDetail: { include: { classes: true } },
        vendor: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(trains);
  } catch (error) {
    console.error('GET /api/trains error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// POST: Tambah train baru (beserta detail train)
export async function POST(req: Request) {
  try {
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

    const newTrain = await prisma.product.create({
      data: {
        vendor: { connect: { id: vendorId } },
        title,
        description,
        location,
        price,
        category: 'train',
        trainDetail: {
          create: {
            trainName,
            trainNumber,
            departureStation: departure,
            arrivalStation: arrival,
            departureTime: new Date(departureTime),
            arrivalTime: new Date(arrivalTime),
            classes: Array.isArray(trainClass)
              ? { create: trainClass.map((cls: any) => ({
                  className: cls.className,
                  price: parseFloat(cls.price),
                  seatCount: parseInt(cls.seatCount, 10),
                })) }
              : undefined,
          },
        },
      },
      include: {
        trainDetail: { include: { classes: true } },
        vendor: true,
      },
    });

    return NextResponse.json(newTrain);
  } catch (error) {
    console.error('POST /api/trains error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
