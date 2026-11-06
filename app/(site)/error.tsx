'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 industrial-grid-dark opacity-10" />
      <div className="relative z-10 text-center space-y-10 px-6 max-w-2xl mx-auto">
        <div className="section-label !text-orange-accent mx-auto">System // Error</div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
          Signal <span className="text-orange-accent">Lost.</span>
        </h1>
        <p className="text-lg text-white/50 font-light leading-relaxed">
          An unexpected failure occurred in the infrastructure layer. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-10 py-5 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-10 py-5 border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
