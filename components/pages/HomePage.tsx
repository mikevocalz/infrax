'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Zap, Building2, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { TICKER_SIGNALS } from '@/constants';
import ScoreBar from '@/components/ui/ScoreBar';

const AUDIENCE_SEGMENTS = [
  {
    icon: Zap,
    label: 'AI Developer',
    desc: 'Find power-ready colocation for GPU clusters — validated before you commit.',
    href: '/contact',
    cta: 'Model My Requirements',
  },
  {
    icon: TrendingUp,
    label: 'Capital Investor',
    desc: 'Commission full asset diligence — feasibility scores, risk factors, underwriting.',
    href: '/capital',
    cta: 'Review Capital Workflow',
  },
  {
    icon: Building2,
    label: 'Operator / Developer',
    desc: 'List capacity with verified grid data and reach qualified mandate-stage buyers.',
    href: '/contact',
    cta: 'Register Capacity',
  },
  {
    icon: Shield,
    label: 'Advisory / Legal',
    desc: 'Access independent technical validation to support client infrastructure mandates.',
    href: '/contact',
    cta: 'Discuss Engagement',
  },
];

const HOW_IT_WORKS = [
  { step: '01', label: 'Define Requirements', desc: 'MW range, geography, timeline, cooling, certifications.' },
  { step: '02', label: 'Infra-Align™ Models', desc: 'Physics-first scoring across real utility data and interconnect queues.' },
  { step: '03', label: 'Candidates Ranked', desc: 'Shortlist of fit-scored options — off-market and on-market.' },
  { step: '04', label: 'Diligence Executed', desc: 'Deep validation: utility LOIs, operator capability, expansion modeling.' },
  { step: '05', label: 'Capital Deployed', desc: 'Data-backed term negotiation and delivery accountability framework.' },
];

const SAMPLE_RESULTS = [
  {
    name: 'Ashburn Core Campus',
    market: 'Northern Virginia',
    score: 87,
    recommendation: 'strong' as const,
    mw: '18 MW',
    timeline: '4 mo',
    confidence: 94,
  },
  {
    name: 'Columbus Hyperscale Campus',
    market: 'Columbus, OH',
    score: 74,
    recommendation: 'viable' as const,
    mw: '38 MW',
    timeline: '8 mo',
    confidence: 88,
  },
  {
    name: 'Irving Logistics District',
    market: 'Dallas-Fort Worth',
    score: 51,
    recommendation: 'conditional' as const,
    mw: '32 MW',
    timeline: '18 mo',
    confidence: 79,
  },
];

const REC_COLORS = {
  strong: 'border-l-emerald-500 bg-emerald-50/30',
  viable: 'border-l-blue-500 bg-blue-50/30',
  conditional: 'border-l-orange-400 bg-orange-50/30',
  disqualified: 'border-l-red-500 bg-red-50/30',
};
const REC_BADGE = {
  strong: 'bg-emerald-100 text-emerald-700',
  viable: 'bg-blue-100 text-blue-700',
  conditional: 'bg-orange-100 text-orange-700',
  disqualified: 'bg-red-100 text-red-700',
};

function QuickIntakeForm() {
  const [mw, setMw] = useState('');
  const [region, setRegion] = useState('');
  const [timeline, setTimeline] = useState('');

  return (
    <div className="p-8 bg-white border border-slate-200 shadow-xl space-y-5">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-orange-accent animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-accent">Quick Requirements Check</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Power Need (MW)</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={mw}
            onChange={e => setMw(e.target.value)}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm font-mono text-navy focus:outline-none focus:border-navy"
          />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Primary Region</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-navy bg-white"
          >
            <option value="">Any</option>
            <option>NOVA</option>
            <option>CMH</option>
            <option>DFW</option>
            <option>CHI</option>
            <option>ATL</option>
            <option>PDX</option>
            <option>PHX</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Timeline (months)</label>
          <input
            type="number"
            placeholder="e.g. 12"
            value={timeline}
            onChange={e => setTimeline(e.target.value)}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm font-mono text-navy focus:outline-none focus:border-navy"
          />
        </div>
      </div>
      <Link
        href={`/platform`}
        className="flex items-center justify-between px-6 py-3.5 bg-navy text-white font-black uppercase tracking-widest text-[10px] hover:bg-orange-accent transition-colors w-full"
      >
        <span>Run Full Infra-Align™ Model</span>
        <ArrowRight size={14} />
      </Link>
      <div className="text-[9px] text-slate-400 text-center">
        Full scoring engine · 7 live candidates · Exportable results
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2500"
            alt="Infrastructure"
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          />
          <div className="absolute inset-0 mesh-bg opacity-40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl space-y-8 md:space-y-12">
            <div className="space-y-4 animate-in slide-in-from-left duration-700">
              <div className="section-label !text-orange-accent">InfraX // Intelligence Layer</div>
              <h1
                className="text-white font-black uppercase tracking-tighter leading-[0.95] md:leading-[0.9]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
              >
                The Intelligence Layer <br className="hidden md:block" />
                For AI-Scale <br className="hidden md:block" />
                <span className="text-orange-accent">Infrastructure.</span>
              </h1>
            </div>

            <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl animate-in fade-in duration-1000 delay-300">
              InfraX aligns power, land, capital, and operators using physics-first modeling and real utility
              constraints — before capital is exposed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 animate-in slide-in-from-bottom duration-1000 delay-500">
              <Link
                href="/contact"
                className="px-8 py-5 md:px-12 md:py-6 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-orange-500/20 text-sm md:text-base text-center"
              >
                Request Infrastructure Audit
              </Link>
              <Link
                href="/platform"
                className="px-8 py-5 md:px-12 md:py-6 border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
              >
                Explore Infra-Align™
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 left-0 w-full bg-white/5 border-t border-white/10 backdrop-blur-md py-4 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee gap-12">
            {[...TICKER_SIGNALS, ...TICKER_SIGNALS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-white/80 font-mono text-[11px] uppercase tracking-wider"
              >
                <span className="text-orange-accent">{' >> '}</span> {item.signal}
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE SEGMENTATION */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
            <div className="section-label mx-auto">Who We Serve</div>
            <h2 className="text-3xl md:text-5xl font-black text-navy uppercase tracking-tighter leading-none">
              Built For Your Role.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCE_SEGMENTS.map(({ icon: Icon, label, desc, href, cta }) => (
              <Link
                key={label}
                href={href}
                className="group p-8 bg-white border border-slate-200 hover:border-navy hover:shadow-lg transition-all flex flex-col gap-5"
              >
                <div className="w-12 h-12 bg-navy text-white flex items-center justify-center group-hover:bg-orange-accent transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-black text-navy uppercase tracking-tight mb-2">{label}</div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-orange-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  {cta} <ArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PROJECTS FAIL */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-10">
              <div className="section-label">The Problem</div>
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                Why Infrastructure <br />
                <span className="text-orange-accent">Projects Stall.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                Most infrastructure failures occur long before construction begins. InfraX eliminates assumptions.
                Every deployment is validated against deliverable megawatts — not theoretical availability.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
              {[
                'Utility interconnection backlogs',
                'Overestimated grid headroom',
                'Cooling density misalignment',
                'Capital deployed before feasibility validation',
                'Permitting delays',
                'Operator capacity mismatches',
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 space-y-4 group hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-navy text-white flex items-center justify-center text-xs font-bold">
                    0{i + 1}
                  </div>
                  <p className="font-black text-navy uppercase tracking-tight leading-tight">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INFRAALIGN™ ENGINE */}
      <section className="py-24 lg:py-40 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="bg-white/5 p-4 rounded-t-xl border-x border-t border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Infra-Align™ // Modeling Engine
                </div>
              </div>
              <div className="border border-white/10 shadow-2xl overflow-hidden bg-navy/50 aspect-video relative group flex items-center justify-center">
                <div className="absolute inset-0 opacity-50">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000"
                    className="w-full h-full object-cover grayscale"
                    alt="Infra-Align modeling engine"
                  />
                </div>
                <div className="relative z-10 text-center space-y-6 p-12">
                  <div className="text-6xl font-black text-orange-accent tracking-tighter">84.2</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                    Feasibility Score // Region: NO_VA_01
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[84%] h-full bg-orange-accent" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="section-label !text-orange-accent">The Engine</div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Infra-Align™ <br />
                <span className="text-white/40">Infrastructure Modeled Before It Is Built.</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                Infra-Align™ ingests deployment requirements, simulates real-world constraints, and produces
                feasibility-ranked deployment scenarios — before capital is committed.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {['No guessing.', 'No inventory bias.', 'No speculative underwriting.'].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-orange-accent" />
                    <span className="font-black uppercase tracking-widest text-sm">{text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/platform"
                className="inline-block px-12 py-6 bg-white text-navy font-black uppercase tracking-widest hover:bg-orange-accent hover:text-white transition-all"
              >
                Explore the Engine
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INTAKE + SAMPLE RESULTS */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="section-label">Try Infra-Align™</div>
              <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter leading-none">
                Model Your <span className="text-orange-accent">Requirements.</span>
              </h2>
              <p className="text-lg text-slate-500 font-light leading-relaxed">
                Enter basic parameters below to run a quick match — or use the full platform for weighted scoring,
                constraint analysis, and candidate explainability.
              </p>
              <QuickIntakeForm />
            </div>

            <div className="space-y-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">
                Sample Infra-Align™ Output — 10 MW · NOVA · 12 months
              </div>
              {SAMPLE_RESULTS.map((r) => (
                <div
                  key={r.name}
                  className={`p-5 border-l-4 border border-slate-200 ${REC_COLORS[r.recommendation]}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-black text-navy uppercase tracking-tight text-sm">{r.name}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{r.market}</div>
                    </div>
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${REC_BADGE[r.recommendation]}`}>
                      {r.recommendation}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {[
                      { label: 'Deliverable', value: r.mw },
                      { label: 'Timeline', value: r.timeline },
                      { label: 'Confidence', value: `${r.confidence}%` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</div>
                        <div className="text-sm font-black text-navy">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="font-black uppercase tracking-widest text-slate-400">Fit Score</span>
                      <span className="font-black text-navy">{r.score}</span>
                    </div>
                    <ScoreBar score={r.score} showLabel={false} size="sm" />
                  </div>
                </div>
              ))}
              <Link
                href="/platform"
                className="flex items-center justify-center gap-2 w-full py-4 border border-navy text-navy font-black uppercase tracking-widest text-[9px] hover:bg-navy hover:text-white transition-colors"
              >
                See Full Analysis <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="section-label">Methodology</div>
            <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
              How InfraX <span className="text-orange-accent">Works.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-0">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="p-8 border border-slate-200 h-full space-y-4 hover:border-orange-accent hover:shadow-lg transition-all group bg-white">
                  <div className="text-4xl font-black text-slate-100 group-hover:text-orange-accent/20 transition-colors">
                    {step.step}
                  </div>
                  <div className="font-black text-navy uppercase tracking-tight text-sm">{step.label}</div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{step.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white border border-slate-200 items-center justify-center -translate-y-1/2">
                    <ChevronRight size={12} className="text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-24 lg:py-40 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="section-label">Ecosystem</div>
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                Built For <span className="text-orange-accent">Scale.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                If megawatts matter, alignment matters. We support the entities building the foundation of the AI economy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Hyperscalers',
                  'AI-native companies',
                  'Private equity & capital',
                  'Colocation operators',
                  'Public sector',
                  'Sovereign deployments',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-200">
                    <div className="w-1.5 h-1.5 bg-orange-accent" />
                    <span className="font-bold text-navy uppercase tracking-widest text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-navy overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000"
                    className="w-full h-full object-cover opacity-40 grayscale"
                    alt="Data center"
                  />
                </div>
                <div className="aspect-[4/3] bg-orange-accent p-8 flex flex-col justify-end">
                  <div className="text-4xl font-black text-white uppercase tracking-tighter">100+ GW</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Global Expansion</div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/3] bg-slate-200 p-8 flex flex-col justify-end">
                  <div className="text-4xl font-black text-navy uppercase tracking-tighter">14.1 GW</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">US Capacity</div>
                </div>
                <div className="aspect-square bg-navy overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"
                    className="w-full h-full object-cover opacity-40 grayscale"
                    alt="Global network"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 lg:py-48 bg-navy text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="container mx-auto px-6 relative z-10 space-y-8 md:space-y-12">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
            Model First. <br />
            <span className="text-orange-accent">Build Second.</span>
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-6 md:px-16 md:py-8 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all text-base md:text-xl shadow-2xl shadow-orange-500/20"
          >
            Request Infrastructure Audit
          </Link>
        </div>
      </section>
    </div>
  );
}
