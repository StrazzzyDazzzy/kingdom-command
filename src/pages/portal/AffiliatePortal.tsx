import { useState } from 'react';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { useAuth } from '@/lib/auth';
import { useAffiliateReferrals, useCreateReferral, useUpdateReferral, useDeleteReferral } from '@/hooks/useAffiliate';
import { useInvestments } from '@/hooks/useInvestments';
import { REFERRAL_STATUS_LABELS } from '@/types/dataroom';
import type { ReferralStatus } from '@/types/dataroom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, DollarSign, Users, TrendingUp, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<ReferralStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  qualified: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  converted: 'bg-green-500/10 text-green-400 border-green-500/30',
  lost: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function AffiliatePortal() {
  const { user } = useAuth();
  const { data: referrals = [], isLoading } = useAffiliateReferrals();
  const { data: investments = [] } = useInvestments();
  const createReferral = useCreateReferral();
  const updateReferral = useUpdateReferral();
  const deleteReferral = useDeleteReferral();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ referred_name: '', referred_email: '', referred_phone: '', investment_id: '', notes: '' });

  const filtered = search
    ? referrals.filter((r) => `${r.referred_name} ${r.referred_email}`.toLowerCase().includes(search.toLowerCase()))
    : referrals;

  const totalCommission = referrals.reduce((sum, r) => sum + (r.commission_amount ?? 0), 0);
  const converted = referrals.filter((r) => r.status === 'converted').length;
  const conversionRate = referrals.length > 0 ? Math.round((converted / referrals.length) * 100) : 0;

  const handleCreate = async () => {
    if (!form.referred_name || !form.referred_email) return;
    await createReferral.mutateAsync({
      affiliate_id: user!.id,
      referred_name: form.referred_name,
      referred_email: form.referred_email,
      referred_phone: form.referred_phone || null,
      investment_id: form.investment_id || null,
      notes: form.notes || null,
    });
    toast({ title: 'Referral submitted' });
    setCreateOpen(false);
    setForm({ referred_name: '', referred_email: '', referred_phone: '', investment_id: '', notes: '' });
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Growth Partner Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your referrals and track commissions</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button><UserPlus className="mr-2 h-4 w-4" />New Referral</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit Referral</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <Input value={form.referred_name} onChange={(e) => setForm({ ...form, referred_name: e.target.value })} placeholder="Full Name *" />
                <Input type="email" value={form.referred_email} onChange={(e) => setForm({ ...form, referred_email: e.target.value })} placeholder="Email *" />
                <Input value={form.referred_phone} onChange={(e) => setForm({ ...form, referred_phone: e.target.value })} placeholder="Phone (optional)" />
                <Select value={form.investment_id} onValueChange={(v) => setForm({ ...form, investment_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Interested in (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific investment</SelectItem>
                    {investments.map((i) => <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
                <Button onClick={handleCreate} disabled={createReferral.isPending} className="w-full">Submit Referral</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <Users className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-mono font-bold">{referrals.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Referrals</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <TrendingUp className="h-5 w-5 text-green-400 mb-2" />
            <div className="text-2xl font-mono font-bold">{converted}</div>
            <div className="text-xs text-muted-foreground mt-1">Converted</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <DollarSign className="h-5 w-5 text-primary mb-2" />
            <div className="text-2xl font-mono font-bold text-primary">${totalCommission.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Commissions</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-teal-400">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Conversion Rate</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search referrals..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Referrals List */}
        <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Commission</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground"><UserPlus className="mx-auto h-8 w-8 mb-2 opacity-30" />No referrals yet</td></tr>
                ) : filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/30 hover:bg-muted/5">
                    <td className="px-4 py-3 text-sm font-medium">{r.referred_name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.referred_email}</td>
                    <td className="px-4 py-3">
                      <Select value={r.status} onValueChange={(v) => updateReferral.mutate({ id: r.id, status: v as ReferralStatus })}>
                        <SelectTrigger className="w-[120px] h-7 text-xs"><Badge variant="outline" className={statusColors[r.status]}>{REFERRAL_STATUS_LABELS[r.status]}</Badge></SelectTrigger>
                        <SelectContent>{Object.entries(REFERRAL_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{r.commission_amount ? `$${r.commission_amount.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => deleteReferral.mutate(r.id)}><Trash2 className="h-3 w-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
