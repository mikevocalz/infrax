import { CheckCircle2, Target } from 'lucide-react';

const EXECUTION_STEPS = [
  { title: 'Site Validation', desc: 'Independent verification of utility headroom and physical constraints.' },
  { title: 'Operator Alignment', desc: 'Matching deployment requirements with technical operator capabilities.' },
  { title: 'Off-Market Sourcing', desc: 'Identifying non-public capacity opportunities through grid intelligence.' },
  { title: 'Capacity Negotiation', desc: 'Leveraging modeled data to secure defensible commercial terms.' },
  { title: 'SLA Governance', desc: 'Enforcing technical adherence through the deployment lifecycle.' },
  { title: 'Deployment Oversight', desc: 'Strategic management of the path from blueprint to power-on.' },
];

export default function ExecutionPage() {
  return (
    <div className="pt-32 pb-24">
      {/* HERO */}
      <section className="container mx-auto px-6 mb-16 md:mb-24">
        <div className="max-w-4xl space-y-6 md:space-y-8">
          <div className="section-label">Execution</div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Neutral. <br />
            Disciplined. <br />
            <span className="text-orange-accent">Aligned.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            InfraX does not push inventory. We execute based on modeled feasibility.
          </p>
        </div>
      </section>

      {/* CORE CONTENT */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-navy uppercase tracking-tight">The Execution Standard</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Every execution decision is driven by InfraAlign™ outputs. We remove the bias of inventory-led
                  brokerage and replace it with physics-first validation.
                </p>
              </div>

              <div className="grid gap-8">
                {EXECUTION_STEPS.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-6 p-6 bg-white border border-slate-200 shadow-sm group hover:border-orange-accent transition-colors"
                  >
                    <div className="w-12 h-12 flex-shrink-0 bg-navy text-white flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-navy uppercase tracking-tight text-sm">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-32 space-y-8">
                <div className="p-12 bg-navy text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Target size={120} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight relative z-10">Execution Discipline</h3>
                  <p className="text-white/60 font-light leading-relaxed relative z-10">
                    &ldquo;Infrastructure is no longer about finding space. It is about validating deliverable power.
                    Our execution model ensures that capital is only deployed where physics permits.&rdquo;
                  </p>
                  <div className="pt-8 border-t border-white/10 flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-orange-accent flex items-center justify-center font-black">
                      IX
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest">InfraX Operations</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Global Execution Layer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
