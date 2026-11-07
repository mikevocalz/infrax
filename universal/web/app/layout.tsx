import type{ReactNode}from'react';import type{Metadata}from'next';
import{Document}from'../../shared/ui/Document.web';import{WebWorkspaceProvider}from'../../shared/workspace/WebHost';
export const metadata:Metadata={title:'InFraX workspace — development',robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <Document><WebWorkspaceProvider>{children}</WebWorkspaceProvider></Document>;}
