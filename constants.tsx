import { SITE_NAV } from '@/lib/ux/navigation.mjs';
import { ShieldCheck, Cpu, Workflow, Layers, Network, Database } from 'lucide-react';
import type { NavItem, Service, Pillar } from '@/types';
export const NAV_ITEMS:NavItem[]=SITE_NAV.map(group=>({label:group.label,href:group.items[0].href}));
/** Legacy component compatibility; public pages use the reviewed route catalog. */
export const PILLARS:Pillar[]=[
 {title:'Deployment Engineering',description:'Evaluate workload power, cooling and site requirements.',icon:Cpu},
 {title:'Technical Governance',description:'Document evidence, responsibilities and unresolved dependencies.',icon:ShieldCheck},
 {title:'Operational Discipline',description:'Define the next verification and delivery steps.',icon:Workflow}
];
export const SERVICES:Service[]=[
 {id:'hpc-arch',title:'HPC Architecture',description:'Workload requirements and technical feasibility questions.',icon:Layers},
 {id:'mesh-gov',title:'Technical Governance',description:'Evidence, responsibilities and review milestones.',icon:Network},
 {id:'intel-ops',title:'Infrastructure Research',description:'Source-backed market context with explicit limitations.',icon:Database}
];
export const FAIL_POINTS=[{title:'Power Assumptions',desc:'MW projections without secured interconnect agreements.'},{title:'Permitting Delays',desc:'Zoning and regulatory dependencies.'},{title:'Cooling Mismatch',desc:'Equipment needs and facility capability differ.'},{title:'Demand Timing',desc:'Availability must match the requested service date.'},{title:'Capital Misalignment',desc:'Underwriting depends on development milestones.'},{title:'Expansion Blind Spots',desc:'Later phases need their own evidence.'}];
// No invented observations. Legacy visual components must tolerate empty data.
export const TICKER_SIGNALS:Array<{category:string;signal:string}>=[];
export const SECURITY_STATS:Array<{name:string;mitigated:number;detected:number}>=[];
export const METRICS=[{category:'Infrastructure requirements',description:'Compare like-for-like units and documented capabilities.',items:['Critical IT power','Facility demand','Delivery date']},{category:'Evidence',description:'Separate reported claims from confirmed commitments.',items:['Source reference','Verification scope','Observation date']}];
export const LEADERSHIP=[
 {name:'Kirk Horton',role:'Founder | Data Center Strategy & Development',bio:'',expertise:['Site Selection','Capacity Planning','Deal Mapping']},
 {name:'Asim Cambrelen',role:'Co-Founder | Strategy & Infrastructure Advisory',bio:'',expertise:['AI Governance','Infrastructure Economics','Regulatory Strategy']}
];
