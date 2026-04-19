interface ScoreBarProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  colorOverride?: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 65) return 'bg-blue-500';
  if (score >= 45) return 'bg-orange-accent';
  return 'bg-red-500';
}

export default function ScoreBar({ score, size = 'md', showLabel = true, colorOverride }: ScoreBarProps) {
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2';
  const color = colorOverride ?? scoreColor(score);
  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Score</span>
          <span className="text-xs font-black text-navy">{score}</span>
        </div>
      )}
      <div className={`w-full ${h} bg-slate-100 overflow-hidden`}>
        <div
          className={`${h} ${color} transition-all duration-700`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}
