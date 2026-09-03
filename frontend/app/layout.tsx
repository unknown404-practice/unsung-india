import '../styles/globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ColdStartBanner from '../components/ColdStartBanner';

export const metadata: Metadata = {
  title: 'Unsung Heroes of India | National Search Engine & DPI',
  description:
    'A national-asset-grade multilingual digital archive documenting India’s unsung freedom fighters, tribal leaders, pioneering scientists, and social reformers with automated banner generation.',
  referrer: 'no-referrer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="bg-background text-slate-100 min-h-screen flex flex-col selection:bg-saffron-500 selection:text-black">
        <ColdStartBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
