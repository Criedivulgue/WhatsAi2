import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { PT_Sans, Source_Code_Pro } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGate } from '@/firebase/auth-gate'; // Import the new AuthGate

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  title: 'WhatsAi',
  description:
    'A plataforma completa de gerenciamento de contatos e bate-papo com tecnologia de IA',
  openGraph: {
    title: 'WhatsAi',
    description:
      'A plataforma completa de gerenciamento de contatos e bate-papo com tecnologia de IA',
    url: 'https://whatsai.app',
    siteName: 'WhatsAi',
    images: [
      {
        url: 'https://whatsai.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E5F8E8' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1B1E' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          ptSans.variable,
          sourceCodePro.variable
        )}
      >
        <FirebaseClientProvider>
          <AuthGate> {/* The AuthGate wraps the application content */}
            {children}
            <Toaster />
          </AuthGate>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
