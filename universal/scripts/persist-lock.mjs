/** Commit only the successfully installed lockfile, to the exact approved development PR.
 * Invoked only after install, typecheck, Next build, both exports and browser tests pass.
 * No application secrets; no merge, deployment or other branch modification.
 */
import fs from 'node:fs';import{createHash}from'node:crypto';
const repo='mikevocalz/infrax',branch='feat/infrax-runtime-integration-20261106',path='universal/package-lock.json';
const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
if(process.env.CI!=='true'||process.env.GITHUB_REPOSITORY!==repo||event.pull_request?.head?.repo?.full_name!==repo||event.pull_request?.head?.ref!==branch)throw Error('Not the approved same-repository development PR');
const token=process.env.LOCK_COMMIT_TOKEN;if(!token)throw Error('Missing scoped workflow credential');
const bytes=fs.readFileSync('package-lock.json');if(bytes.length>1500000)throw Error('Unexpected lockfile size');
const lock=JSON.parse(bytes),manifest=JSON.parse(fs.readFileSync('package.json','utf8'));
if(lock.name!=='@infrax/universal-host'||lock.lockfileVersion!==3)throw Error('Wrong lockfile');
for(const[name,value]of Object.entries(manifest.dependencies))if(lock.packages?.['']?.dependencies?.[name]!==value)throw Error('Lock root differs from declared dependencies');
for(const p of Object.values(lock.packages??{}))if(typeof p.resolved==='string'&&p.resolved.includes('://')){const u=new URL(p.resolved);if(u.username||u.password||u.search||u.hash)throw Error('Credential/query-bearing lockfile URL');}
const api=async(endpoint,options={})=>{
 const response=await fetch('https://api.github.com/repos/'+repo+endpoint,{...options,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},signal:AbortSignal.timeout(30000)});
 if(response.status===404)return null;
 if(!response.ok)throw Error('GitHub lockfile operation HTTP '+response.status);
 return response.json();
};
const head=await api('/git/ref/heads/'+branch);
if(head?.object?.sha!==event.pull_request.head.sha)throw Error('Branch changed; refusing to persist a stale lockfile');
const current=await api('/contents/'+path+'?ref='+encodeURIComponent(branch));
if(current?.content&&Buffer.from(current.content.replace(/\s/g,''),'base64').equals(bytes)){
 console.log('Lockfile already committed; no branch update.');
}else{
 const result=await api('/contents/'+path,{method:'PUT',body:JSON.stringify({message:'build(universal): persist verified dependency lockfile',content:bytes.toString('base64'),branch,...(current?.sha?{sha:current.sha}:{})})});
 fs.writeFileSync('../host-results/lock-commit.json',JSON.stringify({path,sourceCommit:event.pull_request.head.sha,commit:result.commit.sha,sha256:createHash('sha256').update(bytes).digest('hex'),scope:'generated dependency lockfile only; no deployment'},null,2));
 console.log('Verified lockfile commit: '+result.commit.sha);
}
