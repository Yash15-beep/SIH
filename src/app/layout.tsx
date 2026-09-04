import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSans = Noto_Sans({ subsets: ['latin', 'devanagari'], variable: '--font-noto-sans', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'KisanSetu — Direct Farm-to-Fork Marketplace with AI Price Fairness',
  description: 'A digital marketplace that connects farmers/FPOs directly with consumers and bulk buyers, provides logistics support, and uses AI for demand forecasting and route optimization (SIH 2026 PS 26033).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAFAF7] text-slate-900 antialiased selection:bg-brand-200">
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
