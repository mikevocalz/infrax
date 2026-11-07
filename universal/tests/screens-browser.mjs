/** Built Next -> real proxy -> explicit synthetic upstream. No real customer writes. */
import http from'node:http';import fs from'node:fs';import assert from'node:assert/strict';import{createRequire}from'node:module';
import{chromium}from'/tmp/infrax-universal-tools/node_modules/playwright/index.mjs';
import{SCREENS,route}from'../shared/workspace/routes.mjs';import{DEFAULT_SCENARIO}from'../shared/workspace/forms.mjs';import{DATASETS}from'../../client/research-contract.mjs';
const require=createRequire(import.meta.url),{default:AxeBuilder}=require('/tmp/infrax-universal-tools/node_modules/@axe-core/playwright');
const ID='11111111-1111-4111-8111-111111111111',ORG='22222222-2222-4222-8222-222222222222';const writes=[];
const source=http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1:3199');const send=(code,data,headers={})=>{res.writeHead(code,{'Content-Type':'application/json',...headers});res.end(JSON.stringify(data));};
 const authenticated=req.headers.cookie?.includes('screen_fixture=admin'),ordinary=req.headers.cookie?.includes('screen_fixture=member');
 if(u.pathname==='/api/v1/workspace/session')return send(200,{user:authenticated||ordinary?{id:'1',name:'Synthetic screen-test account',email:'ci@example.invalid',role:authenticated?'admin':'user'}:null,organizations:authenticated||ordinary?[{id:ORG,name:'Synthetic screen-test organization',kind:authenticated?'operator':'buyer',role:'owner'}]:[],capabilities:{workspace:true,signup:true,recovery:false,fileUpload:false,reportGeneration:false,emailDispatch:false}});
 if(u.pathname==='/api/v1/research/context'){
  if(!authenticated)return send(403,{error:'STAFF_ONLY'});const state=u.searchParams.get('state'),[dataset,spec]=Object.entries(DATASETS)[0];return send(200,{schema:'infrax-market-context-v2',status:'ready',state,data:[{dataset,state,period:spec.period,entityKind:spec.kind,title:'Synthetic source evidence',recordCount:1,distinctKeys:1,sourceUrl:spec.url,sourceSha256:'a'.repeat(64),outputSha256:'b'.repeat(64),normalizationVersion:'infrax-context-v1',sourceRetrievedAt:'2026-11-01T00:00:00Z',importedAt:'2026-11-02T00:00:00Z',quality:[{field:'nameplate_capacity',status:'reported',count:1}],publication:'internal_review',isCapacityOffer:false}]});
 }
 if(req.method==='POST'){let body='';for await(const c of req)body+=c;writes.push({path:u.pathname,body:JSON.parse(body),key:req.headers['idempotency-key']});return send(201,{id:ID,receiptId:ID,ok:true,status:'saved',version:1});}
 if(!authenticated&&!ordinary&&!['/api/v1/assets','/api/v1/candidates','/api/v1/intel/signals'].includes(u.pathname))return send(401,{error:'SIGN_IN_REQUIRED'});
 const resource=u.pathname.split('/').at(-1);let data={name:'Synthetic '+resource,notes:'Explicit screen-test fixture, not customer data.'};
 if(resource==='scenarios')data={...DEFAULT_SCENARIO,name:'Synthetic scenario',workload:'Test workload'};
 if(resource==='projects')data={name:'Synthetic project',objective:'Test the shared project screens.'};
 if(resource==='sites')data={name:'Synthetic site',state:'TX',locality:'Test city',operator:'Synthetic operator',lifecycle:'planned',specifications:'Not real facility evidence.'};
 if(resource==='sources')data={licenseUrl:'https://www.eia.gov/about/copyrights_reuse.php',usage:'internal',reviewedAt:'2026-11-01',redistributionApproved:false,notes:'Synthetic fixture.'};
 if(resource==='cases')data={name:'Synthetic person',email:'ci@example.invalid',type:'advisor',requirements:{notes:'Not a real inquiry.'}};
 if(resource==='content')data={slug:'synthetic-page',summary:'Not published content.'};
 const record={id:ID,name:'Synthetic '+resource,headline:'Synthetic regional signal',data,kind:resource,status:'reported',version:1,createdAt:'2026-11-01T00:00:00Z',state:'TX',locality:'Test city',country:'US',lifecycle:'planned',geography:'TX',category:'grid',critical_it_mw:10,verified_at:'2026-11-01T00:00:00Z',expires_at:'2027-01-01T00:00:00Z',delivery_date:'2027-01-01',source_url:'https://www.eia.gov/',published_at:'2026-11-01T00:00:00Z'};
 return send(200,{data:[record],status:'ready',nextCursor:null});
});
await new Promise(r=>source.listen(3199,'127.0.0.1',r));const browser=await chromium.launch();
const report={scope:'Shared-screen browser audit with synthetic HTTP data, not native device or live Neon verification',screenCount:SCREENS.length,checks:[],accessibility:[],interactions:[],errors:[],failures:[]};fs.mkdirSync('../host-results',{recursive:true});
try{
 for(const spec of [{id:'phone',width:390,height:844},{id:'compact',width:320,height:720},{id:'desktop',width:1440,height:900},{id:'book',width:1114,height:900,orientation:'vertical',offset:540,maskLength:34},{id:'tabletop',width:900,height:1240,orientation:'horizontal',offset:600,maskLength:40}]){
  const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},isMobile:Boolean(spec.orientation),hasTouch:true,reducedMotion:'reduce'});await context.addCookies([{name:'screen_fixture',value:'admin',domain:'127.0.0.1',path:'/'}]);const page=await context.newPage();page.on('pageerror',e=>report.errors.push(spec.id+': '+e.message));const cdp=await context.newCDPSession(page);
  for(const screen of SCREENS){const path=route(screen.id,{id:ID});const response=await page.goto('http://127.0.0.1:3100'+path,{waitUntil:'networkidle'});
   if(spec.orientation)await cdp.send('Emulation.setDeviceMetricsOverride',{width:spec.width,height:spec.height,deviceScaleFactor:1,mobile:true,screenWidth:spec.width,screenHeight:spec.height,displayFeature:{orientation:spec.orientation,offset:spec.offset,maskLength:spec.maskLength},devicePosture:{type:'folded'}});
   await page.getByTestId('workspace-frame').waitFor();await page.getByText('Synthetic screen-test organization',{exact:true}).first().waitFor();
   const text=await page.locator('body').innerText();assert.ok(!text.includes('No renderer has been registered'),screen.id);assert.equal(response.status(),200,screen.id);
   const bounds=await page.getByTestId('workspace-frame').boundingBox();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,screen.id+' overflow');
   if(spec.orientation==='vertical')assert.ok(bounds.x+bounds.width<=spec.offset+1,screen.id+' book hinge');if(spec.orientation==='horizontal')assert.ok(bounds.y+bounds.height<=spec.offset+1,screen.id+' tabletop hinge');
   report.checks.push({screen:screen.id,layout:spec.id,http:response.status(),bounds});
  }
  await page.goto('http://127.0.0.1:3100/app/align/new',{waitUntil:'networkidle'});await page.getByLabel('Scenario name *',{exact:true}).fill('Retained synthetic draft');
  await page.getByRole('button',{name:'Open workspace and account drawer'}).click();await page.getByRole('dialog').waitFor();
  for(let i=0;i<25;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.querySelector('dialog[open]').contains(document.activeElement)),true);}
  const dialog=await page.getByRole('dialog').boundingBox();if(spec.orientation==='vertical')assert.ok(dialog.x+dialog.width<=spec.offset+1);if(spec.orientation==='horizontal')assert.ok(dialog.y+dialog.height<=spec.offset+1);
  await page.keyboard.press('Escape');assert.equal(await page.getByLabel('Scenario name *',{exact:true}).inputValue(),'Retained synthetic draft');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.accessibility.push({layout:spec.id,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))});assert.equal(axe.violations.filter(v=>['critical','serious'].includes(v.impact)).length,0);
  const capture=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync('../host-results/workspace-'+spec.id+'.png',Buffer.from(capture.data,'base64'));
  if(spec.orientation){await cdp.send('Emulation.clearDisplayFeaturesOverride');await cdp.send('Emulation.clearDeviceMetricsOverride');}
  await page.setViewportSize({width:430,height:900});assert.equal(await page.getByLabel('Scenario name *',{exact:true}).inputValue(),'Retained synthetic draft');report.interactions.push({layout:spec.id,drawerFocus:'passed',draftResize:'retained'});await context.close();
 }
 const member=await browser.newContext();await member.addCookies([{name:'screen_fixture',value:'member',domain:'127.0.0.1',path:'/'}]);const denied=await member.newPage();await denied.goto('http://127.0.0.1:3100/ops/review');await denied.getByText('Workspace access required',{exact:true}).waitFor();await member.close();
 const anon=await browser.newContext();const guest=await anon.newPage();await guest.goto('http://127.0.0.1:3100/app/projects');await guest.getByText('Sign in to continue',{exact:true}).waitFor();await anon.close();
 assert.equal(report.errors.length,0);
}catch(e){report.failures.push(e.stack??String(e));}finally{await browser.close();await new Promise(r=>source.close(r));report.writes=writes.length;fs.writeFileSync('../host-results/screens-browser.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({screens:report.screenCount,checks:report.checks.length,failures:report.failures,errors:report.errors},null,2));assert.equal(report.failures.length,0);
