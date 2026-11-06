import type { Access,CollectionConfig,FieldAccess } from 'payload';
import { betterAuthStrategy } from '@delmaredigital/payload-better-auth';
import { isCMSAdmin,selfOrAdmin,safeEditorialLink } from './policy.mjs';
const admin:Access=({req})=>isCMSAdmin(req.user);
const adminField:FieldAccess=({req})=>isCMSAdmin(req.user);
export const Users:CollectionConfig={slug:'users',versions:false,admin:{useAsTitle:'email'},auth:{disableLocalStrategy:true,strategies:[betterAuthStrategy()]},access:{admin,create:admin,update:admin,delete:admin,read:({req})=>selfOrAdmin(req.user)},fields:[
 {name:'email',type:'email',required:true,unique:true},{name:'emailVerified',type:'checkbox',defaultValue:false,access:{create:adminField,update:adminField}},
 {name:'name',type:'text'},{name:'image',type:'text'},
 {name:'role',type:'select',required:true,defaultValue:'user',options:['user','admin'],access:{create:adminField,update:adminField}}
]};
const publishingAccess={create:admin,update:admin,delete:admin,read:(({req})=>isCMSAdmin(req.user)?true:{publicationStatus:{equals:'published'}}) as Access};
export const Pages:CollectionConfig={slug:'site-pages',versions:false,admin:{useAsTitle:'title'},access:publishingAccess,fields:[
 {name:'title',type:'text',required:true},{name:'slug',type:'text',required:true,unique:true},
 {name:'publicationStatus',type:'select',defaultValue:'draft',required:true,options:['draft','review','published']},
 {name:'summary',type:'textarea'},
 {name:'sections',type:'array',fields:[{name:'kind',type:'select',required:true,options:['hero','editorial','cta','faq','source-list']},{name:'heading',type:'text'},{name:'body',type:'textarea'},{name:'actionLabel',type:'text'},{name:'actionHref',type:'text',validate:(v:unknown)=>!v||safeEditorialLink(v)||'Use an approved internal route'}]}
]};
export const Partners:CollectionConfig={slug:'verified-partners',versions:false,admin:{useAsTitle:'name'},access:publishingAccess,fields:[
 {name:'name',type:'text',required:true},{name:'publicationStatus',type:'select',defaultValue:'draft',options:['draft','review','published']},
 {name:'publicSummary',type:'textarea'},{name:'approvalEvidenceReference',type:'text',access:{read:adminField}},{name:'verifiedAt',type:'date'}
]};
export const Research:CollectionConfig={slug:'research-notes',versions:false,admin:{useAsTitle:'title'},access:publishingAccess,fields:[
 {name:'title',type:'text',required:true},{name:'summary',type:'textarea',required:true},{name:'sourceReference',type:'text',required:true},
 {name:'publicationStatus',type:'select',defaultValue:'draft',options:['draft','review','published']},{name:'licensingCleared',type:'checkbox',defaultValue:false},{name:'reviewedAt',type:'date'}
],hooks:{beforeValidate:[({data})=>{if(data?.publicationStatus==='published'&&(!data.licensingCleared||!data.reviewedAt))throw new Error('Reviewed evidence and source rights are required before publication');return data;}]}};
export const OperatorReviews:CollectionConfig={slug:'operator-reviews',versions:false,admin:{useAsTitle:'organizationName'},access:{read:admin,create:admin,update:admin,delete:admin},fields:[
 {name:'organizationName',type:'text',required:true},{name:'neonFacilityId',type:'text',required:true},{name:'reviewStatus',type:'select',defaultValue:'pending',options:['pending','requested_info','verified','rejected','expired']},{name:'analystNotes',type:'textarea'}
]};
