export type SiteGroup={id:string;label:string;description:string;items:ReadonlyArray<{label:string;href:string}>};
export const SITE_NAV:ReadonlyArray<SiteGroup>;
export const ASSESSMENT_ACTION:Readonly<{label:string;href:string}>;
export const PUBLIC_ROUTES:readonly string[];
export function activeGroup(pathname:string):string|null;
export function contactIntent(search?:string):'developer'|'operator'|'investor'|'advisor'|null;
export function auditNavigation():{groups:number;pages:number};
