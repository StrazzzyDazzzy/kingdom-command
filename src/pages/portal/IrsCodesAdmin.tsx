import { useState } from 'react';
import { useIrsCodes } from '@/hooks/useInvestments';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Disclaimer } from '@/components/shared/Disclaimer';
import {
  Plus,
  Trash2,
  BookOpen,
  ExternalLink,
  Search,
  Loader2,
} from 'lucide-react';
import type { IrsCode } from '@/types/dataroom';

const IRS_CATEGORY_LABELS: Record<string, string> = {
  deduction: 'Deduction',
  credit: 'Credit',
  deferral: 'Deferral',
  exclusion: 'Exclusion',
  depreciation: 'Depreciation',
  passive_activity: 'Passive Activity',
  at_risk: 'At Risk',
  other: 'Other',
};

export default function IrsCodesAdmin() {
  const { profile } = useAuth();
  const { data: codes, isLoading } = useIrsCodes();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [codeNumber, setCodeNumber] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [fullTextUrl, setFullTextUrl] = useState('');
  const [category, setCategory] = useState('other');
  const [relatedTypes, setRelatedTypes] = useState('');

  const createCode = useMutation({
    mutationFn: async (code: Partial<IrsCode>) => {
      const { error } = await supabase
        .from('irs_codes')
        .insert(code as Record<string, unknown>);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['irs-codes'] }),
  });

  const deleteCode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('irs_codes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['irs-codes'] }),
  });

  const handleCreate = async () => {
    if (!codeNumber.trim() || !title.trim()) return;
    await createCode.mutateAsync({
      code_number: codeNumber,
      title,
      summary: summary || null,
      full_text_url: fullTextUrl || null,
      category,
      related_investment_types: relatedTypes.split(',').map(s => s.trim()).filter(Boolean),
    });
    setCodeNumber('');
    setTitle('');
    setSummary('');
    setFullTextUrl('');
    setRelatedTypes('');
    setDialogOpen(false);
  };

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-muted-foreground">Access denied.</div>;
  }

  const filtered = codes?.filter(c =>
    !search || c.code_number.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">IRS Code Library</h1>
          <p className="text-sm text-muted-foreground">Manage tax code references linked to investments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add IRS Code</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add IRS Code Reference</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code Number</Label>
                  <Input value={codeNumber} onChange={e => setCodeNumber(e.target.value)} placeholder="Section 1031" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(IRS_CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Like-Kind Exchange" />
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} placeholder="Brief description of the tax code provision..." />
              </div>
              <div className="space-y-2">
                <Label>Full Text URL (optional)</Label>
                <Input value={fullTextUrl} onChange={e => setFullTextUrl(e.target.value)} placeholder="https://www.law.cornell.edu/uscode/..." />
              </div>
              <div className="space-y-2">
                <Label>Related Investment Types (comma-separated)</Label>
                <Input value={relatedTypes} onChange={e => setRelatedTypes(e.target.value)} placeholder="real_estate, dstx_1031" />
              </div>
              <Button onClick={handleCreate} disabled={createCode.isPending || !codeNumber.trim() || !title.trim()} className="w-full">
                {createCode.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IRS codes..." className="pl-9" />
      </div>

      {/* Code List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered?.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-semibold text-foreground">No IRS Codes Found</h3>
            <p className="text-sm text-muted-foreground">
              {search ? 'Try a different search term.' : 'Click "Add IRS Code" to create your first reference.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered?.map(code => (
            <Card key={code.id} className="border-border/50">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 shrink-0 mt-0.5">
                  <BookOpen className="h-5 w-5 text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-sm font-bold text-primary">{code.code_number}</span>
                    <span className="font-medium text-foreground">{code.title}</span>
                    {code.category && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {IRS_CATEGORY_LABELS[code.category] ?? code.category}
                      </Badge>
                    )}
                  </div>
                  {code.summary && (
                    <p className="text-sm text-muted-foreground mb-2">{code.summary}</p>
                  )}
                  {code.related_investment_types && code.related_investment_types.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {code.related_investment_types.map(t => (
                        <Badge key={t} variant="outline" className="text-xs">{t.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {code.full_text_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={code.full_text_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => {
                    if (confirm(`Delete ${code.code_number}?`)) deleteCode.mutate(code.id);
                  }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer variant="irs" />
    </div>
  );
}
