'use client';
import SignalFeed from '@/components/features/intelligence/SignalFeed';
import {Stack,Heading,Body} from '@/components/ui/semantic';
export default function IntelligencePage(){
 return <Stack className="container mx-auto px-6 pt-32 pb-24"><Heading>Market Intelligence</Heading><Body>Reviewed infrastructure research with source references and observation dates. A market signal does not establish that a facility has capacity available to sell.</Body><SignalFeed/></Stack>;
}
