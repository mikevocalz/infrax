export type PageAction={label:string;href:string};
export type PageSection={id?:string;heading:string;body:string;items?:string[];action?:PageAction};
export type PublicPageSpec={route:string;eyebrow:string;title:string;summary:string;sections:PageSection[];note?:string;variant?:string;nextTitle:string;nextBody:string;audience?:string;related:PageAction[]};
export const PUBLIC_PAGES:Record<string,PublicPageSpec>;
