import {Panel,Heading,Body,Notice} from '@/components/ui/semantic';
/** No published, licensed colocation price series has been connected yet.
 * Do not render the previous seven-month fixture as a real market chart.
 */
export default function TrendChart(){
 return <Panel><Heading>Colocation pricing research</Heading><Body>Like-for-like pricing requires a dated, permissioned market dataset and explicit contract units.</Body><Notice>No approved pricing series is currently available.</Notice></Panel>;
}
