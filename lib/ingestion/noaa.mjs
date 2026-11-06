/** Climate observation reader: NOAA CDO APIv2. Environmental screening, NOT engineering approval.
 * https://www.ncei.noaa.gov/cdo-web/webservices/v2
 */
export function noaaClimateUrl({datasetId='GHCND',stationId,startDate,endDate,limit=100}) {
 const iso=/^\d{4}-\d{2}-\d{2}$/;
 if(!iso.test(startDate)||!iso.test(endDate)||startDate>endDate)throw new RangeError('Valid ordered ISO date range required');
 if(!stationId||!/^[A-Z0-9:-]+$/i.test(stationId))throw new TypeError('Valid station ID required');
 if(!/^[A-Z0-9]+$/i.test(datasetId))throw new TypeError('Invalid dataset ID');
 if(!Number.isInteger(limit)||limit<1||limit>1000)throw new RangeError('Limit must be 1..1000');
 const url=new URL('https://www.ncei.noaa.gov/cdo-web/api/v2/data');
 for(const [k,v] of Object.entries({datasetid:datasetId,stationid:stationId,startdate:startDate,enddate:endDate,limit:String(limit)}))url.searchParams.set(k,v);
 return url;
}
export async function fetchNoaaObservations({token,fetchImpl=fetch,signal,...options}) {
 if(!token?.trim())throw new Error('NOAA token required');
 const u=noaaClimateUrl(options);
 const response=await fetchImpl(u,{headers:{token,Accept:'application/json'},signal});
 if(!response.ok)throw new Error('NOAA HTTP '+response.status);
 const content=await response.json();
 if(!Array.isArray(content?.results))throw new TypeError('Unexpected NOAA payload');
 return content.results.filter(r=>r&&Number.isFinite(Number(r.value))).map((r,i)=>({
  externalKey:String(r.station??options.stationId)+':'+String(r.datatype??'unknown')+':'+String(r.date??i),
  sourceUrl:u.origin+u.pathname,observedAt:r.date??null,
  station:String(r.station??''),value:Number(r.value),datatype:String(r.datatype??''),
  source:'NOAA_CDO',status:'unreviewed',siteCoolingRightsConfirmed:false
 }));
}