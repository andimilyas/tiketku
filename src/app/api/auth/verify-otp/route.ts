import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }
  // Cari OTP
  const otpToken = await prisma.otpToken.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gte: new Date() },
    },
  });
  if (!otpToken) {
    return NextResponse.json({ error: 'OTP salah atau sudah kadaluarsa' }, { status: 400 });
  }
  // Update emailVerified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
  // Hapus OTP
  await prisma.otpToken.delete({ where: { id: otpToken.id } });
  return NextResponse.json({ message: 'Email berhasil diverifikasi' });
} 