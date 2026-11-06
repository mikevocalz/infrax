/** Chromium emulated geometry, NOT native/hardware certification. No real customer writes. */
import {chromium} from '/tmp/infrax-ux-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PUBLIC_ROUTES} from '../../lib/ux/navigation.mjs';
const browser=await chromium.launch(), origin='http://127.0.0.1:3000';
const report={scope:'Public web only; emulated display features are test inputs, not observed hardware',checks:[],interactions:[],failures:[]};
const check=(ok,msg)=>{if(!ok)report.failures.push(msg);};
try {
 for(const spec of [
  {id:'book-hinge',width:1114,height:900,orientation:'vertical',offset:540,maskLength:34},
  {id:'tabletop-hinge',width:900,height:1240,orientation:'horizontal',offset:600,maskLength:40},
  {id:'phone-landscape',width:844,height:390},
  {id:'compact-text-200',width:390,height:844,text:true},
 ]) {
  const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.failures.push(spec.id+': '+e.message));
  const session=await context.newCDPSession(page);
  if(spec.orientation){
   await session.send('Emulation.setDeviceMetricsOverride',{width:spec.width,height:spec.height,deviceScaleFactor:1,mobile:false,screenWidth:spec.width,screenHeight:spec.height});
   await session.send('Emulation.setDisplayFeaturesOverride',{features:[{orientation:spec.orientation,offset:spec.offset,maskLength:spec.maskLength}]});
   await session.send('Emulation.setDevicePostureOverride',{posture:{type:'folded'}});
  }
  for(const route of PUBLIC_ROUTES){
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});
   if(spec.text)await page.addStyleTag({content:'html{font-size:200%!important}'});
   const result=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,book:matchMedia('(horizontal-viewport-segments:2)').matches,tabletop:matchMedia('(vertical-viewport-segments:2)').matches,body:document.body.getBoundingClientRect().toJSON(),header:document.querySelector('header').getBoundingClientRect().toJSON()}));
   check(response.status()===200,spec.id+route+' HTTP');check(result.h1===1,spec.id+route+' H1');check(!result.overflow,spec.id+route+' horizontal overflow');
   if(spec.orientation==='vertical'){check(result.book,spec.id+' emulation inactive');check(result.body.right<=spec.offset+1,spec.id+route+' content crosses hinge');check(result.header.right<=spec.offset+1,spec.id+route+' header crosses hinge');}
   if(spec.orientation==='horizontal'){check(result.tabletop,spec.id+' emulation inactive');check(result.body.bottom<=spec.offset+1,spec.id+route+' reading area crosses hinge');}
   report.checks.push({case:spec.id,route,status:response.status(),...result});
  }
  await page.goto(origin+'/contact?audience=operator',{waitUntil:'networkidle'});
  if(spec.text)await page.addStyleTag({content:'html{font-size:200%!important}'});
  await page.getByLabel('Full name').fill('Layout test retained');
  await page.getByRole('button',{name:'Menu',exact:true}).click();await page.waitForSelector('dialog[open]');
  const bounds=await page.locator('dialog[open]').boundingBox();
  if(spec.orientation==='vertical')check(bounds.x>=0&&bounds.x+bounds.width<=spec.offset+1,'book drawer crosses hinge');
  if(spec.orientation==='horizontal')check(bounds.y>=0&&bounds.y+bounds.height<=spec.offset+1,'tabletop drawer crosses hinge');
  for(let i=0;i<15;i++){await page.keyboard.press('Tab');check(await page.evaluate(()=>document.querySelector('dialog[open]')?.contains(document.activeElement)),'focus escaped '+spec.id);}
  await page.screenshot({path:'ux-results/'+spec.id+'.png'});
  await page.keyboard.press('Escape');
  check(await page.getByLabel('Full name').inputValue()==='Layout test retained','draft lost '+spec.id);
  if(spec.orientation){await session.send('Emulation.clearDisplayFeaturesOverride');await session.send('Emulation.clearDevicePostureOverride');await session.send('Emulation.clearDeviceMetricsOverride');}
  await page.setViewportSize({width:390,height:844});
  check(await page.getByLabel('Full name').inputValue()==='Layout test retained','draft lost on unfold/resize '+spec.id);
  report.interactions.push({case:spec.id,drawer:'tested',draftAfterResize:'retained'});
  await context.close();
 }
} catch(error){report.failures.push(error.stack??String(error));}
finally{fs.mkdirSync('ux-results',{recursive:true});fs.writeFileSync('ux-results/foldable-audit.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({checks:report.checks.length,interactions:report.interactions.length,failures:report.failures},null,2));
assert.equal(report.failures.length,0,'Inspect foldable-audit.json');
