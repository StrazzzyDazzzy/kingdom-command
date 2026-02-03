import { ActionItem, Booking, Bottleneck, BusinessMetrics, Deal, KingdomAllocation, Task } from '@/types/dashboard';

export const mockBusinessMetrics: BusinessMetrics[] = [
  {
    business: 'ai-agents',
    revenue: { current: 47500, previous: 42000, target: 50000 },
    pipelineValue: 185000,
    conversionRate: 0.32,
    deals: []
  },
  {
    business: 'retreats',
    revenue: { current: 28400, previous: 31200, target: 35000 },
    pipelineValue: 67000,
    conversionRate: 0.68,
    deals: []
  },
  {
    business: 'tax-capital',
    revenue: { current: 15200, previous: 12800, target: 20000 },
    pipelineValue: 340000,
    conversionRate: 0.15,
    deals: []
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise AI Platform - TechCorp',
    business: 'ai-agents',
    value: 75000,
    stage: 'proposal',
    probability: 0.6,
    nextAction: 'Send revised SOW by EOD',
    dueDate: '2026-02-03'
  },
  {
    id: '2',
    name: 'Custom Agent Suite - FinServ Inc',
    business: 'ai-agents',
    value: 45000,
    stage: 'negotiation',
    probability: 0.8,
    nextAction: 'Final pricing call scheduled',
    dueDate: '2026-02-04'
  },
  {
    id: '3',
    name: 'Executive Retreat - March',
    business: 'retreats',
    value: 18000,
    stage: 'qualified',
    probability: 0.5,
    nextAction: 'Send property walkthrough video',
    dueDate: '2026-02-05'
  },
  {
    id: '4',
    name: 'Q1 Tax Strategy - Williams Family',
    business: 'tax-capital',
    value: 125000,
    stage: 'proposal',
    probability: 0.7,
    nextAction: 'Review draft with legal',
    dueDate: '2026-02-03'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize AI agent pricing model',
    business: 'ai-agents',
    priority: 'critical',
    status: 'holding',
    dueDate: '2026-02-03'
  },
  {
    id: '2',
    title: 'Review retreat property photos',
    business: 'retreats',
    priority: 'high',
    status: 'delegated',
    assignee: 'Sarah',
    dueDate: '2026-02-04'
  },
  {
    id: '3',
    title: 'Prepare Q1 capital allocation report',
    business: 'tax-capital',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Michael',
    dueDate: '2026-02-05'
  },
  {
    id: '4',
    title: 'Client onboarding automation',
    business: 'ai-agents',
    priority: 'medium',
    status: 'blocked',
    assignee: 'Dev Team',
    dueDate: '2026-02-06'
  },
  {
    id: '5',
    title: 'Update direct booking landing page',
    business: 'retreats',
    priority: 'medium',
    status: 'delegated',
    assignee: 'Design',
    dueDate: '2026-02-07'
  }
];

export const mockBookings: Booking[] = [
  { id: '1', property: 'Mountain Estate', source: 'direct', revenue: 4200, checkIn: '2026-02-10', checkOut: '2026-02-15', status: 'confirmed' },
  { id: '2', property: 'Lake House', source: 'airbnb', revenue: 2800, checkIn: '2026-02-12', checkOut: '2026-02-16', status: 'confirmed' },
  { id: '3', property: 'Mountain Estate', source: 'vrbo', revenue: 3600, checkIn: '2026-02-20', checkOut: '2026-02-24', status: 'pending' },
  { id: '4', property: 'Downtown Loft', source: 'direct', revenue: 1800, checkIn: '2026-02-08', checkOut: '2026-02-10', status: 'confirmed' },
  { id: '5', property: 'Lake House', source: 'direct', revenue: 5200, checkIn: '2026-02-25', checkOut: '2026-03-02', status: 'confirmed' }
];

export const mockKingdomAllocation: KingdomAllocation = {
  totalRevenue: 91100,
  allocated: 14200,
  target: 18220,
  distributions: [
    { id: '1', recipient: 'Local Food Bank', amount: 5000, date: '2026-01-28', category: 'Community' },
    { id: '2', recipient: 'Youth Mentorship Program', amount: 4200, date: '2026-01-25', category: 'Education' },
    { id: '3', recipient: 'Church Building Fund', amount: 5000, date: '2026-01-20', category: 'Faith' }
  ]
};

export const mockTopActions: ActionItem[] = [
  {
    id: '1',
    title: 'Close FinServ negotiation',
    business: 'ai-agents',
    impact: 'revenue',
    urgency: 'today',
    context: '$45K deal at 80% probability - final call at 2pm'
  },
  {
    id: '2',
    title: 'Sign Williams tax strategy',
    business: 'tax-capital',
    impact: 'revenue',
    urgency: 'today',
    context: '$125K engagement pending legal review completion'
  },
  {
    id: '3',
    title: 'Unblock client onboarding automation',
    business: 'ai-agents',
    impact: 'operations',
    urgency: 'immediate',
    context: 'Dev team waiting on API credentials - 4 days blocked'
  }
];

export const mockBottlenecks: Bottleneck[] = [
  {
    id: '1',
    title: 'Client onboarding automation blocked',
    business: 'ai-agents',
    severity: 'critical',
    daysPending: 4,
    blockedValue: 32000
  },
  {
    id: '2',
    title: 'Direct booking conversion below target',
    business: 'retreats',
    severity: 'warning',
    daysPending: 12
  }
];
