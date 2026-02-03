import { KingdomAllocation } from '@/types/dashboard';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KingdomAllocationCardProps {
  allocation: KingdomAllocation;
}

export function KingdomAllocationCard({ allocation }: KingdomAllocationCardProps) {
  const progress = (allocation.allocated / allocation.target) * 100;
  const remaining = allocation.target - allocation.allocated;
  
  return (
    <div className="rounded-lg bg-gradient-to-br from-card to-secondary/30 border border-border/50 p-5 animate-slide-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-retreats to-tax">
          <Heart className="h-4 w-4 text-background" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Kingdom Allocation</h2>
          <p className="text-xs text-muted-foreground">20% Give-Back Tracking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="metric-label">Allocated</p>
          <p className="metric-value text-success">
            ${allocation.allocated.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="metric-label">Target (20%)</p>
          <p className="metric-value">
            ${allocation.target.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn(progress >= 100 ? 'text-success' : progress >= 80 ? 'text-foreground' : 'text-warning')}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              progress >= 100 ? 'bg-success' : 'bg-gradient-to-r from-retreats to-tax'
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            ${remaining.toLocaleString()} remaining to reach target
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Distributions</p>
        {allocation.distributions.slice(0, 3).map((dist) => (
          <div key={dist.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
            <div>
              <p className="text-sm font-medium">{dist.recipient}</p>
              <p className="text-xs text-muted-foreground">{dist.category}</p>
            </div>
            <p className="font-mono text-sm text-success">${dist.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
