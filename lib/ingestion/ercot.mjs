/** ERCOT authenticated report transport. Reports remain raw pending license and schema review. */
export function assertErcotEndpoint(endpoint) {
 const url=new URL(endpoint);
 if(url.protocol!=='https:' || !['api.ercot.com','www.ercot.com'].includes(url.hostname)) {
  throw new Error('Only exact approved ERCOT API hosts permitted');
 }
 return url;
}
export async function readErcotReport({endpoint,subscriptionKey,accessToken,fetchImpl=fetch,signal}) {
 const url=assertErcotEndpoint(endpoint);
 if(!subscriptionKey?.trim() || !accessToken?.trim()) throw new Error('ERCOT credentials required');
 const response=await fetchImpl(url,{headers:{
  'Ocp-Apim-Subscription-Key':subscriptionKey,
  Authorization:'Bearer '+accessToken,
  Accept:'application/json'
 },signal});
 if(!response.ok) throw new Error('ERCOT request failed: HTTP '+response.status);
 return {sourceUrl:url.origin+url.pathname, data:await response.json(),
   status:'needs_schema_and_license_review', publicRedistributionAllowed:false};
}