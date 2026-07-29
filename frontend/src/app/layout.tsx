import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'ActivityMonitor - Real-Time Activity Tracking',
    template: '%s | ActivityMonitor',
  },
  description:
    'Monitor, track, and analyze your application activities in real-time with beautiful dashboards and instant notifications.',
  keywords: [
    'activity monitor',
    'real-time tracking',
    'dashboard',
    'analytics',
    'event monitoring',
  ],
  openGraph: {
    title: 'ActivityMonitor - Real-Time Activity Tracking',
    description:
      'Monitor, track, and analyze your application activities in real-time.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}