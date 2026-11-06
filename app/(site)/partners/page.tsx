import type { Metadata } from 'next';
import PartnersPage from '@/components/pages/PartnersPage';

export const metadata: Metadata = {
  title: 'Strategic Partners | InFraX',
  description: 'Technology, infrastructure, and strategic reseller alliances.',
};

export default function Page() {
  return <PartnersPage />;
}
