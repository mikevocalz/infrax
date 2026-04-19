import type { LucideIcon } from 'lucide-react';

// ── Navigation ─────────────────────────────────────────────────────────────────
export interface NavItem { label: string; href: string; }

// ── Existing shared ────────────────────────────────────────────────────────────
export interface Service { id: string; title: string; description: string; icon: LucideIcon; }
export interface Pillar { title: string; description: string; icon: LucideIcon; }
export interface Testimonial { id: number; author: string; role: string; content: string; avatar: string; }
export interface ChatMessage { role: 'user' | 'assistant'; content: string; }
export interface Asset { id: string; name: string; type: string; provider: string; capacity_mw: number; status: string; location: string; }

// ── Market Signals ─────────────────────────────────────────────────────────────
export type SignalSeverity = 'High' | 'Medium' | 'Low';
export type SignalCategory = 'GRID' | 'POLICY' | 'CAPACITY' | 'PRICING' | 'SUPPLY' | 'DEMAND';

export interface MarketSignal {
  id: string;
  category: SignalCategory;
  signal: string;
  impact?: string;
  timestamp?: string;
  severity: SignalSeverity;
  region?: string;
  source?: string;
  provenance?: string;
  tags?: string[];
  actionable?: boolean;
}

// ── Infrastructure Requirements ────────────────────────────────────────────────
export type CoolingType = 'air' | 'liquid' | 'immersion' | 'any';
export type TierLevel = 2 | 3 | 4;
export type RedundancyLevel = 'N' | 'N+1' | '2N' | 'any';
export type UserType = 'developer' | 'investor' | 'operator' | 'advisor';

export interface RequirementWeights {
  power: number;
  location: number;
  timeline: number;
  cooling: number;
  cost: number;
  expansion: number;
}

export interface InfraRequirement {
  id: string;
  name: string;
  createdAt: string;
  powerMinMW: number;
  powerMaxMW: number;
  geography: string[];
  timelineMonths: number;
  coolingType: CoolingType;
  requiredCertifications: string[];
  redundancy: RedundancyLevel;
  expandabilityTargetMW: number;
  preferredTier: TierLevel | null;
  renewableEnergyPreferred: boolean;
  networkDiversityRequired: boolean;
  offMarketOk: boolean;
  weights: RequirementWeights;
  userType?: UserType;
  notes?: string;
}

// ── Supply-Side Candidates ─────────────────────────────────────────────────────
export type InterconnectStatus = 'operational' | 'approved' | 'pending' | 'queued';
export type CandidateStatus = 'available' | 'limited' | 'committed' | 'development';

export interface Candidate {
  id: string;
  name: string;
  operator: string;
  region: string;
  market: string;
  state: string;
  totalMW: number;
  availableMW: number;
  deliverableMW: number;
  expandableMW: number;
  status: CandidateStatus;
  tier: TierLevel;
  coolingTypes: CoolingType[];
  pue: number;
  redundancy: RedundancyLevel;
  utilityProvider: string;
  interconnectStatus: InterconnectStatus;
  interconnectTimelineMonths?: number;
  availableMonths: number;
  costPerKwMonth: number;
  certifications: string[];
  carriers: string[];
  fiberRoutes: number;
  gridRiskLevel: 'low' | 'medium' | 'high';
  permittingRisk: 'low' | 'medium' | 'high';
  dataConfidence: number;
  lastVerified: string;
  offMarket: boolean;
  renewablePercent?: number;
}

// ── Match Scoring ──────────────────────────────────────────────────────────────
export type MatchRecommendation = 'strong' | 'viable' | 'conditional' | 'disqualified';

export interface ScoreDimension {
  key: string;
  label: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  explanation: string;
  status: 'pass' | 'partial' | 'fail';
}

export interface MatchResult {
  candidateId: string;
  candidate: Candidate;
  fitScore: number;
  dataConfidence: number;
  hardConstraintsMet: boolean;
  hardConstraintFlags: string[];
  scoreBreakdown: ScoreDimension[];
  recommendation: MatchRecommendation;
  highlights: string[];
  risks: string[];
  estimatedMonthlyKw: number;
}

// ── Execution / Mandate ────────────────────────────────────────────────────────
export type MandatePhase = 'intake' | 'modeling' | 'shortlist' | 'diligence' | 'negotiation' | 'execution' | 'closeout';
export type DeliverableStatus = 'pending' | 'in-progress' | 'complete' | 'blocked';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  phase: MandatePhase;
  status: DeliverableStatus;
  dueDate?: string;
  owner: string;
}

export interface PhaseStep {
  phase: MandatePhase;
  label: string;
  description: string;
  status: 'complete' | 'active' | 'upcoming';
  deliverables: Deliverable[];
}

// ── Capital / Diligence ────────────────────────────────────────────────────────
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFactor {
  id: string;
  category: string;
  title: string;
  description: string;
  level: RiskLevel;
  mitigations?: string[];
}

export interface DiligenceReport {
  id: string;
  assetName: string;
  market: string;
  reportDate: string;
  feasibilityScore: number;
  dataConfidence: number;
  powerDeliverability: number;
  expansionViability: number;
  riskFactors: RiskFactor[];
  highlights: string[];
  redFlags: string[];
  underwritingSummary: string;
  recommendedAction: 'proceed' | 'proceed-with-conditions' | 'defer' | 'decline';
}

// ── Leadership ─────────────────────────────────────────────────────────────────
export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  decisionDomains: string[];
  background: string[];
  linkedin?: string;
  email?: string;
}
