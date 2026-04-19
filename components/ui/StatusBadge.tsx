import type { MatchRecommendation, CandidateStatus, InterconnectStatus, DeliverableStatus } from '@/types';

type BadgeVariant = MatchRecommendation | CandidateStatus | InterconnectStatus | DeliverableStatus | 'high' | 'medium' | 'low' | 'critical';

const STYLES: Record<string, string> = {
  strong: 'bg-emerald-100 text-emerald-800',
  viable: 'bg-blue-100 text-blue-800',
  conditional: 'bg-amber-100 text-amber-800',
  disqualified: 'bg-red-100 text-red-800',
  available: 'bg-emerald-100 text-emerald-800',
  limited: 'bg-amber-100 text-amber-800',
  committed: 'bg-slate-100 text-slate-600',
  development: 'bg-purple-100 text-purple-800',
  operational: 'bg-emerald-100 text-emerald-800',
  approved: 'bg-blue-100 text-blue-800',
  pending: 'bg-amber-100 text-amber-800',
  queued: 'bg-red-100 text-red-800',
  complete: 'bg-emerald-100 text-emerald-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  blocked: 'bg-red-100 text-red-800',
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-emerald-100 text-emerald-800',
  critical: 'bg-red-900 text-red-100',
};

export default function StatusBadge({ status, label }: { status: BadgeVariant; label?: string }) {
  const cls = STYLES[status] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${cls}`}>
      {label ?? status.replace('-', ' ')}
    </span>
  );
}
