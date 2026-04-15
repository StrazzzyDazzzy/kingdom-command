import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
      <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild><Link to={actionHref}>{actionLabel}</Link></Button>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
