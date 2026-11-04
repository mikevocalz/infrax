import type { CollectionConfig } from 'payload';
/** Explicit semantic block registry; editors cannot inject arbitrary HTML/JS. */
export const Pages:CollectionConfig={
 slug:'site-pages',
 admin:{useAsTitle:'title'},
 access:{
  read:({req})=> req.user ? true : {status:{equals:'published'}},
  create:({req})=>Boolean(req.user),
  update:({req})=>Boolean(req.user),
  delete:({req})=>Boolean(req.user)
 },
 fields:[
  {name:'title',type:'text',required:true},
  {name:'slug',type:'text',required:true,unique:true},
  {name:'status',type:'select',defaultValue:'draft',options:['draft','review','published'],required:true},
  {name:'summary',type:'textarea'},
  {name:'blocks',type:'array',fields:[
   {name:'type',type:'select',required:true,options:['hero','stat-with-source','editorial','cta','source-list','faq']},
   {name:'headline',type:'text'},
   {name:'body',type:'textarea'},
   {name:'sourceUrl',type:'text'},
   {name:'sourceAsOf',type:'date'},
   {name:'actionLabel',type:'text'},
   {name:'actionHref',type:'text'}
  ]}
 ]
};