import type { Metadata } from 'next';
import SolutionsPage from '@/components/pages/SolutionsPage';

export const metadata: Metadata = {
  title: 'Solutions | InFraX',
  description: 'Industry-specific infrastructure solutions for healthcare, finance, retail, and public sector.',
};

export default function Page() {
  return <SolutionsPage />;
}
