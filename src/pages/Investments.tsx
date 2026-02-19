import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpreadsheetView } from '@/components/investments/SpreadsheetView';
import { InvestmentAnalytics } from '@/components/investments/InvestmentAnalytics';
import { payoutTracker2025, payoutTracker2026, portfolioData, companyDirectory } from '@/data/investmentData';
import { Command, ArrowLeft, BarChart3, Table2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const payoutColumns = [
  { key: 'name', label: 'Investment Name', width: 220, format: 'text' as const },
  { key: 'investments', label: 'Invested', width: 120, format: 'currency' as const },
  { key: 'expectedAnnualPayout', label: 'Expected Annual', width: 130, format: 'currency' as const },
  { key: 'yearIncome', label: 'Year Income', width: 120, format: 'currency' as const },
  { key: 'expectedMonthlyPayout', label: 'Monthly Payout', width: 120, format: 'currency' as const },
  { key: 'monthlyMortgage', label: 'Mortgage', width: 100, format: 'currency' as const },
  { key: 'noiMonthly', label: 'NOI Monthly', width: 100, format: 'currency' as const },
  { key: 'interestRate', label: 'Rate', width: 120, format: 'text' as const },
  { key: 'initiationDate', label: 'Initiation', width: 100, format: 'text' as const },
  { key: 'investmentEndDate', label: 'End Date', width: 100, format: 'text' as const },
  { key: 'notes', label: 'Notes', width: 200, format: 'text' as const },
];

const portfolioColumns = [
  { key: 'propertyAddress', label: 'Property Address', width: 250, format: 'text' as const },
  { key: 'estimatedValue', label: 'Estimated Value', width: 150, format: 'currency' as const },
];

const companyColumns = [
  { key: 'company', label: 'Company', width: 200, format: 'text' as const },
  { key: 'ein', label: 'EIN', width: 110, format: 'text' as const },
  { key: 'entityType', label: 'Entity Type', width: 140, format: 'text' as const },
  { key: 'state', label: 'State', width: 80, format: 'text' as const },
  { key: 'formationDate', label: 'Formation Date', width: 120, format: 'text' as const },
  { key: 'registeredAgent', label: 'Registered Agent', width: 160, format: 'text' as const },
  { key: 'associatedProperty', label: 'Associated Property', width: 280, format: 'text' as const },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRows(data: any[], keys: string[]) {
  return data.map(item => {
    const row: Record<string, string | number> = {};
    keys.forEach(k => { row[k] = item[k] ?? ''; });
    return row;
  });
}

export default function Investments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');

  const payout2025Rows = mapToRows(payoutTracker2025, payoutColumns.map(c => c.key));
  const payout2026Rows = mapToRows(payoutTracker2026, payoutColumns.map(c => c.key));
  const portfolioRows = mapToRows(portfolioData, portfolioColumns.map(c => c.key));
  const companyRows = mapToRows(companyDirectory, companyColumns.map(c => c.key));

  const payoutSummary = (colIdx: number) => `=SUM(B1:B${payout2025Rows.length})`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ai via-retreats to-tax">
            <Command className="h-4 w-4 text-background" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Investment Intelligence</h1>
            <p className="text-xs text-muted-foreground">Payout Tracking · Portfolio · Entity Management</p>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="payout-2025" className="gap-1.5">
              <Table2 className="h-3.5 w-3.5" /> 2025 Payouts
            </TabsTrigger>
            <TabsTrigger value="payout-2026" className="gap-1.5">
              <Table2 className="h-3.5 w-3.5" /> 2026 Payouts
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <InvestmentAnalytics />
          </TabsContent>

          <TabsContent value="payout-2025">
            <SpreadsheetView
              title="2025 Payout Tracker"
              columns={payoutColumns}
              initialData={payout2025Rows}
              summaryFields={{
                name: { formula: '="TOTALS"', format: 'text' },
                investments: { formula: `=SUM(B1:B${payout2025Rows.length})`, format: 'currency' },
                expectedAnnualPayout: { formula: `=SUM(C1:C${payout2025Rows.length})`, format: 'currency' },
                yearIncome: { formula: `=SUM(D1:D${payout2025Rows.length})`, format: 'currency' },
                expectedMonthlyPayout: { formula: `=SUM(E1:E${payout2025Rows.length})`, format: 'currency' },
                monthlyMortgage: { formula: `=SUM(F1:F${payout2025Rows.length})`, format: 'currency' },
              }}
            />
          </TabsContent>

          <TabsContent value="payout-2026">
            <SpreadsheetView
              title="2026 Payout Tracker"
              columns={payoutColumns}
              initialData={payout2026Rows}
              summaryFields={{
                name: { formula: '="TOTALS"', format: 'text' },
                investments: { formula: `=SUM(B1:B${payout2026Rows.length})`, format: 'currency' },
                expectedAnnualPayout: { formula: `=SUM(C1:C${payout2026Rows.length})`, format: 'currency' },
                yearIncome: { formula: `=SUM(D1:D${payout2026Rows.length})`, format: 'currency' },
                expectedMonthlyPayout: { formula: `=SUM(E1:E${payout2026Rows.length})`, format: 'currency' },
                monthlyMortgage: { formula: `=SUM(F1:F${payout2026Rows.length})`, format: 'currency' },
              }}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <SpreadsheetView
              title="Real Estate Portfolio"
              columns={portfolioColumns}
              initialData={portfolioRows}
              summaryFields={{
                propertyAddress: { formula: '="TOTAL"', format: 'text' },
                estimatedValue: { formula: `=SUM(B1:B${portfolioRows.length})`, format: 'currency' },
              }}
            />
          </TabsContent>

          <TabsContent value="companies">
            <SpreadsheetView
              title="Company Directory"
              columns={companyColumns}
              initialData={companyRows}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
