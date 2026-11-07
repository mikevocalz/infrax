/** Built universal Next host -> actual read-only BFF -> explicitly synthetic localhost upstream.
 * No live sessions, Neon credentials, imported sources or customer operations are used.
 */
import http from 'node:http';import fs from 'node:fs';import assert from 'node:assert/strict';
import{chromium}from'/tmp/infrax-universal-tools/node_modules/playwright/index.mjs';
import{createRequire}from'node:module';
const require=createRequire(import.meta.url),{default:AxeBuilder}=require('/tmp/infrax-universal-tools/node_modules/@axe-core/playwright');
import{DATASETS}from'../../client/research-contract.mjs';
const requests=[];
const upstream=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:3199');requests.push({path:url.pathname,state:url.searchParams.get('state'),hasCookie:Boolean(req.headers.cookie)});
 const send=(code,body)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(body));};
 if(url.pathname!=='/api/v1/research/context')return send(404,{error:'TEST_NOT_FOUND'});
 if(!req.headers.cookie?.includes('test_staff=yes'))return send(403,{error:'TEST_FORBIDDEN'});
 const state=url.searchParams.get('state');
 if(state==='AK')return send(503,{error:'TEST_OUTAGE'});
 if(state==='NV')return send(200,{schema:'unrecognized',state,data:[{power:999}]});
 const [dataset,spec]=Object.entries(DATASETS)[0];
 const row={dataset,state,period:spec.period,entityKind:spec.kind,title:'Synthetic generator context for testing',recordCount:3,distinctKeys:3,sourceUrl:spec.url,sourceSha256:'a'.repeat(64),outputSha256:'b'.repeat(64),normalizationVersion:'infrax-context-v1',sourceRetrievedAt:'2026-11-01T00:00:00Z',importedAt:'2026-11-02T00:00:00Z',quality:[{field:'nameplate_capacity',status:'reported',count:2},{field:'nameplate_capacity',status:'missing',count:1}],publication:'internal_review',isCapacityOffer:false};
 return send(200,{schema:'infrax-market-context-v2',status:state==='DC'?'empty':'ready',state,data:state==='DC'?[]:[row]});
});
await new Promise(resolve=>upstream.listen(3199,'127.0.0.1',resolve));
const browser=await chromium.launch(),report={scope:'Universal RN-Web feature with synthetic HTTP upstream, not real staff authentication or native binaries',layouts:[],accessibility:[],errors:[],failures:[]};
fs.mkdirSync('../host-results',{recursive:true});
try{
 for(const spec of [{id:'phone',width:390,height:844},{id:'tablet',width:768,height:1024},{id:'desktop',width:1440,height:900},{id:'book',width:1114,height:900,orientation:'vertical',offset:540,maskLength:34},{id:'tabletop',width:900,height:1240,orientation:'horizontal',offset:600,maskLength:40}]){
  const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},isMobile:Boolean(spec.orientation),hasTouch:Boolean(spec.orientation)});
  await context.addCookies([{name:'test_staff',value:'yes',domain:'127.0.0.1',path:'/'}]);
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});
  const cdp=await context.newCDPSession(page);
  if(spec.orientation){await cdp.send('Emulation.setDeviceMetricsOverride',{width:spec.width,height:spec.height,deviceScaleFactor:1,mobile:true,screenWidth:spec.width,screenHeight:spec.height,displayFeature:{orientation:spec.orientation,offset:spec.offset,maskLength:spec.maskLength},devicePosture:{type:'folded'}});await page.waitForFunction(axis=>matchMedia(axis==='vertical'?'(horizontal-viewport-segments:2)':'(vertical-viewport-segments:2)').matches,spec.orientation);}
  await page.getByText('TX · 1 source datasets',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  const controls=page.getByRole('button',{name:/Inspect evidence:/});await controls.click();
  await page.getByText(/Package SHA-256:/).waitFor();
  const root=await page.getByTestId('research-frame').boundingBox();
  if(spec.orientation==='vertical')assert.ok(root.x+root.width<=spec.offset+1);
  if(spec.orientation==='horizontal')assert.ok(root.y+root.height<=spec.offset+1);
  const region=page.getByRole('textbox',{name:'State or territory'});
  await region.fill('VA');await page.getByRole('button',{name:'Load region',exact:true}).click();await page.getByText('VA · 1 source datasets',{exact:true}).waitFor();
  await region.fill('DC');await page.getByRole('button',{name:'Load region',exact:true}).click();await page.getByText(/No imported summaries for this region/).waitFor();
  await region.fill('AK');await page.getByRole('button',{name:'Load region',exact:true}).click();await page.getByText(/research service is unavailable/).waitFor();
  await region.fill('TX');await page.getByRole('button',{name:'Load region',exact:true}).click();await page.getByText('TX · 1 source datasets',{exact:true}).waitFor();
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({layout:spec.id,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
  assert.equal(axe.violations.filter(v=>['critical','serious'].includes(v.impact)).length,0);
  const capture=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync('../host-results/'+spec.id+'.png',Buffer.from(capture.data,'base64'));
  if(spec.orientation){await cdp.send('Emulation.clearDisplayFeaturesOverride');await cdp.send('Emulation.clearDevicePostureOverride');await cdp.send('Emulation.clearDeviceMetricsOverride');}
  await page.setViewportSize({width:430,height:900});assert.equal(await region.inputValue(),'TX');
  report.layouts.push({id:spec.id,regionChange:true,evidence:true,emptyAndError:true,resizeRetained:true,geometry:root});await context.close();
 }
 const anon=await browser.newContext(),p=await anon.newPage();await p.goto('http://127.0.0.1:3100/');await p.getByText(/Sign in through the connected InFraX host/).waitFor();await anon.close();
 const denied=await browser.newContext();await denied.addCookies([{name:'test_staff',value:'no',domain:'127.0.0.1',path:'/'}]);const d=await denied.newPage();await d.goto('http://127.0.0.1:3100/');await d.getByText(/does not have access/).waitFor();await denied.close();
 assert.equal(report.errors.length,0);
 report.authStates={anonymous:'signed_out',nonStaff:'forbidden'};report.upstreamRequests=requests.length;
}catch(e){report.failures.push(e.stack??String(e));}finally{await browser.close();await new Promise(resolve=>upstream.close(resolve));fs.writeFileSync('../host-results/browser.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));assert.equal(report.failures.length,0);
