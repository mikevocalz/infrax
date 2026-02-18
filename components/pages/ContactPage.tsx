import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Radio, Server, ShieldCheck } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white selection:bg-orange-accent">
      <div className="container mx-auto px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-24 space-y-6">
            <div className="section-label">Operational Intake</div>
            <h1 className="text-5xl md:text-9xl font-black text-navy uppercase tracking-tighter leading-none">
              SECURE <br /><span className="text-orange-accent">ACCESS.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-px bg-navy/10 border border-navy/10 shadow-2xl">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-12 lg:p-24">
              <div className="flex items-center gap-4 mb-12">
                <ShieldCheck className="text-orange-accent w-8 h-8" />
                <h3 className="text-3xl font-black text-navy uppercase tracking-tighter">Initiate Audit</h3>
              </div>
              
              <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engineering Lead</label>
                    <input type="text" className="w-full border-b border-navy/10 focus:border-orange-accent bg-transparent py-3 outline-none transition-all font-light placeholder:text-slate-300" placeholder="Full Name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enterprise Domain</label>
                    <input type="email" className="w-full border-b border-navy/10 focus:border-orange-accent bg-transparent py-3 outline-none transition-all font-light placeholder:text-slate-300" placeholder="work@company.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Solution Pillar</label>
                  <select className="w-full border-b border-navy/10 focus:border-orange-accent bg-transparent py-3 outline-none transition-all font-light appearance-none text-navy">
                    <option>HPC / AI Architecture Blueprinting</option>
                    <option>Utility & Power Governance Audit</option>
                    <option>Global Edge Mesh Topology Review</option>
                    <option>Independent SLA Verification</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Constraints</label>
                  <textarea rows={4} className="w-full border-b border-navy/10 focus:border-orange-accent bg-transparent py-3 outline-none transition-all font-light resize-none placeholder:text-slate-300" placeholder="MW requirements, Latency thresholds, Regional focus..." />
                </div>
                <button className="px-16 py-6 btn-primary w-full md:w-auto flex items-center justify-center gap-4">
                  Request Technical Review
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-px">
              <div className="p-16 bg-navy text-white space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Server size={120} /></div>
                <Radio className="w-12 h-12 text-orange-accent" />
                <h4 className="text-3xl font-black uppercase tracking-tighter">Command Center</h4>
                <p className="text-white/50 text-base font-light leading-relaxed">For immediate technical escalation or partner-mesh inquiries, use our verified channels.</p>
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-6 group">
                    <div className="p-3 border border-white/10 group-hover:border-orange-accent transition-colors">
                      <Phone className="w-6 h-6 text-orange-accent" />
                    </div>
                    <span className="font-black text-xl tracking-tighter group-hover:text-orange-accent transition-colors">1-800-INFRAX-GOV</span>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="p-3 border border-white/10 group-hover:border-orange-accent transition-colors">
                      <Mail className="w-6 h-6 text-orange-accent" />
                    </div>
                    <span className="font-black text-xl tracking-tighter group-hover:text-orange-accent transition-colors">ops@infrax.com</span>
                  </div>
                </div>
              </div>
              <div className="p-16 bg-slate-50 space-y-10 industrial-grid relative group">
                <MapPin className="w-12 h-12 text-navy" />
                <h4 className="text-3xl font-black text-navy uppercase tracking-tighter">Strategic HQ</h4>
                <div className="aspect-video bg-navy relative overflow-hidden shadow-xl">
                   {/* FIXED HIGH-RES HQ IMAGE */}
                   <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" 
                    alt="Corporate HQ" 
                   />
                   <div className="absolute inset-0 bg-navy/20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-6 h-6 bg-orange-accent rounded-full animate-ping shadow-[0_0_20px_#f37021]" />
                     <div className="absolute w-2 h-2 bg-orange-accent rounded-full" />
                   </div>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                  Infrastructure Way, Suite 400<br />
                  Global Grid District, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;