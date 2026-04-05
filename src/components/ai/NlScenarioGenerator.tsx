import { useState } from 'react';
import { generateNlScenario } from '@/lib/ai/claude';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { Loader2, Sparkles, MessageSquare } from 'lucide-react';
import type { Investment } from '@/types/dataroom';

interface Props {
  investment: Investment;
}

export function NlScenarioGenerator({ investment }: Props) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const investmentContext = [
    investment.short_description,
    investment.target_return ? `Target Return: ${investment.target_return}` : '',
    investment.hold_period ? `Hold Period: ${investment.hold_period}` : '',
    investment.minimum_investment ? `Minimum: $${investment.minimum_investment.toLocaleString()}` : '',
    investment.has_cost_seg ? 'Features: Cost Segregation' : '',
    investment.has_1031 ? 'Features: 1031 Exchange' : '',
    investment.has_qoz ? 'Features: Qualified Opportunity Zone' : '',
    investment.has_179d ? 'Features: Section 179D' : '',
    investment.has_section_45 ? 'Features: Section 45 PTC' : '',
    investment.material_participation_notes,
  ].filter(Boolean).join('\n');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const response = await generateNlScenario(investment.title, investmentContext, prompt);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    `If I invest $500K in ${investment.title} for 7 years, what does my tax picture look like?`,
    `Compare a $250K investment held for 3 years vs 10 years`,
    `What would the depreciation benefits look like for a $1M investment at the 37% bracket?`,
  ];

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Scenario Generator
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Describe a scenario in plain English and get a detailed analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example prompts */}
          {!result && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
              <div className="flex flex-col gap-1.5">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-left text-xs rounded-lg border border-border/50 px-3 py-2 text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="inline mr-1.5 h-3 w-3" />
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`e.g. "If I invest $500K for 7 years at the 37% bracket..."`}
            rows={3}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Generating scenario...' : 'Generate Scenario Analysis'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="prose prose-sm prose-invert max-w-none">
              {result.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-display font-bold text-foreground mt-4 mb-2">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">{line.replace('### ', '')}</h3>;
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                if (line.startsWith('| ')) {
                  const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
                  if (line.includes('---')) return null;
                  return (
                    <div key={i} className="flex gap-4 py-1 text-sm">
                      <span className="text-muted-foreground min-w-[200px]">{cells[0]}</span>
                      <span className="font-mono font-medium text-foreground">{cells[1]}</span>
                    </div>
                  );
                }
                if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-muted-foreground ml-4">{line.replace(/^[*-]\s/, '')}</li>;
                if (line.startsWith('---')) return <hr key={i} className="border-border/50 my-3" />;
                if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-xs text-muted-foreground italic">{line.replace(/\*/g, '')}</p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Disclaimer variant="investment" />
    </div>
  );
}
