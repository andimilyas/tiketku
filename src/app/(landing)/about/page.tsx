import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Tentang TixGo
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Platform tiket online terpercaya yang menghubungkan Anda dengan event favorit.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Cerita Kami
            </h2>
            <p className="text-gray-600 mb-4">
              TixGo didirikan dengan visi untuk memudahkan akses masyarakat Indonesia ke berbagai event berkualitas. 
              Kami percaya bahwa setiap orang berhak menikmati hiburan dan pengalaman yang berharga.
            </p>
            <p className="text-gray-600 mb-4">
              Sejak 2020, kami telah melayani ribuan pelanggan dan bekerja sama dengan ratusan penyelenggara event 
              untuk memberikan pengalaman booking tiket yang aman, mudah, dan terpercaya.
            </p>
            <p className="text-gray-600">
              Dengan teknologi terkini dan layanan customer service 24/7, kami berkomitmen untuk menjadi 
              platform tiket online terdepan di Indonesia.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-96 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">TixGo</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
              <p className="text-gray-600">
                Memudahkan akses masyarakat Indonesia ke berbagai event berkualitas dengan teknologi 
                yang inovatif dan layanan yang terpercaya.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
              <p className="text-gray-600">
                Menjadi platform tiket online terdepan di Indonesia yang menghubungkan jutaan orang 
                dengan pengalaman event yang tak terlupakan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Nilai-Nilai Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Terpercaya</h3>
            <p className="text-gray-600">
              Setiap transaksi dijamin aman dan terpercaya dengan sistem keamanan terkini.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inovatif</h3>
            <p className="text-gray-600">
              Selalu mengembangkan teknologi terbaru untuk pengalaman pengguna yang optimal.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Peduli</h3>
            <p className="text-gray-600">
              Memberikan layanan terbaik dengan memahami kebutuhan dan kepuasan pelanggan.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tim Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CEO</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ahmad Rahman</h3>
              <p className="text-gray-600">Chief Executive Officer</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CTO</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Wijaya</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CMO</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Budi Santoso</h3>
              <p className="text-gray-600">Chief Marketing Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
