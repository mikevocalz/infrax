'use client';

import { useState } from 'react';
import type { MarketSignal, SignalCategory, SignalSeverity } from '@/types';
import { SIGNALS } from '@/lib/mock-data';
import StatusBadge from '@/components/ui/StatusBadge';
import TrendChart from './TrendChart';
import { Filter, ChevronDown, ChevronUp, ExternalLink, Bell } from 'lucide-react';

const CATEGORIES: { value: SignalCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Signals' },
  { value: 'GRID', label: 'Grid' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'CAPACITY', label: 'Capacity' },
  { value: 'PRICING', label: 'Pricing' },
  { value: 'SUPPLY', label: 'Supply' },
  { value: 'DEMAND', label: 'Demand' },
];

const SEVERITIES: { value: SignalSeverity | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Severity' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const SEV_COLORS: Record<SignalSeverity, string> = {
  High: 'border-l-red-500',
  Medium: 'border-l-amber-400',
  Low: 'border-l-blue-400',
};

function SignalCard({ signal }: { signal: MarketSignal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white border border-slate-200 border-l-4 ${SEV_COLORS[signal.severity]} transition-all`}>
      <button
        className="w-full text-left p-6"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={signal.severity.toLowerCase() as 'high' | 'medium' | 'low'} label={signal.severity} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5">{signal.category}</span>
              {signal.region && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{signal.region}</span>
              )}
              {signal.actionable && (
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5">Actionable</span>
              )}
            </div>
            <div className="font-black text-navy text-sm leading-snug">{signal.signal}</div>
            {!expanded && signal.impact && (
              <div className="text-xs text-slate-500 font-light leading-relaxed line-clamp-1">{signal.impact}</div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{signal.timestamp}</span>
            {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
          {signal.impact && (
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Analysis</div>
              <div className="text-sm text-slate-600 leading-relaxed">{signal.impact}</div>
            </div>
          )}
          {signal.provenance && (
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Source Provenance</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <ExternalLink size={10} />{signal.provenance}
              </div>
            </div>
          )}
          {signal.tags && signal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {signal.tags.map(t => (
                <span key={t} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">#{t}</span>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button className="px-4 py-2 bg-navy text-white text-[9px] font-black uppercase tracking-widest hover:bg-orange-accent transition-colors flex items-center gap-1.5">
              <Bell size={10} /> Watch Signal
            </button>
            <button className="px-4 py-2 border border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:border-navy transition-colors">
              Run Infra-Align™
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignalFeed() {
  const [category, setCategory] = useState<SignalCategory | 'ALL'>('ALL');
  const [severity, setSeverity] = useState<SignalSeverity | 'ALL'>('ALL');
  const [actionableOnly, setActionableOnly] = useState(false);

  const filtered = SIGNALS.filter(s => {
    if (category !== 'ALL' && s.category !== category) return false;
    if (severity !== 'ALL' && s.severity !== severity) return false;
    if (actionableOnly && !s.actionable) return false;
    return true;
  });

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 p-6 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-navy flex items-center gap-2">
            <Filter size={12} /> Filter Signals
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category</div>
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  category === c.value ? 'bg-navy text-white' : 'text-navy hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Severity</div>
            {SEVERITIES.map(s => (
              <button
                key={s.value}
                onClick={() => setSeverity(s.value)}
                className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  severity === s.value ? 'bg-navy text-white' : 'text-navy hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              checked={actionableOnly}
              onChange={e => setActionableOnly(e.target.checked)}
              className="accent-orange-400"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Actionable Only</span>
          </label>
        </div>

        <div className="bg-navy text-white p-6 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-accent">Signal Feed Status</div>
          {[
            { label: 'Confidence', val: '94%' },
            { label: 'Latency', val: '240ms' },
            { label: 'Active Signals', val: `${SIGNALS.length}` },
          ].map(stat => (
            <div key={stat.label} className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
              <span className="text-xs font-black">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main feed */}
      <div className="lg:col-span-9 space-y-6">
        <TrendChart />

        <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filtered.length} Signal{filtered.length !== 1 ? 's' : ''} — Active Stream
          </div>
          <div className="text-[10px] text-slate-400">Last updated: just now</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No signals match current filters.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(signal => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
