import { Deal } from '@/types/dashboard';
import { BusinessBadge, getBusinessBorderClass } from './BusinessBadge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PipelineOverviewProps {
  deals: Deal[];
}

const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'] as const;

const stageLabels: Record<string, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed: 'Closed',
};

export function PipelineOverview({ deals }: PipelineOverviewProps) {
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const weightedValue = deals.reduce((sum, d) => sum + d.value * d.probability, 0);
  
  // Group deals by stage
  const dealsByStage = stageOrder.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.stage === stage);
    return acc;
  }, {} as Record<string, Deal[]>);

  return (
    <div className="rounded-lg bg-card border border-border/50 p-5 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Pipeline Overview</h2>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold">${(weightedValue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground">weighted value</p>
        </div>
      </div>
      
      {/* Stage funnel */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {stageOrder.slice(0, -1).map((stage, idx) => {
          const stageDeals = dealsByStage[stage];
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          
          return (
            <div key={stage} className="flex items-center">
              <div className={cn(
                'flex flex-col items-center px-3 py-2 rounded-lg min-w-[80px]',
                stageDeals.length > 0 ? 'bg-secondary' : 'bg-secondary/30'
              )}>
                <p className="font-mono text-sm font-semibold">{stageDeals.length}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{stageLabels[stage]}</p>
                {stageValue > 0 && (
                  <p className="text-xs font-mono text-muted-foreground">${(stageValue / 1000).toFixed(0)}k</p>
                )}
              </div>
              {idx < stageOrder.length - 2 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground mx-1 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Hot deals */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hot Deals</p>
        {deals
          .filter(d => d.stage !== 'closed')
          .sort((a, b) => b.probability * b.value - a.probability * a.value)
          .slice(0, 4)
          .map((deal) => (
            <div
              key={deal.id}
              className={cn(
                'p-3 rounded-lg bg-secondary/30',
                getBusinessBorderClass(deal.business)
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium truncate">{deal.name}</p>
                <p className="font-mono text-sm font-semibold shrink-0">${(deal.value / 1000).toFixed(0)}k</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BusinessBadge business={deal.business} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {(deal.probability * 100).toFixed(0)}% prob
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[140px]">{deal.nextAction}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
