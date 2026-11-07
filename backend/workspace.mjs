import {ApiError,allowedOrigin,boundedJSON,failure,json,uuid} from './core.mjs';
import {validateForm} from '../universal/shared/workspace/forms.mjs';
const reads=new Set(['organizations','scenarios','projects','tasks','documents','reports','messages','sites','offers','requests','responses','watchlists','reviews','sources','cases','content','notifications','preferences','team']);
const forms={organizations:'organization',scenarios:'scenario',projects:'project',tasks:'task',documents:'document',messages:'message',sites:'site',offers:'offer',responses:'response',watchlists:'watch',reviews:'review'};
const staff=new Set(['reviews','sources','cases','content']);
export function createWorkspaceAPI({identity,repository,publicOrigin,signupEnabled=false}){
 return async(request,resource)=>{
  try{
   allowedOrigin(request,publicOrigin);
   if(!['GET','POST'].includes(request.method))throw new ApiError(405,'METHOD_NOT_ALLOWED');
   const auth=await identity(request),user=auth?.user;
   if(resource==='session'&&request.method==='GET'){
    const organizations=user?.id?await repository.organizations(String(user.id)):[];
    return json({user:user?.id?{id:String(user.id),name:String(user.name??''),email:String(user.email??''),role:user.role==='admin'?'admin':'user'}:null,organizations,
     capabilities:{signup:signupEnabled,recovery:false,fileUpload:false,reportGeneration:false,emailDispatch:false,workspace:true}});
   }
   if(!user?.id)throw new ApiError(401,'SIGN_IN_REQUIRED');
   if(!reads.has(resource))throw new ApiError(404,'NOT_FOUND');
   if(staff.has(resource)&&user.role!=='admin')throw new ApiError(403,'STAFF_REQUIRED');
   const subject=String(user.id),q=new URL(request.url).searchParams;
   if([...q.keys()].some(k=>!['organizationId','id','parent','after'].includes(k))||[...q.keys()].some(k=>q.getAll(k).length>1))throw new ApiError(400,'INVALID_QUERY');
   if(request.method==='GET'){
    if(resource==='organizations')return json({data:await repository.organizations(subject),status:'ready'});
    const opt={organizationId:q.has('organizationId')?uuid(q.get('organizationId')):null,id:q.has('id')?uuid(q.get('id')):null,parent:q.has('parent')?uuid(q.get('parent')):null,after:q.has('after')?uuid(q.get('after')):null};
    if(!staff.has(resource)&&!opt.organizationId)throw new ApiError(400,'ORGANIZATION_REQUIRED');
    const rows=await repository.read(subject,resource,opt),more=rows.length>50,data=rows.slice(0,50);
    return json({data,status:data.length?'ready':'empty',nextCursor:more?data.at(-1).id:null});
   }
   if(!Object.hasOwn(forms,resource))throw new ApiError(405,'RESOURCE_READ_ONLY');
   const body=await boundedJSON(request,24576),key=uuid(request.headers.get('idempotency-key'));
   if(Object.keys(body).some(k=>!['organizationId','parent','id','data','version'].includes(k)))throw new ApiError(400,'UNEXPECTED_FIELD');
   const checked=validateForm(forms[resource],body.data);
   if(!checked.ok)return json({error:'INVALID_INPUT',fields:checked.errors},422);
   if(resource==='organizations')return json({id:await repository.createOrganization(subject,checked.value.name,key),status:'created',kind:'buyer'},201);
   const input={organizationId:body.organizationId?uuid(body.organizationId):null,parent:body.parent?uuid(body.parent):null,id:body.id?uuid(body.id):null,data:checked.value,version:body.version??null};
   if(!staff.has(resource)&&!input.organizationId)throw new ApiError(400,'ORGANIZATION_REQUIRED');
   if(input.version!==null&&(!Number.isInteger(input.version)||input.version<1))throw new ApiError(400,'INVALID_VERSION');
   return json(await repository.write(subject,resource,input,key),201);
  }catch(e){return failure(e);}
 };
}
export function createWorkspaceRepository(sql){return{
 organizations:subject=>sql.query('SELECT * FROM infra_api.workspace_orgs($1)',[subject]),
 async createOrganization(subject,name,key){const [r]=await sql.query('SELECT infra_api.workspace_create_org($1,$2,$3::uuid) AS id',[subject,name,key]);if(!r?.id)throw Error('No receipt');return r.id;},
 async read(subject,resource,o){const rows=await sql.query('SELECT value FROM infra_api.workspace_read($1,$2::uuid,$3,$4::uuid,$5::uuid,$6::uuid) AS value',[subject,o.organizationId,resource,o.id,o.parent,o.after]);return rows.map(r=>r.value);},
 async write(subject,resource,o,key){const [r]=await sql.query('SELECT infra_api.workspace_write($1,$2::uuid,$3,$4::uuid,$5::uuid,$6::jsonb,$7,$8::uuid) AS value',[subject,o.organizationId,resource,o.parent,o.id,JSON.stringify(o.data),o.version,key]);if(!r?.value?.id)throw Error('No receipt');return r.value;},
};}
