/** Source-aware, confidentiality-safe projection. No DB connection needed. */
export const DISCLOSURES = Object.freeze(['public','qualified_buyers','internal','restricted']);
export function canPublishSource(license) {
  return Boolean(license && license.redistribution_approved === true &&
    ['attributed_public','licensed_public'].includes(license.allowed_usage) && license.reviewed_at);
}
export function claimState(claim, now = new Date()) {
  if (!claim || !claim.verification_status) return 'unverified';
  if (claim.verification_status === 'disputed') return 'disputed';
  if (claim.valid_until && new Date(claim.valid_until).getTime() <= now.getTime()) return 'expired';
  return claim.verification_status;
}
export function publicFacilityProjection(facility, claims = [], offers = [], now = new Date()) {
  if (!facility?.public_discovery_allowed) return null;
  return {
    id: facility.id,
    canonicalName: facility.canonical_name,
    locality: facility.locality ?? null,
    state: facility.state ?? null,
    lifecycle: facility.lifecycle ?? 'unknown',
    claims: claims.filter(c => c.disclosure === 'public' && claimState(c,now) !== 'disputed' && claimState(c,now) !== 'expired')
      .map(c => ({ field: c.field_key, value: c.value_json ?? null, unit: c.unit ?? null, status: claimState(c,now), observedAt: c.observed_at ?? null })),
    offers: offers.filter(o => o.disclosure === 'public' && o.status === 'approved' && o.verified_at &&
      o.expires_at && new Date(o.expires_at) > now && o.critical_it_mw != null)
      .map(o => ({ id: o.id, criticalItMw: Number(o.critical_it_mw), deliveryDate: o.delivery_date ?? null, asOf: o.verified_at })),
  };
}
export function validatePublicSignal(signal, source, license, now = new Date()) {
  if (!canPublishSource(license)) return false;
  if (!signal || signal.publication_status !== 'published' || !signal.reviewed_at) return false;
  if (!source?.source_url || !source?.retrieved_at) return false;
  return !signal.expires_at || new Date(signal.expires_at) > now;
}
