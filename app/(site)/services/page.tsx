import type { Metadata } from 'next';
import ServicesPage from '@/components/pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Services | InFraX',
  description: 'Intelligent matching, neutral guidance, and execution discipline for AI-scale infrastructure.',
};

export default function Page() {
  return <ServicesPage />;
}
