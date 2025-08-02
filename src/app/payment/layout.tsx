import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';
import SessionClientProvider from '@/components/SessionClientProvider';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionClientProvider>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </SessionClientProvider>
    </>
  );
}
