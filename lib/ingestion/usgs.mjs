/** Modern USGS Water Data OGC API is for hydroclimate feasibility context, not legal water rights. */
export function usgsWaterUrl({path='collections',limit=50}={}) {
 if(!/^(collections|collections\/[a-z0-9_-]+\/items)$/i.test(path))throw new Error('Unsupported USGS collection path');
 if(!Number.isInteger(limit)||limit<1||limit>500)throw new RangeError('Invalid limit');
 const url=new URL('https://api.waterdata.usgs.gov/ogcapi/v0/'+path);
 url.searchParams.set('f','json');url.searchParams.set('limit',String(limit));
 return url;
}
export async function fetchUsgsWaterContext({path,fetchImpl=fetch,signal,apiKey}={}) {
 const url=usgsWaterUrl({path});
 const headers={Accept:'application/json'};
 if(apiKey)headers['x-api-key']=apiKey;
 const response=await fetchImpl(url,{headers,signal});
 if(!response.ok)throw new Error('USGS HTTP '+response.status);
 const data=await response.json();
 if(!data || typeof data!=='object')throw new TypeError('Bad USGS response');
 return {sourceUrl:url.origin+url.pathname,retrievedData:data,source:'USGS_WATER',status:'unreviewed',waterRightsConfirmed:false};
}