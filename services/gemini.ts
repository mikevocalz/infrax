/** Server proxy; provider credentials stay in /api/v1/chat only. */
export async function getSecurityInsights(query:string):Promise<string> {
 try{
  const result=await fetch('/api/v1/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
  const data=await result.json();
  const response=String(data.response??data.error??'Evidence-based advisor unavailable.');
  const sources=Array.isArray(data.sources)?data.sources.filter((s:any)=>typeof s.url==='string'&&s.url.startsWith('https://')):[];
  return response+(sources.length?'\n\nReviewed sources:\n'+sources.map((s:any)=>'['+s.number+'] '+s.url).join('\n'):'');
 }catch{return 'Market intelligence is temporarily unavailable. No live capacity is verified.';}
}
