"use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [status, session, router]);

  // Jangan render dashboard sebelum status "authenticated" dan role admin
  if (status === "loading" || (status === "authenticated" && session?.user.role !== "admin")) {
    return null; // atau tampilkan spinner/loading
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Cepat</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tiket</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendapatan</span>
                <span className="font-semibold text-green-600">Rp 45.6M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pengguna Aktif</span>
                <span className="font-semibold">892</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link 
                href="/dashboard/orders"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
              >
                Kelola Pesanan
              </Link>
              <Link 
                href="/dashboard/users"
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
              >
                Kelola Pengguna
              </Link>
              <Link 
                href="/contact"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
              >
                Hubungi Support
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Pesanan baru #12345</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Pembayaran diterima</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Tiket dikirim</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Selamat Datang di Dashboard TixGo
          </h2>
          <p className="text-blue-100 mb-6">
            Kelola semua aspek bisnis tiket Anda dari satu tempat yang mudah digunakan.
          </p>
          <Link 
            href="/"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}