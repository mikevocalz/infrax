import type { Candidate, InfraRequirement, MatchResult, ScoreDimension, MatchRecommendation } from '@/types';
import { CANDIDATES } from '@/lib/mock-data';

// ── Hard constraint check ──────────────────────────────────────────────────────
function checkHardConstraints(c: Candidate, req: InfraRequirement): { met: boolean; flags: string[] } {
  const flags: string[] = [];

  if (c.deliverableMW < req.powerMinMW) {
    flags.push(`Deliverable capacity ${c.deliverableMW}MW below required ${req.powerMinMW}MW`);
  }
  if (req.geography.length > 0 && !req.geography.includes(c.region)) {
    flags.push(`Region ${c.region} not in requested geography`);
  }
  if (c.availableMonths > req.timelineMonths) {
    flags.push(`Delivery ${c.availableMonths}mo exceeds required ${req.timelineMonths}mo timeline`);
  }
  for (const cert of req.requiredCertifications) {
    if (!c.certifications.includes(cert)) {
      flags.push(`Missing required certification: ${cert}`);
    }
  }
  if (req.coolingType !== 'any' && !c.coolingTypes.includes(req.coolingType)) {
    flags.push(`Cooling type ${req.coolingType} not supported`);
  }

  return { met: flags.length === 0, flags };
}

// ── Dimension scorers ──────────────────────────────────────────────────────────
function scorePower(c: Candidate, req: InfraRequirement): ScoreDimension {
  const ratio = c.deliverableMW / req.powerMinMW;
  let raw = Math.min(100, 60 + (ratio - 1) * 40);
  const interconnectBonus = c.interconnectStatus === 'operational' ? 15 :
    c.interconnectStatus === 'approved' ? 7 : 0;
  raw = Math.min(100, raw + interconnectBonus);
  const status = raw >= 75 ? 'pass' : raw >= 50 ? 'partial' : 'fail';

  return {
    key: 'power',
    label: 'Power Deliverability',
    weight: 0,
    rawScore: Math.round(raw),
    weightedScore: 0,
    explanation: `${c.deliverableMW}MW deliverable vs ${req.powerMinMW}MW required. Interconnect: ${c.interconnectStatus}.`,
    status,
  };
}

function scoreLocation(c: Candidate, req: InfraRequirement): ScoreDimension {
  const inGeo = req.geography.length === 0 || req.geography.includes(c.region);
  const raw = inGeo ? 100 : 40;
  return {
    key: 'location',
    label: 'Location Match',
    weight: 0,
    rawScore: raw,
    weightedScore: 0,
    explanation: inGeo ? `${c.market} is within requested geography.` : `${c.market} is outside requested regions.`,
    status: inGeo ? 'pass' : 'partial',
  };
}

function scoreTimeline(c: Candidate, req: InfraRequirement): ScoreDimension {
  if (c.availableMonths > req.timelineMonths) {
    return { key: 'timeline', label: 'Timeline Fit', weight: 0, rawScore: 0, weightedScore: 0, explanation: `${c.availableMonths}mo delivery exceeds ${req.timelineMonths}mo requirement.`, status: 'fail' };
  }
  const headroom = (req.timelineMonths - c.availableMonths) / req.timelineMonths;
  const raw = Math.min(100, 60 + headroom * 40);
  return {
    key: 'timeline',
    label: 'Timeline Fit',
    weight: 0,
    rawScore: Math.round(raw),
    weightedScore: 0,
    explanation: `${c.availableMonths}mo delivery — ${req.timelineMonths - c.availableMonths}mo ahead of deadline.`,
    status: raw >= 70 ? 'pass' : 'partial',
  };
}

function scoreCooling(c: Candidate, req: InfraRequirement): ScoreDimension {
  const match = req.coolingType === 'any' || c.coolingTypes.includes(req.coolingType);
  const hasLiquid = c.coolingTypes.includes('liquid') || c.coolingTypes.includes('immersion');
  const raw = match ? (hasLiquid ? 100 : 80) : 30;
  return {
    key: 'cooling',
    label: 'Cooling Fit',
    weight: 0,
    rawScore: raw,
    weightedScore: 0,
    explanation: `Supports: ${c.coolingTypes.join(', ')}. Requested: ${req.coolingType}.`,
    status: match ? 'pass' : 'fail',
  };
}

function scoreCost(c: Candidate, _req: InfraRequirement): ScoreDimension {
  // Market median ~$138/kW/month; score inversely
  const median = 138;
  const delta = ((median - c.costPerKwMonth) / median) * 100;
  const raw = Math.min(100, Math.max(0, 50 + delta));
  return {
    key: 'cost',
    label: 'Cost Efficiency',
    weight: 0,
    rawScore: Math.round(raw),
    weightedScore: 0,
    explanation: `$${c.costPerKwMonth}/kW/mo vs market median $${median}/kW/mo.`,
    status: raw >= 60 ? 'pass' : raw >= 40 ? 'partial' : 'fail',
  };
}

function scoreExpansion(c: Candidate, req: InfraRequirement): ScoreDimension {
  const target = req.expandabilityTargetMW || req.powerMinMW * 2;
  const ratio = c.expandableMW / target;
  const raw = Math.min(100, ratio * 80);
  return {
    key: 'expansion',
    label: 'Expansion Viability',
    weight: 0,
    rawScore: Math.round(raw),
    weightedScore: 0,
    explanation: `${c.expandableMW}MW expansion ceiling vs ${target}MW target.`,
    status: ratio >= 1 ? 'pass' : ratio >= 0.6 ? 'partial' : 'fail',
  };
}

// ── Highlights / Risks ─────────────────────────────────────────────────────────
function buildHighlights(c: Candidate, dims: ScoreDimension[]): string[] {
  const h: string[] = [];
  if (c.interconnectStatus === 'operational') h.push('Operational interconnect — no queue risk');
  if (c.dataConfidence >= 90) h.push(`High data confidence (${c.dataConfidence}%)`);
  if (c.offMarket) h.push('Off-market opportunity — limited competition');
  if ((c.renewablePercent ?? 0) >= 50) h.push(`${c.renewablePercent}% renewable energy`);
  if (c.fiberRoutes >= 5) h.push(`${c.fiberRoutes}-route fiber diversity`);
  if (dims.find(d => d.key === 'cost')!.rawScore >= 70) h.push('Below-market cost efficiency');
  return h.slice(0, 4);
}

function buildRisks(c: Candidate, dims: ScoreDimension[]): string[] {
  const r: string[] = [];
  if (c.interconnectStatus === 'pending') r.push(`Interconnect pending — ${c.interconnectTimelineMonths}mo estimated`);
  if (c.gridRiskLevel === 'high') r.push('High grid risk in this market');
  if (c.dataConfidence < 75) r.push(`Data confidence below threshold (${c.dataConfidence}%)`);
  if (c.status === 'development') r.push('Site in development — delivery risk elevated');
  if (dims.find(d => d.key === 'cost')!.rawScore < 40) r.push('Above-market pricing');
  return r.slice(0, 3);
}

// ── Main scoring function ──────────────────────────────────────────────────────
export function scoreCandidate(candidate: Candidate, req: InfraRequirement): MatchResult {
  const { met, flags } = checkHardConstraints(candidate, req);

  const dims = [
    scorePower(candidate, req),
    scoreLocation(candidate, req),
    scoreTimeline(candidate, req),
    scoreCooling(candidate, req),
    scoreCost(candidate, req),
    scoreExpansion(candidate, req),
  ];

  // Normalize weights
  const wMap: Record<string, number> = {
    power: req.weights.power,
    location: req.weights.location,
    timeline: req.weights.timeline,
    cooling: req.weights.cooling,
    cost: req.weights.cost,
    expansion: req.weights.expansion,
  };
  const totalW = Object.values(wMap).reduce((a, b) => a + b, 0) || 100;

  let fitScore = 0;
  const scored = dims.map(d => {
    const normW = (wMap[d.key] / totalW) * 100;
    const ws = (d.rawScore * normW) / 100;
    fitScore += ws;
    return { ...d, weight: Math.round(normW), weightedScore: Math.round(ws * 10) / 10 };
  });

  if (!met) fitScore = Math.min(fitScore * 0.4, 35);

  const rounded = Math.round(fitScore);
  const rec: MatchRecommendation = !met ? 'disqualified' :
    rounded >= 80 ? 'strong' :
    rounded >= 65 ? 'viable' :
    rounded >= 45 ? 'conditional' : 'disqualified';

  return {
    candidateId: candidate.id,
    candidate,
    fitScore: rounded,
    dataConfidence: candidate.dataConfidence,
    hardConstraintsMet: met,
    hardConstraintFlags: flags,
    scoreBreakdown: scored,
    recommendation: rec,
    highlights: buildHighlights(candidate, scored),
    risks: buildRisks(candidate, scored),
    estimatedMonthlyKw: candidate.costPerKwMonth * req.powerMinMW * 1000,
  };
}

export function runScoring(req: InfraRequirement): MatchResult[] {
  return CANDIDATES
    .map(c => scoreCandidate(c, req))
    .sort((a, b) => b.fitScore - a.fitScore);
}

export const DEFAULT_REQUIREMENT: InfraRequirement = {
  id: 'default',
  name: 'New Scenario',
  createdAt: new Date().toISOString(),
  powerMinMW: 5,
  powerMaxMW: 10,
  geography: [],
  timelineMonths: 12,
  coolingType: 'any',
  requiredCertifications: [],
  redundancy: 'any',
  expandabilityTargetMW: 20,
  preferredTier: null,
  renewableEnergyPreferred: false,
  networkDiversityRequired: false,
  offMarketOk: true,
  weights: { power: 35, location: 20, timeline: 20, cooling: 10, cost: 10, expansion: 5 },
};
