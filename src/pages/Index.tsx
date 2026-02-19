import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimePeriod } from '@/types/dashboard';
import { TimePeriodToggle } from '@/components/dashboard/TimePeriodToggle';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TopActionsCard } from '@/components/dashboard/TopActionsCard';
import { DelegationTracker } from '@/components/dashboard/DelegationTracker';
import { BookingsOverview } from '@/components/dashboard/BookingsOverview';
import { KingdomAllocationCard } from '@/components/dashboard/KingdomAllocationCard';
import { BottleneckAlerts } from '@/components/dashboard/BottleneckAlerts';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import {
  mockBusinessMetrics,
  mockTopActions,
  mockTasks,
  mockBookings,
  mockKingdomAllocation,
  mockBottlenecks,
  mockDeals,
} from '@/data/mockData';
import { Bot, Home, Landmark, Command, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const [period, setPeriod] = useState<TimePeriod>('daily');
  const navigate = useNavigate();
  
  const totalRevenue = mockBusinessMetrics.reduce((sum, m) => sum + m.revenue.current, 0);
  const totalPipeline = mockBusinessMetrics.reduce((sum, m) => sum + m.pipelineValue, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ai via-retreats to-tax">
              <Command className="h-4 w-4 text-background" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Command Center</h1>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <TimePeriodToggle value={period} onChange={setPeriod} />
        </div>
      </header>

      <main className="container py-6">
        {/* Top Actions - Most prominent */}
        <div className="mb-6">
          <TopActionsCard actions={mockTopActions} />
        </div>
        
        {/* Bottleneck Alerts */}
        {mockBottlenecks.length > 0 && (
          <div className="mb-6">
            <BottleneckAlerts bottlenecks={mockBottlenecks} />
          </div>
        )}

        {/* Revenue Overview */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Revenue by Business</h2>
            <div className="text-right">
              <p className="font-mono text-lg font-semibold">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total {period === 'daily' ? 'today' : period === 'weekly' ? 'this week' : 'this month'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockBusinessMetrics.map((metric) => (
              <div key={metric.business} className="relative">
                <div className="absolute -top-2 left-3 z-10">
                  <div className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${
                    metric.business === 'ai-agents' ? 'business-badge-ai' :
                    metric.business === 'retreats' ? 'business-badge-retreats' :
                    'business-badge-tax'
                  }`}>
                    {metric.business === 'ai-agents' && <Bot className="h-3 w-3" />}
                    {metric.business === 'retreats' && <Home className="h-3 w-3" />}
                    {metric.business === 'tax-capital' && <Landmark className="h-3 w-3" />}
                    <span>
                      {metric.business === 'ai-agents' ? 'AI Agents' :
                       metric.business === 'retreats' ? 'Retreats' :
                       'Tax & Capital'}
                    </span>
                  </div>
                </div>
                <MetricCard
                  label="Revenue"
                  value={metric.revenue.current}
                  previousValue={metric.revenue.previous}
                  target={metric.revenue.target}
                  business={metric.business}
                  format="currency"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pipeline */}
          <PipelineOverview deals={mockDeals} />
          
          {/* Delegation */}
          <DelegationTracker tasks={mockTasks} />
          
          {/* Bookings */}
          <BookingsOverview bookings={mockBookings} />
          
          {/* Kingdom Allocation */}
          <KingdomAllocationCard allocation={mockKingdomAllocation} />
        </div>

        {/* Investment Intelligence CTA */}
        <section className="my-6">
          <Button
            variant="outline"
            className="w-full h-14 justify-between border-border/50 hover:border-border bg-card"
            onClick={() => navigate('/investments')}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ai to-tax">
                <TrendingUp className="h-4 w-4 text-background" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Investment Intelligence</p>
                <p className="text-xs text-muted-foreground">Payout tracking · Portfolio analytics · Company directory</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Open →</span>
          </Button>
        </section>

        {/* Footer Stats */}
        <footer className="mt-8 pt-6 border-t border-border/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="font-mono text-xl font-semibold">${(totalPipeline / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total Pipeline</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-semibold">{mockDeals.length}</p>
              <p className="text-xs text-muted-foreground">Active Deals</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-semibold">{mockTasks.filter(t => t.status === 'holding').length}</p>
              <p className="text-xs text-muted-foreground">Holding Items</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-semibold text-success">
                {((mockKingdomAllocation.allocated / mockKingdomAllocation.target) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Kingdom Target</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
