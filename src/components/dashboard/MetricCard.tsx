import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { BusinessType } from '@/types/dashboard';
import { getBusinessBorderClass } from './BusinessBadge';

interface MetricCardProps {
  label: string;
  value: string | number;
  previousValue?: number;
  target?: number;
  business?: BusinessType;
  format?: 'currency' | 'percent' | 'number';
  showTrend?: boolean;
}

function formatValue(value: string | number, format: 'currency' | 'percent' | 'number' = 'number'): string {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percent':
      return `${(value * 100).toFixed(1)}%`;
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function MetricCard({
  label,
  value,
  previousValue,
  target,
  business,
  format = 'number',
  showTrend = true,
}: MetricCardProps) {
  const numericValue = typeof value === 'number' ? value : 0;
  const change = previousValue !== undefined ? calculateChange(numericValue, previousValue) : null;
  const targetProgress = target ? (numericValue / target) * 100 : null;
  
  const getTrendIcon = () => {
    if (change === null) return null;
    if (change > 2) return <TrendingUp className="h-3.5 w-3.5" />;
    if (change < -2) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };
  
  const getTrendClass = () => {
    if (change === null) return '';
    if (change > 2) return 'text-success';
    if (change < -2) return 'text-critical';
    return 'text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'rounded-lg bg-card p-4 animate-slide-in',
        business && getBusinessBorderClass(business)
      )}
    >
      <p className="metric-label mb-2">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="metric-value">{formatValue(value, format)}</p>
        {showTrend && change !== null && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendClass())}>
            {getTrendIcon()}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      {targetProgress !== null && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Target</span>
            <span>{targetProgress.toFixed(0)}%</span>
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                targetProgress >= 100 ? 'bg-success' : targetProgress >= 70 ? 'bg-warning' : 'bg-critical'
              )}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
