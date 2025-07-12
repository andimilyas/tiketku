import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
