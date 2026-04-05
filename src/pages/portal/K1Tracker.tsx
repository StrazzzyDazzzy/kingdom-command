import { useState } from 'react';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { useK1Documents, useCreateK1, useUpdateK1, useDeleteK1 } from '@/hooks/useCompliance';
import { useInvestments } from '@/hooks/useInvestments';
import { useAllProfiles } from '@/hooks/useAffiliate';
import { K1_STATUS_LABELS } from '@/types/dataroom';
import type { K1Status } from '@/types/dataroom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Send, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<K1Status, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  draft: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  final: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  amended: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  distributed: 'bg-green-500/10 text-green-400 border-green-500/30',
};

export default function K1Tracker() {
  const [yearFilter, setYearFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data: k1s = [], isLoading } = useK1Documents(yearFilter ? { taxYear: parseInt(yearFilter) } : undefined);
  const { data: investments = [] } = useInvestments();
  const { data: profiles = [] } = useAllProfiles();
  const createK1 = useCreateK1();
  const updateK1 = useUpdateK1();
  const deleteK1 = useDeleteK1();
  const { toast } = useToast();

  const [form, setForm] = useState({ investment_id: '', client_id: '', tax_year: new Date().getFullYear().toString(), notes: '' });

  const filtered = k1s.filter((k) => {
    if (statusFilter && k.status !== statusFilter) return false;
    if (search) {
      const inv = investments.find((i) => i.id === k.investment_id);
      const prof = profiles.find((p: { id: string }) => p.id === k.client_id);
      const text = `${inv?.title ?? ''} ${(prof as { full_name?: string })?.full_name ?? ''} ${k.notes ?? ''}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const stats = {
    total: k1s.length,
    pending: k1s.filter((k) => k.status === 'pending').length,
    distributed: k1s.filter((k) => k.status === 'distributed').length,
    final: k1s.filter((k) => k.status === 'final').length,
  };

  const handleCreate = async () => {
    if (!form.investment_id || !form.client_id) return;
    await createK1.mutateAsync({ investment_id: form.investment_id, client_id: form.client_id, tax_year: parseInt(form.tax_year), notes: form.notes || null });
    toast({ title: 'K-1 created' });
    setCreateOpen(false);
    setForm({ investment_id: '', client_id: '', tax_year: new Date().getFullYear().toString(), notes: '' });
  };

  const handleDistribute = async (id: string) => {
    await updateK1.mutateAsync({ id, status: 'distributed' as K1Status, distributed_at: new Date().toISOString() });
    toast({ title: 'K-1 marked as distributed' });
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">K-1 Tracker</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and distribute K-1 documents to clients</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />New K-1</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create K-1 Record</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <Select value={form.investment_id} onValueChange={(v) => setForm({ ...form, investment_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select investment" /></SelectTrigger>
                  <SelectContent>{investments.map((i) => <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{(profiles as Array<{ id: string; full_name: string; role: string }>).filter((p) => p.role === 'client').map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={form.tax_year} onChange={(e) => setForm({ ...form, tax_year: e.target.value })} placeholder="Tax Year" />
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" />
                <Button onClick={handleCreate} disabled={createK1.isPending} className="w-full">Create K-1</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total K-1s', value: stats.total, color: 'text-foreground' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Final', value: stats.final, color: 'text-teal-400' },
            { label: 'Distributed', value: stats.distributed, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-4">
              <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search K-1s..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Years" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {[2026, 2025, 2024, 2023].map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {Object.entries(K1_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Investment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Year</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground"><FileText className="mx-auto h-8 w-8 mb-2 opacity-30" />No K-1 documents found</td></tr>
                ) : filtered.map((k) => {
                  const inv = investments.find((i) => i.id === k.investment_id);
                  const prof = profiles.find((p: { id: string }) => p.id === k.client_id) as { full_name?: string } | undefined;
                  return (
                    <tr key={k.id} className="border-b border-border/30 hover:bg-muted/5">
                      <td className="px-4 py-3 text-sm">{inv?.title ?? 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm">{prof?.full_name ?? 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm font-mono">{k.tax_year}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statusColors[k.status]}>{K1_STATUS_LABELS[k.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {k.status === 'final' && (
                            <Button size="sm" variant="outline" onClick={() => handleDistribute(k.id)} className="text-green-400"><Send className="h-3 w-3 mr-1" />Distribute</Button>
                          )}
                          {k.file_url && (
                            <Button size="sm" variant="ghost" asChild><a href={k.file_url} target="_blank" rel="noreferrer"><Download className="h-3 w-3" /></a></Button>
                          )}
                          <Select value={k.status} onValueChange={(v) => updateK1.mutate({ id: k.id, status: v as K1Status })}>
                            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{Object.entries(K1_STATUS_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteK1.mutate(k.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
