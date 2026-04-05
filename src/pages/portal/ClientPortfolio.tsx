import { PortalLayout } from '@/components/shared/PortalLayout';
import { useAuth } from '@/lib/auth';
import { useInvestments } from '@/hooks/useInvestments';
import { useK1Documents } from '@/hooks/useCompliance';
import { useNotifications } from '@/hooks/useClientExperience';
import { CATEGORY_LABELS, K1_STATUS_LABELS } from '@/types/dataroom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Bell, TrendingUp, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientPortfolio() {
  const { user } = useAuth();
  const { data: investments = [] } = useInvestments();
  const { data: k1s = [] } = useK1Documents({ clientId: user?.id });
  const { data: notifications = [] } = useNotifications();

  const activeInvestments = investments.filter((i) => i.status === 'active');
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;
  const pendingK1s = k1s.filter((k) => k.status === 'distributed' || k.status === 'final');

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">My Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-1">Your investment overview and documents</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <Building2 className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-mono font-bold">{activeInvestments.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Active Investments</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <FileText className="h-5 w-5 text-teal-400 mb-2" />
            <div className="text-2xl font-mono font-bold">{pendingK1s.length}</div>
            <div className="text-xs text-muted-foreground mt-1">K-1s Available</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <Bell className="h-5 w-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-mono font-bold">{unreadNotifs}</div>
            <div className="text-xs text-muted-foreground mt-1">Unread Notifications</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <TrendingUp className="h-5 w-5 text-green-400 mb-2" />
            <div className="text-2xl font-mono font-bold">{investments.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Deals Accessed</div>
          </div>
        </div>

        {/* K-1 Documents */}
        {pendingK1s.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-3">K-1 Documents</h2>
            <div className="rounded-xl border border-border/50 bg-card/30 divide-y divide-border/30">
              {pendingK1s.map((k1) => {
                const inv = investments.find((i) => i.id === k1.investment_id);
                return (
                  <div key={k1.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm font-medium">{inv?.title ?? 'Investment'}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Tax Year {k1.tax_year}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{K1_STATUS_LABELS[k1.status]}</Badge>
                      {k1.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={k1.file_url} target="_blank" rel="noreferrer"><Download className="h-3 w-3 mr-1" />Download</a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Investments */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-3">Available Investments</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeInvestments.map((inv) => (
              <Link key={inv.id} to={`/portal/deal-room/${inv.slug}`} className="block">
                <div className="rounded-xl border border-border/50 bg-card/30 p-5 hover:border-primary/50 transition-colors">
                  <Badge variant="outline" className="mb-3 text-xs">{CATEGORY_LABELS[inv.category]}</Badge>
                  <h3 className="font-display font-semibold">{inv.title}</h3>
                  {inv.short_description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{inv.short_description}</p>}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border/30">
                    {inv.minimum_investment && (
                      <div><div className="text-xs font-mono text-primary">${(inv.minimum_investment / 1000).toFixed(0)}K</div><div className="text-[10px] text-muted-foreground">Minimum</div></div>
                    )}
                    {inv.target_return && (
                      <div><div className="text-xs font-mono text-primary">{inv.target_return}</div><div className="text-[10px] text-muted-foreground">Target</div></div>
                    )}
                    {inv.hold_period && (
                      <div><div className="text-xs font-mono text-primary">{inv.hold_period}</div><div className="text-[10px] text-muted-foreground">Hold</div></div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
