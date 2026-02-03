import { TimePeriod } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface TimePeriodToggleProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
];

export function TimePeriodToggle({ value, onChange }: TimePeriodToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-secondary p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            value === period.value
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
