const kinds=new Set(['developer','investor','operator','advisor']);
const s=(value,max=200)=>typeof value==='string'?value.trim().slice(0,max):'';
export function parseIntake(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Invalid request payload');
 const userType=s(value.userType,40);
 if(!kinds.has(userType))throw new TypeError('Select a valid inquiry type');
 const name=s(value.name,150),organization=s(value.organization,200),email=s(value.email,254).toLowerCase();
 if(!name||!organization||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new TypeError('Name, organization and valid email are required');
 if(value.consent!==true)throw new TypeError('Consent to process your inquiry is required');
 const regions=Array.isArray(value.regions)?value.regions.filter(v=>typeof v==='string').slice(0,30).map(v=>v.slice(0,100)):[];
 return Object.freeze({
   userType,name,organization,email,
   payload:{
     deploymentSize:s(value.deploymentSize,80),timeline:s(value.timeline,80),regions,
     notes:s(value.notes,4000),assetType:s(value.assetType,100),
     capitalAmount:s(value.capitalAmount,80),availableMW:s(value.availableMW,50),
     market:s(value.market,150)
   }
 });
}