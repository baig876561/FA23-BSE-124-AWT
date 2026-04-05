import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AdFlow Pro | Premium Sponsored Listings',
  description: 'The premier marketplace for top-tier sponsored listings and digital real estate.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased flex flex-col selection:bg-indigo-500/30`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          {/* Simple Footer */}
          <footer className="border-t border-white/5 py-8 mt-auto text-center text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} AdFlow Pro. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
