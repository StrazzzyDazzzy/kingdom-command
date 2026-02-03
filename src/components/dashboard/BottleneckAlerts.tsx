import { Bottleneck } from '@/types/dashboard';
import { BusinessBadge } from './BusinessBadge';
import { AlertTriangle, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottleneckAlertsProps {
  bottlenecks: Bottleneck[];
}

const severityConfig = {
  critical: { icon: XCircle, className: 'status-critical', label: 'Critical' },
  warning: { icon: AlertTriangle, className: 'status-warning', label: 'Warning' },
  watch: { icon: Eye, className: 'bg-muted text-muted-foreground', label: 'Watch' },
};

export function BottleneckAlerts({ bottlenecks }: BottleneckAlertsProps) {
  if (bottlenecks.length === 0) {
    return (
      <div className="rounded-lg bg-card border border-success/20 p-4 animate-slide-in">
        <div className="flex items-center gap-2 text-success">
          <Eye className="h-4 w-4" />
          <p className="text-sm font-medium">No bottlenecks detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border/50 p-5 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Bottlenecks & Alerts</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-critical/20 px-2 py-0.5 text-xs font-medium text-critical">
          {bottlenecks.length} issue{bottlenecks.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {bottlenecks.map((bottleneck) => {
          const config = severityConfig[bottleneck.severity];
          const Icon = config.icon;
          
          return (
            <div
              key={bottleneck.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg',
                config.className
              )}
            >
              <Icon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium">{bottleneck.title}</p>
                  <BusinessBadge business={bottleneck.business} showLabel={false} size="sm" />
                </div>
                <div className="flex items-center gap-3 text-xs opacity-80">
                  <span>{bottleneck.daysPending} days pending</span>
                  {bottleneck.blockedValue && (
                    <span className="font-mono">${bottleneck.blockedValue.toLocaleString()} blocked</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
