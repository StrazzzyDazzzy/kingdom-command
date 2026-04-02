import { AlertTriangle, Info } from 'lucide-react';

type DisclaimerVariant = 'investment' | 'ai' | 'audit' | 'irs' | 'affiliate';

const DISCLAIMERS: Record<DisclaimerVariant, string> = {
  investment:
    'This material is for informational purposes only and does not constitute investment, tax, or legal advice. Past performance is not indicative of future results. Please consult your attorney and CPA before making any investment decision.',
  ai:
    'This response is generated from the investment documents provided and is not legal or tax advice. Always consult a qualified professional before investing.',
  audit:
    'Audit outcomes are historical and do not guarantee future results.',
  irs:
    'IRS code references are for educational purposes. Tax treatment varies by individual circumstance.',
  affiliate:
    'Affiliates are not licensed investment advisors. All client conversations must remain educational. Do not make projections or guarantees.',
};

interface DisclaimerProps {
  variant: DisclaimerVariant;
  className?: string;
}

export function Disclaimer({ variant, className = '' }: DisclaimerProps) {
  const Icon = variant === 'investment' || variant === 'affiliate' ? AlertTriangle : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-xs text-muted-foreground ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <p className="leading-relaxed">{DISCLAIMERS[variant]}</p>
    </div>
  );
}
