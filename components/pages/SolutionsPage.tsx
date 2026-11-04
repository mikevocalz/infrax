import Link from 'next/link';
import { ShieldCheck, HeartPulse, Building, ShoppingBag, Landmark, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Industry {
  title: string;
  icon: LucideIcon;
  iconClass: string;
  description: string;
  metrics: string[];
}

const INDUSTRIES: Industry[] = [
{title:'AI / HPC Enterprises',icon:HeartPulse,iconClass:'w-12 h-12 text-orange-accent',description:'Assess power, GPU density, cooling feasibility, timing and network diversity against real constraints.',metrics:['IT MW and delivered power','Cooling and network requirements','Evidence-backed candidate evaluation']},
{title:'Data Center Developers',icon:Building,iconClass:'w-12 h-12 text-navy',description:'Evaluate planned facilities, secured utility service, permits and authorized capacity-offer details.',metrics:['Site feasibility','Capacity attestations','Market and grid screening']},
{title:'Infrastructure Investors',icon:Landmark,iconClass:'w-12 h-12 text-orange-accent',description:'Review power rights, commercial assumptions and project milestones before capital commitments.',metrics:['Utility diligence','Development risk review','Assumptions and source register']},
{title:'Public Sector',icon:ShoppingBag,iconClass:'w-12 h-12 text-navy',description:'Understand energy, land, resilience and economic-development tradeoffs within local regulatory settings.',metrics:['Grid and land screening','Infrastructure policy research','Stakeholder planning']}
];
export default function SolutionsPage() {
  return (
    <div className="pt-40 bg-white">
      <div className="container mx-auto px-6 space-y-32 mb-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-20 items-end max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="section-label">Infrastructure Applications</div>
            <h1 className="text-5xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
              INDUSTRY <br />
              <span className="text-orange-accent">SOLUTIONS.</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed">
            Infrastructure decisions change by buyer and use case. Choose the feasibility and advisory path aligned with your goals.
          </p>
        </div>

        {/* Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.title}
                className="bg-white p-12 lg:p-16 hover:bg-slate-50 transition-all group border-b md:border-b-0 border-navy/5"
              >
                <div className="mb-10">
                  <Icon className={industry.iconClass} />
                </div>
                <h3 className="text-3xl font-black text-navy uppercase tracking-tighter mb-6">{industry.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed mb-10 text-lg">{industry.description}</p>

                <div className="space-y-3 mb-12">
                  {industry.metrics.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-navy"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-accent flex-shrink-0" />
                      {m}
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.2em] text-navy group-hover:text-orange-accent transition-all border-t border-navy/10 pt-8">
                  <span>Discuss Feasibility</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Zero-Trust Feature */}
        <section className="bg-navy text-white p-12 lg:p-24 relative overflow-hidden industrial-grid-dark">
          <div className="max-w-4xl relative z-10 space-y-8">
            <ShieldCheck className="w-16 h-16 text-orange-accent" />
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              Evidence-Led <br />Decisions.
            </h2>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              Public grid data is not proof of sellable capacity. InFraX separates reported indicators from confirmed operator offers and unresolved feasibility risks.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
              {['Power', 'Cooling', 'Location', 'Delivery'].map((item) => (
                <div key={item}>
                  <div className="text-2xl font-black text-white">{item}</div>
                  <div className="text-[10px] text-orange-accent font-bold uppercase mt-2">Evaluated</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
