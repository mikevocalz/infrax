import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';
import GlobalCTA from '@/components/layout/GlobalCTA';
import ChatBot from '@/components/ChatBot';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InFraX | The Intelligence Layer for AI-Scale Infrastructure',
  description:
    'InfraX aligns power, land, capital, and operators using physics-first modeling and real utility constraints via InfraAlign™.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white" suppressHydrationWarning>
        <Header />
        <main>
          {children}
          <GlobalCTA />
        </main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
