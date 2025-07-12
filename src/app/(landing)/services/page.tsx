import React from 'react';
import Link from 'next/link';

const services = [
  {
    id: 'konser',
    title: 'Konser',
    description: 'Dapatkan tiket konser favoritmu dengan mudah dan cepat.',
    image: '/concert.jpg',
    price: 'Mulai dari Rp 100.000'
  },
  {
    id: 'olahraga',
    title: 'Olahraga',
    description: 'Tonton pertandingan olahraga langsung di stadion.',
    image: '/sports.jpg',
    price: 'Mulai dari Rp 50.000'
  },
  {
    id: 'teater',
    title: 'Teater',
    description: 'Nikmati pertunjukan teater dan drama terbaik.',
    image: '/theater.jpg',
    price: 'Mulai dari Rp 75.000'
  },
  {
    id: 'seminar',
    title: 'Seminar',
    description: 'Hadiri seminar dan workshop yang informatif.',
    image: '/seminar.jpg',
    price: 'Mulai dari Rp 25.000'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Layanan Kami
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            TixGo menyediakan berbagai jenis tiket event untuk memenuhi kebutuhan hiburan dan edukasi Anda.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id}
              href={`/services/${service.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{service.title.charAt(0)}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">
                    {service.price}
                  </span>
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    Lihat Detail →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Butuh Bantuan?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7 untuk memastikan pengalaman booking tiket yang lancar.
          </p>
          <Link 
            href="/contact"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
} 