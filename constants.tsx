import React from 'react';
import { ShieldCheck, Cpu, Workflow, Layers, Network, Database, AlertCircle, Zap, Globe, BarChart3, TrendingUp, Search } from 'lucide-react';
import { NavItem, Service } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Strategy', href: 'home' },
  { label: 'Solutions', href: 'services' },
  { label: 'InfraAlign™ OS', href: 'platform' },
  { label: 'Market Intel', href: 'intelligence' },
  { label: 'Governance', href: 'metrics' },
  { label: 'Leadership', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

export const PILLARS = [
  {
    title: "Deployment Engineering",
    description: "We architect the power-density and thermal profiles required for next-generation GPU clusters and AI-scale workloads.",
    icon: <Cpu className="w-8 h-8" />
  },
  {
    title: "Technical Governance",
    description: "Operating as an independent oversight layer, we enforce SLA adherence and regulatory compliance across global provider meshes.",
    icon: <ShieldCheck className="w-8 h-8" />
  },
  {
    title: "Operational Discipline",
    description: "Managing the lifecycle from initial blueprinting to utility interconnect and operational handoff with zero vendor bias.",
    icon: <Workflow className="w-8 h-8" />
  }
];

export const SERVICES: Service[] = [
  {
    id: 'hpc-arch',
    title: 'HPC Architecture',
    description: 'Bespoke blueprints for high-density computing, liquid cooling integration, and multi-megawatt site planning.',
    icon: <Layers className="w-8 h-8" />,
  },
  {
    id: 'mesh-gov',
    title: 'Mesh Governance',
    description: 'Real-time oversight of global infrastructure assets, ensuring path diversity and power-redundancy integrity.',
    icon: <Network className="w-8 h-8" />,
  },
  {
    id: 'intel-ops',
    title: 'Intelligence Ops',
    description: 'Proprietary telemetry on utility substation capacity and off-market asset availability across secondary hubs.',
    icon: <Database className="w-8 h-8" />,
  },
];

export const FAIL_POINTS = [
  { title: "Power Assumptions", desc: "MW projections without secured interconnect agreements." },
  { title: "Permitting Delays", desc: "Zoning and regulatory friction underestimated early." },
  { title: "Cooling Mismatch", desc: "AI density outpaces original facility design assumptions." },
  { title: "Demand Timing", desc: "Capacity delivered before anchor commitments are secured." },
  { title: "Capital Misalignment", desc: "Underwriting not aligned with development timeline reality." },
  { title: "Expansion Blind Spots", desc: "Phase 1 is viable. Phase 2 is impossible." }
];

// Structural signals for the market intelligence tickers, now as objects to support categorization
export const TICKER_SIGNALS = [
  { category: "MARKET", signal: "US Operating Data Centers: 577" },
  { category: "CAPACITY", signal: "US Operating Capacity: 14,187 MW" },
  { category: "PLANNED", signal: "US Planned Projects: 668" },
  { category: "EXPANSION", signal: "Planned Additional US Capacity: 184,000+ MW" },
  { category: "GLOBAL", signal: "Global Data Center Expansion 2026–2030: 100+ GW" },
  { category: "DEMAND", signal: "AI workloads driving double-digit annual capacity growth" },
  { category: "POLICY", signal: "Hyperscale demand now shaping regional grid policy" },
  { category: "GRID", signal: "Interconnect queues extending timelines in major US markets" },
  { category: "REALITY", signal: "MW without interconnect ≠ deliverable capacity" },
  { category: "RISK", signal: "Stranded capacity risk increasing in oversubscribed markets" },
  { category: "TIMELINE", signal: "Typical Construction Phase: 18–30 months" },
  { category: "ENERGY", signal: "Baseload energy becoming strategic priority" }
];

// Added SECURITY_STATS to resolve "Module has no exported member 'SECURITY_STATS'" error in Stats.tsx
export const SECURITY_STATS = [
  { name: 'Mon', mitigated: 400, detected: 600 },
  { name: 'Tue', mitigated: 300, detected: 500 },
  { name: 'Wed', mitigated: 600, detected: 800 },
  { name: 'Thu', mitigated: 800, detected: 1000 },
  { name: 'Fri', mitigated: 500, detected: 700 },
  { name: 'Sat', mitigated: 900, detected: 1100 },
  { name: 'Sun', mitigated: 700, detected: 900 },
];

// Added METRICS to resolve "Module has no exported member 'METRICS'" error in MetricsPage.tsx
export const METRICS = [
  {
    category: "Operational Efficiency",
    description: "Measuring the delta between planned capacity and actual delivery timelines.",
    items: ["PUE Optimization", "Asset Lifecycle Velocity", "MW Density Utilization"]
  },
  {
    category: "Financial Performance",
    description: "Alignment of capital deployment with real-world infrastructure milestones.",
    items: ["CapEx Predictability", "ROI on Power-Rights", "Lease Term Integrity"]
  },
  {
    category: "Technical Governance",
    description: "Adherence to sovereign mesh standards and independent SLA verification.",
    items: ["SLA Compliance %", "Redundancy Audit Pass Rate", "Latency Threshold Stability"]
  },
  {
    category: "Market Intel",
    description: "Accuracy of signals processed across the global infrastructure grid.",
    items: ["Signal Confidence Score", "Off-Market Discovery Rate", "Node Integrity Tracking"]
  }
];

export const LEADERSHIP = [
  {
    name: "Asim Cambrelen",
    role: "Co-Founder | Strategy & Infrastructure Advisory",
    bio: "Asim brings over 20 years of executive experience in enterprise technology strategy and public sector advisory. He works at the intersection of infrastructure economics, AI governance, and board-level decision advisory.",
    expertise: ["AI Governance", "Infrastructure Economics", "Regulatory Strategy"]
  },
  {
    name: "Kirk “Hurricane” Horton",
    role: "Co-Founder | Data Center Strategy & Development",
    bio: "A 30-year executive leader with deep experience in data center development and infrastructure commercialization. Kirk brings operational realism to infrastructure expansion.",
    expertise: ["Site Selection", "Capacity Planning", "Deal Mapping"]
  }
];