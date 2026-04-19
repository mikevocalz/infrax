'use client';

import { useState, useMemo } from 'react';
import type { InfraRequirement, MatchResult, CoolingType, TierLevel } from '@/types';
import { runScoring, DEFAULT_REQUIREMENT } from '@/lib/scoring';
import CandidateCard from './CandidateCard';
import ScoreBreakdown from './ScoreBreakdown';
import EmptyState from '@/components/ui/EmptyState';
import { Search, SlidersHorizontal, ChevronDown, RotateCcw, Play } from 'lucide-react';

const REGIONS = [
  { code: 'NOVA', label: 'Northern Virginia' },
  { code: 'CMH', label: 'Columbus, OH' },
  { code: 'DFW', label: 'Dallas-Fort Worth' },
  { code: 'CHI', label: 'Chicago, IL' },
  { code: 'ATL', label: 'Atlanta, GA' },
  { code: 'PDX', label: 'Portland, OR' },
  { code: 'PHX', label: 'Phoenix, AZ' },
];

const CERTS = ['SOC2', 'ISO27001', 'PCI-DSS', 'HIPAA'];
const COOLING_OPTIONS: { value: CoolingType; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'immersion', label: 'Immersion' },
  { value: 'air', label: 'Air' },
];
const WEIGHT_KEYS: { key: keyof InfraRequirement['weights']; label: string }[] = [
  { key: 'power', label: 'Power Deliverability' },
  { key: 'location', label: 'Location Match' },
  { key: 'timeline', label: 'Timeline Fit' },
  { key: 'cooling', label: 'Cooling Fit' },
  { key: 'cost', label: 'Cost Efficiency' },
  { key: 'expansion', label: 'Expansion Viability' },
];

type SortKey = 'fitScore' | 'dataConfidence' | 'costPerKwMonth' | 'availableMonths';

export default function ScenarioBuilder() {
  const [req, setReq] = useState<InfraRequirement>({ ...DEFAULT_REQUIREMENT });
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selected, setSelected] = useState<MatchResult | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('fitScore');
  const [mobileView, setMobileView] = useState<'form' | 'results'>('form');

  const totalWeight = useMemo(
    () => Object.values(req.weights).reduce((a, b) => a + b, 0),
    [req.weights]
  );

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortBy === 'fitScore') return b.fitScore - a.fitScore;
      if (sortBy === 'dataConfidence') return b.dataConfidence - a.dataConfidence;
      if (sortBy === 'costPerKwMonth') return a.candidate.costPerKwMonth - b.candidate.costPerKwMonth;
      if (sortBy === 'availableMonths') return a.candidate.availableMonths - b.candidate.availableMonths;
      return 0;
    });
  }, [results, sortBy]);

  function runAnalysis() {
    const r = runScoring(req);
    setResults(r);
    setSelected(null);
    setHasRun(true);
    setMobileView('results');
  }

  function updateWeight(key: keyof InfraRequirement['weights'], val: number) {
    setReq(prev => ({ ...prev, weights: { ...prev.weights, [key]: Math.max(0, Math.min(100, val)) } }));
  }

  function toggleRegion(code: string) {
    setReq(prev => ({
      ...prev,
      geography: prev.geography.includes(code)
        ? prev.geography.filter(r => r !== code)
        : [...prev.geography, code],
    }));
  }

  function toggleCert(cert: string) {
    setReq(prev => ({
      ...prev,
      requiredCertifications: prev.requiredCertifications.includes(cert)
        ? prev.requiredCertifications.filter(c => c !== cert)
        : [...prev.requiredCertifications, cert],
    }));
  }

  const strongCount = results.filter(r => r.recommendation === 'strong').length;
  const viableCount = results.filter(r => r.recommendation === 'viable').length;

  // ── Sidebar form ─────────────────────────────────────────────────────────────
  const FormPanel = (
    <div className="flex flex-col h-full overflow-hidden bg-white border-r border-slate-200">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Scenario Builder</div>
        <input
          className="w-full text-sm font-black text-navy bg-transparent border-b border-slate-200 focus:border-orange-accent outline-none py-1"
          value={req.name}
          onChange={e => setReq(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {/* Hard Constraints */}
        <section className="space-y-5">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <div className="w-3 h-px bg-orange-accent" /> Hard Constraints
          </div>

          {/* Power */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy">Power Required (MW)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[9px] text-slate-400 mb-1">Minimum</div>
                <input
                  type="number" min={1} max={500} value={req.powerMinMW}
                  onChange={e => setReq(prev => ({ ...prev, powerMinMW: Number(e.target.value) }))}
                  className="w-full border border-slate-200 px-3 py-2 text-sm font-black text-navy focus:border-orange-accent outline-none"
                />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 mb-1">Maximum</div>
                <input
                  type="number" min={1} max={1000} value={req.powerMaxMW}
                  onChange={e => setReq(prev => ({ ...prev, powerMaxMW: Number(e.target.value) }))}
                  className="w-full border border-slate-200 px-3 py-2 text-sm font-black text-navy focus:border-orange-accent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-navy">Timeline</label>
              <span className="text-[10px] font-black text-orange-accent">{req.timelineMonths} months</span>
            </div>
            <input
              type="range" min={3} max={36} value={req.timelineMonths}
              onChange={e => setReq(prev => ({ ...prev, timelineMonths: Number(e.target.value) }))}
              className="w-full accent-orange-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>3mo</span><span>36mo</span>
            </div>
          </div>

          {/* Cooling */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy">Cooling Type</label>
            <div className="grid grid-cols-4 gap-1">
              {COOLING_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setReq(prev => ({ ...prev, coolingType: opt.value }))}
                  className={`py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${
                    req.coolingType === opt.value
                      ? 'bg-navy text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Geography */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy">
              Geography <span className="text-slate-400 font-normal">(empty = all)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map(r => (
                <button
                  key={r.code}
                  onClick={() => toggleRegion(r.code)}
                  className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                    req.geography.includes(r.code)
                      ? 'bg-navy text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {r.code}
                </button>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy">Required Certifications</label>
            <div className="flex flex-wrap gap-1.5">
              {CERTS.map(cert => (
                <button
                  key={cert}
                  onClick={() => toggleCert(cert)}
                  className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                    req.requiredCertifications.includes(cert)
                      ? 'bg-orange-accent text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Soft Preferences */}
        <section className="space-y-5">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <div className="w-3 h-px bg-slate-300" /> Soft Preferences
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy">Expansion Target (MW)</label>
            <input
              type="number" min={0} max={1000} value={req.expandabilityTargetMW}
              onChange={e => setReq(prev => ({ ...prev, expandabilityTargetMW: Number(e.target.value) }))}
              className="w-full border border-slate-200 px-3 py-2 text-sm font-black text-navy focus:border-orange-accent outline-none"
            />
          </div>

          <div className="space-y-2">
            {[
              { key: 'renewableEnergyPreferred', label: 'Renewable Energy Preferred' },
              { key: 'networkDiversityRequired', label: 'Network Diversity Required' },
              { key: 'offMarketOk', label: 'Include Off-Market Sites' },
            ].map(pref => (
              <label key={pref.key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setReq(prev => ({ ...prev, [pref.key]: !prev[pref.key as keyof InfraRequirement] }))}
                  className={`w-8 h-4 relative transition-colors ${
                    req[pref.key as keyof InfraRequirement] ? 'bg-navy' : 'bg-slate-200'
                  }`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white transition-transform ${
                    req[pref.key as keyof InfraRequirement] ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{pref.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Weight Editor */}
        <section className="space-y-5">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2"><div className="w-3 h-px bg-slate-300" /> Scoring Weights</span>
            <span className={`font-black ${Math.abs(totalWeight - 100) > 5 ? 'text-red-500' : 'text-emerald-600'}`}>
              {totalWeight}/100
            </span>
          </div>
          {WEIGHT_KEYS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-slate-600">{label}</span>
                <span className="text-[10px] font-black text-navy">{req.weights[key]}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={req.weights[key]}
                onChange={e => updateWeight(key, Number(e.target.value))}
                className="w-full accent-orange-400"
              />
            </div>
          ))}
          <div className="text-[9px] text-slate-400">Weights are normalized automatically during scoring.</div>
        </section>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={runAnalysis}
          className="w-full py-4 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-[#d95d12] transition-colors flex items-center justify-center gap-2"
        >
          <Play size={14} /> Run Analysis
        </button>
        <button
          onClick={() => { setReq({ ...DEFAULT_REQUIREMENT }); setResults([]); setHasRun(false); setSelected(null); }}
          className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-navy transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>
    </div>
  );

  // ── Results panel ──────────────────────────────────────────────────────────
  const ResultsPanel = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
        {hasRun ? (
          <div className="space-y-0.5">
            <div className="text-sm font-black text-navy">{results.length} Candidates Evaluated</div>
            <div className="text-[10px] text-slate-400">
              {strongCount} strong · {viableCount} viable · {results.length - strongCount - viableCount} conditional/disqualified
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400 font-light">Configure requirements and run analysis.</div>
        )}
        {hasRun && (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="text-[10px] font-black uppercase tracking-widest border border-slate-200 px-3 py-2 text-navy focus:outline-none"
            >
              <option value="fitScore">Fit Score</option>
              <option value="dataConfidence">Confidence</option>
              <option value="costPerKwMonth">Cost</option>
              <option value="availableMonths">Timeline</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Candidate list */}
        <div className={`overflow-y-auto p-4 space-y-3 transition-all ${selected ? 'w-1/2 border-r border-slate-200' : 'w-full'}`}>
          {!hasRun && (
            <EmptyState
              icon={Search}
              title="No Analysis Run"
              description="Set your infrastructure requirements on the left and click Run Analysis to see scored candidate matches."
              action={{ label: 'Run with Defaults', onClick: runAnalysis }}
            />
          )}
          {hasRun && sorted.map(result => (
            <CandidateCard
              key={result.candidateId}
              result={result}
              selected={selected?.candidateId === result.candidateId}
              onSelect={r => setSelected(prev => prev?.candidateId === r.candidateId ? null : r)}
            />
          ))}
        </div>

        {/* Breakdown panel */}
        {selected && (
          <div className="w-1/2 overflow-hidden">
            <ScoreBreakdown result={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Mobile tab toggle */}
      <div className="xl:hidden flex border-b border-slate-200 bg-white">
        {(['form', 'results'] as const).map(v => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
              mobileView === v ? 'bg-navy text-white' : 'text-slate-400 hover:text-navy'
            }`}
          >
            {v === 'form' ? 'Requirements' : `Results${hasRun ? ` (${results.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Desktop: side by side */}
      <div className="flex-1 overflow-hidden hidden xl:flex">
        <div className="w-96 flex-shrink-0 overflow-hidden">{FormPanel}</div>
        <div className="flex-1 overflow-hidden">{ResultsPanel}</div>
      </div>

      {/* Mobile: single view */}
      <div className="flex-1 overflow-hidden xl:hidden">
        {mobileView === 'form' ? FormPanel : ResultsPanel}
      </div>
    </div>
  );
}
