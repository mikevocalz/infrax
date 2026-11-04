/**
 * EIA APIv2 electricity retail-sales market-context reader.
 * Does not imply site-specific power availability, headroom or sellable inventory.
 * Docs: https://www.eia.gov/opendata/documentation.php
 */
const EIA_ENDPOINT = 'https://api.eia.gov/v2/electricity/retail-sales/data/';
export function eiaRetailSalesUrl({ apiKey, state='TX', sector='COM', length=24 }) {
 if (!apiKey?.trim()) throw new Error('EIA_API_KEY required');
 if (!/^[A-Z]{2}$/.test(state)) throw new Error('US state code required');
 if (!['COM','IND','ALL','RES','TRA','OTH'].includes(sector)) throw new Error('Invalid EIA sector');
 if (!Number.isInteger(length)||length<1||length>5000) throw new Error('Invalid page size');
 const u=new URL(EIA_ENDPOINT);
 u.searchParams.set('api_key',apiKey);
 u.searchParams.set('frequency','monthly');
 u.searchParams.set('data[0]','price');
 u.searchParams.set('facets[stateid][]',state);
 u.searchParams.set('facets[sectorid][]',sector);
 u.searchParams.set('sort[0][column]','period');
 u.searchParams.set('sort[0][direction]','desc');
 u.searchParams.set('offset','0');
 u.searchParams.set('length',String(length));
 return u;
}
export async function readEiaRetailSales({apiKey,state='TX',sector='COM',fetchImpl=fetch,signal}) {
 const url=eiaRetailSalesUrl({apiKey,state,sector});
 const res=await fetchImpl(url,{headers:{Accept:'application/json'},signal});
 if(!res.ok) throw new Error('EIA request failed: HTTP '+res.status);
 const payload=await res.json();
 if(!Array.isArray(payload?.response?.data)) throw new TypeError('Unexpected EIA response format');
 return payload.response.data.map(row=>{
  const price=Number(row.price);
  if(!/^\d{4}-\d{2}$/.test(String(row.period)) || !Number.isFinite(price) || price<0) return null;
  return {
   externalKey: 'retail-sales:'+state+':'+sector+':'+row.period,
   series:'retail-sales', period:row.period, state, sector,
   value:price, unit: 'cents_per_kwh',
   scope:'state_sector_market_context', sourceUrl:EIA_ENDPOINT,
   publicationStatus:'not_reviewed', // not an automatically public market signal
   note:'State/sector average retail electricity price, NOT a data center quotation or substation availability.'
  };
 }).filter(Boolean);
}