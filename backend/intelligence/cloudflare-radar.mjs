import {createHash} from 'node:crypto';
/** Cloudflare Radar outage adapter. Fixed host/path, token never enters logs or client responses.
 * Outages are network observations, not evidence a data-center facility is unavailable.
 */
export const RADAR_OUTAGES_URL='https://api.cloudflare.com/client/v4/radar/annotations/outages';
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))?new Date(x).toISOString():null;
export function normalizeRadarAnnotation(row){
 if(!row||typeof row!=='object'||typeof row.id!=='string'||row.id.length>150)return null;
 const start=iso(row.startDate),end=row.endDate?iso(row.endDate):null;
 if(!start||(end&&end<start))return null;
 const countries=Array.isArray(row.locations)?row.locations.filter(x=>typeof x==='string'&&/^[A-Z]{2}$/.test(x)).slice(0,40):[];
 const asns=Array.isArray(row.asns)?row.asns.filter(x=>Number.isSafeInteger(x)&&x>0&&x<4294967296).slice(0,100):[];
 return Object.freeze({source:'cloudflare-radar-outages',externalKey:row.id,eventAt:start,endAt:end,countries,asns,category:'network_outage',eventType:String(row.eventType??'OUTAGE').slice(0,40),outageType:typeof row.outage?.outageType==='string'?row.outage.outageType.slice(0,80):null,cause:typeof row.outage?.outageCause==='string'?row.outage.outageCause.slice(0,80):null,description:typeof row.description==='string'?row.description.slice(0,1200):'',facilityOutageConfirmed:false,capacityAvailableMw:null,publicationStatus:'internal_review'});
}
export function parseRadarOutages(payload){
 const raw=payload?.result?.annotations??payload?.annotations;
 if(!Array.isArray(raw)||raw.length>1000)throw new Error('RADAR_SCHEMA_INVALID');
 const events=[],rejected=[];const seen=new Set();
 for(let i=0;i<raw.length;i++){const item=normalizeRadarAnnotation(raw[i]);if(!item||seen.has(item.externalKey)){rejected.push(i);continue;}seen.add(item.externalKey);events.push(item);}
 return {events,rejected,publications:0};
}
export async function fetchRadarOutages({token,fetchImpl=fetch,signal=AbortSignal.timeout(15000),licenseReviewed=false}={}){
 if(!licenseReviewed)throw new Error('RADAR_LICENSE_REVIEW_REQUIRED');
 if(typeof token!=='string'||token.length<12||/[\s\r\n]/.test(token))throw new Error('RADAR_TOKEN_REQUIRED');
 const res=await fetchImpl(RADAR_OUTAGES_URL,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},signal,redirect:'error'});
 if(!res?.ok)throw new Error('RADAR_REQUEST_FAILED');
 if(!res.headers.get('content-type')?.toLowerCase().includes('application/json'))throw new Error('RADAR_CONTENT_TYPE_INVALID');
 const body=await res.text();if(Buffer.byteLength(body)>2_000_000)throw new Error('RADAR_RESPONSE_TOO_LARGE');
 let data;try{data=JSON.parse(body);}catch{throw new Error('RADAR_SCHEMA_INVALID');}
 if(data?.success===false)throw new Error('RADAR_RESPONSE_ERROR');
 const parsed=parseRadarOutages(data);
 const checksum=createHash('sha256').update(body).digest('hex');
 return {...parsed,checksum,sourceUrl:RADAR_OUTAGES_URL,publicationStatus:'internal_review'};
}
