/** Host-measured logical coordinates only. Width alone never creates a hinge. */
export function boundedRegion(region){
 if(!region||!['x','y','width','height'].every(k=>Number.isFinite(region[k]))||region.x<0||region.y<0||region.width<=0||region.height<=0)throw new TypeError('Measured usable region required');
 return Object.freeze({x:region.x,y:region.y,width:region.width,height:region.height});
}
export function researchLayout(region,fontScale=1){
 const r=boundedRegion(region);
 if(!Number.isFinite(fontScale)||fontScale<.5||fontScale>5)throw new TypeError('Invalid font scale');
 return Object.freeze({region:r,columns:r.width/fontScale>=900?2:1,padding:r.width<400?16:24,drawerWidth:Math.min(420,r.width)});
}
