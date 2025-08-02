import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  // Cek user sudah ada
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Buat user baru
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword, // field password opsional, tambahkan di model jika belum ada
      emailVerified: null,
    },
  });
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
  await prisma.otpToken.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });
  // Kirim OTP ke email
  const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: 'no-reply@tixgo.com',
    to: email,
    subject: 'Kode OTP Verifikasi Email',
    text: `Kode OTP kamu: ${otp}`,
  });
  return NextResponse.json({ message: 'Register success, OTP sent to email' });
} 