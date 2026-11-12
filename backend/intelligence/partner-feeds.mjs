/** Partner directory/feed acquisition contract. These sources are NOT crawled.
 * No "open API" implies permission to reproduce a commercial catalog.
 */
export const PARTNERS=Object.freeze({
 cloudscene:{provider:'cloudscene-directory',mode:'licensed_snapshot',dataType:'facility_connectivity',needs:['signed_agreement','export_delivery','attribution_terms']},
 peeringdb:{provider:'peeringdb-interconnection',mode:'licensed_api',dataType:'network_presence',needs:['commercial_reuse_permission','access_method','attribution_terms']},
 netblocks:{provider:'netblocks-outages',mode:'licensed_feed',dataType:'network_disruption',needs:['data_agreement','feed_credentials','attribution_terms']},
 downdetector:{provider:'downdetector-enterprise',mode:'enterprise_api',dataType:'service_reports',needs:['enterprise_subscription','api_credentials','redistribution_terms']}
});
export function acquisitionChecklist(provider){
 const spec=Object.values(PARTNERS).find(p=>p.provider===provider);if(!spec)throw new Error('UNKNOWN_PARTNER');
 return {...spec,requirements:[...spec.needs],ready:false,automatedAcquisition:false};
}
export function assertPartnerRights(provider,grant={},action='internal_import'){
 const item=Object.values(PARTNERS).find(p=>p.provider===provider);
 if(!item)throw new Error('UNKNOWN_PARTNER');
 if(!item.needs.every(field=>grant[field]===true)||grant.provider!==provider||grant.reviewed!==true)throw new Error('PARTNER_RIGHTS_REQUIRED');
 if(action==='publish'&&grant.redistributionApproved!==true)throw new Error('NO_REDISTRIBUTION_PERMISSION');
 if(!['internal_import','publish'].includes(action))throw new Error('INVALID_PARTNER_ACTION');
 return true;
}
export function normalizePartnerEvidence(provider,item,grant){
 assertPartnerRights(provider,grant);
 if(!item||typeof item!=='object'||typeof item.externalId!=='string'||item.externalId.length>160||!item.externalId.trim())throw new Error('PARTNER_RECORD_INVALID');
 const source=Object.values(PARTNERS).find(p=>p.provider===provider);
 const observedAt=typeof item.observedAt==='string'&&Number.isFinite(Date.parse(item.observedAt))?new Date(item.observedAt).toISOString():null;
 if(!observedAt)throw new Error('OBSERVED_AT_REQUIRED');
 return {provider,externalId:item.externalId,kind:source.dataType,observedAt,summary:typeof item.summary==='string'?item.summary.slice(0,800):'',reviewStatus:'pending',publicAllowed:false,facilityOutageConfirmed:false,availableCapacityMw:null};
}
