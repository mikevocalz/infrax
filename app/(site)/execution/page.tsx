import type { Metadata } from 'next';
import ExecutionPage from '@/components/pages/ExecutionPage';

export const metadata: Metadata = {
  title: 'Execution Discipline | InFraX',
  description: 'Neutral, disciplined infrastructure execution from site validation to operational handoff.',
};

export default function Page() {
  return <ExecutionPage />;
}
