/** Built local CI app only. Synthetic intake HTTP responses are explicitly intercepted. */
import{chromium}from'/tmp/infrax-ux-tools/node_modules/playwright/index.mjs';
import{createRequire}from'node:module';import fs from'node:fs';import assert from'node:assert/strict';
import{PUBLIC_ROUTES,SITE_NAV}from'../../lib/ux/navigation.mjs';
const require=createRequire(import.meta.url),{default:AxeBuilder}=require('/tmp/infrax-ux-tools/node_modules/@axe-core/playwright');
const origin='http://127.0.0.1:3000';fs.mkdirSync('ux-results',{recursive:true});
const browser=await chromium.launch(),report={routeChecks:[],interactions:[],accessibility:[],pageErrors:[],failures:[]};
const check=(yes,message)=>{if(!yes)report.failures.push(message);};
try{
 for(const width of [320,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  for(const route of PUBLIC_ROUTES){
   const r=await page.goto(origin+route,{waitUntil:'networkidle'});
   const data=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth+1,links:[...document.querySelectorAll('main a,header a,footer a')].map(e=>e.getAttribute('href')),text:document.body.innerText}));
   report.routeChecks.push({route,width,status:r.status(),...data});
   check(r.status()===200,route+' returns '+r.status());check(data.h1.length===1,route+' needs one H1 at '+width);check(!data.overflow,route+' horizontal overflow at '+width);
   check(!/7 Candidates|Live Data|VERIFIED_INFRAX_NODE|Tier 1 Provider|Assets Under Review|Active Phase|HIPAA-compliant SOC/.test(data.text),route+' retains misleading content');
   for(const href of data.links){if(!href?.startsWith('/'))continue;const dest=href.split(/[?#]/)[0];check([...PUBLIC_ROUTES,'/account','/sign-in'].includes(dest),'unmounted link '+href+' on '+route);}
   if(width===390||width===1440){
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    report.accessibility.push({route,width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    check(!axe.violations.some(v=>v.impact==='critical'||v.impact==='serious'),'serious accessibility finding '+route+' at '+width);
   }
   if(['/','/solutions','/platform','/contact'].includes(route)&&(width===390||width===1440))await page.screenshot({path:'ux-results/'+(route.replaceAll('/','')||'home')+'-'+width+'.png',fullPage:true});
  }
  await page.goto(origin+'/solutions',{waitUntil:'networkidle'});
  if(width<1101){
   await page.getByRole('button',{name:'Menu',exact:true}).click();await page.waitForSelector('dialog[open]');
   const box=await page.locator('dialog[open]').boundingBox();check(Math.abs(box.x+box.width-width)<2,'drawer not right-aligned '+width);check(box.height>=898,'drawer became a bottom sheet '+width);
   for(const group of SITE_NAV){await page.getByRole('dialog').getByRole('button',{name:group.label,exact:true}).click();for(const item of group.items)check(await page.getByRole('dialog').getByRole('link',{name:item.label,exact:true}).isVisible(),'missing drawer link '+item.href);}
   for(let i=0;i<25;i++){await page.keyboard.press('Tab');check(await page.evaluate(()=>document.querySelector('dialog')?.contains(document.activeElement)),'focus escaped modal '+width);}
   if(width===390)await page.screenshot({path:'ux-results/menu-390.png'});
   await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
   check(await page.getByRole('button',{name:'Menu',exact:true}).evaluate(e=>e===document.activeElement),'focus not returned');
   check(await page.evaluate(()=>document.body.style.overflow!=='hidden'),'scroll remained locked');
  }else{
   const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});check(await nav.getByRole('button').count()===4,'desktop header needs exactly four groups');
   await nav.getByRole('button',{name:'Platform',exact:true}).click();check(await nav.getByRole('link',{name:'Infra-Align overview',exact:true}).isVisible(),'desktop disclosure missing');await page.keyboard.press('Escape');check(await nav.getByRole('button',{name:'Platform',exact:true}).getAttribute('aria-expanded')==='false','desktop Escape not closing');
  }
  report.interactions.push({width,menu:'exercised'});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:900}});
 await page.goto(origin+'/contact?audience=operator',{waitUntil:'networkidle'});check(await page.getByLabel('Your role').inputValue()==='operator','operator journey context lost');
 await page.getByLabel('Full name').fill('UX Test');await page.getByLabel('Work email').fill('ux@example.org');await page.getByLabel('Organization',{exact:true}).fill('Test organization');await page.getByLabel('I authorize').check();
 await page.getByRole('button',{name:'Review request',exact:true}).click();check(await page.getByLabel('Full name').isDisabled(),'review is not read-only');await page.getByRole('button',{name:'Edit details',exact:true}).click();check(await page.getByLabel('Full name').isEnabled(),'edit does not restore fields');
 let calls=[];await page.route('**/api/v1/intake',async route=>{calls.push({key:route.request().headers()['idempotency-key'],body:route.request().postData()});if(calls.length===1)return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'SERVICE_UNAVAILABLE'})});return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({status:'received',receiptId:'550e8400-e29b-41d4-a716-446655440000',notificationStatus:'queued'})});});
 await page.getByRole('button',{name:'Review request',exact:true}).click();await page.getByRole('button',{name:'Confirm and submit',exact:true}).click();await page.getByRole('button',{name:'Retry same request',exact:true}).waitFor();await page.getByRole('button',{name:'Retry same request',exact:true}).click();await page.getByRole('heading',{name:'Request received',exact:true}).waitFor();check(calls.length===2&&calls[0].key===calls[1].key&&calls[0].body===calls[1].body,'uncertain retry changed identity');report.interactions.push({form:'review/edit and duplicate-safe retry; HTTP responses intercepted'});
 await page.unroute('**/api/v1/intake');await page.goto(origin+'/contact',{waitUntil:'networkidle'});await page.getByLabel('Full name').fill('UX Test');await page.getByLabel('Work email').fill('ux@example.org');await page.getByLabel('Organization',{exact:true}).fill('Test organization');await page.getByLabel('I authorize').check();await page.route('**/api/v1/intake',r=>r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:'INVALID_INPUT'})}));await page.getByRole('button',{name:'Review request',exact:true}).click();await page.getByRole('button',{name:'Confirm and submit',exact:true}).click();await page.getByRole('button',{name:'Review request',exact:true}).waitFor();check(await page.getByLabel('Full name').isEnabled(),'validation rejection trapped the user');report.interactions.push({form:'confirmed rejection permits editing; HTTP response intercepted'});
 await page.close();check(report.pageErrors.length===0,'uncaught browser errors');
}catch(e){report.failures.push(e.stack??String(e));}
finally{fs.writeFileSync('ux-results/audit.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({routeChecks:report.routeChecks.length,interactions:report.interactions.length,scans:report.accessibility.length,failures:report.failures},null,2));
assert.equal(report.failures.length,0,'Public UX checks failed; inspect ux-results/audit.json');
