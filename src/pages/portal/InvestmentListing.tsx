import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvestments } from '@/hooks/useInvestments';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Disclaimer } from '@/components/shared/Disclaimer';
import {
  Search,
  Building2,
  ArrowRight,
  Star,
  Loader2,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/dataroom';

export default function InvestmentListing() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: investments, isLoading } = useInvestments({
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Investment Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse available investments and tax strategies
        </p>
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

      {/* Investment Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : investments?.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-semibold">No Investments Found</h3>
            <p className="text-sm text-muted-foreground">
              {search || categoryFilter || statusFilter
                ? 'Try adjusting your filters.'
                : 'No investments are currently available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {investments?.map((investment) => (
            <Link
              key={investment.id}
              to={`/portal/deal-room/${investment.slug}`}
              className="group"
            >
              <Card className="h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_LABELS[investment.category]}
                      </Badge>
                      <Badge
                        variant={investment.status === 'active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {STATUS_LABELS[investment.status]}
                      </Badge>
                    </div>
                    {investment.is_featured && (
                      <Star className="h-4 w-4 text-gold fill-gold" />
                    )}
                  </div>

                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {investment.title}
                  </h3>

                  {investment.short_description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {investment.short_description}
                    </p>
                  )}

                  <div className="mt-auto grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                    {investment.minimum_investment && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Minimum</p>
                          <p className="text-sm font-mono font-medium text-foreground">
                            ${investment.minimum_investment >= 1000000
                              ? `${(investment.minimum_investment / 1000000).toFixed(1)}M`
                              : `${(investment.minimum_investment / 1000).toFixed(0)}K`}
                          </p>
                        </div>
                      </div>
                    )}
                    {investment.target_return && (
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-teal" />
                        <div>
                          <p className="text-xs text-muted-foreground">Target</p>
                          <p className="text-sm font-mono font-medium text-foreground">{investment.target_return}</p>
                        </div>
                      </div>
                    )}
                    {investment.hold_period && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hold</p>
                          <p className="text-sm font-mono font-medium text-foreground">{investment.hold_period}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tax strategy badges */}
                  {(investment.has_1031 || investment.has_qoz || investment.has_cost_seg || investment.has_179d || investment.has_section_45) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {investment.has_1031 && <Badge variant="outline" className="text-xs border-teal/30 text-teal">1031</Badge>}
                      {investment.has_qoz && <Badge variant="outline" className="text-xs border-teal/30 text-teal">QOZ</Badge>}
                      {investment.has_cost_seg && <Badge variant="outline" className="text-xs border-teal/30 text-teal">Cost Seg</Badge>}
                      {investment.has_179d && <Badge variant="outline" className="text-xs border-teal/30 text-teal">179D</Badge>}
                      {investment.has_section_45 && <Badge variant="outline" className="text-xs border-teal/30 text-teal">Sec. 45</Badge>}
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Enter Deal Room
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Disclaimer variant="investment" />
    </div>
  );
}
