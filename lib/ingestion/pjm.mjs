/** PJM Data Miner 2. Redistribution prohibited without qualifying membership/permissions.
 * https://www.pjm.com/markets-and-operations/etools/data-miner-2.aspx
 */
export function approvedPjmUrl({endpoint,distributionApproved=false}){
 if(distributionApproved!==true)throw new Error('PJM license and redistribution review required');
 const url=new URL(endpoint);
 if(url.protocol!=='https:' || url.hostname!=='api.pjm.com'|| !url.pathname.startsWith('/api/v1/'))
 throw new Error('Only approved PJM Data Miner API endpoint permitted');
 return url;
}
export async function fetchPjmContext({endpoint,apiKey,distributionApproved,fetchImpl=fetch,signal}){
 const url=approvedPjmUrl({endpoint,distributionApproved});
 if(!apiKey)throw new Error('PJM subscription key required');
 const response=await fetchImpl(url,{headers:{'Ocp-Apim-Subscription-Key':apiKey,Accept:'application/json'},signal});
 if(!response.ok)throw new Error('PJM HTTP '+response.status);
 return {sourceUrl:url.origin+url.pathname,source:'PJM_DATA_MINER',status:'unreviewed',
  raw:await response.json(),retainedLicenseReview:true,siteDeliverabilityConfirmed:false};
}