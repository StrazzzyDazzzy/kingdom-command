import { useState } from 'react';
import { PortalLayout } from '@/components/shared/PortalLayout';
import { useComplianceItems, useCreateComplianceItem, useUpdateComplianceItem, useDeleteComplianceItem } from '@/hooks/useCompliance';
import { useInvestments } from '@/hooks/useInvestments';
import { COMPLIANCE_STATUS_LABELS, COMPLIANCE_CATEGORY_LABELS } from '@/types/dataroom';
import type { ComplianceStatus, ComplianceCategory, CompliancePriority } from '@/types/dataroom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Plus, CheckCircle, AlertTriangle, Clock, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusIcons: Record<ComplianceStatus, React.ReactNode> = {
  compliant: <CheckCircle className="h-4 w-4 text-green-400" />,
  non_compliant: <XCircle className="h-4 w-4 text-red-400" />,
  pending_review: <Clock className="h-4 w-4 text-yellow-400" />,
  not_applicable: <span className="h-4 w-4 text-muted-foreground">—</span>,
};

const priorityColors: Record<CompliancePriority, string> = {
  low: 'bg-slate-500/10 text-slate-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-orange-500/10 text-orange-400',
  critical: 'bg-red-500/10 text-red-400',
};

export default function ComplianceDashboard() {
  const [investmentFilter, setInvestmentFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data: items = [], isLoading } = useComplianceItems(investmentFilter || undefined);
  const { data: investments = [] } = useInvestments();
  const createItem = useCreateComplianceItem();
  const updateItem = useUpdateComplianceItem();
  const deleteItem = useDeleteComplianceItem();
  const { toast } = useToast();

  const [form, setForm] = useState({
    investment_id: '', title: '', description: '', category: 'regulatory' as ComplianceCategory,
    priority: 'medium' as CompliancePriority, due_date: '',
  });

  const filtered = categoryFilter ? items.filter((i) => i.category === categoryFilter) : items;

  const compliant = items.filter((i) => i.status === 'compliant').length;
  const total = items.filter((i) => i.status !== 'not_applicable').length;
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 100;
  const overdue = items.filter((i) => i.due_date && new Date(i.due_date) < new Date() && i.status !== 'compliant').length;

  const handleCreate = async () => {
    if (!form.investment_id || !form.title) return;
    await createItem.mutateAsync({
      investment_id: form.investment_id, title: form.title, description: form.description || null,
      category: form.category, priority: form.priority, due_date: form.due_date || null,
    });
    toast({ title: 'Compliance item created' });
    setCreateOpen(false);
    setForm({ investment_id: '', title: '', description: '', category: 'regulatory', priority: 'medium', due_date: '' });
  };

  return (
    <PortalLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor compliance status across all investments</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Compliance Item</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <Select value={form.investment_id} onValueChange={(v) => setForm({ ...form, investment_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select investment" /></SelectTrigger>
                  <SelectContent>{investments.map((i) => <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>)}</SelectContent>
                </Select>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Item title" />
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ComplianceCategory })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(COMPLIANCE_CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as CompliancePriority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                <Button onClick={handleCreate} disabled={createItem.isPending} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Compliance Rate</span></div>
            <div className="text-2xl font-mono font-bold text-primary">{complianceRate}%</div>
            <Progress value={complianceRate} className="mt-2 h-1.5" />
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-green-400">{compliant}</div>
            <div className="text-xs text-muted-foreground mt-1">Compliant</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="text-2xl font-mono font-bold text-yellow-400">{items.filter((i) => i.status === 'pending_review').length}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending Review</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <div className="flex items-center gap-1">
              {overdue > 0 && <AlertTriangle className="h-4 w-4 text-red-400" />}
              <div className={`text-2xl font-mono font-bold ${overdue > 0 ? 'text-red-400' : 'text-foreground'}`}>{overdue}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Overdue</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={investmentFilter} onValueChange={setInvestmentFilter}>
            <SelectTrigger className="w-[240px]"><SelectValue placeholder="All Investments" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Investments</SelectItem>
              {investments.map((i) => <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {Object.entries(COMPLIANCE_CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="mx-auto h-10 w-10 mb-3 opacity-30" />
              <p>No compliance items found</p>
            </div>
          ) : filtered.map((item) => {
            const inv = investments.find((i) => i.id === item.investment_id);
            return (
              <div key={item.id} className="rounded-xl border border-border/50 bg-card/30 p-4 flex items-start gap-4">
                <div className="mt-0.5">{statusIcons[item.status]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.title}</span>
                    <Badge variant="outline" className={priorityColors[item.priority]}>{item.priority}</Badge>
                    <Badge variant="outline" className="text-xs">{COMPLIANCE_CATEGORY_LABELS[item.category]}</Badge>
                  </div>
                  {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{inv?.title ?? 'Unknown investment'}</span>
                    {item.due_date && <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={item.status} onValueChange={(v) => updateItem.mutate({ id: item.id, status: v as ComplianceStatus, ...(v === 'compliant' ? { completed_at: new Date().toISOString() } : {}) })}>
                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(COMPLIANCE_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" className="text-destructive h-8" onClick={() => deleteItem.mutate(item.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
