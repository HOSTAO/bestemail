import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bestemail - Email Campaigns for Growing Businesses',
  description:
    'Bestemail helps teams create campaigns, manage contacts, and run practical email marketing workflows. Core features are live, with several advanced areas still evolving.',
  keywords: 'email marketing, email campaigns, contact management, newsletter software, marketing automation',
  authors: [{ name: 'Hostao L.L.C.' }],
  openGraph: {
    title: 'Bestemail - Email Campaigns for Growing Businesses',
    description: 'Create campaigns, manage contacts, and run practical email workflows.',
    url: 'https://bestemail.in',
    siteName: 'Bestemail',
    type: 'website',
    images: [
      {
        url: 'https://bestemail.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bestemail Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bestemail - Practical Email Campaigns',
    description: 'Create campaigns, manage contacts, and grow with practical email workflows.',
    images: ['https://bestemail.in/twitter-card.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00B4D8" />
        <link rel="canonical" href="https://bestemail.in" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
