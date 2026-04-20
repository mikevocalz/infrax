import { LEADERSHIP } from '@/constants';
import { Mail, Linkedin, User } from 'lucide-react';

const DOMAIN_MAP: Record<string, string[]> = {
  'Founder | Data Center Strategy & Development': ['Site Selection', 'Mandate Architecture', 'Operator Networks', 'Feasibility Scoping'],
  'Co-Founder | Strategy & Infrastructure Advisory': ['AI Governance', 'Capital Advisory', 'Regulatory Strategy', 'Board Advisory'],
};

const BACKGROUND_MAP: Record<string, string[]> = {
  'Founder | Data Center Strategy & Development': ['30+ Years Data Center Executive Leadership', 'Infrastructure Commercialization', 'Hyperscale Site Development'],
  'Co-Founder | Strategy & Infrastructure Advisory': ['20+ Years Enterprise Technology Strategy', 'Public Sector Advisory', 'AI Infrastructure Economics'],
};

const OPERATING_MODEL = [
  {
    step: '01',
    title: 'Intelligence-First',
    description: 'Every engagement begins with modeling — not inventory. We validate physics before capital moves.',
  },
  {
    step: '02',
    title: 'Operator-Agnostic',
    description: 'We carry no vendor bias. Candidates are scored on deliverable megawatts, not relationships.',
  },
  {
    step: '03',
    title: 'Enforced Accountability',
    description: 'SLAs are written with enforcement mechanisms. Delivery standards are not negotiated down.',
  },
  {
    step: '04',
    title: 'Direct Specialist Access',
    description: 'Founders lead each engagement. No account manager layer between clients and decision-makers.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center bg-navy overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="Office"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-orange-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-accent">
                Founding Principles
              </span>
            </div>
            <h1
              className="text-white font-black uppercase tracking-tighter leading-none"
              style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
            >
              INFRAX <br />
              <span className="text-orange-accent">LEADERSHIP.</span>
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl">
              Built by operators and strategists who have deployed infrastructure at scale — and learned what breaks.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24 lg:py-40 space-y-32">
        {/* Leadership Grid */}
        <div>
          <div className="mb-12">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Founding Team</div>
            <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Decision-Domain Ownership</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {LEADERSHIP.map((leader) => {
              const domains = DOMAIN_MAP[leader.role] ?? leader.expertise;
              const background = BACKGROUND_MAP[leader.role] ?? [];
              return (
                <div
                  key={leader.name}
                  className="bg-slate-50 border border-navy/5 flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="bg-navy text-white p-8 flex items-start gap-6">
                    <div className="w-16 h-16 bg-orange-accent flex items-center justify-center flex-shrink-0">
                      <User size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                        {leader.name}
                      </h3>
                      <div className="text-[10px] font-bold text-orange-accent uppercase tracking-[0.2em] leading-tight">
                        {leader.role}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex-1 space-y-6">
                    <p className="text-base text-slate-500 font-light leading-relaxed">{leader.bio}</p>

                    {/* Decision domains */}
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Decision Domains</div>
                      <div className="grid grid-cols-2 gap-2">
                        {domains.map((domain) => (
                          <div key={domain} className="px-3 py-2 bg-navy text-white text-[9px] font-bold uppercase tracking-widest">
                            {domain}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expertise tags */}
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Expertise</div>
                      <div className="flex flex-wrap gap-2">
                        {leader.expertise.map((exp) => (
                          <span key={exp} className="px-3 py-1 border border-slate-200 text-navy text-[9px] font-bold uppercase tracking-widest">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Background */}
                    {background.length > 0 && (
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Background</div>
                        <div className="space-y-1.5">
                          {background.map((b) => (
                            <div key={b} className="flex items-start gap-2 text-xs text-slate-600">
                              <div className="w-1 h-1 rounded-full bg-orange-accent mt-1.5 flex-shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-8 pb-8 pt-4 border-t border-navy/5 flex gap-6">
                    <button className="text-navy hover:text-orange-accent transition-colors" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </button>
                    <button className="text-navy hover:text-orange-accent transition-colors" aria-label="Email">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Model */}
        <section>
          <div className="mb-12">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">How We Work</div>
            <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">Operating Model</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
            {OPERATING_MODEL.map((item) => (
              <div key={item.step} className="bg-white p-8 space-y-4 hover:bg-slate-50 transition-colors">
                <div className="text-4xl font-black text-slate-100">{item.step}</div>
                <h3 className="font-black text-navy uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Heritage */}
        <section className="relative p-8 sm:p-12 lg:p-24 bg-slate-50 overflow-hidden border border-navy/5 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475"
            className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale"
            alt=""
          />
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <div className="space-y-8">
              <div className="section-label">Our Position</div>
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                Truth Over <br />Inventory.
              </h2>
              <p className="text-lg sm:text-xl text-slate-500 font-light leading-relaxed max-w-xl">
                InfraX was built on a single premise: the gap between theoretical capacity and deliverable megawatts
                is where infrastructure capital is lost. We close that gap.
              </p>
              <a href="/contact" className="inline-block px-10 py-5 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-colors text-[10px]">
                Start an Engagement
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                { val: 'Signal', label: 'Intelligence Focus' },
                { val: 'Agnostic', label: 'Market Advice' },
                { val: 'Enforced', label: 'SLA Accountability' },
                { val: 'Direct', label: 'Specialist Access' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center p-6 bg-white border border-navy/10 aspect-square shadow-xl group hover:bg-navy transition-all duration-300 overflow-hidden"
                >
                  <div className="text-left w-full">
                    <div className="text-xl font-black text-navy group-hover:text-orange-accent tracking-tighter uppercase transition-colors duration-300 leading-none mb-3 break-words">
                      {stat.val}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] group-hover:text-white/70 transition-colors duration-300 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
