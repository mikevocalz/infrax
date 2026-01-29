import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Radio } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white selection:bg-[#f37021]">
      <div className="container mx-auto px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-24 space-y-6">
            <div className="section-label">Contact</div>
            <h1 className="text-5xl md:text-9xl font-black text-navy uppercase tracking-tighter leading-none">
              REACH <br /><span className="text-[#f37021]">OUT.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-px bg-navy/10 border border-navy/10">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-10 lg:p-20">
              <h3 className="text-3xl font-black text-navy uppercase tracking-tighter mb-10">Request InfraAlign™ Match</h3>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Contact Name</label>
                    <input type="text" className="w-full border-b-2 border-navy/10 focus:border-[#f37021] bg-transparent py-3 outline-none transition-all font-light" placeholder="e.g. Jane Smith" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Operational Email</label>
                    <input type="email" className="w-full border-b-2 border-navy/10 focus:border-[#f37021] bg-transparent py-3 outline-none transition-all font-light" placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Deployment Pillar</label>
                  <select className="w-full border-b-2 border-navy/10 focus:border-[#f37021] bg-transparent py-3 outline-none transition-all font-light">
                    <option>Select Infrastructure Category</option>
                    <option>Data Center / Colocation</option>
                    <option>Power Availability / Substations</option>
                    <option>Connectivity / Dark Fiber</option>
                    <option>Cloud / Edge Nodes</option>
                    <option>Equipment Sourcing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Infrastructure Requirements</label>
                  <textarea rows={4} className="w-full border-b-2 border-navy/10 focus:border-[#f37021] bg-transparent py-3 outline-none transition-all font-light resize-none" placeholder="Describe your constraints (Power, Latency, Region)..." />
                </div>
                <button className="px-12 py-6 btn-primary w-full md:w-auto flex items-center justify-center gap-3">
                  Initiate Alignment
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-px">
              <div className="p-12 lg:p-16 bg-navy text-white space-y-8">
                <Radio className="w-10 h-10 text-[#f37021]" />
                <h4 className="text-2xl font-black uppercase tracking-tighter">Market Intelligence</h4>
                <p className="text-white/50 text-sm font-light leading-relaxed">For urgent market signal inquiries or partner-side access, please contact our strategic operations team.</p>
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-5">
                    <Phone className="w-5 h-5 text-[#f37021]" />
                    <span className="font-bold text-lg">1-800-INFRAX</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <Mail className="w-5 h-5 text-[#f37021]" />
                    <span className="font-bold text-lg">info@infrax.com</span>
                  </div>
                </div>
              </div>
              <div className="p-12 lg:p-16 bg-slate-50 space-y-8 industrial-grid">
                <MapPin className="w-10 h-10 text-navy" />
                <h4 className="text-2xl font-black text-navy uppercase tracking-tighter">Strategic HQ</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  Decisions Predictable Blvd<br />
                  Sovereign Hub, USA
                </p>
                <div className="aspect-video bg-slate-200 border border-navy/5 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale" alt="HQ" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-4 h-4 bg-[#f37021] rounded-full animate-ping" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
