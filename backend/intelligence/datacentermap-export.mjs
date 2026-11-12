import {createHash} from 'node:crypto';
/** Licensed Data Center Map export -> quarantine candidate only.
 * Never requests/scrapes the provider; caller supplies a file acquired with authorized rights.
 * Operator confirmed offers are a different ingestion process.
 */
const MAX_BYTES=10_000_000,MAX_ROWS=25000;
function parseCsv(text){
 if(typeof text!=='string'||Buffer.byteLength(text,'utf8')>MAX_BYTES)throw new Error('INVALID_EXPORT_SIZE');
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(quoted){if(c==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"')quoted=false;else cell+=c;}
  else if(c==='"'){if(cell!=='')throw new Error('INVALID_CSV_QUOTE');quoted=true;}
  else if(c===','){row.push(cell.trim());cell='';}
  else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());cell='';if(row.some(Boolean))rows.push(row);row=[];if(rows.length>MAX_ROWS+1)throw new Error('EXPORT_ROW_LIMIT');}
  else cell+=c;
 }
 if(quoted)throw new Error('UNCLOSED_CSV_QUOTE');row.push(cell.trim());if(row.some(Boolean))rows.push(row);
 return rows;
}
const key=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
function optionalNumber(value,min,max){if(value===''||value===undefined)return null;const n=Number(value);return Number.isFinite(n)&&n>=min&&n<=max?n:null;}
const str=(v,max=240)=>typeof v==='string'?v.trim().slice(0,max):'';
export function normalizeFacilityExport(csv,{licensed=false,sourceVersion='unspecified'}={}){
 if(!licensed)throw new Error('LICENSED_EXPORT_REQUIRED');
 const [header,...rows]=parseCsv(csv.replace(/^\uFEFF/,''));
 if(!header||!rows.length)throw new Error('EMPTY_EXPORT');
 const normalizedHeader=header.map(key),indices=new Map(normalizedHeader.map((h,i)=>[h,i]));
 if(!indices.has('datacenterid')||!indices.has('datacentername')||!indices.has('country'))throw new Error('REQUIRED_COLUMNS_MISSING');
 if(new Set(normalizedHeader).size!==normalizedHeader.length)throw new Error('DUPLICATE_HEADERS');
 const accepted=[],rejected=[],seen=new Set();
 for(let i=0;i<rows.length;i++){const row=rows[i],get=(name)=>str(row[indices.get(key(name))]??'');
  const id=get('Data Center ID'),name=get('Data Center Name'),country=get('Country');
  if(row.length!==header.length||!id||!name||!country||seen.has(id)){rejected.push({row:i+2,reason:'MISSING_OR_DUPLICATE_IDENTITY'});continue;}
  const lat=optionalNumber(get('Latitude'),-90,90),lon=optionalNumber(get('Longitude'),-180,180);
  const latitudeRaw=get('Latitude'),longitudeRaw=get('Longitude');
  if((latitudeRaw||longitudeRaw)&&(lat===null||lon===null)){rejected.push({row:i+2,reason:'INVALID_COORDINATES'});continue;}
  const builtOutPowerMw=optionalNumber(get('Fully Built-Out Power (MW)'),0,1_000_000);
  const rawPower=get('Fully Built-Out Power (MW)');
  if(rawPower&&builtOutPowerMw===null){rejected.push({row:i+2,reason:'INVALID_REPORTED_POWER'});continue;}
  seen.add(id);
  accepted.push(Object.freeze({source:'datacentermap-directory',externalId:id,name,operator:get('Company Name')||null,city:get('City')||null,state:get('State')||null,country,market:get('Market')||null,lifecycle:get('Lifecycle Stage')||'unverified',location:lat===null?null:{lat,lon},builtOutPowerMw,availableCapacityMw:null,availableCapacityVerified:false,sourceVersion,provenance:'provider_export_unverified',publicDiscoveryAllowed:false}));
 }
 return {source:'datacentermap-directory',sourceVersion,checksum:createHash('sha256').update(csv).digest('hex'),accepted,rejected,summary:{received:rows.length,accepted:accepted.length,rejected:rejected.length,publications:0,operatorOffersCreated:0}};
}
