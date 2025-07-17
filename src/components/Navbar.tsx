'use client';

import { Box } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="flex justify-between items-center h-16">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                TixGo
              </Link>
            </div>

            {/*Search Input*/}
            <div className="hidden md:block flex-1">
              <div className="flex justify-center">
                <div className="w-full max-w-xs">
                  <form>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        {/* MUI Search Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder={["Lagi cari tiket apa?", "Mau pergi kemana?", "Promo tiket kereta api"][Math.floor((Date.now()/4000)%3)]}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/movie"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Movies
                </Link>
                <Link
                  href="/services"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </Box>
          <Box>
            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </Box>
        </Box>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
}
