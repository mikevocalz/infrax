import {createHash,randomUUID} from 'node:crypto';
import {readEiaRetailSales} from '../lib/ingestion/eia.mjs';
/** Manual, bounded evidence job. Uses the restricted ingest connection, never the public API login.
 * No source license approval, cron, emails or publication is performed here.
 */
export async function ingestEia({sql,apiKey,state='TX',sector='COM',fetchImpl=fetch,signal=AbortSignal.timeout(30000)}) {
 if(!apiKey?.trim())throw new Error('EIA_CREDENTIAL_REQUIRED');
 const [license]=await sql.query("SELECT id FROM infra.source_licenses WHERE provider=$1 AND reviewed_at<=now() AND allowed_usage IN ('internal','attributed_public','licensed_public')",['EIA']);
 if(!license)throw new Error('EIA_LICENSE_REVIEW_REQUIRED');
 const runId=randomUUID();
 await sql.query('INSERT INTO infra.ingestion_runs(id,provider) VALUES($1::uuid,$2)',[runId,'EIA']);
 let inserted=0;
 try {
  const rows=await readEiaRetailSales({apiKey,state,sector,fetchImpl,signal});
  for(const row of rows) {
   const raw=JSON.stringify(row);const hash=createHash('sha256').update(raw).digest('hex');
   const created=await sql.query(`INSERT INTO infra.source_records(license_id,external_key,source_url,source_version,content_sha256,observed_at,raw_payload)
    VALUES($1::uuid,$2,$3,$4,$5,NULL,$6::jsonb) ON CONFLICT(license_id,external_key,content_sha256) DO NOTHING RETURNING id`,
    [license.id,row.externalKey,row.sourceUrl,'EIA-v2',hash,raw]);
   inserted+=created.length;
  }
  await sql.query("UPDATE infra.ingestion_runs SET finished_at=now(),result='succeeded',imported=$2,rejected=0 WHERE id=$1::uuid",[runId,inserted]);
  return {runId,received:rows.length,inserted,duplicates:rows.length-inserted,published:false};
 }catch {
  // Partial inserts are retained as raw evidence and retry deduplicates them. No source error/URL/key in logs.
  try{await sql.query("UPDATE infra.ingestion_runs SET finished_at=now(),result='failed',imported=$2,error_text='PROVIDER_OR_STORAGE_FAILURE' WHERE id=$1::uuid",[runId,inserted]);}catch{}
  throw new Error('EIA_INGESTION_FAILED');
 }
}
