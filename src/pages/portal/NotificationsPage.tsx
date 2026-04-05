import { PortalLayout } from '@/components/shared/PortalLayout';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useClientExperience';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, FileText, TrendingUp, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NotificationType } from '@/types/dataroom';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-400" />,
  success: <CheckCircle className="h-4 w-4 text-green-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  action_required: <Mail className="h-4 w-4 text-red-400" />,
  document: <FileText className="h-4 w-4 text-teal-400" />,
  k1: <FileText className="h-4 w-4 text-primary" />,
  investment: <TrendingUp className="h-4 w-4 text-primary" />,
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.is_read).length;

  const handleClick = (id: string, actionUrl: string | null, isRead: boolean) => {
    if (!isRead) markRead.mutate(id);
    if (actionUrl) navigate(actionUrl);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
              <CheckCheck className="mr-2 h-4 w-4" />Mark All Read
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id, n.action_url, n.is_read)}
                  className={`w-full text-left flex items-start gap-4 p-4 transition-colors hover:bg-muted/5 ${!n.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div className="mt-0.5">{typeIcons[n.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!n.is_read ? 'font-semibold' : 'font-medium'}`}>{n.title}</span>
                      {!n.is_read && <Badge className="bg-primary/20 text-primary text-[10px] px-1.5">New</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(n.created_at)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
