/** Shared validation used by native/web forms AND the server boundary. */
export const FIELDS=Object.freeze({
 scenario:[['name','Scenario name','text',true],['workload','Workload / business objective','text',true],['minimumItMw','Minimum critical IT power (MW)','number',true],['maximumItMw','Maximum critical IT power (MW)','number',true],['densityKw','Target rack density (kW/rack)','number',false],['regions','States or markets, separated by commas','text',true],['timelineMonths','Delivery timeline (months)','number',true],['cooling','Cooling: any, air, liquid, hybrid or immersion','text',true],['redundancy','Required redundancy / certification','text',false],['network','Connectivity requirements','text',false],['priorities','Priorities and unresolved assumptions','multiline',false]],
 site:[['name','Site name','text',true],['state','State or territory code','text',true],['locality','City / locality','text',true],['operator','Operating company','text',true],['lifecycle','Lifecycle: planned, under construction, operational','text',true],['specifications','Power, cooling and network specifications','multiline',true]],
 offer:[['name','Offer / product name','text',true],['criticalItMw','Proposed critical IT capacity (MW)','number',true],['deliveryDate','Proposed service date (YYYY-MM-DD)','text',true],['cooling','Cooling specification','text',true],['terms','Commercial scope and dependencies','multiline',true],['evidence','Evidence reference (no confidential URLs)','text',true]],
 project:[['name','Project name','text',true],['objective','Scope and objective','multiline',true]],
 task:[['name','Task','text',true],['assignee','Assigned person or team','text',false],['dueDate','Due date (YYYY-MM-DD)','text',false],['notes','Acceptance criteria','multiline',false]],
 document:[['name','Document title','text',true],['reference','Document reference / authorized source URL','text',true],['notes','What this evidence establishes','multiline',true]],
 message:[['name','Subject','text',true],['body','Message','multiline',true]],
 response:[['name','Response subject','text',true],['body','Response and open questions','multiline',true]],
 watch:[['name','Watchlist name','text',true],['state','State or territory code','text',true],['category','Signal category','text',false]],
 review:[['name','Decision: needs_info, accepted or rejected','text',true],['notes','Evidence reviewed and decision reason','multiline',true]],
 assessment:[['name','Full name','text',true],['email','Work email','email',true],['organization','Organization','text',true],['userType','Role: developer, investor, operator or advisor','text',true],['regions','Preferred regions','text',false],['notes','Requirements / message','multiline',true]],
 organization:[['name','Organization name','text',true]],
 profile:[['name','Display name','text',true]],
 password:[['currentPassword','Current password','password',true],['newPassword','New password (at least 12 characters)','password',true]],
 signIn:[['email','Email','email',true],['password','Password','password',true]],
 signUp:[['name','Full name','text',true],['email','Email','email',true],['password','Password (at least 12 characters)','password',true]],
});
export const DEFAULT_SCENARIO=Object.freeze({name:'',workload:'',minimumItMw:'5',maximumItMw:'10',densityKw:'',regions:'TX',timelineMonths:'12',cooling:'any',redundancy:'',network:'',priorities:''});
export function validateForm(kind,value){
 const spec=FIELDS[kind];if(!spec||!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid form');
 const out={},errors={};
 for(const [key,label,type,required]of spec){const raw=value[key];const text=typeof raw==='string'?raw.trim():typeof raw==='number'?String(raw):'';
  if(text.length>4000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))errors[key]='Remove unsupported characters or shorten this field.';
  else if(required&&!text)errors[key]=label+' is required.';
  else if(type==='number'&&text&&(!Number.isFinite(Number(text))||Number(text)<0))errors[key]='Enter a finite, non-negative number.';
  else if(type==='email'&&text&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))errors[key]='Enter a valid email address.';
  else if(['deliveryDate','dueDate'].includes(key)&&text&&(!/^\d{4}-\d{2}-\d{2}$/.test(text)||!Number.isFinite(Date.parse(text))||new Date(text).toISOString().slice(0,10)!==text))errors[key]='Enter a valid date as YYYY-MM-DD.';
  out[key]=text;
 }
 if(kind==='scenario'){
  if(!(Number(out.minimumItMw)>0&&Number(out.minimumItMw)<=10000))errors.minimumItMw='Minimum must be greater than zero and at most 10,000 MW.';
  if(!(Number(out.maximumItMw)>=Number(out.minimumItMw)&&Number(out.maximumItMw)<=10000))errors.maximumItMw='Maximum must be at least the minimum and at most 10,000 MW.';
  if(!Number.isInteger(Number(out.timelineMonths))||Number(out.timelineMonths)<1||Number(out.timelineMonths)>120)errors.timelineMonths='Enter 1–120 whole months.';
  if(!['any','air','liquid','hybrid','immersion'].includes(out.cooling))errors.cooling='Choose any, air, liquid, hybrid or immersion.';
 }
 if(kind==='offer'&&!(Number(out.criticalItMw)>0&&Number(out.criticalItMw)<=10000))errors.criticalItMw='Capacity must be greater than zero and at most 10,000 MW.';
 if(['signUp','password'].includes(kind)&&String(out.password??out.newPassword).length<12)errors[kind==='password'?'newPassword':'password']='Use at least 12 characters.';
 if(kind==='assessment'&&!['developer','investor','operator','advisor'].includes(out.userType))errors.userType='Choose developer, investor, operator or advisor.';
 if(kind==='review'&&!['needs_info','accepted','rejected'].includes(out.name))errors.name='Choose needs_info, accepted or rejected.';
 if(out.state&&!/^[A-Z]{2}$/.test(out.state))errors.state='Use a two-letter uppercase code.';
 return {ok:!Object.keys(errors).length,value:out,errors};
}
export function safeSource(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&u.href.length<2048?u.href:null;}catch{return null;}}
/** No invented probability or reference price. Unknown fields remain unresolved. */
export function assessOffer(requirements,offer,now=new Date()){
 const failures=[],unknown=[];const r=requirements??{},o=offer??{};
 const capacity=Number(o.critical_it_mw);
 if(!Number.isFinite(capacity)||capacity<=0)unknown.push('Deliverable IT power is not confirmed.');else if(capacity<Number(r.minimumItMw??r.minimum_it_mw))failures.push('Below minimum critical IT power.');
 if(!o.verified_at||!o.expires_at||new Date(o.expires_at)<=now)unknown.push('Current independent offer verification is missing.');
 const regions=Array.isArray(r.regions)?r.regions:String(r.regions??'').split(',').map(x=>x.trim());
 if(regions.length&&o.state&&!regions.includes(o.state))failures.push('Outside requested regions.');
 if(!o.delivery_date)unknown.push('Delivery date is not confirmed.');
 if(r.cooling&&r.cooling!=='any'&&!o.cooling)unknown.push('Required cooling is not confirmed.');
 if(r.redundancy)unknown.push('Redundancy / certification needs document review.');
 if(r.network)unknown.push('Network diversity needs document review.');
 return {status:failures.length?'excluded':unknown.length?'needs_diligence':'eligible_for_review',failures,unknown,score:null};
}
