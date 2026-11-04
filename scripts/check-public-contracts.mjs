import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const routes=['','services','solutions','platform','intelligence','metrics','why-infrax','about','partners','capital','execution','contact'];
for(const route of routes)assert.ok(existsSync(resolve('app',route,'page.tsx')),'Missing public route /'+route);
for(const path of ['app/api/v1/candidates/route.ts','app/api/v1/assets/route.ts','app/api/v1/intel/signals/route.ts']){
 const text=readFileSync(resolve(path),'utf8');
 assert.doesNotMatch(text,/from ['"]@\/lib\/mock-data/,'No mock API allowed: '+path);
}
const home=readFileSync('components/pages/HomePage.tsx','utf8');
assert.doesNotMatch(home,/7 live candidates/,'Unverified live candidate assertion');
const partners=readFileSync('components/pages/PartnersPage.tsx','utf8');
assert.doesNotMatch(partners,/VERIFIED_INFRAX_NODE|Tier 1 Provider [\{0-9]/,'Fictional partnership claims');
console.log('Validated '+routes.length+' routes, API fixture exclusions and P0 trust labels');
