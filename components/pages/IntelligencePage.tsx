import React from 'react';
import { TICKER_SIGNALS } from '../../constants';
import { AlertTriangle, TrendingUp, Info, Zap } from 'lucide-react';

const IntelligencePage: React.FC = () => {
  return (
    <div className="pt-40 bg-navy text-white min-h-screen selection:bg-[#f37021]">
      <div className="container mx-auto px-6 pb-32">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="section-label !text-[#f37021]">Market Intelligence Ticker</div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Live <br />Signals.
            </h1>
          </div>
          <p className="text-xl text-white/40 font-light max-w-sm">
            Curated market signals across data center capacity, power availability, and regional demand spikes.
          </p>
        </div>

        {/* The Live Ticker Visualizer */}
        <div className="mb-24 relative bg-black/40 border border-white/10 p-4 overflow-hidden rounded-sm group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f37021] to-transparent" />
          <div className="flex gap-12 animate-[shimmer_30s_linear_infinite] whitespace-nowrap">
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
        <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {/* Section: Now Trending */}
          <div className="p-12 space-y-10 group bg-navy hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <TrendingUp className="text-[#f37021]" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Now Trending</h3>
            </div>
            <ul className="space-y-8">
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Regional Bottlenecks</div>
                <p className="text-sm text-white/50 leading-relaxed">Northern Virginia grid capacity reaching 98% commitment through 2027.</p>
              </li>
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Cooling Shifts</div>
                <p className="text-sm text-white/50 leading-relaxed">Adoption of direct-to-chip liquid cooling surfacing as mandatory spec for tier-1 builds.</p>
              </li>
            </ul>
          </div>

          {/* Section: Deal Signals */}
          <div className="p-12 space-y-10 group bg-navy hover:bg-white/5 transition-colors border-x border-white/10">
            <div className="flex items-center gap-4">
              <Zap className="text-[#f37021]" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Deal Signals</h3>
            </div>
            <ul className="space-y-8">
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Quiet Capacity</div>
                <p className="text-sm text-white/50 leading-relaxed">Sub-10MW chunks surfacing in Dallas and Phoenix markets as tenants consolidate.</p>
              </li>
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Partner Side</div>
                <p className="text-sm text-white/50 leading-relaxed">Hyperscale-adjacent shells identified with utility approval locked.</p>
              </li>
            </ul>
          </div>

          {/* Section: Operational Alerts */}
          <div className="p-12 space-y-10 group bg-navy hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-[#f37021]" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Operational Alerts</h3>
            </div>
            <ul className="space-y-8">
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Utility Delays</div>
                <p className="text-sm text-white/50 leading-relaxed">Transformer lead times easing slightly but substation permitting remains stagnant.</p>
              </li>
              <li className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#f37021]">Equipment Risks</div>
                <p className="text-sm text-white/50 leading-relaxed">Switchgear delivery windows hitting 50+ weeks for standard configurations.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Insight Bar */}
        <div className="mt-24 p-10 bg-white/5 border border-[#f37021]/30 flex items-start gap-6 relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-[#f37021] text-xs font-black uppercase tracking-widest">InFraX AI Summary</div>
          <Info className="w-8 h-8 text-[#f37021] flex-shrink-0 mt-1" />
          <p className="text-lg text-white/80 font-light leading-relaxed">
            Market transition is accelerating. Supply-side constraints are moving from space to power-ready shells. Regional focus is shifting toward secondary metros with utility headroom over primary saturated hubs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePage;