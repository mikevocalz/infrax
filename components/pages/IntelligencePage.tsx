'use client';

import SignalFeed from '@/components/features/intelligence/SignalFeed';

export default function IntelligencePage() {
  return (
    <div className="pt-32 pb-24">
      <section className="container mx-auto px-6 mb-12">
        <div className="max-w-4xl space-y-6">
          <div className="section-label flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-accent animate-pulse" />
            Live Infrastructure Signals
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Market <br />
            <span className="text-orange-accent">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            InfraX aggregates grid filings, operator disclosures, and utility data into a normalized signal feed — filtered, sourced, and actionable.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <SignalFeed />
      </section>
    </div>
  );
}
