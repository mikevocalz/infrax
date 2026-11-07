export class WorkspaceError extends Error{code:string;status:number;constructor(code:string,status?:number);}
export const RESOURCES:readonly string[];
export function endpoint(resource:string):string;
export function readJSON(response:Response,max?:number):Promise<any>;
export type Client={id:()=>string;session:(o?:{signal?:AbortSignal})=>Promise<any>;list:(resource:string,options?:{organizationId?:string;id?:string;parent?:string;after?:string;signal?:AbortSignal})=>Promise<any>;save:(resource:string,input:{organizationId?:string;parent?:string;id?:string;data:Record<string,any>;version?:number},key:string)=>Promise<any>;feed:(kind:string,o?:{after?:string;signal?:AbortSignal})=>Promise<any>;intake:(body:Record<string,any>,key:string)=>Promise<any>;auth:(action:string,body?:Record<string,any>)=>Promise<any>};
export function createWorkspaceClient(options:{baseUrl:string;fetchImpl?:typeof fetch;getAuthHeaders?:()=>Promise<Record<string,string>>;makeId?:()=>string}):Client;
