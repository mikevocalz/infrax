export type Region=Readonly<{x:number;y:number;width:number;height:number}>;
export function boundedRegion(region:Region):Region;
export function researchLayout(region:Region,fontScale?:number):Readonly<{region:Region;columns:1|2;padding:number;drawerWidth:number}>;
