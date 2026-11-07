import type{Metadata}from'next';
import HomePage from'@/components/pages/HomePage';
export const metadata:Metadata={title:'InFraX | AI infrastructure advisory',description:'Assess power, cooling, location, delivery and capital requirements before infrastructure commitments.'};
export default function Page(){return <HomePage/>;}
