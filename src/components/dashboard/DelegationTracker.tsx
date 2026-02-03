import { Task } from '@/types/dashboard';
import { BusinessBadge } from './BusinessBadge';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, Hand, User } from 'lucide-react';

interface DelegationTrackerProps {
  tasks: Task[];
}

const statusConfig = {
  holding: { icon: Hand, label: 'You\'re Holding', color: 'text-warning' },
  delegated: { icon: User, label: 'Delegated', color: 'text-ai' },
  'in-progress': { icon: Clock, label: 'In Progress', color: 'text-muted-foreground' },
  blocked: { icon: AlertCircle, label: 'Blocked', color: 'text-critical' },
};

const priorityStyles = {
  critical: 'border-l-critical',
  high: 'border-l-warning',
  medium: 'border-l-muted-foreground',
  low: 'border-l-border',
};

export function DelegationTracker({ tasks }: DelegationTrackerProps) {
  const holding = tasks.filter(t => t.status === 'holding');
  const delegated = tasks.filter(t => t.status === 'delegated' || t.status === 'in-progress');
  const blocked = tasks.filter(t => t.status === 'blocked');
  
  return (
    <div className="rounded-lg bg-card border border-border/50 p-5 animate-slide-in">
      <h2 className="text-sm font-semibold mb-4">Delegation Status</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="metric-value text-warning">{holding.length}</p>
          <p className="text-xs text-warning/80">You're Holding</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-ai/10 border border-ai/20">
          <p className="metric-value text-ai">{delegated.length}</p>
          <p className="text-xs text-ai/80">Delegated</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-critical/10 border border-critical/20">
          <p className="metric-value text-critical">{blocked.length}</p>
          <p className="text-xs text-critical/80">Blocked</p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {tasks.map((task) => {
          const status = statusConfig[task.status];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border-l-2',
                priorityStyles[task.priority]
              )}
            >
              <StatusIcon className={cn('h-4 w-4 mt-0.5 shrink-0', status.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <BusinessBadge business={task.business} showLabel={false} size="sm" />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {task.assignee && <span>→ {task.assignee}</span>}
                  <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
