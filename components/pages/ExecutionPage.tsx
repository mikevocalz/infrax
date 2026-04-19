import { MANDATE_PHASES } from '@/lib/mock-data';
import type { DeliverableStatus } from '@/types';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

const STATUS_ICON = {
  complete: <CheckCircle2 size={16} className="text-emerald-500" />,
  active: <div className="w-4 h-4 rounded-full border-2 border-orange-accent flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-orange-accent" /></div>,
  upcoming: <Circle size={16} className="text-slate-200" />,
};

const DELIVERABLE_COLORS: Record<DeliverableStatus, string> = {
  complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-slate-50 text-slate-500 border-slate-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
};

export default function ExecutionPage() {
  const activePhase = MANDATE_PHASES.find(p => p.status === 'active');

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl space-y-6">
          <div className="section-label">Execution</div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Neutral. <br />Disciplined. <br />
            <span className="text-orange-accent">Aligned.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            InfraX executes based on modeled feasibility — not inventory. Every mandate follows the same disciplined lifecycle.
          </p>
        </div>
      </section>

      {/* Active mandate summary */}
      {activePhase && (
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-navy text-white p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 industrial-grid-dark opacity-10" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-orange-accent">Active Phase</div>
                <div className="text-3xl font-black uppercase tracking-tighter">{activePhase.label}</div>
                <div className="text-white/60 font-light">{activePhase.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {activePhase.deliverables.map(d => (
                  <div key={d.id} className={`p-4 border text-sm ${DELIVERABLE_COLORS[d.status]}`}>
                    <div className="font-black uppercase tracking-tight text-[11px] mb-1">{d.title}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{d.status.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mandate timeline */}
      <section className="container mx-auto px-6 mb-16">
        <div className="mb-10">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mandate Lifecycle</div>
          <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Standard Engagement Phases</h2>
        </div>

        <div className="space-y-0">
          {MANDATE_PHASES.map((phase, i) => (
            <div key={phase.phase} className={`relative border border-slate-200 ${phase.status === 'active' ? 'bg-white shadow-lg ring-2 ring-navy' : phase.status === 'complete' ? 'bg-slate-50' : 'bg-white opacity-60'}`}>
              {/* Left accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${phase.status === 'complete' ? 'bg-emerald-500' : phase.status === 'active' ? 'bg-orange-accent' : 'bg-slate-200'}`} />

              <div className="p-6 pl-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">{STATUS_ICON[phase.status]}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phase {i + 1}</span>
                        {phase.status === 'active' && (
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-orange-accent text-white">Active</span>
                        )}
                        {phase.status === 'complete' && (
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">Complete</span>
                        )}
                      </div>
                      <div className="font-black text-navy uppercase tracking-tight">{phase.label}</div>
                      <div className="text-sm text-slate-500 font-light">{phase.description}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0 mt-1" />
                </div>

                {phase.deliverables.length > 0 && (phase.status === 'active' || phase.status === 'complete') && (
                  <div className="mt-6 ml-8 grid sm:grid-cols-2 gap-3">
                    {phase.deliverables.map(d => (
                      <div key={d.id} className={`p-3 border text-xs ${DELIVERABLE_COLORS[d.status]}`}>
                        <div className="font-black uppercase tracking-tight mb-1">{d.title}</div>
                        <div className="font-light opacity-80">{d.description}</div>
                        <div className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-60">
                          {d.owner} · {d.status.replace('-', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-10 bg-slate-50 border border-slate-200 space-y-6">
            <h3 className="text-xl font-black text-navy uppercase tracking-tight">Start an Engagement</h3>
            <p className="text-slate-500 font-light text-sm leading-relaxed">
              Submit your infrastructure requirements and InfraX will initiate a structured execution mandate within one business day.
            </p>
            <a href="/contact" className="inline-block px-8 py-4 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-colors text-[10px]">
              Submit Requirements
            </a>
          </div>
          <div className="p-10 bg-navy text-white space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 industrial-grid-dark opacity-10" />
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-orange-accent">Execution Standard</div>
              <div className="text-white/80 font-light leading-relaxed text-sm">
                &ldquo;Infrastructure is no longer land-first. It is power-first. Our execution model ensures capital is deployed only where physics permits delivery.&rdquo;
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 bg-orange-accent flex items-center justify-center font-black text-sm">IX</div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest">InfraX Operations</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">Global Execution Layer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
