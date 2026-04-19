import type { Metadata } from 'next';
import IntelligencePage from '@/components/pages/IntelligencePage';

export const metadata: Metadata = {
  title: 'Market Intelligence | InFraX',
  description: 'Live infrastructure signals across utility filings, interconnection queues, and operator disclosures.',
};

export default function Page() {
  return <IntelligencePage />;
}
