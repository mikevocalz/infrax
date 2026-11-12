/** Read-only source availability service for staff and public website displays.
 * The SQL remains fixed: no client-supplied SQL, provider names or secrets.
 * Deny by default; only public-approved providers are returned to anonymous readers.
 */
const SOURCE_STATUS_SQL=`SELECT l.provider,l.license_url,l.allowed_usage,l.redistribution_approved,l.reviewed_at,
 COUNT(r.id)::integer AS record_count,MAX(r.retrieved_at) AS latest_retrieval
 FROM infra.source_licenses l LEFT JOIN infra.source_records r ON r.license_id=l.id
 WHERE l.provider = ANY($1::text[]) GROUP BY l.id ORDER BY l.provider`;
export const EXT_SOURCES=Object.freeze(['cloudscene-directory','datacentermap-directory','peeringdb-interconnection','cloudflare-radar-outages','netblocks-outages','downdetector-enterprise']);
export function sanitizeSourceStatuses(rows,{staff=false}={}){
 if(!Array.isArray(rows)||rows.length>100)throw new Error('INVALID_SOURCE_STATUS');
 return rows.filter(row=>EXT_SOURCES.includes(row.provider)).map(row=>{
  const approved=!!row.reviewed_at&&row.redistribution_approved===true&&['attributed_public','licensed_public'].includes(row.allowed_usage);
  if(!staff&&!approved)return null;
  const result={provider:row.provider,publicAllowed:approved,recordCount:approved?Math.max(0,Number(row.record_count)||0):0,latestRetrieval:approved?row.latest_retrieval??null:null,sourceUrl:typeof row.license_url==='string'?row.license_url:null};
  if(staff)Object.assign(result,{rightsReviewed:!!row.reviewed_at,allowedUsage:row.allowed_usage,importedRecords:Math.max(0,Number(row.record_count)||0),requiresApproval:!approved});
  return result;
 }).filter(Boolean);
}
export async function getExternalSourceStatus({sql,staff=false}={}){
 if(!sql||typeof sql.query!=='function')throw new Error('DATABASE_REQUIRED');
 const rows=await sql.query(SOURCE_STATUS_SQL,[EXT_SOURCES]);
 return {schema:'infrax-external-sources-v1',status:'ready',sources:sanitizeSourceStatuses(rows,{staff}),disclaimer:'Directory counts and outage observations are not verified available MW or confirmed facility outages.'};
}
