import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, contact, address } = body;

    if (!name || !type) {
      return NextResponse.json(
        { message: 'Nama dan type vendor wajib diisi' },
        { status: 400 }
      );
    }

    const newVendor = await prisma.vendor.create({
      data: {
        name,
        type,
        contact: contact || null,
        address: address || null,
      },
    });

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: `${error}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany();
    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: `${error}` },
      { status: 500 }
    );
  }
}
