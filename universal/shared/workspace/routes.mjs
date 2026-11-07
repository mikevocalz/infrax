/** Canonical screen ownership. Visibility never replaces server authorization. */
const rows = [
 ['overview','/app','client','overview','Overview','overview'],
 ['explore','/app/explore','client','explore','Explore infrastructure','explore'],
 ['market','/app/explore/markets/:id','client','explore','Market overview','market'],
 ['facility','/app/explore/facilities/:id','client','explore','Facility evidence','facility'],
 ['scenarios','/app/align','client','align','Infra-Align','scenarios'],
 ['scenario-new','/app/align/new','client','align','New scenario','scenario-editor'],
 ['scenario','/app/align/scenarios/:id','client','align','Scenario requirements','scenario-detail'],
 ['matches','/app/align/scenarios/:id/matches','client','align','Candidate assessment','matches'],
 ['compare','/app/align/scenarios/:id/compare','client','align','Compare candidates','compare'],
 ['shortlist','/app/align/scenarios/:id/shortlist','client','align','Scenario shortlist','shortlist'],
 ['intelligence','/app/intelligence','client','intelligence','Intelligence','intelligence'],
 ['signal','/app/intelligence/signals/:id','client','intelligence','Signal and sources','signal'],
 ['watchlists','/app/intelligence/watchlists','client','intelligence','Watchlists and alerts','watchlists'],
 ['projects','/app/projects','client','projects','Projects','projects'],
 ['project','/app/projects/:id','client','projects','Project workspace','project'],
 ['diligence','/app/projects/:id/diligence','client','projects','Diligence','diligence'],
 ['tasks','/app/projects/:id/tasks','client','projects','Tasks and timeline','tasks'],
 ['documents','/app/projects/:id/documents','client','projects','Documents and evidence','documents'],
 ['reports','/app/projects/:id/reports','client','projects','Reports','reports'],
 ['discussion','/app/projects/:id/messages','client','projects','Project discussion','discussion'],
 ['operator-overview','/operator','operator','overview','Operator overview','operator-overview'],
 ['sites','/operator/sites','operator','sites','Sites and capacity','sites'],
 ['site-new','/operator/sites/new','operator','sites','Submit a site','site-editor'],
 ['site','/operator/sites/:id','operator','sites','Site workspace','site'],
 ['offers','/operator/sites/:id/offers','operator','sites','Capacity offers','offers'],
 ['site-evidence','/operator/sites/:id/evidence','operator','sites','Site evidence','site-evidence'],
 ['requests','/operator/requests','operator','requests','Qualified requests','requests'],
 ['request','/operator/requests/:id','operator','requests','Request and response','request'],
 ['operator-intelligence','/operator/intelligence','operator','intelligence','Market intelligence','intelligence'],
 ['operator-projects','/operator/projects','operator','projects','Shared projects','projects'],
 ['operator-project','/operator/projects/:id','operator','projects','Shared project','project'],
 ['ops-overview','/ops','operations','overview','Operations overview','ops-overview'],
 ['review','/ops/review','operations','review','Verification queue','review'],
 ['review-item','/ops/review/:id','operations','review','Evidence review','review-item'],
 ['sources','/ops/sources','operations','sources','Sources and pipelines','sources'],
 ['source','/ops/sources/:id','operations','sources','Source health and license','source'],
 ['cases','/ops/cases','operations','cases','Client cases','cases'],
 ['case','/ops/cases/:id','operations','cases','Case workspace','case'],
 ['content','/ops/content','operations','content','Editorial review','content'],
 ['research','/ops/research','operations','sources','Source review','research'],
 ['sign-in','/sign-in','account',null,'Sign in','sign-in'],
 ['sign-up','/sign-up','account',null,'Create account','sign-up'],
 ['recovery','/recovery','account',null,'Account recovery','recovery'],
 ['onboarding','/onboarding','account',null,'Organization setup','onboarding'],
 ['account','/account','account',null,'Account and workspace','account'],
 ['profile','/account/profile','account',null,'Profile','profile'],
 ['security','/account/security','account',null,'Security and sessions','security'],
 ['team','/account/team','account',null,'Team and access','team'],
 ['preferences','/account/preferences','account',null,'Appearance and accessibility','preferences'],
 ['notification-preferences','/account/notifications','account',null,'Notification preferences','notification-preferences'],
 ['notifications','/notifications','account',null,'Notifications','notifications'],
 ['assessment','/assessment','public',null,'Request an assessment','assessment'],
 ['coverage','/coverage','public',null,'Data coverage','coverage'],
 ['methodology','/methodology','public',null,'Verification methodology','methodology'],
 ['attribution','/attribution','public',null,'Sources and attribution','attribution'],
 ['support','/support','public',null,'Help and support','support'],
 ['report-problem','/support/report','public',null,'Report a problem','report-problem'],
 ['privacy','/privacy','public',null,'Privacy information','policy'],
 ['terms','/terms','public',null,'Terms of use','policy'],
];
export const SCREENS=Object.freeze(rows.map(([id,path,workspace,tab,title,component])=>Object.freeze({id,path,workspace,tab,title,component})));
export const NAV=Object.freeze({
 client:Object.freeze([['overview','Overview','/app'],['explore','Explore','/app/explore'],['align','Infra-Align','/app/align'],['intelligence','Intelligence','/app/intelligence'],['projects','Projects','/app/projects']]),
 operator:Object.freeze([['overview','Overview','/operator'],['sites','Sites','/operator/sites'],['requests','Requests','/operator/requests'],['intelligence','Intelligence','/operator/intelligence'],['projects','Projects','/operator/projects']]),
 operations:Object.freeze([['overview','Overview','/ops'],['review','Review','/ops/review'],['sources','Sources','/ops/sources'],['cases','Cases','/ops/cases'],['content','Content','/ops/content']]),
});
export const PUBLIC_HEADER=Object.freeze(['Platform','Solutions','Insights','Company']);
export const DRAWER=Object.freeze([
 ['Workspace',[['Organization and workspace','/account'],['Team and access','/account/team']]],
 ['My account',[['Profile','/account/profile'],['Security and sessions','/account/security']]],
 ['Preferences',[['Notifications','/account/notifications'],['Appearance and accessibility','/account/preferences']]],
 ['Data and trust',[['Data coverage','/coverage'],['Verification methodology','/methodology'],['Sources and attribution','/attribution']]],
 ['Help',[['Help and support','/support'],['Report a problem','/support/report']]],
 ['Policies',[['Privacy','/privacy'],['Terms','/terms']]],
]);
export function cleanPath(value){
 if(typeof value!=='string'||value.length>2048||!value.startsWith('/')||value.startsWith('//')||/[\\\s\x00-\x1f%]/.test(value))return null;
 const p=value.split(/[?#]/)[0].replace(/\/$/,'')||'/';
 if(p.includes('//')||/\/(?:\.|\.\.)(?:\/|$)/.test(p))return null;return p==='/'?'/app':p;
}
export function resolveScreen(value){
 const path=cleanPath(value);if(!path)return null;
 const parts=path.split('/');
 // Exact paths win over entity IDs such as the literal `new`.
 const exact=SCREENS.find(s=>s.path===path);if(exact)return {...exact,params:{},href:path};
 for(const s of SCREENS){const pattern=s.path.split('/');if(pattern.length!==parts.length)continue;const params={};
  if(pattern.every((p,i)=>{if(p[0]!==':')return p===parts[i];if(!/^[A-Za-z0-9_-]{1,128}$/.test(parts[i]))return false;params[p.slice(1)]=parts[i];return true;}))return {...s,params,href:path};
 }return null;
}
export function route(id,params={}){const s=SCREENS.find(s=>s.id===id);if(!s)throw Error('Unknown screen');return s.path.replace(/:([a-z]+)/g,(_,key)=>{const v=params[key];if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,128}$/.test(v))throw Error('Invalid route identifier');return v;});}
export function access(screen,session){
 if(!screen)return 'not_found';
 if(screen.workspace==='public'||['sign-in','sign-up','recovery'].includes(screen.id))return 'allowed';
 if(!session?.user?.id)return 'signed_out';
 if(screen.workspace==='operations'&&session.user.role!=='admin')return 'forbidden';
 if(screen.workspace==='operator'&&!session.organizations?.some(o=>['operator','developer'].includes(o.kind)))return 'forbidden';
 return 'allowed';
}
export function workspaceFor(screen,fallback='client'){return Object.hasOwn(NAV,screen?.workspace)?screen.workspace:fallback;}
export const STEPS=Object.freeze(['Workload','Power and density','Location and timing','Cooling and network','Priorities','Review']);
