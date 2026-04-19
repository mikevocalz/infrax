import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Pillar {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  content: string;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  provider: string;
  capacity_mw: number;
  status: string;
  location: string;
}

export interface MarketSignal {
  id: string;
  category: string;
  signal: string;
  impact?: string;
  timestamp?: string;
  severity: 'High' | 'Medium' | 'Low';
}
