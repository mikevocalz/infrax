import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'InFraX | The Intelligence Layer for AI-Scale Infrastructure',
  description:
    'InfraX aligns power, land, capital, and operators using physics-first modeling and real utility constraints — before capital is exposed.',
  openGraph: {
    title: 'InFraX | The Intelligence Layer for AI-Scale Infrastructure',
    description:
      'Physics-first infrastructure modeling. Power, land, capital, and operator alignment for AI-scale deployments.',
    type: 'website',
  },
};

export default function Page() {
  return <HomePage />;
}
