import {createHash} from 'node:crypto';
/** Deliberately manual, permission-gated importer. Caller supplies licensed normalized
 * records from the DCM/Radar adapters. No network reads or public publication here.
 * A failed mid-batch import is safely replayable through immutable evidence hashes.
 */
const SOURCES=Object.freeze({
 'datacentermap-directory':{kind:'facility',url:'https://www.datacentermap.com/research/explorer/'},
 'cloudflare-radar-outages':{kind:'incident',url:'https://developers.cloudflare.com/api/resources/radar/subresources/annotations/subresources/outages/methods/get/'}
});
export async function persistExternalEvidence({sql,provider,items,sourceVersion,importApproved=false}={}){
 if(!sql||typeof sql.query!=='function')throw new Error('SQL_REQUIRED');
 if(!Object.hasOwn(SOURCES,provider))throw new Error('UNSUPPORTED_SOURCE');
 if(!importApproved)throw new Error('IMPORT_APPROVAL_REQUIRED');
 if(!Array.isArray(items)||items.length<1||items.length>250)throw new Error('INVALID_BATCH_SIZE');
 if(typeof sourceVersion!=='string'||!sourceVersion.trim()||sourceVersion.length>120)throw new Error('SOURCE_VERSION_REQUIRED');
 const [license]=await sql.query('SELECT id,provider,allowed_usage,reviewed_at FROM infra.source_licenses WHERE provider=$1',[provider]);
 if(!license||!license.reviewed_at||!['internal','attributed_public','licensed_public'].includes(license.allowed_usage))throw new Error('SOURCE_RIGHTS_NOT_APPROVED');
 let created=0,duplicate=0;
 for(const item of items){
  if(!item||item.source!==provider)throw new Error('MISMATCHED_EVIDENCE_SOURCE');
  const key=SOURCES[provider].kind==='facility'?item.externalId:item.externalKey;
  if(typeof key!=='string'||!key.trim()||key.length>150)throw new Error('EVIDENCE_KEY_INVALID');
  if(SOURCES[provider].kind==='facility'){
   if(typeof item.name!=='string'||!item.name.trim()||!item.country||item.availableCapacityMw!==null||item.publicDiscoveryAllowed!==false)throw new Error('FACILITY_QUARANTINE_REQUIRED');
  }else if(item.category!=='network_outage'||item.facilityOutageConfirmed!==false||item.capacityAvailableMw!==null||item.publicationStatus!=='internal_review'||!Number.isFinite(Date.parse(item.eventAt)))throw new Error('INCIDENT_QUARANTINE_REQUIRED');
  const raw=JSON.stringify(item);
  if(Buffer.byteLength(raw)>16000)throw new Error('EVIDENCE_PAYLOAD_TOO_LARGE');
  const sha=createHash('sha256').update(raw).digest('hex');
  const saved=await sql.query('INSERT INTO infra.source_records(license_id,external_key,source_url,source_version,content_sha256,observed_at,raw_payload) VALUES($1::uuid,$2,$3,$4,$5,$6::timestamptz,$7::jsonb) ON CONFLICT(license_id,external_key,content_sha256) DO NOTHING RETURNING id',[license.id,key,SOURCES[provider].url,sourceVersion,sha,SOURCES[provider].kind==='incident'?item.eventAt:null,raw]);
  let sourceId=saved[0]?.id;
  if(!sourceId){const existing=await sql.query('SELECT id FROM infra.source_records WHERE license_id=$1::uuid AND external_key=$2 AND content_sha256=$3',[license.id,key,sha]);sourceId=existing[0]?.id;}
  if(!sourceId)throw new Error('EVIDENCE_RECEIPT_REQUIRED');
  let rows;
  if(SOURCES[provider].kind==='facility'){
   rows=await sql.query('INSERT INTO infra.external_facility_leads(license_id,source_record_id,external_key,name,operator_name,locality,state,country,latitude,longitude,built_out_mw) VALUES($1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(license_id,external_key) DO NOTHING RETURNING id',[license.id,sourceId,key,item.name,item.operator??null,item.city??null,item.state??null,item.country,item.location?.lat??null,item.location?.lon??null,item.builtOutPowerMw??null]);
  }else{
   rows=await sql.query('INSERT INTO infra.external_network_incidents(license_id,source_record_id,external_key,event_start,event_end,countries,asns,event_type,description) VALUES($1::uuid,$2::uuid,$3,$4::timestamptz,$5::timestamptz,$6::text[],$7::bigint[],$8,$9) ON CONFLICT(license_id,external_key) DO NOTHING RETURNING id',[license.id,sourceId,key,item.eventAt,item.endAt??null,item.countries??[],item.asns??[],item.eventType??null,item.description??null]);
  }
  if(rows.length)created++;else duplicate++;
 }
 return {provider,received:items.length,created,duplicate,publications:0,operatorOffers:0};
}
