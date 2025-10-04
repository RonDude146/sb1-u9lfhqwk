import './globals.css';
import type { Metadata } from 'next/metadata';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Newhill Spices - Premium Spices from Kerala Hills',
  description: 'Premium quality spices directly from Munnar hills. Farm-to-table freshness with authentic Kerala spices including cardamom, black pepper, cinnamon and more.',
  keywords: 'kerala spices, cardamom, black pepper, organic spices, munnar spices, indian spices',
  authors: [{ name: 'Newhill Spices' }],
  creator: 'Newhill Spices',
  publisher: 'Newhill Spices',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newhillspices.com',
    title: 'Newhill Spices - Premium Kerala Spices',
    description: 'Premium quality spices directly from Munnar hills. Farm-to-table freshness with authentic Kerala spices.',
    siteName: 'Newhill Spices',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newhill Spices - Premium Kerala Spices',
    description: 'Premium quality spices directly from Munnar hills. Farm-to-table freshness with authentic Kerala spices.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}