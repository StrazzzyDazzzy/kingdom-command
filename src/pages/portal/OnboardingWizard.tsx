import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useOnboarding, useUpsertOnboarding } from '@/hooks/useClientExperience';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Crown, User, ShieldCheck, BarChart3, FileText, CheckCircle } from 'lucide-react';
import type { AccreditationType, RiskTolerance, InvestmentHorizon } from '@/types/dataroom';

const STEPS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'accreditation', label: 'Accreditation', icon: ShieldCheck },
  { key: 'risk', label: 'Risk Profile', icon: BarChart3 },
  { key: 'tax', label: 'Tax Info', icon: FileText },
  { key: 'agreements', label: 'Agreements', icon: CheckCircle },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const { data: onboarding } = useOnboarding();
  const upsert = useUpsertOnboarding();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: '',
    company: '',
    accreditation_type: '' as AccreditationType | '',
    risk_tolerance: '' as RiskTolerance | '',
    investment_horizon: '' as InvestmentHorizon | '',
    annual_income_range: '',
    tax_bracket: '',
    state_of_residence: '',
    has_cpa: false,
    cpa_name: '',
    cpa_email: '',
    agree_terms: false,
    agree_privacy: false,
    agree_risk: false,
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleNext = async () => {
    const stepKey = STEPS[step].key;
    const stepData: Record<string, unknown> = {};

    if (stepKey === 'profile') stepData.step_profile = true;
    if (stepKey === 'accreditation') {
      stepData.step_accreditation = true;
      stepData.accreditation_type = form.accreditation_type || null;
    }
    if (stepKey === 'risk') {
      stepData.step_risk_assessment = true;
      stepData.risk_tolerance = form.risk_tolerance || null;
      stepData.investment_horizon = form.investment_horizon || null;
    }
    if (stepKey === 'tax') {
      stepData.step_tax_info = true;
      stepData.annual_income_range = form.annual_income_range || null;
      stepData.tax_bracket = form.tax_bracket || null;
      stepData.state_of_residence = form.state_of_residence || null;
      stepData.has_cpa = form.has_cpa;
      stepData.cpa_name = form.cpa_name || null;
      stepData.cpa_email = form.cpa_email || null;
    }
    if (stepKey === 'agreements') {
      stepData.step_agreements = true;
      stepData.completed_at = new Date().toISOString();
    }

    await upsert.mutateAsync(stepData as Record<string, unknown>);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await refreshProfile();
      navigate('/portal');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-display font-bold">Welcome to Kingdom Investors</h1>
          <p className="text-sm text-muted-foreground mt-1">Let's set up your investor profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
              <div className={`text-[10px] mt-1.5 text-center ${i === step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-border/50 bg-card/30 p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Your Profile</h2>
              <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 555-5555" /></div>
              <div><Label>Company (optional)</Label><Input value={form.company} onChange={(e) => update('company', e.target.value)} /></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Accreditation Status</h2>
              <p className="text-sm text-muted-foreground">Most investments require accredited investor status under SEC Rule 501.</p>
              <Select value={form.accreditation_type} onValueChange={(v) => update('accreditation_type', v)}>
                <SelectTrigger><SelectValue placeholder="How do you qualify?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income ($200K+ individual / $300K+ joint)</SelectItem>
                  <SelectItem value="net_worth">Net Worth ($1M+ excluding primary residence)</SelectItem>
                  <SelectItem value="entity">Entity with $5M+ in assets</SelectItem>
                  <SelectItem value="professional">Licensed Series 7, 65, or 82</SelectItem>
                  <SelectItem value="other">Other qualification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Risk Profile</h2>
              <div>
                <Label>Risk Tolerance</Label>
                <Select value={form.risk_tolerance} onValueChange={(v) => update('risk_tolerance', v)}>
                  <SelectTrigger><SelectValue placeholder="Select tolerance" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative — Capital preservation</SelectItem>
                    <SelectItem value="moderate">Moderate — Balanced growth</SelectItem>
                    <SelectItem value="aggressive">Aggressive — High growth</SelectItem>
                    <SelectItem value="speculative">Speculative — Maximum returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Investment Horizon</Label>
                <Select value={form.investment_horizon} onValueChange={(v) => update('investment_horizon', v)}>
                  <SelectTrigger><SelectValue placeholder="Select horizon" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3_years">1-3 Years</SelectItem>
                    <SelectItem value="3-5_years">3-5 Years</SelectItem>
                    <SelectItem value="5-10_years">5-10 Years</SelectItem>
                    <SelectItem value="10_plus_years">10+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Tax Information</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Annual Income Range</Label>
                  <Select value={form.annual_income_range} onValueChange={(v) => update('annual_income_range', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200-500k">$200K - $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                      <SelectItem value="5m+">$5M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax Bracket</Label>
                  <Select value={form.tax_bracket} onValueChange={(v) => update('tax_bracket', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32%">32%</SelectItem>
                      <SelectItem value="35%">35%</SelectItem>
                      <SelectItem value="37%">37%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>State of Residence</Label><Input value={form.state_of_residence} onChange={(e) => update('state_of_residence', e.target.value)} placeholder="e.g. Texas" /></div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.has_cpa} onCheckedChange={(v) => update('has_cpa', v)} />
                <Label className="cursor-pointer">I have a CPA / Tax Attorney</Label>
              </div>
              {form.has_cpa && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <Input value={form.cpa_name} onChange={(e) => update('cpa_name', e.target.value)} placeholder="CPA Name" />
                  <Input value={form.cpa_email} onChange={(e) => update('cpa_email', e.target.value)} placeholder="CPA Email" />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-lg">Agreements</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                  <Checkbox checked={form.agree_terms} onCheckedChange={(v) => update('agree_terms', v)} className="mt-0.5" />
                  <div><div className="text-sm font-medium">Terms of Service</div><div className="text-xs text-muted-foreground">I agree to the Kingdom Investors Terms of Service and Platform Agreement.</div></div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                  <Checkbox checked={form.agree_privacy} onCheckedChange={(v) => update('agree_privacy', v)} className="mt-0.5" />
                  <div><div className="text-sm font-medium">Privacy Policy</div><div className="text-xs text-muted-foreground">I acknowledge the Privacy Policy and consent to data processing.</div></div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                  <Checkbox checked={form.agree_risk} onCheckedChange={(v) => update('agree_risk', v)} className="mt-0.5" />
                  <div><div className="text-sm font-medium">Investment Risk Disclosure</div><div className="text-xs text-muted-foreground">I understand that alternative investments involve substantial risk of loss and are only suitable for accredited investors.</div></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border/30">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
            <Button
              onClick={handleNext}
              disabled={upsert.isPending || (step === 4 && !(form.agree_terms && form.agree_privacy && form.agree_risk))}
            >
              {step === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
