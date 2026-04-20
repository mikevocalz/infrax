import ScenarioBuilder from '@/components/features/platform/ScenarioBuilder';

export default function PlatformPage() {
  return (
    <div className="flex flex-col bg-slate-50" style={{ height: 'calc(100vh - 72px)', marginTop: '72px' }}>
      {/* Product header bar */}
      <div className="bg-navy text-white px-6 py-3 flex items-center justify-between border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-accent animate-pulse" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Infra-Align™ v1.0</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Modeling Environment</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>7 Candidates</span>
          <span>·</span>
          <span>Live Data</span>
        </div>
      </div>

      {/* Full-height builder */}
      <div className="flex-1 overflow-hidden">
        <ScenarioBuilder />
      </div>
    </div>
  );
}
