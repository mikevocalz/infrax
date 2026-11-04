import type { Candidate, InfraRequirement, MatchResult } from '@/types';
import { scoreRequirements, scoreOne, assertRequirement } from '@/lib/infra/scoring-core.mjs';
/** Only real server-supplied candidates are eligible. No production mock fallback. */
export function runScoring(req: InfraRequirement, candidates: readonly Candidate[] = []): MatchResult[] {
  assertRequirement(req);
  return scoreRequirements(req, candidates) as MatchResult[];
}
export function scoreCandidate(candidate: Candidate, req: InfraRequirement): MatchResult {
  assertRequirement(req);
  return scoreOne(req, candidate) as MatchResult;
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
