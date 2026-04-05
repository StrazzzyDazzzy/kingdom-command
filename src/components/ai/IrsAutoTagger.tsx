import { useState } from 'react';
import { suggestIrsCodes } from '@/lib/ai/claude';
import { useUpdateInvestment } from '@/hooks/useInvestments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookOpen, Plus, Check } from 'lucide-react';
import type { Investment, InvestmentDocument } from '@/types/dataroom';

interface IrsAutoTaggerProps {
  investment: Investment;
  documents: InvestmentDocument[];
}

export function IrsAutoTagger({ investment, documents }: IrsAutoTaggerProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState<string[]>([]);
  const updateInvestment = useUpdateInvestment();

  const handleAnalyze = async () => {
    setLoading(true);
    setSuggestions([]);
    setApplied([]);
    try {
      const allText = documents
        .filter(d => d.parsed_text && d.parsed_text.length > 50)
        .map(d => d.parsed_text!)
        .join('\n\n---\n\n');

      if (!allText) {
        setSuggestions([]);
        return;
      }

      const codes = await suggestIrsCodes(allText, investment.title);
      // Filter out codes already on the investment
      const newCodes = codes.filter(c => !(investment.irs_codes ?? []).includes(c));
      setSuggestions(newCodes);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (code: string) => {
    const currentCodes = investment.irs_codes ?? [];
    if (currentCodes.includes(code)) return;

    await updateInvestment.mutateAsync({
      id: investment.id,
      irs_codes: [...currentCodes, code],
    });
    setApplied(prev => [...prev, code]);
  };

  const handleApplyAll = async () => {
    const currentCodes = investment.irs_codes ?? [];
    const newCodes = suggestions.filter(c => !currentCodes.includes(c) && !applied.includes(c));
    if (newCodes.length === 0) return;

    await updateInvestment.mutateAsync({
      id: investment.id,
      irs_codes: [...currentCodes, ...newCodes],
    });
    setApplied(prev => [...prev, ...newCodes]);
  };

  const parsedDocCount = documents.filter(d => d.parsed_text && d.parsed_text.length > 50).length;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-primary" />
          AI IRS Code Tagger
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Analyze documents to auto-suggest applicable IRS codes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current codes */}
        {investment.irs_codes && investment.irs_codes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Current IRS Codes</p>
            <div className="flex flex-wrap gap-1.5">
              {investment.irs_codes.map(code => (
                <Badge key={code} variant="outline" className="text-xs border-teal/30 text-teal">
                  <BookOpen className="mr-1 h-3 w-3" />{code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={loading || parsedDocCount === 0}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Analyzing documents...' : `Analyze ${parsedDocCount} Document${parsedDocCount !== 1 ? 's' : ''}`}
        </Button>

        {parsedDocCount === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Upload and parse documents first to enable auto-tagging.
          </p>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Suggested Codes</p>
              <Button size="sm" variant="ghost" onClick={handleApplyAll} className="text-xs h-7">
                Apply All
              </Button>
            </div>
            <div className="space-y-2">
              {suggestions.map(code => {
                const isApplied = applied.includes(code);
                return (
                  <div
                    key={code}
                    className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                      isApplied
                        ? 'border-teal/30 bg-teal/5'
                        : 'border-border/50 hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-mono font-medium">{code}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={isApplied ? 'ghost' : 'outline'}
                      onClick={() => handleApply(code)}
                      disabled={isApplied}
                      className="h-7 text-xs"
                    >
                      {isApplied ? (
                        <><Check className="mr-1 h-3 w-3 text-teal" /> Applied</>
                      ) : (
                        <><Plus className="mr-1 h-3 w-3" /> Apply</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && suggestions.length === 0 && parsedDocCount > 0 && applied.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Click &quot;Analyze&quot; to scan documents for applicable IRS codes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
