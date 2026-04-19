import type { MatchResult } from '@/types';
import ScoreBar from '@/components/ui/ScoreBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Zap, Clock, Shield } from 'lucide-react';

interface CandidateCardProps {
  result: MatchResult;
  selected?: boolean;
  onSelect: (result: MatchResult) => void;
}

const REC_COLORS: Record<string, string> = {
  strong: 'border-l-emerald-500',
  viable: 'border-l-blue-500',
  conditional: 'border-l-amber-400',
  disqualified: 'border-l-red-400',
};

export default function CandidateCard({ result, selected, onSelect }: CandidateCardProps) {
  const { candidate: c, fitScore, recommendation, dataConfidence, highlights } = result;
  const borderColor = REC_COLORS[recommendation] ?? 'border-l-slate-200';

  return (
    <button
      onClick={() => onSelect(result)}
      className={`w-full text-left border-l-4 ${borderColor} border border-slate-200 bg-white p-6 transition-all group hover:shadow-md ${
        selected ? 'ring-2 ring-navy shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0 flex-1">
          <div className="font-black text-navy uppercase tracking-tight text-sm leading-tight">{c.name}</div>
          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
            <MapPin size={10} />
            <span className="text-[10px] font-medium">{c.market}, {c.state}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-black ${
            fitScore >= 80 ? 'text-emerald-600' :
            fitScore >= 65 ? 'text-blue-600' :
            fitScore >= 45 ? 'text-amber-600' : 'text-red-500'
          }`}>{fitScore}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fit</div>
        </div>
      </div>

      <div className="mb-4">
        <ScoreBar score={fitScore} showLabel={false} size="sm" />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <StatusBadge status={recommendation} />
        <StatusBadge status={c.interconnectStatus} label={`Grid: ${c.interconnectStatus}`} />
        {c.offMarket && (
          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-purple-100 text-purple-800">Off-Market</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-100 pt-4">
        <div>
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1"><Zap size={10} /><span className="text-[8px] uppercase tracking-widest font-bold">Power</span></div>
          <div className="text-xs font-black text-navy">{c.deliverableMW}MW</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1"><Clock size={10} /><span className="text-[8px] uppercase tracking-widest font-bold">Timeline</span></div>
          <div className="text-xs font-black text-navy">{c.availableMonths}mo</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1"><Shield size={10} /><span className="text-[8px] uppercase tracking-widest font-bold">Conf.</span></div>
          <div className="text-xs font-black text-navy">{dataConfidence}%</div>
        </div>
      </div>

      {highlights.length > 0 && (
        <div className="mt-4 space-y-1">
          {highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
              <div className="w-1 h-1 bg-orange-accent flex-shrink-0" />
              {h}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
