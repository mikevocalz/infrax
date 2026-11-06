/** Framework-independent HTTP policy. Never accepts client-supplied identity. */
export class ApiError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function uuid(value) {
  if (typeof value !== 'string' || !UUID.test(value)) throw new ApiError(400, 'INVALID_IDENTIFIER');
  return value;
}
export function pageParameters(url) {
  const raw = url.searchParams.get('limit') ?? '25';
  if (!/^\d{1,3}$/.test(raw) || +raw < 1 || +raw > 100) throw new ApiError(400, 'INVALID_PAGE_SIZE');
  const after = url.searchParams.get('after');
  return { limit: +raw, after: after === null ? null : uuid(after) };
}
export function allowedOrigin(request, origin) {
  if (!origin) throw new ApiError(503, 'ORIGIN_NOT_CONFIGURED');
  const supplied = request.headers.get('origin');
  if ((supplied && supplied !== origin) || request.headers.get('sec-fetch-site') === 'cross-site')
    throw new ApiError(403, 'ORIGIN_NOT_ALLOWED');
  // Native clients may omit Origin. This is CSRF policy, not authentication or anti-bot protection.
}
export async function boundedJSON(request, maximum = 16384, allowNull = false) {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json'))
    throw new ApiError(415, 'JSON_REQUIRED');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'BODY_REQUIRED');
  let count = 0; const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      count += value.byteLength;
      if (count > maximum) { await reader.cancel(); throw new ApiError(413, 'BODY_TOO_LARGE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(count); let offset = 0;
  for (const part of chunks) { bytes.set(part, offset); offset += part.length; }
  try {
    const parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (parsed === null && allowNull) return null;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new ApiError(400, 'INVALID_JSON_OBJECT'); }
}
function text(value, max, required = false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
    throw new ApiError(400, 'INVALID_INPUT');
  return value.trim();
}
function keys(value, allowed) {
  if (Object.keys(value).some(k => !allowed.includes(k))) throw new ApiError(400, 'UNEXPECTED_FIELD');
}
export function intakeInput(body) {
  keys(body, ['userType','name','email','organization','deploymentSize','timeline','regions','notes','assetType','capitalAmount','availableMW','market','consent']);
  if (!['developer','investor','operator','advisor'].includes(body.userType) || body.consent !== true)
    throw new ApiError(400, 'TYPE_AND_CONSENT_REQUIRED');
  const email = text(body.email, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'INVALID_EMAIL');
  const regions = body.regions ?? [];
  if (!Array.isArray(regions) || regions.length > 30) throw new ApiError(400, 'INVALID_REGIONS');
  const payload = { regions: regions.map(r => text(r, 100, true)) };
  for (const key of ['deploymentSize','timeline','assetType','capitalAmount','availableMW','market'])
    payload[key] = text(body[key] ?? '', 200);
  payload.notes = text(body.notes ?? '', 4000);
  return { kind: body.userType, name: text(body.name,150,true), email,
    company: text(body.organization,200,true), payload };
}
export function scenarioInput(body) {
  keys(body, ['organizationId','name','requirements']);
  const r = body.requirements;
  if (!r || typeof r !== 'object' || Array.isArray(r)) throw new ApiError(400, 'REQUIREMENTS_REQUIRED');
  keys(r, ['minimumItMw','maximumItMw','timelineMonths','regions','cooling']);
  if (!Number.isFinite(r.minimumItMw) || r.minimumItMw <= 0 || r.minimumItMw > 10000 ||
      !Number.isFinite(r.maximumItMw) || r.maximumItMw < r.minimumItMw || r.maximumItMw > 10000 ||
      !Number.isInteger(r.timelineMonths) || r.timelineMonths < 1 || r.timelineMonths > 120)
    throw new ApiError(400, 'INVALID_REQUIREMENTS');
  if (!Array.isArray(r.regions) || r.regions.length > 30) throw new ApiError(400, 'INVALID_REGIONS');
  const cooling = r.cooling ?? 'any';
  if (!['any','air','liquid','hybrid','immersion'].includes(cooling)) throw new ApiError(400, 'INVALID_COOLING');
  return { organizationId: uuid(body.organizationId), name: text(body.name,160,true), requirements: {
    minimumItMw:r.minimumItMw,maximumItMw:r.maximumItMw,timelineMonths:r.timelineMonths,
    regions:r.regions.map(v=>text(v,100,true)),cooling
  }};
}
export function json(data, status=200, extra={}) {
  return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...extra}});
}
export function failure(error) {
  if (error instanceof ApiError) return json({status:'error',error:error.code},error.status);
  if (error?.code === '42501') return json({status:'error',error:'ACCESS_DENIED'},403);
  if (error?.code === '22023') return json({status:'error',error:'INVALID_OR_CONFLICTING_INPUT'},409);
  if (error?.code === 'P0001' && error?.message === 'INTAKE_RATE_LIMIT')
    return json({status:'error',error:'RATE_LIMITED'},429,{'Retry-After':'3600'});
  return json({status:'unavailable',error:'SERVICE_UNAVAILABLE'},503);
}
export function createAPI({repository,identity,publicOrigin}) {
  return async function handle(request, operation) {
    try {
      allowedOrigin(request,publicOrigin);
      const url = new URL(request.url);
      if (['facilities','signals','offers'].includes(operation)) {
        if(request.method!=='GET') throw new ApiError(405,'METHOD_NOT_ALLOWED');
        const page=pageParameters(url); const rows=await repository[operation](page);
        const more=rows.length>page.limit; const data=rows.slice(0,page.limit);
        return json({data,status:data.length?'ready':'empty',nextCursor:more?data.at(-1).id:null,
          metadata:{contractVersion:2,dataMode:'database',availabilityGuarantee:false}});
      }
      if (operation === 'intake') {
        if(request.method!=='POST') throw new ApiError(405,'METHOD_NOT_ALLOWED');
        const key=uuid(request.headers.get('idempotency-key'));
        const input=intakeInput(await boundedJSON(request,12000));
        const receiptId=await repository.submitIntake(input,key);
        return json({receiptId,status:'received',notificationStatus:'queued'},201);
      }
      if (operation === 'scenarios') {
        if(!['GET','POST'].includes(request.method)) throw new ApiError(405,'METHOD_NOT_ALLOWED');
        const principal=await identity(request);
        if(!principal?.subject) throw new ApiError(401,'SIGN_IN_REQUIRED');
        if(request.method==='GET') {
          const org=uuid(url.searchParams.get('organizationId')); const page=pageParameters(url);
          const rows=await repository.listScenarios(principal.subject,org,{...page,limit:page.limit});
          return json({data:rows,status:rows.length?'ready':'empty',nextCursor:rows.length===page.limit?rows.at(-1).id:null});
        }
        const key=uuid(request.headers.get('idempotency-key'));
        const input=scenarioInput(await boundedJSON(request));
        const id=await repository.saveScenario(principal.subject,input,key);
        return json({id,status:'saved',version:1,matchRunStatus:'not_started'},201);
      }
      if (operation === 'readiness') {
        if(request.method!=='GET') throw new ApiError(405,'METHOD_NOT_ALLOWED');
        await repository.readiness();
        return json({databaseReady:true,applicationReady:false});
      }
      throw new ApiError(404,'NOT_FOUND');
    } catch(error) { return failure(error); }
  };
}
