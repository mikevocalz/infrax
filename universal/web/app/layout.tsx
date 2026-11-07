import type{ReactNode}from'react';import type{Metadata}from'next';
import{Document}from'../../shared/ui/Document.web';
export const metadata:Metadata={title:'InFraX source review — development',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:ReactNode}){return <Document>{children}</Document>;}
