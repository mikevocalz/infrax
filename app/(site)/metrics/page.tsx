import type { Metadata } from 'next';
import MetricsPage from '@/components/pages/MetricsPage';

export const metadata: Metadata = {
  title: 'Metrics | InFraX',
  description: 'Infrastructure performance metrics across operational, financial, and technical governance dimensions.',
};

export default function Page() {
  return <MetricsPage />;
}
