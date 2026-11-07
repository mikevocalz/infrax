export const FIELDS:Record<string,readonly (readonly [string,string,string,boolean])[]>;
export const DEFAULT_SCENARIO:Readonly<Record<string,string>>;
export function validateForm(kind:string,value:unknown):{ok:boolean;value:Record<string,string>;errors:Record<string,string>};
export function safeSource(value:unknown):string|null;
export function assessOffer(requirements:Record<string,any>,offer:Record<string,any>,now?:Date):{status:string;failures:string[];unknown:string[];score:null};
