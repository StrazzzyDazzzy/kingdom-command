import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';

interface DisclosureGateProps {
  investmentTitle: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function DisclosureGate({ investmentTitle, onAccept, onDecline }: DisclosureGateProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg border-border/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
            <Shield className="h-7 w-7 text-gold" />
          </div>
          <CardTitle className="font-display text-xl">
            Deal Room Access
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {investmentTitle}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-gold shrink-0" />
              <p>
                This material is for informational purposes only and does not constitute
                investment, tax, or legal advice. Past performance is not indicative of
                future results.
              </p>
            </div>
            <p>
              Please consult your attorney and CPA before making any investment decision.
              The information contained in this deal room is confidential and intended
              solely for the use of authorized investors.
            </p>
            <p>
              By proceeding, you acknowledge that you have read and understand these
              disclosures, and that you will not redistribute any materials found within
              this deal room without express written consent.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <label htmlFor="acknowledge" className="text-sm text-foreground leading-relaxed cursor-pointer">
              I acknowledge that I have read and understand the above disclosures. I understand
              that the information provided is not investment advice and I will consult with
              qualified professionals before making any investment decisions.
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onDecline}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button className="flex-1" disabled={!acknowledged} onClick={onAccept}>
              Enter Deal Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
