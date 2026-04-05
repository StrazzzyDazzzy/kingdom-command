import { useState } from 'react';
import { detectMaterialParticipation } from '@/lib/ai/claude';
import { useUpdateInvestment } from '@/hooks/useInvestments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Scale, Sparkles, Check, AlertTriangle } from 'lucide-react';
import type { Investment, InvestmentDocument } from '@/types/dataroom';

interface Props {
  investment: Investment;
  documents: InvestmentDocument[];
}

export function MaterialParticipationDetector({ investment, documents }: Props) {
  const [result, setResult] = useState<{ hasRequirement: boolean; notes: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const updateInvestment = useUpdateInvestment();

  const handleDetect = async () => {
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const allText = documents
        .filter(d => d.parsed_text && d.parsed_text.length > 50)
        .map(d => d.parsed_text!)
        .join('\n\n');

      if (!allText) return;

      const detection = await detectMaterialParticipation(allText);
      setResult(detection);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!result) return;
    await updateInvestment.mutateAsync({
      id: investment.id,
      has_material_participation: result.hasRequirement,
      material_participation_notes: result.notes || null,
    });
    setSaved(true);
  };

  const parsedDocCount = documents.filter(d => d.parsed_text && d.parsed_text.length > 50).length;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="h-5 w-5 text-gold" />
          Material Participation Detector
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          AI scans documents for material participation requirements
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current status */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current status:</span>
          {investment.has_material_participation ? (
            <span className="flex items-center gap-1 text-gold font-medium">
              <AlertTriangle className="h-3.5 w-3.5" /> Required
            </span>
          ) : (
            <span className="text-muted-foreground">Not detected</span>
          )}
        </div>

        <Button
          onClick={handleDetect}
          disabled={loading || parsedDocCount === 0}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Scanning documents...' : 'Scan for Material Participation'}
        </Button>

        {parsedDocCount === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Upload and parse documents first.
          </p>
        )}

        {result && (
          <div className={`rounded-lg border p-4 ${
            result.hasRequirement
              ? 'border-gold/30 bg-gold/5'
              : 'border-teal/30 bg-teal/5'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.hasRequirement ? (
                <AlertTriangle className="h-4 w-4 text-gold" />
              ) : (
                <Check className="h-4 w-4 text-teal" />
              )}
              <span className="font-medium text-sm">
                {result.hasRequirement
                  ? 'Material Participation Requirement Detected'
                  : 'No Material Participation Requirement Found'}
              </span>
            </div>
            {result.notes && (
              <p className="text-sm text-muted-foreground">{result.notes}</p>
            )}
            <Button
              onClick={handleApply}
              disabled={saved}
              size="sm"
              className="mt-3"
              variant={saved ? 'ghost' : 'default'}
            >
              {saved ? (
                <><Check className="mr-1 h-3 w-3" /> Applied</>
              ) : (
                'Apply to Investment'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
