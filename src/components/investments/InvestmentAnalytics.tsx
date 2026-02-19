import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { payoutTracker2025, payoutTracker2026, portfolioData, getPayoutSummary, getPortfolioSummary } from '@/data/investmentData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const COLORS = ['hsl(188,90%,50%)', 'hsl(38,92%,50%)', 'hsl(158,64%,42%)', 'hsl(280,60%,50%)', 'hsl(0,72%,51%)', 'hsl(210,60%,50%)', 'hsl(120,40%,50%)'];

export function InvestmentAnalytics() {
  const summary2025 = useMemo(() => getPayoutSummary(payoutTracker2025), []);
  const summary2026 = useMemo(() => getPayoutSummary(payoutTracker2026), []);
  const portfolioSummary = useMemo(() => getPortfolioSummary(portfolioData), []);

  const portfolioPie = portfolioData.map((p, i) => ({
    name: p.propertyAddress,
    value: p.estimatedValue,
    fill: COLORS[i % COLORS.length],
  }));

  const yearComparison = [
    { metric: 'Total Invested', '2025': summary2025.totalInvested, '2026': summary2026.totalInvested },
    { metric: 'Expected Annual', '2025': summary2025.totalExpectedAnnual, '2026': summary2026.totalExpectedAnnual },
    { metric: 'Actual Income', '2025': summary2025.totalIncome, '2026': summary2026.totalIncome },
    { metric: 'Monthly Payout', '2025': summary2025.totalMonthlyPayout * 12, '2026': summary2026.totalMonthlyPayout * 12 },
  ];

  const incomeByInvestment2025 = payoutTracker2025
    .filter(p => p.yearIncome > 0)
    .sort((a, b) => b.yearIncome - a.yearIncome)
    .map(p => ({ name: p.name.substring(0, 20), income: p.yearIncome, expected: p.expectedAnnualPayout }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* KPI Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="Portfolio Value" value={`$${(portfolioSummary.totalValue / 1e6).toFixed(2)}M`} sub={`${portfolioSummary.propertyCount} properties`} />
        <KPICard label="2025 Income" value={`$${(summary2025.totalIncome / 1e3).toFixed(0)}K`} sub={`${summary2025.incomeVsExpected.toFixed(0)}% of expected`} accent={summary2025.incomeVsExpected >= 80 ? 'success' : 'warning'} />
        <KPICard label="2026 Income" value={`$${(summary2026.totalIncome / 1e3).toFixed(0)}K`} sub={`${summary2026.incomeVsExpected.toFixed(0)}% of expected`} accent={summary2026.incomeVsExpected >= 80 ? 'success' : 'warning'} />
        <KPICard label="Avg Yield" value={`${summary2025.avgYield.toFixed(1)}%`} sub="Annualized return" />
      </div>

      {/* Portfolio Allocation Pie */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={portfolioPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} strokeWidth={1} stroke="hsl(220,18%,9%)">
                {portfolioPie.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220,18%,9%)', border: '1px solid hsl(220,15%,16%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210,20%,92%)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-2">
            {portfolioPie.map((p, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.fill }} />
                {p.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* YoY Comparison */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">2025 vs 2026 Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearComparison} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,16%)" />
              <XAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} tickFormatter={v => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220,18%,9%)', border: '1px solid hsl(220,15%,16%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210,20%,92%)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="2025" fill="hsl(188,90%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2026" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income by Investment */}
      <Card className="lg:col-span-2 bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">2025 Income vs Expected by Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeByInvestment2025} layout="vertical" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,16%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} tickFormatter={v => `$${(v / 1e3).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} width={130} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(220,18%,9%)', border: '1px solid hsl(220,15%,16%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210,20%,92%)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="income" name="Actual Income" fill="hsl(158,64%,42%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="expected" name="Expected Annual" fill="hsl(215,12%,50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: 'success' | 'warning' | 'critical' }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={cn('font-mono text-xl font-semibold mt-1', accent === 'success' && 'text-[hsl(var(--success))]', accent === 'warning' && 'text-[hsl(var(--warning))]', accent === 'critical' && 'text-[hsl(var(--critical))]')}>
          {value}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
