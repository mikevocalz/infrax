'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIDDEN_ON = ['/contact', '/intelligence'];

export default function GlobalCTA() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <section className="py-32 lg:py-40 bg-[#000d1a] text-white relative overflow-hidden">
      <div className="absolute inset-0 industrial-grid-dark opacity-10 pointer-events-none" />
      <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
        <h2 className="text-4xl md:text-8xl font-black leading-none tracking-tighter uppercase max-w-5xl mx-auto">
          Ready to <br /><span className="text-[#f37021]">Align?</span>
        </h2>
        <p className="text-xl lg:text-2xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
          Connect with our strategic infrastructure team to architect your next deployment using the InFraAlign™ model.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/contact"
            className="px-10 py-6 lg:px-16 lg:py-8 btn-primary text-lg lg:text-xl"
          >
            Request A Match
          </Link>
          <Link
            href="/intelligence"
            className="px-10 py-6 lg:px-16 lg:py-8 btn-outline-navy !border-white !text-white hover:!bg-white hover:!text-[#000d1a] text-lg lg:text-xl transition-all"
          >
            Market Signals
          </Link>
        </div>
      </div>
    </section>
  );
}
