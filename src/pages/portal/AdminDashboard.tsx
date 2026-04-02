import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvestments, useCreateInvestment, useDeleteInvestment } from '@/hooks/useInvestments';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Disclaimer } from '@/components/shared/Disclaimer';
import {
  Plus,
  Search,
  Building2,
  TrendingUp,
  Users,
  FileText,
  Trash2,
  ExternalLink,
  Loader2,
  Star,
  Pencil,
} from 'lucide-react';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/dataroom';
import type { InvestmentCategory, InvestmentStatus } from '@/types/dataroom';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: investments, isLoading } = useInvestments({
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const createInvestment = useCreateInvestment();
  const deleteInvestment = useDeleteInvestment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<InvestmentCategory>('real_estate');
  const [newStatus, setNewStatus] = useState<InvestmentStatus>('active');
  const [newDescription, setNewDescription] = useState('');
  const [newMinInvestment, setNewMinInvestment] = useState('');
  const [newTargetReturn, setNewTargetReturn] = useState('');
  const [newHoldPeriod, setNewHoldPeriod] = useState('');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createInvestment.mutateAsync({
      title: newTitle,
      slug: slugify(newTitle),
      category: newCategory,
      status: newStatus,
      short_description: newDescription || null,
      minimum_investment: newMinInvestment ? parseFloat(newMinInvestment) : null,
      target_return: newTargetReturn || null,
      hold_period: newHoldPeriod || null,
    });
    setNewTitle('');
    setNewDescription('');
    setNewMinInvestment('');
    setNewTargetReturn('');
    setNewHoldPeriod('');
    setDialogOpen(false);
  };

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-muted-foreground">Access denied. Admin only.</div>;
  }

  const activeCount = investments?.filter(i => i.status === 'active').length ?? 0;
  const totalCount = investments?.length ?? 0;
  const featuredCount = investments?.filter(i => i.is_featured).length ?? 0;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Investment Management</h1>
          <p className="text-sm text-muted-foreground">Manage your investment data room</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Investment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Solar ITC Fund III" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newCategory} onValueChange={(v) => setNewCategory(v as InvestmentCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as InvestmentStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief investment overview..." rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Min. Investment ($)</Label>
                  <Input type="number" value={newMinInvestment} onChange={(e) => setNewMinInvestment(e.target.value)} placeholder="100000" />
                </div>
                <div className="space-y-2">
                  <Label>Target Return</Label>
                  <Input value={newTargetReturn} onChange={(e) => setNewTargetReturn(e.target.value)} placeholder="8-12%" />
                </div>
                <div className="space-y-2">
                  <Label>Hold Period</Label>
                  <Input value={newHoldPeriod} onChange={(e) => setNewHoldPeriod(e.target.value)} placeholder="5-7 years" />
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createInvestment.isPending || !newTitle.trim()} className="w-full">
                {createInvestment.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Investment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Investments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
              <TrendingUp className="h-5 w-5 text-teal" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
              <Star className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{featuredCount}</p>
              <p className="text-xs text-muted-foreground">Featured</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search investments..."
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Investment List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : investments?.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-semibold text-foreground">No Investments Yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Click &quot;Add Investment&quot; to create your first investment listing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {investments?.map((investment) => (
            <Card key={investment.id} className="border-border/50 hover:border-primary/20 transition-colors">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/portal/investments/${investment.slug}`}
                      className="font-semibold text-foreground hover:text-primary truncate"
                    >
                      {investment.title}
                    </Link>
                    {investment.is_featured && (
                      <Star className="h-4 w-4 text-gold fill-gold" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {CATEGORY_LABELS[investment.category]}
                    </Badge>
                    <Badge
                      variant={investment.status === 'active' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {STATUS_LABELS[investment.status]}
                    </Badge>
                    {investment.minimum_investment && (
                      <span className="text-xs text-muted-foreground font-mono">
                        Min: ${investment.minimum_investment.toLocaleString()}
                      </span>
                    )}
                    {investment.target_return && (
                      <span className="text-xs text-muted-foreground">
                        Target: {investment.target_return}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/portal/investments/${investment.slug}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/portal/investments/${investment.slug}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Delete this investment? This cannot be undone.')) {
                        deleteInvestment.mutate(investment.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer variant="investment" />
    </div>
  );
}
