/** Public marketing navigation, not application tabs. Only mounted routes are listed. */
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const SITE_NAV=deepFreeze([
 {id:'platform',label:'Platform',description:'Understand the product and our approach.',items:[{label:'Infra-Align overview',href:'/platform'},{label:'What we do',href:'/services'},{label:'How we work',href:'/execution'}]},
 {id:'solutions',label:'Solutions',description:'Start with the decision you need to make.',items:[{label:'Who we help',href:'/solutions'},{label:'Capital advisory',href:'/capital'},{label:'For operators & partners',href:'/partners'}]},
 {id:'insights',label:'Insights',description:'Understand the evidence behind a decision.',items:[{label:'Market intelligence',href:'/intelligence'},{label:'Infrastructure metrics',href:'/metrics'}]},
 {id:'company',label:'Company',description:'Meet InFraX and understand our role.',items:[{label:'About & leadership',href:'/about'},{label:'Why InFraX',href:'/why-infrax'}]}
]);
export const ASSESSMENT_ACTION=Object.freeze({label:'Request assessment',href:'/contact'});
export const PUBLIC_ROUTES=Object.freeze(['/',...SITE_NAV.flatMap(g=>g.items.map(i=>i.href)),'/contact']);
export function activeGroup(pathname){return SITE_NAV.find(g=>g.items.some(i=>i.href===pathname))?.id??null;}
export function contactIntent(search=''){
 const audience=new URLSearchParams(search).get('audience');
 return ({enterprise:'developer',developer:'developer',operator:'operator',investor:'investor',agency:'advisor'})[audience]??null;
}
export function auditNavigation(){
 const routes=SITE_NAV.flatMap(g=>g.items.map(i=>i.href));
 if(SITE_NAV.length!==4||new Set(routes).size!==routes.length)throw new Error('Public hierarchy must have four groups and unique destinations');
 if(routes.some(p=>!p.startsWith('/')||p.startsWith('//')||p.includes('#')||p.includes('/app')))throw new Error('Unexpected public route');
 return {groups:SITE_NAV.length,pages:PUBLIC_ROUTES.length};
}
