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
  {
    label: 'Technology Partners',
    icon: Globe2,
    description:
      'Integrate your security products with our SOC visibility platform to deliver superior outcomes for mutual clients.',
    cta: 'Apply Now',
  },
  {
    label: 'Infrastructure Partners',
    icon: Cpu,
    description: "Work with us to secure the world's most critical data center and cloud infrastructure at scale.",
    cta: 'Collaborate',
    dark: true,
  },
  {
    label: 'Strategic Resellers',
    icon: Shield,
    description:
      'Join our tiered reseller program to offer industrial-grade SOC services to your existing portfolio.',
    cta: 'Partner Portal',
  },
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
              Integrating leading infrastructure and software providers to ensure seamless, end-to-end protection.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        {/* Partner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-navy/10 border border-navy/10 shadow-xl">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-12 lg:p-20 bg-white hover:bg-slate-50 transition-colors group relative"
            >
              <Building2 className="w-12 h-12 text-slate-200 group-hover:text-navy transition-colors mb-6" />
              <span className="font-black text-[10px] text-slate-300 group-hover:text-navy uppercase tracking-[0.3em]">
                Tier 1 Provider {i}
              </span>
              <div className="absolute top-4 right-4 text-[8px] font-mono text-navy/10 opacity-0 group-hover:opacity-100">
                VERIFIED_INFRAX_NODE
              </div>
            </div>
          ))}
        </div>

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
                <button
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 pb-1 transition-all hover:text-orange-accent hover:border-orange-accent ${
                    tier.dark ? 'text-white border-white' : 'text-navy border-navy'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-slate-50 p-16 lg:p-24 border border-navy/10 text-center space-y-10 relative overflow-hidden industrial-grid shadow-lg">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy">Join the Network.</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-light text-lg">
            Partner with InfraX to deliver industrial-grade security to your global client base. Our resources are your
            resources.
          </p>
          <button className="px-16 py-6 btn-primary group inline-flex items-center gap-4 mx-auto">
            Become a Partner
            <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
