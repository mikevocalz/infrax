import type {CollectionConfig} from 'payload';
/** Private review queue. Public facility assertions live in Neon infra schema. */
export const OperatorReviews:CollectionConfig={
 slug:'operator-reviews',admin:{useAsTitle:'organizationName'},
 access:{read:({req})=>!!req.user,create:({req})=>!!req.user,update:({req})=>!!req.user,delete:({req})=>!!req.user},
 fields:[
  {name:'organizationName',type:'text',required:true},
  {name:'neonFacilityId',type:'text',required:true},
  {name:'reviewStatus',type:'select',required:true,defaultValue:'pending',options:['pending','requested_info','verified','rejected','expired']},
  {name:'analystNotes',type:'textarea'},
  {name:'reviewedAt',type:'date'},
  {name:'evidenceReference',type:'text'}
 ]
};