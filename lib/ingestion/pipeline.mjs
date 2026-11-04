import {createHash} from 'node:crypto';
/** Caller provides a Neon-backed repository implementing writeSourceRecord(). No automatic publishing. */
export function fingerprint(content) {
 return createHash('sha256').update(JSON.stringify(content)).digest('hex');
}
export async function ingestBatch({provider,sourceUrl,license,rows,repository,retrievedAt=new Date().toISOString()}) {
 if(!provider || !sourceUrl?.startsWith('https://') || !license?.provider) throw new Error('Source license, provider and HTTPS provenance required');
 if(!Array.isArray(rows) || rows.length>10000) throw new Error('Rows must be a bounded array');
 if(typeof repository?.writeSourceRecord!=='function') throw new TypeError('Durable evidence repository required');
 let imported=0,rejected=0;
 for(const row of rows){
  if(!row || typeof row.externalKey!=='string' || !row.externalKey) {rejected++;continue;}
  await repository.writeSourceRecord({
   provider,externalKey:row.externalKey,sourceUrl,sourceVersion:String(row.series ?? row.version ?? ''),
   contentSha256:fingerprint(row),retrievedAt,
   publishedAt:null,observedAt:row.period??null,payload:row,
   reviewStatus:'pending',publicRedistributionApproved:false
  });
  imported++;
 }
 return {provider,imported,rejected,retrievedAt,publication:'not_published'};
}