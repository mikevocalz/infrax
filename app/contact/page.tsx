import type { Metadata } from 'next';
import ContactPage from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact | InFraX',
  description: 'Request an infrastructure audit or connect with the InFraX strategic team.',
};

export default function Page() {
  return <ContactPage />;
}
