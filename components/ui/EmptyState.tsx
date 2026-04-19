import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6">
      <div className="w-16 h-16 bg-slate-100 flex items-center justify-center">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-black text-navy uppercase tracking-tight">{title}</div>
        <div className="text-xs text-slate-400 font-light leading-relaxed max-w-xs">{description}</div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-accent transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
