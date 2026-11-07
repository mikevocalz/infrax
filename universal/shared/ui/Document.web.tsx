import type{ReactNode}from'react';
/** DOM is restricted to this web host adapter, never shared feature screens. */
export function Document({children}:{children:ReactNode}){
 return <html lang="en"><body style={{margin:0,background:'#f3f6f8'}}>{children}</body></html>;
}
