import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { siteConfig } from '@/lib/theme';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL('https://tcslc.com'),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: 'https://tcslc.com',
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en">
      <body className={`${sans.variable} min-h-screen bg-background font-sans text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gradient-to-b from-background via-background to-secondary/30">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
