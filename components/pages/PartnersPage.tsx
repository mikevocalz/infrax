import React from 'react';
import { Building2, ArrowUpRight, Globe2, Cpu, Shield } from 'lucide-react';

const PartnersPage: React.FC = () => {
  return (
    <div className="bg-white selection:bg-[#f37021] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale brightness-50"
          alt="Satellite Grid"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl space-y-10">
              <div className="space-y-4">
                <div className="section-label !text-orange-accent">Global Network</div>
                <h1 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                  STRATEGIC <br /><span className="text-orange-accent">ALLIANCES.</span>
                </h1>
              </div>
              
              <div className="pt-4">
                <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed max-w-2xl">
                  Integrating leading infrastructure and software providers to ensure seamless, end-to-end protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        {/* Global Partner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#002b5c]/10 border border-[#002b5c]/10 shadow-xl">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex flex-col items-center justify-center p-12 lg:p-20 bg-white hover:bg-[#f8fafc] transition-colors group grayscale hover:grayscale-0 relative">
              <Building2 className="w-12 h-12 text-[#64748b]/20 group-hover:text-[#002b5c] transition-colors mb-6" />
              <span className="font-black text-[10px] text-[#64748b]/40 group-hover:text-[#002b5c] uppercase tracking-[0.3em]">Tier 1 Provider {i}</span>
              <div className="absolute top-4 right-4 text-[8px] font-mono text-[#002b5c]/10 opacity-0 group-hover:opacity-100">VERIFIED_INFRAX_NODE</div>
            </div>
          ))}
        </div>

        {/* Partner Tiers */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#002b5c]/10 border border-[#002b5c]/10 shadow-2xl">
           <div className="p-12 lg:p-16 bg-white space-y-8 group">
              <Globe2 className="w-10 h-10 text-[#f37021]" />
              <h3 className="text-3xl font-black text-[#002b5c] uppercase tracking-tighter">Technology Partners</h3>
              <p className="text-[#64748b] font-light text-sm leading-relaxed">Integrate your security products with our SOC visibility platform to deliver superior outcomes for mutual clients.</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#002b5c] border-b-2 border-[#002b5c] pb-1 hover:text-[#f37021] hover:border-[#f37021] transition-all">Apply Now</button>
           </div>
           <div className="p-12 lg:p-16 bg-[#002b5c] text-white space-y-8 group">
              <Cpu className="w-10 h-10 text-[#f37021]" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">Infrastructure Partners</h3>
              <p className="text-white/60 font-light text-sm leading-relaxed">Work with us to secure the world's most critical data center and cloud infrastructure at scale.</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-white pb-1 hover:text-[#f37021] hover:border-[#f37021] transition-all">Collaborate</button>
           </div>
           <div className="p-12 lg:p-16 bg-white space-y-8 group">
              <Shield className="w-10 h-10 text-[#f37021]" />
              <h3 className="text-3xl font-black text-[#002b5c] uppercase tracking-tighter">Strategic Resellers</h3>
              <p className="text-[#64748b] font-light text-sm leading-relaxed">Join our tiered reseller program to offer industrial-grade SOC services to your existing portfolio.</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#002b5c] border-b-2 border-[#002b5c] pb-1 hover:text-[#f37021] hover:border-[#f37021] transition-all">Partner Portal</button>
           </div>
        </section>

        {/* Localized CTA for Partners */}
        <div className="bg-[#f8fafc] p-16 lg:p-24 border border-[#002b5c]/10 text-center space-y-10 relative overflow-hidden industrial-grid shadow-lg">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#002b5c]">Join the Network.</h2>
          <p className="text-[#64748b] max-w-xl mx-auto font-light text-lg">Partner with InfraX to deliver industrial-grade security to your global client base. Our resources are your resources.</p>
          <button className="px-16 py-6 btn-primary group flex items-center gap-4 mx-auto">
            Become a Partner
            <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;