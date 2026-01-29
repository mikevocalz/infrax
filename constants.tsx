import React from 'react';
import { Activity, ShieldCheck, Search, FileCheck, Globe, Server, Cpu, Zap, BarChart3, Radio } from 'lucide-react';
import { NavItem, Service, Testimonial } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: 'home' },
  { label: 'What We Do', href: 'services' },
  { label: 'InfraAlign™ Platform', href: 'platform' },
  { label: 'Intelligence', href: 'intelligence' },
  { label: 'Metrics & Education', href: 'metrics' },
  { label: 'Why InFraX', href: 'why-infrax' },
  { label: 'About', href: 'about' },
  { label: 'Partners', href: 'partners' },
  { label: 'Contact', href: 'contact' },
];

export const PILLARS = [
  {
    title: "Intelligent Matching",
    description: "InfraAlign™ analyzes public datasets and exclusive off-market intelligence to generate shortlists that actually fit.",
    icon: <Cpu className="w-8 h-8" />
  },
  {
    title: "Neutral Guidance",
    description: "We do not sell inventory. We guide decisions. Filtering the market before sales conversations begin.",
    icon: <ShieldCheck className="w-8 h-8" />
  },
  {
    title: "Execution Discipline",
    description: "From evaluation to implementation, we manage risk, timelines, and accountability.",
    icon: <Zap className="w-8 h-8" />
  }
];

export const SERVICES: Service[] = [
  {
    id: 'filtering',
    title: 'Market Filtering',
    description: 'Filtering the market before sales conversations begin. Surfacing off-market capacity and real constraints.',
    icon: <Search className="w-8 h-8" />,
  },
  {
    id: 'off-market',
    title: 'Off-Market Sourcing',
    description: 'Accessing quiet expansions and transitional assets that are rarely listed on public exchanges.',
    icon: <Globe className="w-8 h-8" />,
  },
  {
    id: 'risk-modelling',
    title: 'Tradeoff Modeling',
    description: 'Analyzing requirement-to-capability matching with heavy focus on power and connectivity constraints.',
    icon: <BarChart3 className="w-8 h-8" />,
  },
];

export const TICKER_SIGNALS = [
  { category: 'REGIONAL', signal: 'Northern Virginia power bottlenecks intensifying; 2026 delivery risk high.', type: 'alert' },
  { category: 'OFF-MARKET', signal: '15MW transitional asset identified in Phoenix market; ready for immediate fit-out.', type: 'opportunity' },
  { category: 'UTILITY', signal: 'Atlanta utility approval timelines extended by 4 months due to substation upgrades.', type: 'warning' },
  { category: 'DEMAND', signal: 'AI-driven density shifts pushing requirements to 50kW/rack in secondary hubs.', type: 'trend' },
  { category: 'CAPACITY', signal: 'New build expansion in Dallas surfacing 10MW ahead of public announcement.', type: 'opportunity' },
];

export const METRICS = [
  {
    category: 'Power',
    items: ['MW available vs committed', 'Time-to-interconnect', 'Utility approval timelines'],
    description: 'The most critical constraint in modern infrastructure.'
  },
  {
    category: 'Space',
    items: ['White space vs shell', 'Density per rack', 'Expansion headroom'],
    description: 'Evaluating current utility against future scalability.'
  },
  {
    category: 'Connectivity',
    items: ['Carrier diversity', 'Latency considerations', 'Dark fiber access'],
    description: 'Ensuring path diversity and performance at the edge.'
  },
  {
    category: 'Delivery Risk',
    items: ['Build timelines', 'Supply chain constraints', 'Permitting exposure'],
    description: 'Separating marketing dates from realistic operational go-lives.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: "Robert Miller",
    role: "Infrastructure Lead, Global SaaS",
    content: "InfraAlign™ surfaced three off-market options in Europe that our brokers didn't even know existed. They cut our evaluation time in half.",
    avatar: "https://picsum.photos/seed/robert/100/100"
  }
];

export const SECURITY_STATS = [
  { name: 'Mon', threats: 240, mitigated: 240 },
  { name: 'Tue', threats: 300, mitigated: 300 },
  { name: 'Wed', threats: 280, mitigated: 280 },
  { name: 'Thu', threats: 350, mitigated: 350 },
  { name: 'Fri', threats: 310, mitigated: 310 },
  { name: 'Sat', threats: 150, mitigated: 150 },
  { name: 'Sun', threats: 120, mitigated: 120 },
];
