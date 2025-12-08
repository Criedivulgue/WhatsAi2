import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'WhatsAi',
  description: 'The All-in-One AI-Powered Chat and Contact Management Platform',
  openGraph: {
    title: 'WhatsAi',
    description: 'The All-in-One AI-Powered Chat and Contact Management Platform',
    url: 'https://whatsai.app',
    siteName: 'WhatsAi',
    images: [
      {
        url: 'https://whatsai.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E5F8E8' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1B1E' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
