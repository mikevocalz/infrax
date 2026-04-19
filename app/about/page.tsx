import type { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'Leadership | InFraX',
  description: 'Meet the InFraX leadership team.',
};

export default function Page() {
  return <AboutPage />;
}
