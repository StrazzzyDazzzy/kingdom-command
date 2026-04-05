import { useState } from 'react';
import { useInvestments } from '@/hooks/useInvestments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Disclaimer } from '@/components/shared/Disclaimer';
import {
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  Clock,
  BookOpen,
  Shield,
  Scale,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { CATEGORY_LABELS } from '@/types/dataroom';
import type { Investment } from '@/types/dataroom';

export function InvestmentComparison() {
  const { data: investments } = useInvestments();
  const [leftId, setLeftId] = useState<string>('');
  const [rightId, setRightId] = useState<string>('');

  const left = investments?.find(i => i.id === leftId);
  const right = investments?.find(i => i.id === rightId);

  const availableForRight = investments?.filter(i => i.id !== leftId) ?? [];
  const availableForLeft = investments?.filter(i => i.id !== rightId) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          Side-by-Side Comparison
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compare two investments across key metrics
        </p>
      </div>

      {/* Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Investment A</label>
          <Select value={leftId} onValueChange={setLeftId}>
            <SelectTrigger><SelectValue placeholder="Select investment..." /></SelectTrigger>
            <SelectContent>
              {availableForLeft?.map(i => (
                <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Investment B</label>
          <Select value={rightId} onValueChange={setRightId}>
            <SelectTrigger><SelectValue placeholder="Select investment..." /></SelectTrigger>
            <SelectContent>
              {availableForRight?.map(i => (
                <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comparison Table */}
      {left && right && (
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-1/3">Metric</th>
                  <th className="text-left p-4 text-xs font-medium text-primary uppercase tracking-wider w-1/3">
                    {left.title}
                    {left.is_featured && <Star className="inline ml-1 h-3 w-3 text-gold fill-gold" />}
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-primary uppercase tracking-wider w-1/3">
                    {right.title}
                    {right.is_featured && <Star className="inline ml-1 h-3 w-3 text-gold fill-gold" />}
                  </th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow label="Category" icon={<BookOpen className="h-3.5 w-3.5" />}
                  left={<Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[left.category]}</Badge>}
                  right={<Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[right.category]}</Badge>}
                />
                <ComparisonRow label="Status" icon={<Shield className="h-3.5 w-3.5" />}
                  left={left.status.replace('_', ' ')}
                  right={right.status.replace('_', ' ')}
                />
                <ComparisonRow label="Minimum Investment" icon={<DollarSign className="h-3.5 w-3.5" />}
                  left={left.minimum_investment ? <span className="font-mono">${left.minimum_investment.toLocaleString()}</span> : '—'}
                  right={right.minimum_investment ? <span className="font-mono">${right.minimum_investment.toLocaleString()}</span> : '—'}
                  highlight={left.minimum_investment && right.minimum_investment
                    ? (left.minimum_investment < right.minimum_investment ? 'left' : left.minimum_investment > right.minimum_investment ? 'right' : undefined)
                    : undefined}
                />
                <ComparisonRow label="Target Return" icon={<TrendingUp className="h-3.5 w-3.5" />}
                  left={left.target_return ? <span className="font-mono">{left.target_return}</span> : '—'}
                  right={right.target_return ? <span className="font-mono">{right.target_return}</span> : '—'}
                />
                <ComparisonRow label="Hold Period" icon={<Clock className="h-3.5 w-3.5" />}
                  left={left.hold_period ?? '—'}
                  right={right.hold_period ?? '—'}
                />
                <ComparisonRow label="1031 Exchange" icon={null}
                  left={<BoolBadge value={left.has_1031} />}
                  right={<BoolBadge value={right.has_1031} />}
                />
                <ComparisonRow label="Opportunity Zone" icon={null}
                  left={<BoolBadge value={left.has_qoz} />}
                  right={<BoolBadge value={right.has_qoz} />}
                />
                <ComparisonRow label="Cost Segregation" icon={null}
                  left={<BoolBadge value={left.has_cost_seg} />}
                  right={<BoolBadge value={right.has_cost_seg} />}
                />
                <ComparisonRow label="Section 179D" icon={null}
                  left={<BoolBadge value={left.has_179d} />}
                  right={<BoolBadge value={right.has_179d} />}
                />
                <ComparisonRow label="Section 45 PTC" icon={null}
                  left={<BoolBadge value={left.has_section_45} />}
                  right={<BoolBadge value={right.has_section_45} />}
                />
                <ComparisonRow label="Material Participation" icon={<Scale className="h-3.5 w-3.5" />}
                  left={left.has_material_participation
                    ? <span className="text-gold font-medium">Required</span>
                    : <span className="text-muted-foreground">Not required</span>}
                  right={right.has_material_participation
                    ? <span className="text-gold font-medium">Required</span>
                    : <span className="text-muted-foreground">Not required</span>}
                />
                <ComparisonRow label="IRS Codes" icon={<BookOpen className="h-3.5 w-3.5" />}
                  left={left.irs_codes?.length ? (
                    <div className="flex flex-wrap gap-1">{left.irs_codes.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                  ) : '—'}
                  right={right.irs_codes?.length ? (
                    <div className="flex flex-wrap gap-1">{right.irs_codes.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                  ) : '—'}
                />
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {(!left || !right) && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ArrowLeftRight className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Select two investments above to compare them side by side.
            </p>
          </CardContent>
        </Card>
      )}

      <Disclaimer variant="investment" />
    </div>
  );
}

function ComparisonRow({ label, icon, left, right, highlight }: {
  label: string;
  icon: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  highlight?: 'left' | 'right';
}) {
  return (
    <tr className="border-b border-border/30">
      <td className="p-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </td>
      <td className={`p-4 ${highlight === 'left' ? 'text-teal font-medium' : 'text-foreground'}`}>{left}</td>
      <td className={`p-4 ${highlight === 'right' ? 'text-teal font-medium' : 'text-foreground'}`}>{right}</td>
    </tr>
  );
}

function BoolBadge({ value }: { value: boolean }) {
  return value
    ? <CheckCircle className="h-4 w-4 text-teal" />
    : <XCircle className="h-4 w-4 text-muted-foreground/40" />;
}
