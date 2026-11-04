import type {CollectionConfig} from 'payload';
export const ResearchNotes:CollectionConfig={
 slug:'research-notes',admin:{useAsTitle:'title'},
 access:{read:({req})=>req.user?true:{publicationStatus:{equals:'published'}},
  create:({req})=>!!req.user,update:({req})=>!!req.user,delete:({req})=>!!req.user},
 fields:[
  {name:'title',type:'text',required:true},
  {name:'category',type:'select',options:['grid','capacity','policy','pricing','risk']},
  {name:'summary',type:'textarea',required:true},
  {name:'publicationStatus',type:'select',required:true,defaultValue:'draft',options:['draft','review','published','retracted']},
  {name:'sourceReference',type:'text',required:true},
  {name:'sourceObservationDate',type:'date'},
  {name:'reviewedAt',type:'date'},
  {name:'licensingCleared',type:'checkbox',defaultValue:false}
 ]
};