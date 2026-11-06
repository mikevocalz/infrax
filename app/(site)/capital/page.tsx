import type { Metadata } from 'next';
import CapitalPage from '@/components/pages/CapitalPage';

export const metadata: Metadata = {
  title: 'Capital Validation | InFraX',
  description: 'Infrastructure capital advisory for PE, funds, hyperscale, and sovereign deployments.',
};

export default function Page() {
  return <CapitalPage />;
}
