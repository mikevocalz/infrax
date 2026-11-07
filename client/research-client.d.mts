import type {ResearchResponse} from './research-types';
export type ResearchFailure='signed_out'|'forbidden'|'invalid_response'|'unavailable'|'aborted';
export class ResearchClientError extends Error {constructor(code:ResearchFailure);code:ResearchFailure;}
export function createResearchClient(options:{baseUrl:string;fetchImpl?:typeof fetch;getAuthHeaders?:()=>Promise<Record<string,string>>;timeoutMs?:number}):(state:string,options?:{signal?:AbortSignal})=>Promise<ResearchResponse>;
export type ResearchSnapshot={region:string;status:'loading'|'ready'|'empty'|ResearchFailure;result:ResearchResponse|null};
export function createResearchController(options:{load:ReturnType<typeof createResearchClient>;onChange:(state:ResearchSnapshot)=>void}):{select:(region:string)=>Promise<void>;dispose:()=>void};
