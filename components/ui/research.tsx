import type{ContextRow}from'@/client/research-types';
/** Web host markup is isolated here; no physical-screen-width assumptions. */
export function ResearchCards({rows}:{rows:ReadonlyArray<ContextRow>}){
 return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,20rem),1fr))',gap:20,minWidth:0}}>
  {rows.map(row=><article key={row.dataset} aria-label={row.title} style={{border:'1px solid #dbe3eb',padding:24,minWidth:0,overflowWrap:'anywhere'}}>
   <p style={{fontSize:13,fontWeight:700,color:'#9a3e04'}}>INTERNAL RESEARCH · {row.state}</p>
   <h2 style={{fontSize:22,fontWeight:700,lineHeight:1.3,marginTop:12}}>{row.title}</h2>
   <dl style={{display:'grid',gridTemplateColumns:'1fr',gap:8,marginTop:20}}>
    <div><dt>Observation period</dt><dd><strong>{row.period}</strong></dd></div>
    <div><dt>Normalized source rows</dt><dd><strong>{row.recordCount.toLocaleString()}</strong></dd></div>
    <div><dt>Distinct source entity keys</dt><dd>{row.distinctKeys.toLocaleString()}</dd></div>
   </dl>
   <p style={{marginTop:16,fontSize:14,lineHeight:1.6}}>These are {row.entityKind.replaceAll('_',' ')} records, not data centers or capacity offers.</p>
   <details style={{marginTop:16}}><summary style={{paddingBlock:12,minHeight:44,cursor:'pointer'}}>Evidence quality and provenance</summary>
    <ul>{row.quality.map(q=><li key={q.field+q.status} style={{paddingBlock:4}}>{q.field.replaceAll('_',' ')}: {q.count.toLocaleString()} {q.status}</li>)}</ul>
    <p style={{marginTop:12,fontSize:13}}>Parser: {row.normalizationVersion}</p><p style={{fontSize:12,wordBreak:'break-all'}}>Source SHA-256: {row.sourceSha256}</p>
   </details>
   <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',minHeight:48,color:'#9a3e04',textDecoration:'underline'}}>Open original publisher file</a>
  </article>)}
 </div>;
}
