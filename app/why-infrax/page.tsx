import type { Metadata } from 'next';
import WhyInfraXPage from '@/components/pages/WhyInfraXPage';

export const metadata: Metadata = {
  title: 'Why InFraX | InFraX',
  description: 'Neutral. Disciplined. Aligned. The InFraX difference.',
};

export default function Page() {
  return <WhyInfraXPage />;
}
