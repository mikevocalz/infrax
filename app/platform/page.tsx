import type { Metadata } from 'next';
import PlatformPage from '@/components/pages/PlatformPage';

export const metadata: Metadata = {
  title: 'Infra-Align™ Engine | InFraX',
  description: 'Physics-first infrastructure modeling for power-constrained markets.',
};

export default function Page() {
  return <PlatformPage />;
}
