import { PortalLayout } from '@/components/shared/PortalLayout';
import { useInvestments } from '@/hooks/useInvestments';
import { useAllProfiles, useAllReferrals } from '@/hooks/useAffiliate';
import { useK1Documents, useComplianceItems } from '@/hooks/useCompliance';
import { CATEGORY_LABELS } from '@/types/dataroom';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Building2, FileText, TrendingUp, DollarSign, Shield, UserPlus } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { data: investments = [] } = useInvestments();
  const { data: profiles = [] } = useAllProfiles();
  const { data: referrals = [] } = useAllReferrals();
  const { data: k1s = [] } = useK1Documents();
  const { data: compliance = [] } = useComplianceItems();

  const typedProfiles = profiles as Array<{ id: string; role: string; full_name: string; created_at: string }>;

  const clients = typedProfiles.filter((p) => p.role === 'client');
  const affiliates = typedProfiles.filter((p) => p.role === 'affiliate');
  const activeDeals = investments.filter((i) => i.status === 'active');
  const totalMinimum = investments.reduce((s, i) => s + (i.minimum_investment ?? 0), 0);
  const convertedReferrals = referrals.filter((r) => r.status === 'converted');
  const totalCommissions = referrals.reduce((s, r) => s + (r.commission_amount ?? 0), 0);
  const compliantItems = compliance.filter((c) => c.status === 'compliant').length;
  const totalCompliance = compliance.filter((c) => c.status !== 'not_applicable').length;

  // Category breakdown
  const categoryMap = new Map<string, number>();
  investments.forEach((i) => {
    categoryMap.set(i.category, (categoryMap.get(i.category) ?? 0) + 1);
  });
  const categories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

  // Recent users
  const recentUsers = typedProfiles.slice(0, 8);

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide metrics and insights</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building2, label: 'Active Deals', value: activeDeals.length, color: 'text-primary' },
            { icon: Users, label: 'Total Clients', value: clients.length, color: 'text-blue-400' },
            { icon: UserPlus, label: 'Affiliates', value: affiliates.length, color: 'text-teal-400' },
            { icon: DollarSign, label: 'Total Minimums', value: `$${(totalMinimum / 1000000).toFixed(1)}M`, color: 'text-primary' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-4">
              <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
              <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Investment Categories */}
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Investment Breakdown</h3>
            <div className="space-y-3">
              {categories.map(([cat, count]) => {
                const pct = Math.round((count / investments.length) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}</span>
                      <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && <p className="text-sm text-muted-foreground">No investments yet</p>}
            </div>
          </div>

          {/* Referral Funnel */}
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-400" />Referral Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Referrals', value: referrals.length, color: 'bg-blue-500' },
                { label: 'Contacted', value: referrals.filter((r) => r.status === 'contacted').length, color: 'bg-yellow-500' },
                { label: 'Qualified', value: referrals.filter((r) => r.status === 'qualified').length, color: 'bg-teal-500' },
                { label: 'Converted', value: convertedReferrals.length, color: 'bg-green-500' },
              ].map((stage) => {
                const pct = referrals.length > 0 ? Math.round((stage.value / referrals.length) * 100) : 0;
                return (
                  <div key={stage.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stage.label}</span>
                      <span className="font-mono text-muted-foreground">{stage.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                      <div className={`h-full rounded-full ${stage.color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-border/30 flex justify-between text-sm">
                <span className="text-muted-foreground">Total Commissions</span>
                <span className="font-mono text-primary font-semibold">${totalCommissions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Compliance Overview */}
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-orange-400" />Compliance Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/5">
                <div className="text-3xl font-mono font-bold text-green-400">{totalCompliance > 0 ? Math.round((compliantItems / totalCompliance) * 100) : 100}%</div>
                <div className="text-xs text-muted-foreground mt-1">Compliance Rate</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/5">
                <div className="text-3xl font-mono font-bold">{compliance.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Items</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/5">
                <div className="text-3xl font-mono font-bold text-primary">{k1s.length}</div>
                <div className="text-xs text-muted-foreground mt-1">K-1 Documents</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/5">
                <div className="text-3xl font-mono font-bold text-yellow-400">{k1s.filter((k) => k.status === 'pending').length}</div>
                <div className="text-xs text-muted-foreground mt-1">K-1s Pending</div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" />Recent Users</h3>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {u.full_name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{u.full_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{u.role}</Badge>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-sm text-muted-foreground">No users yet</p>}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
