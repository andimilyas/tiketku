import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Service data - in a real app, this would come from a database
const serviceData = {
  konser: {
    title: 'Tiket Konser',
    description: 'Dapatkan tiket konser favoritmu dengan mudah dan cepat. Kami menyediakan tiket untuk berbagai jenis konser dari artis lokal hingga internasional.',
    features: [
      'Booking online 24/7',
      'Pembayaran aman dan terpercaya',
      'Tiket digital langsung ke email',
      'Refund policy yang fleksibel',
      'Customer service 24/7'
    ],
    price: 'Mulai dari Rp 100.000',
    image: '/concert.jpg'
  },
  olahraga: {
    title: 'Tiket Olahraga',
    description: 'Tonton pertandingan olahraga langsung di stadion. Dari sepak bola, basket, hingga badminton, kami punya tiketnya.',
    features: [
      'Tiket untuk berbagai cabang olahraga',
      'Pilihan tempat duduk terbaik',
      'Notifikasi real-time',
      'Transfer tiket mudah',
      'Garansi keaslian tiket'
    ],
    price: 'Mulai dari Rp 50.000',
    image: '/sports.jpg'
  },
  teater: {
    title: 'Tiket Teater',
    description: 'Nikmati pertunjukan teater dan drama terbaik. Dari drama klasik hingga pertunjukan modern.',
    features: [
      'Pertunjukan teater terbaik',
      'Pilihan tempat duduk VIP',
      'Paket dinner + show',
      'Group booking tersedia',
      'Season pass untuk penggemar'
    ],
    price: 'Mulai dari Rp 75.000',
    image: '/theater.jpg'
  },
  seminar: {
    title: 'Tiket Seminar',
    description: 'Hadiri seminar dan workshop yang informatif. Tingkatkan skill dan pengetahuan Anda.',
    features: [
      'Seminar dari expert terkemuka',
      'Workshop hands-on',
      'Sertifikat kehadiran',
      'Networking session',
      'Materi seminar digital'
    ],
    price: 'Mulai dari Rp 25.000',
    image: '/seminar.jpg'
  }
};

interface ServicePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(serviceData).map((id) => ({ id }));
}

export const dynamic = 'force-dynamic'; // opsional

export default function ServicePage({ params }: ServicePageProps) {
  const service = serviceData[params.id as keyof typeof serviceData];

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link 
              href="/services"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Kembali ke Layanan
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {service.description}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Image */}
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-96 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">{service.title.charAt(0)}</span>
          </div>

          {/* Service Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Fitur Layanan
              </h2>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    {service.price}
                  </span>
                  <Link 
                    href="/contact"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Layanan Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(serviceData)
              .filter(([id]) => id !== params.id)
              .slice(0, 3)
              .map(([id, data]) => (
                <Link 
                  key={id}
                  href={`/services/${id}`}
                  className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {data.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {data.description.substring(0, 100)}...
                  </p>
                  <span className="text-blue-600 font-medium">
                    {data.price}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
