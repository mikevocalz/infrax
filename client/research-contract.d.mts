import type {ContextRow,ResearchResponse} from './research-types';
export const CONTEXT_SCHEMA:'infrax-market-context-v2';
export const RESEARCH_WARNING:string;
export const STATE_CODES:readonly string[];
export const DATASETS:Readonly<Record<string,{period:string;kind:string;url:string;metrics:readonly string[]}>>;
export function stateFilter(value?:unknown):string;
export function sourceLink(value:unknown):string|null;
export function parseContextRow(value:unknown,expectedState:string):ContextRow;
export function parseResearchResponse(value:unknown,expectedState:string):ResearchResponse;
