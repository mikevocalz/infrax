import type{Metadata}from'next';import MetricsPage from'@/components/pages/MetricsPage';
export const metadata:Metadata={title:'Infrastructure metrics | InFraX',description:'Understand critical IT power, facility demand, capacity offers, cooling and evidence quality.'};
export default function Page(){return <MetricsPage/>;}
