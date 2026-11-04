import type {CollectionConfig} from 'payload';
export const Partners:CollectionConfig={
 slug:'verified-partners',admin:{useAsTitle:'name'},
 access:{read:({req})=>req.user?true:{publicationStatus:{equals:'published'}},
  create:({req})=>!!req.user,update:({req})=>!!req.user,delete:({req})=>!!req.user},
 fields:[
  {name:'name',type:'text',required:true},
  {name:'organizationType',type:'select',required:true,options:['operator','developer','technology','advisory','other']},
  {name:'publicationStatus',type:'select',required:true,defaultValue:'private',options:['private','review','published']},
  {name:'approvalEvidenceReference',type:'text',access:{read:({req})=>!!req.user}},
  {name:'publicSummary',type:'textarea'},
  {name:'website',type:'text'},
  {name:'verifiedAt',type:'date'}
 ]
};