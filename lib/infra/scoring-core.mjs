/**
 * Deterministic matching core. No database, no mock imports, no invented reference pricing.
 * A fit score is NOT a probability of real availability.
 */
export function assertRequirement(r) {
 if(!r || !Number.isFinite(r.powerMinMW) || r.powerMinMW <= 0 ||
 !Number.isFinite(r.powerMaxMW) || r.powerMaxMW < r.powerMinMW ||
 !Number.isFinite(r.timelineMonths) || r.timelineMonths < 1 ||
 !Number.isFinite(r.expandabilityTargetMW) || r.expandabilityTargetMW<0)
 throw new RangeError('Invalid MW, timeline or expansion requirement');
 for(const val of Object.values(r.weights??{})) if(!Number.isFinite(val)||val<0) throw new RangeError('Invalid scoring weight');
 if(!r.weights || Object.values(r.weights).reduce((s,n)=>s+n,0)===0)throw new RangeError('At least one weight required');
}
const status=(n)=>n>=75?'pass':n>=50?'partial':'fail';
const finite=(n)=>Number.isFinite(n)&&n>=0?n:0;
function hardConstraints(req,c) {
 const flags=[];
 if(c.status==='committed' || c.status==='development')flags.push('No currently contractable capacity offer');
 if(!['available','limited'].includes(c.status))flags.push('Offer status is not available');
 if(!Number.isFinite(c.deliverableMW)||c.deliverableMW<req.powerMinMW)flags.push('Verified deliverable MW below required minimum or unknown');
 if(!Number.isFinite(c.availableMW)||c.availableMW<req.powerMinMW)flags.push('Published availability below required minimum or unknown');
 if(req.geography.length && !req.geography.includes(c.region))flags.push('Outside requested geography');
 if(!Number.isFinite(c.availableMonths)||c.availableMonths>req.timelineMonths)flags.push('Not ready within required timeline');
 for(const cert of req.requiredCertifications){if(!c.certifications.includes(cert))flags.push('Missing required certification: '+cert);}
 if(req.coolingType!=='any'&&!c.coolingTypes.includes(req.coolingType))flags.push('Cooling requirement not met');
 if(req.redundancy!=='any' && c.redundancy!==req.redundancy)flags.push('Redundancy requirement not met');
 if(req.preferredTier!==null && req.preferredTier!==undefined && c.tier<req.preferredTier)flags.push('Preferred minimum Tier not met');
 if(req.networkDiversityRequired && (c.fiberRoutes<2||new Set(c.carriers).size<2))flags.push('Network diversity not established');
 if(!req.offMarketOk && c.offMarket)flags.push('Off-market offers excluded');
 return flags;
}
function dimension(key,label,rawScore,explanation) {
 const raw=Math.round(Math.min(100,Math.max(0,finite(rawScore))));
 return {key,label,weight:0,rawScore:raw,weightedScore:0,explanation,status:status(raw)};
}
function verify(c,now=new Date()) {
 if(c.availabilityVerificationStatus!=='independently_verified')return false;
 if(!c.offerVerifiedAt||!c.offerValidUntil)return false;
 const verifiedAt=Date.parse(c.offerVerifiedAt),until=Date.parse(c.offerValidUntil);
 return Number.isFinite(verifiedAt)&&Number.isFinite(until)&&verifiedAt<=now.getTime()&&until>now.getTime();
}
export function scoreOne(req,c,now=new Date()) {
 assertRequirement(req);
 const flags=hardConstraints(req,c);
 const verified=verify(c,now);
 const ratio=finite(c.deliverableMW)/req.powerMinMW;
 // Upper MW is used as desired headroom; a larger facility is not disqualified.
 const power=Math.min(100,Math.round(60+40*(finite(c.deliverableMW)-req.powerMinMW)/(req.powerMaxMW-req.powerMinMW||req.powerMinMW)));
 const expansionTarget=req.expandabilityTargetMW||req.powerMinMW*2;
 const dims=[
  dimension('power','Power Deliverability',Math.max(0,power),'Deliverable capacity '+c.deliverableMW+' MW IT; requested '+req.powerMinMW+'–'+req.powerMaxMW+' MW IT.'),
  dimension('location','Location Match',req.geography.length===0||req.geography.includes(c.region)?100:0,'Location: '+c.market),
  dimension('timeline','Timeline Fit',c.availableMonths<=req.timelineMonths?Math.min(100,60+40*(req.timelineMonths-c.availableMonths)/req.timelineMonths):0,'Estimated readiness '+c.availableMonths+' months; customer requires '+req.timelineMonths+'.'),
  dimension('cooling','Cooling Fit',req.coolingType==='any'||c.coolingTypes.includes(req.coolingType)?100:0,'Cooling types: '+c.coolingTypes.join(', ')),
  dimension('cost','Cost Efficiency',50,'No independent like-for-like price benchmark supplied. Neutral—not a market quote.'),
  dimension('expansion','Expansion Viability',Math.min(100,100*finite(c.expandableMW)/expansionTarget),'Expansion estimate '+c.expandableMW+' MW against target '+expansionTarget+'.')
 ];
 const total=Object.values(req.weights).reduce((s,n)=>s+n,0);
 const scored=dims.map(d=>{
  const w=100*req.weights[d.key]/total;
  return {...d,weight:Math.round(w),weightedScore:Math.round(d.rawScore*w)/100};
 });
 let fit=Math.round(scored.reduce((sum,d)=>sum+d.weightedScore,0));
 if(req.renewableEnergyPreferred && !(typeof c.renewablePercent==='number'&&c.renewablePercent>=50))fit=Math.max(0,fit-10);
 if(flags.length)fit=Math.min(35,Math.round(fit*0.4));
 // No verified offer -> cannot be designated strong/viable, even with excellent mock numbers.
 const recommendation=flags.length?'disqualified':!verified?'conditional':fit>=80?'strong':fit>=65?'viable':fit>=45?'conditional':'disqualified';
 const risks=[...flags];
 if(!verified)risks.push('Availability is not independently verified with a current offer');
 if(req.renewableEnergyPreferred && !(c.renewablePercent>=50))risks.push('Renewable preference lacks supporting evidence');
 if(c.gridRiskLevel==='high')risks.push('High grid risk indicated');
 return {
  candidateId:c.id,candidate:c,fitScore:fit,
  // Do not expose synthetic data-confidence percentages as validated evidence.
  dataConfidence:verified?Math.max(0,Math.min(100,finite(c.dataConfidence))):0,
  hardConstraintsMet:flags.length===0,
  hardConstraintFlags:flags,
  scoreBreakdown:scored,recommendation,
  highlights:verified?['Current operator offer has independent verification']:[],
  risks,estimatedMonthlyKw:0 // no source-specific, unit-correct binding quote
 };
}
export function scoreRequirements(req,candidates=[],now=new Date()){
 assertRequirement(req);
 if(!Array.isArray(candidates))throw new TypeError('Candidates must be an array');
 return candidates.map(c=>scoreOne(req,c,now)).sort((a,b)=>b.fitScore-a.fitScore);
}