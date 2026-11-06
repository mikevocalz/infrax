/** EIA electricity retail-sales context; never site capacity or commercial quotations. */
const ENDPOINT='https://api.eia.gov/v2/electricity/retail-sales/data/';
export function eiaRetailSalesUrl({apiKey,state='TX',sector='COM',length=24}) {
 if(typeof apiKey!=='string'||!apiKey.trim())throw new Error('EIA_API_KEY required');
 if(!/^[A-Z]{2}$/.test(state)||!['COM','IND','ALL','RES','TRA','OTH'].includes(sector))throw new Error('Invalid EIA scope');
 if(!Number.isInteger(length)||length<1||length>5000)throw new Error('Invalid page size');
 const url=new URL(ENDPOINT);
 for(const [k,v] of Object.entries({api_key:apiKey,frequency:'monthly','data[0]':'price','facets[stateid][]':state,'facets[sectorid][]':sector,'sort[0][column]':'period','sort[0][direction]':'desc',offset:'0',length:String(length)}))url.searchParams.set(k,v);
 return url;
}
export async function readEiaRetailSales({apiKey,state='TX',sector='COM',fetchImpl=fetch,signal}) {
 const response=await fetchImpl(eiaRetailSalesUrl({apiKey,state,sector}),{headers:{Accept:'application/json'},signal});
 if(!response.ok)throw new Error('EIA request failed: HTTP '+response.status);
 const payload=await response.json();
 if(!Array.isArray(payload?.response?.data)||payload.response.data.length>5000)throw new TypeError('Unexpected EIA data');
 return payload.response.data.flatMap(row=>{
  // Number(null) and Number('') are zero: never manufacture a zero price from missing data.
  if(!row||!['string','number'].includes(typeof row.price)||String(row.price).trim()===''||
     !/^\d{4}-(0[1-9]|1[0-2])$/.test(String(row.period)))return [];
  const price=Number(row.price);if(!Number.isFinite(price)||price<0)return [];
  if(row.stateid && row.stateid!==state)return [];
  if(row.sectorid && row.sectorid!==sector)return [];
  return [{externalKey:'retail-sales:'+state+':'+sector+':'+row.period,series:'retail-sales',period:row.period,
   state,sector,value:price,unit:'cents_per_kwh',scope:'state_sector_market_context',sourceUrl:ENDPOINT,
   publicationStatus:'not_reviewed',note:'State/sector retail average, not a data center quotation or substation availability.'}];
 });
}
