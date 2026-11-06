/**
 * HIFLD/ArcGIS geospatial batch data is a stale-awareness overlay, not proof
 * of power access. The exact official data service must be reviewed by an analyst.
 */
export function approvedHifldUrl({serviceUrl,offset=0,limit=200}){
 const u=new URL(serviceUrl);
 if(u.protocol!=='https:' || !/^(?:services\d*\.)?arcgis\.com$/.test(u.hostname) ||
 !/\/(?:ArcGIS|arcgis)\/rest\/services\/[^/]+\/FeatureServer\/\d+\/query$/.test(u.pathname))
  throw new Error('Approved ArcGIS FeatureServer query URL required');
 if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>1000)throw new RangeError('Invalid page');
 u.searchParams.set('where','1=1');
 u.searchParams.set('outFields','*');
 u.searchParams.set('resultOffset',String(offset));
 u.searchParams.set('resultRecordCount',String(limit));
 u.searchParams.set('f','json');
 return u;
}
export async function fetchHifldPage({serviceUrl,offset=0,limit=200,fetchImpl=fetch,signal}){
 const url=approvedHifldUrl({serviceUrl,offset,limit});
 const response=await fetchImpl(url,{headers:{Accept:'application/json'},signal});
 if(!response.ok)throw new Error('HIFLD HTTP '+response.status);
 const data=await response.json();
 if(data?.error||!Array.isArray(data?.features))throw new TypeError('Unexpected HIFLD ArcGIS payload');
 return {features:data.features,sourceUrl:url.origin+url.pathname,source:'HIFLD_GEOGRAPHY',
  status:'unreviewed',isCurrentPowerAvailability:false,pagination:{offset,limit,hasMore:data.exceededTransferLimit===true}};
}