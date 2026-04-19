'use client';

import { useState } from 'react';
import { DILIGENCE_REPORTS } from '@/lib/mock-data';
import type { DiligenceReport, RiskFactor } from '@/types';
import ScoreBar from '@/components/ui/ScoreBar';
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react';

const ACTION_CONFIG = {
  proceed: { label: 'Proceed to LOI', color: 'bg-emerald-500 text-white', icon: CheckCircle2 },
  'proceed-with-conditions': { label: 'Proceed — Conditional', color: 'bg-orange-accent text-white', icon: AlertTriangle },
  defer: { label: 'Defer — More Data Needed', color: 'bg-yellow-500 text-white', icon: AlertTriangle },
  decline: { label: 'Decline', color: 'bg-red-500 text-white', icon: XCircle },
};

const RISK_COLORS: Record<string, string> = {
  low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  medium: 'bg-orange-50 border-orange-200 text-orange-700',
  high: 'bg-red-50 border-red-200 text-red-700',
  critical: 'bg-red-100 border-red-400 text-red-800',
};

const RISK_DOT: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-orange-500',
  high: 'bg-red-500',
  critical: 'bg-red-700',
};

function RiskCard({ risk }: { risk: RiskFactor }) {
  return (
    <div className={`p-4 border ${RISK_COLORS[risk.level]}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{risk.category}</div>
          <div className="font-black uppercase tracking-tight text-sm">{risk.title}</div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${RISK_DOT[risk.level]}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest">{risk.level}</span>
        </div>
      </div>
      <p className="text-xs font-light opacity-80 mb-3">{risk.description}</p>
      {risk.mitigations && risk.mitigations.length > 0 && (
        <div className="space-y-1">
          <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Mitigations</div>
          {risk.mitigations.map((m, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px]">
              <ArrowRight size={10} className="mt-0.5 flex-shrink-0" />
              <span>{m}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportDetail({ report }: { report: DiligenceReport }) {
  const action = ACTION_CONFIG[report.recommendedAction];
  const ActionIcon = action.icon;

  return (
    <div className="space-y-8">
      {/* Score overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
        {[
          { label: 'Feasibility', score: report.feasibilityScore },
          { label: 'Data Confidence', score: report.dataConfidence },
          { label: 'Power Deliverability', score: report.powerDeliverability },
          { label: 'Expansion Viability', score: report.expansionViability },
        ].map(({ label, score }) => (
          <div key={label} className="bg-white p-6 space-y-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</div>
            <div className="text-3xl font-black text-navy">{score}</div>
            <ScoreBar score={score} showLabel={false} />
          </div>
        ))}
      </div>

      {/* Highlights + red flags */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Highlights</div>
          </div>
          {report.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-emerald-800">
              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>
        <div className={`p-6 border space-y-3 ${report.redFlags.length ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <XCircle size={14} className={report.redFlags.length ? 'text-red-600' : 'text-slate-400'} />
            <div className={`text-[9px] font-black uppercase tracking-widest ${report.redFlags.length ? 'text-red-700' : 'text-slate-400'}`}>Red Flags</div>
          </div>
          {report.redFlags.length === 0 ? (
            <div className="text-xs text-slate-400 italic">No material red flags identified.</div>
          ) : report.redFlags.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-800">
              <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk factors */}
      <div>
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Risk Factors</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {report.riskFactors.map(r => <RiskCard key={r.id} risk={r} />)}
        </div>
      </div>

      {/* Underwriting summary */}
      <div className="p-6 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-orange-accent" />
            <div className="text-[9px] font-black uppercase tracking-widest text-orange-accent">Underwriting Summary</div>
          </div>
          <p className="text-sm text-white/80 font-light leading-relaxed">{report.underwritingSummary}</p>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Report Date:</div>
            <div className="text-[9px] font-mono text-white/60">{report.reportDate}</div>
          </div>
        </div>
      </div>

      {/* Recommended action */}
      <div className={`p-4 flex items-center justify-between ${action.color}`}>
        <div className="flex items-center gap-3">
          <ActionIcon size={18} />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest opacity-70">Recommended Action</div>
            <div className="font-black uppercase tracking-tight">{action.label}</div>
          </div>
        </div>
        <a href="/contact" className="px-6 py-2.5 bg-white/20 hover:bg-white/30 transition-colors font-black uppercase tracking-widest text-[9px]">
          Initiate
        </a>
      </div>
    </div>
  );
}

export default function CapitalPage() {
  const [selected, setSelected] = useState<DiligenceReport>(DILIGENCE_REPORTS[0]);

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl space-y-6">
          <div className="section-label">Capital</div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Capital <br />Requires <br />
            <span className="text-orange-accent">Validation.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            Infrastructure capital deployed without grid validation carries systemic risk. Every asset reviewed below
            is scored across feasibility, deliverability, and expansion viability before capital is exposed.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="container mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {[
            { value: `${DILIGENCE_REPORTS.length}`, label: 'Assets Under Review' },
            { value: '87', label: 'Avg Feasibility Score' },
            { value: '100%', label: 'Grid-First Methodology' },
            { value: '< 45 Days', label: 'Diligence Cycle' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white p-8">
              <div className="text-3xl font-black text-navy mb-1">{value}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Diligence dashboard */}
      <section className="container mx-auto px-6">
        <div className="mb-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Asset Diligence Dashboard</div>
          <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Active Coverage</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Asset list */}
          <div className="lg:w-72 flex-shrink-0 space-y-2">
            {DILIGENCE_REPORTS.map(r => {
              const isSelected = r.id === selected.id;
              const action = ACTION_CONFIG[r.recommendedAction];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left p-5 border transition-all ${isSelected ? 'border-navy bg-navy text-white shadow-lg' : 'border-slate-200 bg-white hover:border-navy/30'}`}
                >
                  <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-orange-accent' : 'text-slate-400'}`}>
                    {r.market}
                  </div>
                  <div className={`font-black uppercase tracking-tight text-sm mb-3 ${isSelected ? 'text-white' : 'text-navy'}`}>
                    {r.assetName}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isSelected ? 'text-white/50' : 'text-slate-400'}`}>Feasibility</div>
                      <div className={`text-xl font-black ${isSelected ? 'text-white' : 'text-navy'}`}>{r.feasibilityScore}</div>
                    </div>
                    <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest ${isSelected ? action.color : 'bg-slate-100 text-slate-600'}`}>
                      {action.label.split('—')[0].trim()}
                    </div>
                  </div>
                  {!isSelected && (
                    <div className="mt-3">
                      <ScoreBar score={r.feasibilityScore} showLabel={false} size="sm" />
                    </div>
                  )}
                </button>
              );
            })}

            <div className="p-5 border border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
              <TrendingUp size={20} className="mx-auto text-slate-300" />
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Submit Asset for Review</div>
              <a href="/contact" className="inline-block px-4 py-2 bg-navy text-white font-black uppercase tracking-widest text-[8px] hover:bg-orange-accent transition-colors">
                Request Diligence
              </a>
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            <div className="border border-navy bg-navy text-white px-6 py-3 flex items-center justify-between mb-0">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-orange-accent">{selected.market}</div>
                <div className="font-black uppercase tracking-tight">{selected.assetName}</div>
              </div>
              <div className="text-[9px] font-mono text-white/40">Report: {selected.reportDate}</div>
            </div>
            <div className="border border-t-0 border-slate-200 p-6">
              <ReportDetail report={selected} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 mt-16">
        <div className="p-10 bg-slate-50 border border-slate-200 grid sm:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-orange-accent">Capital Advisory</div>
            <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Commission an Asset Review</h3>
            <p className="text-slate-500 font-light text-sm leading-relaxed">
              Submit an asset for full technical diligence — utility interconnect analysis, deliverable MW verification,
              expansion feasibility, and underwriting summary.
            </p>
          </div>
          <div className="flex sm:justify-end">
            <a href="/contact" className="inline-block px-10 py-5 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-colors text-[10px]">
              Initiate Review
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
