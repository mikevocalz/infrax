'use client';

import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/constants';

export default function Services() {
  return (
    <section className="py-24 lg:py-32 bg-white industrial-grid" id="services">
      <div className="container mx-auto px-6">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <div className="section-label">Capabilities</div>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none mb-6">
              Securing the <br />Future of Scale.
            </h2>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              We provide the critical infrastructure intelligence required for modern AI-scale operations, ensuring your
              expansion is never limited by assumption.
            </p>
          </div>
          <button className="text-[11px] font-black uppercase tracking-[0.3em] text-navy border-b-2 border-navy pb-1 hover:text-[#f37021] hover:border-[#f37021] transition-all self-start">
            Full Service Portfolio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white p-12 lg:p-16 h-auto lg:h-[480px] flex flex-col justify-between overflow-hidden transition-all duration-500"
              >
                <div className="text-[10px] font-mono text-slate-400/40 group-hover:text-[#f37021] transition-colors mb-8 lg:mb-0">
                  [ SERVICE_ID: 0{idx + 1} ]
                </div>

                <div>
                  <div className="w-12 h-12 mb-8 flex items-center justify-center text-navy group-hover:text-[#f37021] transition-colors">
                    <Icon size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-navy uppercase tracking-tighter mb-4 leading-none">
                    {service.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light group-hover:text-navy transition-colors">
                    {service.description}
                  </p>
                </div>

                <div className="pt-10">
                  <button className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.2em] text-navy group-hover:text-[#f37021] transition-all">
                    <span>Explore Solution</span>
                    <div className="p-2 border border-navy group-hover:border-[#f37021] transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#f37021] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
