import type { MatchResult } from '@/types';
import ScoreBar from '@/components/ui/ScoreBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { X, AlertTriangle, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

interface ScoreBreakdownProps {
  result: MatchResult;
  onClose: () => void;
}

const DIM_COLORS: Record<string, string> = {
  pass: 'text-emerald-600 bg-emerald-50',
  partial: 'text-amber-600 bg-amber-50',
  fail: 'text-red-600 bg-red-50',
};

export default function ScoreBreakdown({ result, onClose }: ScoreBreakdownProps) {
  const { candidate: c, fitScore, scoreBreakdown, highlights, risks, hardConstraintsMet, hardConstraintFlags, recommendation, dataConfidence, estimatedMonthlyKw } = result;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-navy text-white">
        <div className="space-y-1">
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Score Breakdown</div>
          <div className="font-black uppercase tracking-tight text-lg leading-tight">{c.name}</div>
          <div className="text-sm text-white/60">{c.market}, {c.state} — {c.operator}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-4xl font-black ${
              fitScore >= 80 ? 'text-emerald-400' :
              fitScore >= 65 ? 'text-blue-400' : 'text-amber-400'
            }`}>{fitScore}</div>
            <StatusBadge status={recommendation} />
          </div>
          <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white transition-colors mt-1">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hard constraints */}
        {!hardConstraintsMet && (
          <div className="p-4 bg-red-50 border-b border-red-100 space-y-2">
            <div className="flex items-center gap-2 text-red-700 text-xs font-black uppercase tracking-widest">
              <AlertTriangle size={14} /> Hard Constraint Failures
            </div>
            {hardConstraintFlags.map((f, i) => (
              <div key={i} className="text-xs text-red-600 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">×</span>{f}
              </div>
            ))}
          </div>
        )}

        {/* Dimension breakdown */}
        <div className="p-6 space-y-4 border-b border-slate-100">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Weighted Score Breakdown</div>
          {scoreBreakdown.map(dim => (
            <div key={dim.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-widest ${DIM_COLORS[dim.status]}`}>
                    {dim.status}
                  </span>
                  <span className="text-xs font-bold text-navy">{dim.label}</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-[10px] text-slate-400">w:{dim.weight}%</span>
                  <span className="text-xs font-black text-navy w-8">{dim.weightedScore}</span>
                </div>
              </div>
              <ScoreBar score={dim.rawScore} showLabel={false} size="sm" />
              <div className="text-[10px] text-slate-400 leading-relaxed">{dim.explanation}</div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Composite Fit Score</span>
            <span className="text-2xl font-black text-navy">{fitScore}<span className="text-sm text-slate-400">/100</span></span>
          </div>
        </div>

        {/* Data confidence */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Data Quality</div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600">Data Confidence</span>
            <span className="text-xs font-black text-navy">{dataConfidence}%</span>
          </div>
          <ScoreBar score={dataConfidence} showLabel={false} size="sm" colorOverride={dataConfidence >= 85 ? 'bg-emerald-500' : dataConfidence >= 70 ? 'bg-blue-500' : 'bg-amber-500'} />
          <div className="text-[10px] text-slate-400 mt-2">Last verified: {c.lastVerified}</div>
        </div>

        {/* Cost estimate */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
            <DollarSign size={10} /> Cost Estimate
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400">Rate</div>
              <div className="text-sm font-black text-navy">${c.costPerKwMonth}/kW/mo</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Est. Monthly</div>
              <div className="text-sm font-black text-navy">${(estimatedMonthlyKw / 1000).toFixed(0)}K</div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-3">
              <CheckCircle2 size={10} /> Highlights
            </div>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 mt-1.5 flex-shrink-0" />{h}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks */}
        {risks.length > 0 && (
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-600 mb-3">
              <TrendingUp size={10} /> Risk Factors
            </div>
            <div className="space-y-2">
              {risks.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />{r}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3">
        <button className="py-3 bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-accent transition-colors">
          Save Candidate
        </button>
        <button className="py-3 border border-navy text-navy text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
          Request Diligence
        </button>
      </div>
    </div>
  );
}
