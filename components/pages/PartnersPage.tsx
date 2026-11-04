import Link from 'next/link';
import { Building2, ArrowUpRight, Globe2, Cpu, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PartnerTier {
  label: string;
  icon: LucideIcon;
  description: string;
  cta: string;
  dark?: boolean;
}

const PARTNER_TIERS: PartnerTier[] = [
 {label:'Operators & Colocation',icon:Globe2,description:'Submit permissioned capacity, service specifications and supporting verification documents for analyst review.',cta:'Submit Inventory'},
 {label:'Developers & Utilities',icon:Cpu,description:'Share site plans, utility studies and commissioning assumptions under controlled access.',cta:'Discuss a Project',dark:true},
 {label:'Research & Technology',icon:Shield,description:'Discuss licensed data feeds, provenance and approved infrastructure research partnerships.',cta:'Propose Collaboration'},
];
export default function PartnersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[65vh] flex items-center bg-navy overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale brightness-50"
          alt="Satellite Grid"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl space-y-10">
            <div className="space-y-4">
              <div className="section-label !text-orange-accent">Global Network</div>
              <h1 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                STRATEGIC <br />
                <span className="text-orange-accent">ALLIANCES.</span>
              </h1>
            </div>
            <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed max-w-2xl">
              A permissioned infrastructure network of operators, developers, and data partners. No unverified logos or capacity claims.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        {/* Partner profiles are published only with operator permission. */}
        <div className="p-8 border border-slate-200 text-sm text-slate-600 bg-slate-50">We publish approved partner identities only after verification and consent. Ask about the operator program below.</div>
        {/* Partner Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10 shadow-2xl">
          {PARTNER_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.label}
                className={`p-12 lg:p-16 space-y-8 ${tier.dark ? 'bg-navy text-white' : 'bg-white'}`}
              >
                <Icon className="w-10 h-10 text-orange-accent" />
                <h3
                  className={`text-3xl font-black uppercase tracking-tighter ${
                    tier.dark ? 'text-white' : 'text-navy'
                  }`}
                >
                  {tier.label}
                </h3>
                <p className={`font-light text-sm leading-relaxed ${tier.dark ? 'text-white/60' : 'text-slate-500'}`}>
                  {tier.description}
                </p>
                <Link href="/contact"
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 pb-1 transition-all hover:text-orange-accent hover:border-orange-accent ${
                    tier.dark ? 'text-white border-white' : 'text-navy border-navy'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-slate-50 p-16 lg:p-24 border border-navy/10 text-center space-y-10 relative overflow-hidden industrial-grid shadow-lg">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy">Join the Network.</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-light text-lg">
            Participate in source-backed feasibility assessments and trusted capacity matching. Commercial details remain restricted until authorized.
          </p>
          <Link href="/contact" className="px-16 py-6 btn-primary group inline-flex items-center gap-4 mx-auto">
            Become a Partner
            <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
