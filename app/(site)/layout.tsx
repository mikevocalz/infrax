import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';
const inter = Inter({subsets:['latin'],weight:['300','400','500','600','700','800'],variable:'--font-inter',display:'swap'});
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],weight:['400','500'],variable:'--font-jetbrains-mono',display:'swap'});
export const metadata:Metadata={title:'InFraX | AI infrastructure advisory',description:'Assess power, cooling, location, delivery and capital requirements with InFraX infrastructure advisory.'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}><body className="min-h-screen bg-white"><Header authAvailable={Boolean(process.env.INFRAX_CMS_DATABASE_URL && process.env.BETTER_AUTH_SECRET)}/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></body></html>;
}
