/** All private workflow commands require injected Better Auth session checks and Neon repository. */
function checkActor(actor){if(!actor?.subject||!actor.organizationId)throw new Error('Authenticated organization membership required');}
async function checkPermission({authorize,actor,action,resource}) {
 checkActor(actor);
 if(typeof authorize!=='function'||!(await authorize({actor,action,resource})))throw new Error('Not authorized for '+action);
}
function requireRepository(repository,method){if(typeof repository?.[method]!=='function')throw new Error('Durable repository unavailable');}
export async function saveScenario({actor,scenario,authorize,repository}) {
 await checkPermission({authorize,actor,action:'scenario:write',resource:scenario});
 if(!scenario||typeof scenario.name!=='string'||!scenario.name.trim())throw new TypeError('Scenario name required');
 if(!Number.isFinite(scenario.minimumItMw)||scenario.minimumItMw<=0)throw new RangeError('Critical IT MW required');
 requireRepository(repository,'saveScenarioVersion');
 return repository.saveScenarioVersion({organizationId:actor.organizationId,subject:actor.subject,
  name:scenario.name.trim(),minimumItMw:scenario.minimumItMw,requirements:scenario,verifiedResultsOnly:true});
}
export async function watchMarketSignal({actor,signal,authorize,repository}) {
 await checkPermission({authorize,actor,action:'signal:watch',resource:signal});
 if(!signal||signal.publication_status!=='published'||!signal.reviewed_at||!signal.source_record_id)
  throw new Error('Only reviewed sourced signals may be watched');
 requireRepository(repository,'upsertWatch');
 return repository.upsertWatch({organizationId:actor.organizationId,subject:actor.subject,signalId:signal.id,notificationsEnabled:false});
}
export async function requestDiligence({actor,facilityId,notes,authorize,repository}) {
 await checkPermission({authorize,actor,action:'diligence:request',resource:facilityId});
 if(typeof facilityId!=='string'||!facilityId)throw new TypeError('Facility reference required');
 if(typeof notes!=='string'||notes.length>4000)throw new TypeError('Notes must be 0–4000 chars');
 requireRepository(repository,'createDiligenceRequest');
 return repository.createDiligenceRequest({organizationId:actor.organizationId,requestedBy:actor.subject,
  facilityId,notes,status:'submitted',reportStatus:'not_generated'});
}
export function buildEvidenceDossier({caseId,claimRows,reviewedBy,createdAt=new Date().toISOString()}) {
 if(!caseId||!reviewedBy||!Array.isArray(claimRows))throw new TypeError('Reviewed case and claims required');
 const accepted=claimRows.filter(c=>c && c.review_status==='approved' && c.source_url);
 const missing=claimRows.filter(c=>!c||c.review_status!=='approved'||!c.source_url);
 return Object.freeze({caseId,createdAt,reviewedBy,status:missing.length?'incomplete':'reviewed',
   claims:accepted.map(c=>({field:c.field,value:c.value??null,unit:c.unit??null,sourceUrl:c.source_url,observedAt:c.observed_at??null})),
   unresolved:missing.map(c=>({field:c?.field??'unknown',reason:'No reviewed source evidence'}))});
}