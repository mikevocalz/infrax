/**
 * Neon/Postgres writer for immutable source evidence. Requires migrations PR #9.
 * Accepts an authenticated server-side SQL adapter with .query(text,params).
 * Never creates a source license or promotes data to publication.
 */
export function createNeonEvidenceWriter(sql) {
 if(typeof sql?.query!=='function')throw new TypeError('SQL adapter required');
 return Object.freeze({
  async writeSourceRecord(record) {
   if(!record || typeof record.provider!=='string' || !record.externalKey || !record.sourceUrl ||
    !/^[a-f0-9]{64}$/.test(record.contentSha256))throw new TypeError('Invalid evidence record');
   const providers=await sql.query('SELECT id FROM infra.source_licenses WHERE provider=$1',[record.provider]);
   const licenseId=providers?.[0]?.id;
   if(!licenseId)throw new Error('Source provider has not been licensed and approved');
   const observed=/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(record.observedAt??'')?record.observedAt:null;
   return sql.query(
    'INSERT INTO infra.source_records (license_id,external_key,source_url,source_version,content_sha256,observed_at,retrieved_at,raw_payload) VALUES ($1,$2,$3,$4,$5,$6::timestamptz,$7::timestamptz,$8::jsonb) ON CONFLICT (license_id,external_key,content_sha256) DO NOTHING',
    [licenseId,record.externalKey,record.sourceUrl,record.sourceVersion??'',record.contentSha256,
     observed,record.retrievedAt??new Date().toISOString(),JSON.stringify(record.payload??{})]
   );
  }
 });
}