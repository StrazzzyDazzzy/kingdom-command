export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export type BusinessType = 'ai-agents' | 'retreats' | 'tax-capital';

export interface Revenue {
  current: number;
  previous: number;
  target: number;
}

export interface Deal {
  id: string;
  name: string;
  business: BusinessType;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  probability: number;
  nextAction: string;
  dueDate: string;
}

export interface Task {
  id: string;
  title: string;
  business: BusinessType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'holding' | 'delegated' | 'in-progress' | 'blocked';
  assignee?: string;
  dueDate: string;
}

export interface Booking {
  id: string;
  property: string;
  source: 'direct' | 'airbnb' | 'vrbo';
  revenue: number;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface KingdomAllocation {
  totalRevenue: number;
  allocated: number;
  target: number;
  distributions: {
    id: string;
    recipient: string;
    amount: number;
    date: string;
    category: string;
  }[];
}

export interface ActionItem {
  id: string;
  title: string;
  business: BusinessType;
  impact: 'revenue' | 'operations' | 'strategic';
  urgency: 'immediate' | 'today' | 'this-week';
  context: string;
}

export interface Bottleneck {
  id: string;
  title: string;
  business: BusinessType;
  severity: 'critical' | 'warning' | 'watch';
  daysPending: number;
  blockedValue?: number;
}

export interface BusinessMetrics {
  business: BusinessType;
  revenue: Revenue;
  deals: Deal[];
  pipelineValue: number;
  conversionRate: number;
}
