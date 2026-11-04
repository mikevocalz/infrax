import {ingestBatch} from './pipeline.mjs';
/** Each job has isolated credentials and a persisted source adapter. No hidden cron. */
export async function runIngestionJob({provider,sourceUrl,license,load,repository,onStatus,now=new Date()}) {
 if(typeof load!=='function')throw new TypeError('Source loader required');
 const startedAt=now.toISOString();
 onStatus?.({provider,status:'running',startedAt});
 try{
  const rows=await load();
  const result=await ingestBatch({provider,sourceUrl,license,rows,repository,retrievedAt:startedAt});
  onStatus?.({provider,status:'completed',...result});
  return result;
 } catch(error) {
  onStatus?.({provider,status:'failed',startedAt,error:error instanceof Error?error.message:'Unknown error'});
  throw error;
 }
}
export function shouldRefresh({lastSuccessfulAt,minimumIntervalMinutes,now=new Date()}) {
 if(!Number.isFinite(minimumIntervalMinutes)||minimumIntervalMinutes<1)throw new RangeError('Positive refresh interval required');
 if(!lastSuccessfulAt)return true;
 const last=new Date(lastSuccessfulAt).getTime();
 if(!Number.isFinite(last))return true;
 return now.getTime()-last>=minimumIntervalMinutes*60000;
}
