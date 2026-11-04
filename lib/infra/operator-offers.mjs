/**
 * Confidential operator inventory workflow — domain service only.
 * Storage, authorization and documents are injected so unauthenticated
 * browser/HTTP requests can never reach this implementation directly.
 */
const allowed=new Set(['internal','restricted','qualified_buyers','public']);
export function validateOffer(input) {
 if(!input||typeof input!=='object')throw new TypeError('Offer required');
 if(typeof input.facilityId!=='string'||!input.facilityId)throw new TypeError('Facility ID required');
 if(typeof input.operatorId!=='string'||!input.operatorId)throw new TypeError('Operator ID required');
 if(typeof input.product!=='string'||!input.product.trim()||input.product.length>160)throw new TypeError('Product required');
 if(!Number.isFinite(input.criticalItMw)||input.criticalItMw<=0||input.criticalItMw>10000)throw new RangeError('Critical IT MW must be positive and bounded');
 if(!allowed.has(input.disclosure??'restricted'))throw new Error('Invalid disclosure level');
 if(!input.deliveryDate||!/^\d{4}-\d{2}-\d{2}$/.test(input.deliveryDate))throw new Error('Delivery date required');
 return Object.freeze({facilityId:input.facilityId,operatorId:input.operatorId,product:input.product.trim(),
  criticalItMw:input.criticalItMw,deliveryDate:input.deliveryDate,disclosure:'restricted',
  status:'submitted',attestedAt:new Date().toISOString(),verifiedAt:null,expiresAt:null});
}
export async function submitOperatorOffer({actor,input,authorize,repository}){
 if(!actor?.subject)throw new Error('Authenticated operator session required');
 if(typeof authorize!=='function'||!(await authorize(actor,input?.operatorId,'offer:submit')))throw new Error('Not authorized');
 if(typeof repository?.insertRestrictedOffer!=='function')throw new Error('Offer repository required');
 return repository.insertRestrictedOffer(validateOffer(input));
}
export async function approveOperatorOffer({reviewer,offerId,evidenceClaimId,validUntil,repository,authorize,now=new Date()}){
 if(!reviewer?.subject || typeof authorize!=='function'||!(await authorize(reviewer,null,'offer:verify')))throw new Error('Independent analyst authorization required');
 if(!evidenceClaimId || typeof evidenceClaimId!=='string')throw new Error('Evidence claim required');
 const expiry=new Date(validUntil);
 if(!Number.isFinite(expiry.getTime())||expiry<=now)throw new Error('Future evidence expiry required');
 if(!offerId||typeof repository?.approveRestrictedOffer!=='function')throw new Error('Offer repository required');
 return repository.approveRestrictedOffer({offerId,evidenceClaimId,reviewedBy:reviewer.subject,verifiedAt:now.toISOString(),expiresAt:expiry.toISOString(),disclosure:'restricted'});
}
export function canViewOffer({actor,offer,authorize}){
 if(offer?.status!=='approved'||!offer.verified_at||!offer.expires_at)return false;
 if(new Date(offer.expires_at)<=new Date())return false;
 if(offer.disclosure==='restricted')return Boolean(actor?.subject&&authorize?.(actor,offer));
 if(offer.disclosure==='qualified_buyers')return Boolean(actor?.subject&&authorize?.(actor,offer));
 return offer.disclosure==='public'&&offer.publication_approved===true;
}