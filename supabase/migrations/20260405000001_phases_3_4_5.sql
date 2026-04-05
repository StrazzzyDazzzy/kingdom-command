-- ============================================
-- Kingdom Investors Data Room
-- Phases 3-5 Migration
-- ============================================

-- ============================================
-- PHASE 3: COMPLIANCE & REPORTING
-- ============================================

-- K-1 Document Tracking
CREATE TABLE IF NOT EXISTS public.k1_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'draft', 'final', 'amended', 'distributed')) NOT NULL DEFAULT 'pending',
  file_url TEXT,
  file_name TEXT,
  distributed_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.k1_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage K-1s" ON public.k1_documents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients view own K-1s" ON public.k1_documents FOR SELECT
  USING (client_id = auth.uid());

-- Compliance Checklist Items
CREATE TABLE IF NOT EXISTS public.compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('regulatory', 'tax', 'legal', 'reporting', 'operational')) NOT NULL DEFAULT 'regulatory',
  status TEXT CHECK (status IN ('compliant', 'non_compliant', 'pending_review', 'not_applicable')) NOT NULL DEFAULT 'pending_review',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.profiles(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage compliance" ON public.compliance_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Activity Log (audit trail for all platform actions)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_name TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all logs" ON public.activity_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users view own logs" ON public.activity_logs FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- PHASE 4: CLIENT EXPERIENCE
-- ============================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'action_required', 'document', 'k1', 'investment')) NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Client Onboarding Tracking
CREATE TABLE IF NOT EXISTS public.client_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_profile BOOLEAN DEFAULT false,
  step_accreditation BOOLEAN DEFAULT false,
  step_risk_assessment BOOLEAN DEFAULT false,
  step_tax_info BOOLEAN DEFAULT false,
  step_agreements BOOLEAN DEFAULT false,
  accreditation_type TEXT CHECK (accreditation_type IN ('income', 'net_worth', 'entity', 'professional', 'other')),
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'speculative')),
  investment_horizon TEXT CHECK (investment_horizon IN ('1-3_years', '3-5_years', '5-10_years', '10_plus_years')),
  annual_income_range TEXT,
  tax_bracket TEXT,
  state_of_residence TEXT,
  has_cpa BOOLEAN DEFAULT false,
  cpa_name TEXT,
  cpa_email TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients manage own onboarding" ON public.client_onboarding FOR ALL
  USING (client_id = auth.uid());

CREATE POLICY "Admins view all onboarding" ON public.client_onboarding FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- PHASE 5: SCALE & INTEGRATE
-- ============================================

-- Affiliate Referrals
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_name TEXT NOT NULL,
  referred_email TEXT NOT NULL,
  referred_phone TEXT,
  status TEXT CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'lost')) NOT NULL DEFAULT 'pending',
  investment_id UUID REFERENCES public.investments(id) ON DELETE SET NULL,
  commission_amount NUMERIC(12,2),
  commission_paid BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates manage own referrals" ON public.affiliate_referrals FOR ALL
  USING (affiliate_id = auth.uid());

CREATE POLICY "Admins manage all referrals" ON public.affiliate_referrals FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Platform Analytics (aggregated metrics)
CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view analytics" ON public.platform_analytics FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add onboarding fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_k1_client ON public.k1_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_k1_investment ON public.k1_documents(investment_id);
CREATE INDEX IF NOT EXISTS idx_compliance_investment ON public.compliance_items(investment_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.platform_analytics(metric_date, metric_type);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['k1_documents', 'compliance_items', 'client_onboarding', 'affiliate_referrals'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', tbl);
  END LOOP;
END;
$$;
