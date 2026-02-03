import { ActionItem } from '@/types/dashboard';
import { BusinessBadge } from './BusinessBadge';
import { ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopActionsCardProps {
  actions: ActionItem[];
}

const urgencyStyles = {
  immediate: 'status-critical animate-pulse-glow',
  today: 'status-warning',
  'this-week': 'bg-secondary text-secondary-foreground',
};

export function TopActionsCard({ actions }: TopActionsCardProps) {
  return (
    <div className="rounded-lg bg-card border border-border/50 p-5 animate-slide-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ai to-retreats">
          <Zap className="h-4 w-4 text-background" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Top 3 Actions</h2>
          <p className="text-xs text-muted-foreground">What matters today</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {actions.slice(0, 3).map((action, index) => (
          <div
            key={action.id}
            className="group relative rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold">
                  {index + 1}
                </span>
                <h3 className="font-medium text-sm">{action.title}</h3>
              </div>
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-medium',
                  urgencyStyles[action.urgency]
                )}
              >
                {action.urgency === 'immediate' ? 'Now' : action.urgency === 'today' ? 'Today' : 'This Week'}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 pl-7">
              {action.context}
            </p>
            
            <div className="flex items-center justify-between pl-7">
              <BusinessBadge business={action.business} size="sm" />
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
