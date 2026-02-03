import { BusinessType } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Bot, Home, Landmark } from 'lucide-react';

interface BusinessBadgeProps {
  business: BusinessType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const businessConfig = {
  'ai-agents': {
    label: 'AI Agents',
    icon: Bot,
    className: 'business-badge-ai',
  },
  'retreats': {
    label: 'Retreats',
    icon: Home,
    className: 'business-badge-retreats',
  },
  'tax-capital': {
    label: 'Tax & Capital',
    icon: Landmark,
    className: 'business-badge-tax',
  },
};

export function BusinessBadge({ business, showLabel = true, size = 'sm' }: BusinessBadgeProps) {
  const config = businessConfig[business];
  const Icon = config.icon;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {showLabel && config.label}
    </span>
  );
}

export function getBusinessBorderClass(business: BusinessType): string {
  const classes = {
    'ai-agents': 'card-glow-ai',
    'retreats': 'card-glow-retreats',
    'tax-capital': 'card-glow-tax',
  };
  return classes[business];
}
