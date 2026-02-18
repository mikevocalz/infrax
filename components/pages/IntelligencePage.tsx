import React from 'react';
import { TICKER_SIGNALS } from '../../constants';
import { AlertTriangle, TrendingUp, Info, Zap } from 'lucide-react';

const IntelligencePage: React.FC = () => {
  return (
    <div className="bg-navy text-white min-h-screen selection:bg-[#f37021]">
      {/* Hero Header */}
      <section className="relative h-[50vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50"
          alt="Satellite Data"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 max-w-6xl">
            <div className="max-w-3xl space-y-6">
              <div className="section-label !text-[#f37021]">Operational Telemetry</div>
              <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                Live <br />Signals.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24 space-y-24">
        {/* The Live Ticker Visualizer */}
        <div className="relative bg-black border border-white/10 p-6 overflow-hidden rounded-sm group shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f37021] to-transparent" />
          <div className="flex gap-12 animate-[shimmer_45s_linear_infinite] whitespace-nowrap">
            {[...TICKER_SIGNALS, ...TICKER_SIGNALS].map((s, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/10 text-[#f37021]">{s.category}</span>
                <span className="text-xs font-mono text-white/80">{s.signal}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Ticker Sections Grid */}
        <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10 shadow-2xl">
          {[
            { 
              title: "Now Trending", 
              icon: <TrendingUp className="text-[#f37021]" />, 
              img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
              items: [
                { label: "Regional Bottlenecks", desc: "Northern Virginia grid capacity committed through 2027." },
                { label: "Cooling Shifts", desc: "Direct-to-chip liquid cooling now mandatory spec." }
              ]
            },
            { 
              title: "Deal Signals", 
              icon: <Zap className="text-[#f37021]" />, 
              img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
              items: [
                { label: "Quiet Capacity", desc: "Sub-10MW chunks surfacing in Dallas and Phoenix." },
                { label: "Partner Side", desc: "Hyperscale-adjacent shells identified with utility approval locked." }
              ]
            },
            { 
              title: "Operational Alerts", 
              icon: <AlertTriangle className="text-[#f37021]" />, 
              img: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
              items: [
                { label: "Utility Delays", desc: "Transformer lead times easing but substation permitting remains stagnant." },
                { label: "Equipment Risks", desc: "Switchgear delivery windows hitting 50+ weeks." }
              ]
            }
          ].map((sec, i) => (
            <div key={i} className="relative p-12 space-y-10 group overflow-hidden bg-navy">
              <img src={sec.img} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-30 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  {sec.icon}
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{sec.title}</h3>
                </div>
                <ul className="space-y-8">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">{item.label}</div>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Bar */}
        <div className="p-12 bg-white/5 border border-[#f37021]/30 flex items-start gap-8 relative overflow-hidden">
           <img src="https://images.unsplash.com/photo-1591453089816-0fbb971b454c" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale brightness-50" />
           <div className="relative z-10 flex gap-8">
            <Info className="w-10 h-10 text-[#f37021] flex-shrink-0" />
            <p className="text-xl text-white/90 font-light leading-relaxed">
              Market transition is accelerating. Supply-side constraints are moving from space to power-ready shells. Regional focus is shifting toward secondary metros with utility headroom over primary saturated hubs.
            </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePage;