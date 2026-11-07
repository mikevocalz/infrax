import {getPayload} from 'payload';
import config from '../payload.config';
if(process.env.CI!=='true'||process.env.INFRAX_CMS_TEST_MODE!=='1')throw new Error('Disposable CI database only');
const payload=await getPayload({config});
for(const [slug,publicationStatus] of [['ci-published','published'],['ci-private-draft','draft']] as const){
 await payload.create({collection:'site-pages',overrideAccess:true,data:{title:slug,slug,publicationStatus,summary:'Synthetic CI publication test; never copied to Neon'}});
}
await payload.destroy();
