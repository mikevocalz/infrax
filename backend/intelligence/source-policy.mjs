/** InFraX external intelligence source rules. Never treat network/directory evidence as available MW.
 * This catalog is a configuration gate, not legal authorization for provider content.
 */
export const SOURCES=Object.freeze({
 'datacentermap-directory':Object.freeze({kind:'facility_directory',url:'https://www.datacentermap.com/research/explorer/',acquisition:'licensed_export',right:'restricted'}),
 'cloudscene-directory':Object.freeze({kind:'facility_directory',url:'https://explore.cloudscene.com/terms-of-service/',acquisition:'commercial_agreement',right:'restricted'}),
 'peeringdb-interconnection':Object.freeze({kind:'network_directory',url:'https://tools.peeringdb.com/aup',acquisition:'written_permission',right:'restricted'}),
 'cloudflare-radar-outages':Object.freeze({kind:'outage_observation',url:'https://developers.cloudflare.com/api/resources/radar/subresources/annotations/subresources/outages/methods/get/',acquisition:'token_and_license_review',right:'restricted'}),
 'netblocks-outages':Object.freeze({kind:'outage_observation',url:'https://netblocks.org/projects/observatory',acquisition:'data_agreement',right:'restricted'}),
 'downdetector-enterprise':Object.freeze({kind:'outage_observation',url:'https://downdetectorapi.com/v2/docs/',acquisition:'enterprise_agreement',right:'restricted'})
});
const USAGES=new Set(['internal','attributed_public','licensed_public','restricted']);
export function sourceSpec(provider){return Object.hasOwn(SOURCES,provider)?SOURCES[provider]:null;}
export function assertSourcePermission({provider,license,action='ingest'}){
 if(!sourceSpec(provider))throw new Error('UNREGISTERED_SOURCE');
 if(!license||license.provider!==provider||!USAGES.has(license.allowed_usage)||!license.reviewed_at)throw new Error('SOURCE_LICENSE_REVIEW_REQUIRED');
 if(license.allowed_usage==='restricted')throw new Error('SOURCE_ACCESS_RESTRICTED');
 if(action==='publish'&&(!license.redistribution_approved||!['attributed_public','licensed_public'].includes(license.allowed_usage)))throw new Error('REDISTRIBUTION_NOT_APPROVED');
 if(!['ingest','internal_read','publish'].includes(action))throw new Error('UNSUPPORTED_SOURCE_ACTION');
 return true;
}
export function sourceToPublicStatus({provider,license,records=0}){
 const spec=sourceSpec(provider);if(!spec)return null;
 const reviewed=!!license?.reviewed_at && license.provider===provider;
 const published=reviewed&&['attributed_public','licensed_public'].includes(license.allowed_usage)&&license.redistribution_approved===true;
 return Object.freeze({provider,kind:spec.kind,acquisition:spec.acquisition,sourceUrl:spec.url,reviewed,publicAllowed:published,records:published?records:0,importStatus:reviewed?'reviewed':'pending'});
}
export function classifyEvidence(value){
 if(!value||typeof value!=='object')throw new TypeError('EVIDENCE_REQUIRED');
 if(value.kind==='network_outage')return 'network_observation_not_facility_outage';
 if(value.kind==='facility_directory'||value.kind==='built_out_power')return 'facility_context_not_contractable_capacity';
 if(value.kind==='operator_offer'&&value.operator_authorized===true&&value.verified_at&&value.expires_at&&Date.parse(value.expires_at)>Date.now())return 'operator_offer_requires_diligence';
 return 'unverified_context';
}
