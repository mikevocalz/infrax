/** Actual CMS sessions with intercepted synthetic research responses.
 * NEVER a live admin bootstrap, live Neon test, or hardware certification.
 */
import{chromium}from'/tmp/infrax-ux-tools/node_modules/playwright/index.mjs';
import{createRequire}from'node:module';import fs from'node:fs';import assert from'node:assert/strict';import{randomBytes}from'node:crypto';import pg from'pg';
import{CONTEXT_SCHEMA,DATASETS,RESEARCH_WARNING}from'../../client/research-contract.mjs';
const db=new URL(process.env.INFRAX_CMS_DATABASE_URL??'');
if(process.env.CI!=='true'||process.env.INFRAX_CMS_TEST_MODE!=='1'||db.hostname!=='127.0.0.1'||db.pathname!=='/infrax')throw Error('Disposable CI only');
const require=createRequire(import.meta.url),{default:AxeBuilder}=require('/tmp/infrax-ux-tools/node_modules/@axe-core/playwright');
const origin='http://127.0.0.1:3000',browser=await chromium.launch(),sql=new pg.Client({connectionString:db.href});await sql.connect();
const report={scope:'Built staff screen; real disposable CMS sessions; synthetic intercepted evidence; emulated layouts only',checks:[],access:[],failures:[]};
const check=(ok,message)=>{if(!ok)report.failures.push(message);};
const data=state=>Object.entries(DATASETS).map(([dataset,spec])=>({dataset,state,period:spec.period,entityKind:spec.kind,title:'CI fixture '+dataset,recordCount:5,distinctKeys:5,sourceUrl:spec.url,sourceSha256:'a'.repeat(64),outputSha256:'b'.repeat(64),normalizationVersion:'infrax-context-v1',sourceRetrievedAt:'2026-11-06T23:33:57Z',importedAt:'2026-11-07T06:00:00Z',quality:spec.metrics.flatMap(field=>[{field,status:'reported',count:4},{field,status:'missing',count:1}]),publication:'internal_review',isCapacityOffer:false}));
const payload=state=>({schema:CONTEXT_SCHEMA,status:'ready',state,data:data(state),warning:RESEARCH_WARNING});
fs.mkdirSync('research-results',{recursive:true});
try{
 const auth=await browser.newContext();
 check((await auth.request.get(origin+'/api/v1/research/context?state=TX')).status()===401,'Anonymous research denied');
 const email='research-ci-'+randomBytes(6).toString('hex')+'@example.invalid';
 const signup=await auth.request.post(origin+'/api/auth/sign-up/email',{headers:{Origin:origin},data:{name:'CI source reviewer',email,password:'CiOnly!'+randomBytes(20).toString('hex'),role:'admin'}});
 check(signup.status()===200,'Synthetic signup failed');const user=(await signup.json()).user;
 check(user.role==='user','Signup improperly grants admin');
 check((await auth.request.get(origin+'/api/v1/research/context?state=TX')).status()===403,'Ordinary user research denied');
 report.access.push('anonymous 401; ordinary user 403; signup role escalation rejected');
 await sql.query("UPDATE cms.users SET role='admin' WHERE id=$1 AND email=$2",[user.id,email]);
 check((await (await auth.request.get(origin+'/api/auth/get-session')).json()).user.role==='admin','Test role setup not reflected in real session');
 const storageState=await auth.storageState();await auth.close();
 for(const spec of [{id:'phone-320',width:320,height:900},{id:'phone-390',width:390,height:900},{id:'tablet-768',width:768,height:900},{id:'tablet-1024',width:1024,height:900},{id:'desktop',width:1440,height:900},{id:'book',width:1114,height:900,orientation:'vertical',offset:540,maskLength:34},{id:'tabletop',width:900,height:1240,orientation:'horizontal',offset:600,maskLength:40},{id:'text-200',width:390,height:900,text:true}]){
  const context=await browser.newContext({storageState,viewport:{width:spec.width,height:spec.height},isMobile:!!spec.orientation,hasTouch:!!spec.orientation,reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.failures.push(spec.id+': '+e.message));let mode='ready';
  await page.route('**/api/v1/research/context?*',route=>{
   const state=new URL(route.request().url()).searchParams.get('state');
   if(mode==='signed_out')return route.fulfill({status:401,json:{error:'SIGN_IN_REQUIRED'}});
   if(mode==='forbidden')return route.fulfill({status:403,json:{error:'STAFF_ACCESS_REQUIRED'}});
   if(mode==='unavailable')return route.fulfill({status:503,json:{error:'RESEARCH_UNAVAILABLE'}});
   if(mode==='empty')return route.fulfill({status:200,json:{schema:CONTEXT_SCHEMA,status:'empty',state,data:[],warning:RESEARCH_WARNING}});
   const value=payload(state);if(mode==='invalid')value.data[0].sourceUrl='https://untrusted.invalid/';
   return route.fulfill({status:200,json:value});
  });
  const response=await page.goto(origin+'/account/research',{waitUntil:'networkidle'});check(response.status()===200,spec.id+' staff page status');
  const session=await context.newCDPSession(page);
  if(spec.orientation){await session.send('Emulation.setDeviceMetricsOverride',{width:spec.width,height:spec.height,deviceScaleFactor:1,mobile:true,screenWidth:spec.width,screenHeight:spec.height,displayFeature:{orientation:spec.orientation,offset:spec.offset,maskLength:spec.maskLength},devicePosture:{type:'folded'}});await page.waitForFunction(vertical=>matchMedia(vertical?'(horizontal-viewport-segments:2)':'(vertical-viewport-segments:2)').matches,spec.orientation==='vertical');}
  if(spec.text)await page.addStyleTag({content:'html{font-size:200%!important}'});
  await page.getByRole('article').first().waitFor();check(await page.getByRole('article').count()===6,spec.id+' source cards');
  await page.getByLabel('State or territory').selectOption('VA');await page.waitForFunction(()=>[...document.querySelectorAll('article p')].some(e=>e.textContent==='INTERNAL RESEARCH · VA'));
  await page.getByText('Evidence quality and provenance',{exact:true}).first().click();check(await page.getByText('Source retrieved:',{exact:false}).first().isVisible(),spec.id+' provenance details');
  const measured=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,body:document.body.getBoundingClientRect().toJSON(),header:document.querySelector('header').getBoundingClientRect().toJSON()}));
  check(!measured.overflow,spec.id+' horizontal overflow');
  if(spec.orientation==='vertical')check(measured.body.right<=spec.offset+1&&measured.header.right<=spec.offset+1,'book crosses hinge');
  if(spec.orientation==='horizontal')check(measured.body.bottom<=spec.offset+1,'tabletop crosses hinge');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();check(!axe.violations.length,spec.id+' axe violations '+axe.violations.map(v=>v.id).join(','));
  mode='invalid';await page.getByLabel('State or territory').selectOption('TX');await page.getByText('Source evidence failed validation.',{exact:false}).waitFor();check(await page.getByRole('article').count()===0,spec.id+' invalid response retained data');
  mode='ready';await page.getByRole('button',{name:'Retry',exact:true}).click();await page.getByRole('article').first().waitFor();
  mode='empty';await page.getByLabel('State or territory').selectOption('AK');await page.getByText('No normalized summaries have been imported',{exact:false}).waitFor();
  mode='forbidden';await page.getByLabel('State or territory').selectOption('VA');await page.getByText('This account does not have staff',{exact:false}).waitFor();check(await page.getByRole('article').count()===0,spec.id+' permission loss retained data');
  mode='signed_out';await page.getByLabel('State or territory').selectOption('TX');await page.getByText('Your session has expired.',{exact:false}).waitFor();
  report.checks.push({layout:spec.id,cards:6,axeViolations:axe.violations.length,measured,states:['ready','invalid_response','recovered','empty','forbidden','signed_out']});await context.close();
 }
}catch(error){report.failures.push(error.stack??String(error));}
finally{await sql.end();await browser.close();fs.writeFileSync('research-results/audit.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({layouts:report.checks.length,access:report.access,failures:report.failures}));assert.equal(report.failures.length,0,'Inspect research-results/audit.json');
