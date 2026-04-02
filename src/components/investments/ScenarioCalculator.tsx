import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';
import type { Investment } from '@/types/dataroom';

interface ScenarioCalculatorProps {
  investment: Investment;
}

interface ScenarioResult {
  investmentAmount: number;
  holdYears: number;
  taxBracket: number;
  projectedReturn: number;
  estimatedTaxSavings: number;
  netBenefit: number;
  annualizedReturn: number;
}

function calculateScenario(
  amount: number,
  holdYears: number,
  taxBracket: number,
  investment: Investment
): ScenarioResult {
  // Parse target return range (e.g., "8-12%")
  const returnMatch = investment.target_return?.match(/(\d+(?:\.\d+)?)/);
  const baseReturn = returnMatch ? parseFloat(returnMatch[1]) / 100 : 0.08;

  // Estimate tax savings based on investment features
  let taxMultiplier = 0;
  if (investment.has_cost_seg) taxMultiplier += 0.6;
  if (investment.has_1031) taxMultiplier += 0.3;
  if (investment.has_qoz) taxMultiplier += 0.4;
  if (investment.has_179d) taxMultiplier += 0.25;
  if (investment.has_section_45) taxMultiplier += 0.2;
  if (taxMultiplier === 0) taxMultiplier = 0.15;

  const projectedReturn = amount * baseReturn * holdYears;
  const estimatedTaxSavings = amount * taxMultiplier * (taxBracket / 100);
  const netBenefit = projectedReturn + estimatedTaxSavings;
  const annualizedReturn = holdYears > 0
    ? ((Math.pow((amount + netBenefit) / amount, 1 / holdYears) - 1) * 100)
    : 0;

  return {
    investmentAmount: amount,
    holdYears,
    taxBracket,
    projectedReturn,
    estimatedTaxSavings,
    netBenefit,
    annualizedReturn,
  };
}

export function ScenarioCalculator({ investment }: ScenarioCalculatorProps) {
  const [amount, setAmount] = useState('250000');
  const [holdYears, setHoldYears] = useState('5');
  const [taxBracket, setTaxBracket] = useState('37');
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(amount);
    const h = parseInt(holdYears);
    const t = parseFloat(taxBracket);
    if (isNaN(a) || isNaN(h) || isNaN(t) || a <= 0 || h <= 0 || t <= 0) return;
    setResult(calculateScenario(a, h, t, investment));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-5 w-5 text-primary" />
            Hypothetical Scenario Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Investment Amount
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250000"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                Hold Period (Years)
              </Label>
              <Input
                type="number"
                value={holdYears}
                onChange={(e) => setHoldYears(e.target.value)}
                placeholder="5"
                min="1"
                max="30"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                Tax Bracket (%)
              </Label>
              <Input
                type="number"
                value={taxBracket}
                onChange={(e) => setTaxBracket(e.target.value)}
                placeholder="37"
                min="0"
                max="50"
                className="font-mono"
              />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full sm:w-auto">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Scenario
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Hypothetical Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-lg bg-background/50 border border-border/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Projected Return
                </p>
                <p className="text-xl font-mono font-bold text-teal">
                  {formatCurrency(result.projectedReturn)}
                </p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Est. Tax Savings
                </p>
                <p className="text-xl font-mono font-bold text-gold">
                  {formatCurrency(result.estimatedTaxSavings)}
                </p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Net Benefit
                </p>
                <p className="text-xl font-mono font-bold text-foreground">
                  {formatCurrency(result.netBenefit)}
                </p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Annualized Return
                </p>
                <p className="text-xl font-mono font-bold text-teal">
                  {result.annualizedReturn.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
              <p>
                <strong>Assumptions:</strong> Based on {investment.target_return || '8%'} target return,{' '}
                {result.holdYears}-year hold period, and {result.taxBracket}% tax bracket.
                {investment.has_cost_seg && ' Includes estimated cost segregation benefits.'}
                {investment.has_1031 && ' Includes estimated 1031 exchange deferral benefits.'}
                {investment.has_qoz && ' Includes estimated Qualified Opportunity Zone benefits.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Disclaimer variant="investment" />
    </div>
  );
}
