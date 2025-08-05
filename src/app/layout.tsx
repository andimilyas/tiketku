import type { Metadata } from "next";
import SessionClientProvider from "@/components/SessionClientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from '../components/ReduxProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TixGo",
  description: "TixGo adalah platform pemesanan tiket pesawat, event, dan perjalanan dengan mudah dan cepat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
