-- ============================================
-- Kingdom Investors Data Room Schema
-- Phase 1 Foundation Migration
-- ============================================

-- Enable pgvector extension for document embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- USERS & ROLES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'client', 'affiliate')) NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  assigned_rm TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "New users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- INVESTMENTS (master table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN (
    'tax_strategy', 'real_estate', 'alternative', 'private_equity',
    'opportunity_zone', 'oil_gas', 'conservation_easement',
    'cost_segregation', 'solar_itc', 'historic_tax_credit',
    'land_conservation', 'dstx_1031', 'other'
  )) NOT NULL,
  status TEXT CHECK (status IN ('active', 'closed', 'coming_soon', 'archived')) DEFAULT 'active',
  short_description TEXT,
  long_description TEXT,
  minimum_investment NUMERIC,
  target_return TEXT,
  hold_period TEXT,
  irs_codes TEXT[] DEFAULT '{}',
  has_1031 BOOLEAN DEFAULT false,
  has_qoz BOOLEAN DEFAULT false,
  has_cost_seg BOOLEAN DEFAULT false,
  has_179d BOOLEAN DEFAULT false,
  has_section_45 BOOLEAN DEFAULT false,
  has_material_participation BOOLEAN DEFAULT false,
  material_participation_notes TEXT,
  audit_history JSONB DEFAULT '[]'::jsonb,
  internal_audit_notes TEXT,
  compliance_notes TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view active investments
CREATE POLICY "Authenticated users can view investments"
  ON public.investments FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete investments
CREATE POLICY "Admins can manage investments"
  ON public.investments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INVESTMENT DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.investment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  doc_type TEXT CHECK (doc_type IN (
    'ppm', 'one_pager', 'fact_sheet', 'term_sheet', 'tax_opinion',
    'audit_report', 'k1_sample', 'subscription_agreement',
    'legal_opinion', 'irs_ruling', 'other'
  )) NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  page_count INTEGER,
  parsed_text TEXT,
  is_affiliate_visible BOOLEAN DEFAULT false,
  is_client_visible BOOLEAN DEFAULT true,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investment_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view client-visible documents"
  ON public.investment_documents FOR SELECT
  USING (
    auth.role() = 'authenticated' AND (
      is_client_visible = true
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage documents"
  ON public.investment_documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INVESTMENT LINKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.investment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT CHECK (link_type IN (
    'prospectus', 'article', 'irs_reference', 'news',
    'regulatory', 'sponsor_website', 'other'
  )),
  is_public BOOLEAN DEFAULT false
);

ALTER TABLE public.investment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view links"
  ON public.investment_links FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage links"
  ON public.investment_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- INVESTMENT VIDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.investment_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('youtube', 'vimeo', 'loom', 'wistia')) DEFAULT 'youtube',
  description TEXT,
  is_affiliate_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

ALTER TABLE public.investment_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view videos"
  ON public.investment_videos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage videos"
  ON public.investment_videos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- HYPOTHETICAL SCENARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.investment_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  input_amount NUMERIC NOT NULL,
  projected_return NUMERIC,
  tax_savings_estimate NUMERIC,
  net_benefit NUMERIC,
  assumptions TEXT,
  hold_years INTEGER,
  depreciation_schedule JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investment_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scenarios"
  ON public.investment_scenarios FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can create scenarios"
  ON public.investment_scenarios FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can view all scenarios"
  ON public.investment_scenarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- IRS CODE LIBRARY
-- ============================================
CREATE TABLE IF NOT EXISTS public.irs_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  full_text_url TEXT,
  category TEXT CHECK (category IN (
    'deduction', 'credit', 'deferral', 'exclusion',
    'depreciation', 'passive_activity', 'at_risk', 'other'
  )),
  related_investment_types TEXT[]
);

ALTER TABLE public.irs_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view IRS codes"
  ON public.irs_codes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage IRS codes"
  ON public.irs_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AUDIT RECORDS
-- ============================================
CREATE TABLE IF NOT EXISTS public.investment_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  audit_year INTEGER NOT NULL,
  auditor_name TEXT,
  auditor_firm TEXT,
  audit_type TEXT CHECK (audit_type IN ('irs', 'internal', 'third_party')) NOT NULL,
  outcome TEXT CHECK (outcome IN (
    'sustained', 'partially_sustained', 'disallowed', 'pending', 'no_change'
  )),
  success_rate_pct NUMERIC,
  notes TEXT,
  report_url TEXT
);

ALTER TABLE public.investment_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audits"
  ON public.investment_audits FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage audits"
  ON public.investment_audits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AFFILIATE RESOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS public.affiliate_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE SET NULL,
  resource_type TEXT CHECK (resource_type IN (
    'what_to_say', 'what_not_to_say', 'fact_sheet', 'one_pager',
    'rate_sheet', 'commission_guide', 'compliance_guide',
    'video_training', 'pitch_deck', 'objection_handling'
  )) NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliate_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates and admins can view resources"
  ON public.affiliate_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'affiliate')
    )
  );

CREATE POLICY "Admins can manage affiliate resources"
  ON public.affiliate_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AFFILIATE COMMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  affiliate_tier TEXT CHECK (affiliate_tier IN ('standard', 'preferred', 'elite')) DEFAULT 'standard',
  commission_type TEXT CHECK (commission_type IN ('flat', 'percentage', 'tiered')) NOT NULL,
  commission_rate NUMERIC NOT NULL,
  commission_notes TEXT,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates and admins can view commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'affiliate')
    )
  );

CREATE POLICY "Admins can manage commissions"
  ON public.affiliate_commissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CLIENT DEAL ROOM ACCESS
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_deal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  disclosure_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  documents_opened TEXT[] DEFAULT '{}',
  sent_to_advisor BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  UNIQUE(client_id, investment_id)
);

ALTER TABLE public.client_deal_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deal access"
  ON public.client_deal_access FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Users can manage own deal access"
  ON public.client_deal_access FOR ALL
  USING (client_id = auth.uid());

CREATE POLICY "Admins can view all deal access"
  ON public.client_deal_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AI CONVERSATION LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  source_doc_ids TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations"
  ON public.ai_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Updated_at trigger for investments
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- Seed IRS codes for reference
-- ============================================
INSERT INTO public.irs_codes (code_number, title, summary, category, related_investment_types) VALUES
  ('Section 1031', 'Like-Kind Exchange', 'Allows deferral of capital gains tax when exchanging like-kind real property.', 'deferral', ARRAY['real_estate', 'dstx_1031']),
  ('Section 1400Z-2', 'Qualified Opportunity Zone', 'Tax incentives for investing in economically distressed communities.', 'deferral', ARRAY['opportunity_zone', 'real_estate']),
  ('Section 167', 'Depreciation of Property', 'Allows deduction for depreciation of tangible property used in trade or business.', 'depreciation', ARRAY['real_estate', 'cost_segregation']),
  ('Section 168(k)', 'Bonus Depreciation', 'Allows 100% first-year depreciation for qualifying assets.', 'depreciation', ARRAY['cost_segregation', 'real_estate']),
  ('Section 170(h)', 'Conservation Easement', 'Charitable deduction for donation of a qualified conservation easement.', 'deduction', ARRAY['conservation_easement', 'land_conservation']),
  ('Section 179D', 'Energy Efficient Commercial Building Deduction', 'Deduction for energy-efficient improvements to commercial buildings.', 'deduction', ARRAY['real_estate', 'solar_itc']),
  ('Section 45', 'Production Tax Credit', 'Credit for electricity produced from renewable energy sources.', 'credit', ARRAY['solar_itc', 'alternative']),
  ('Section 48', 'Investment Tax Credit', 'Credit for investment in solar and other renewable energy property.', 'credit', ARRAY['solar_itc']),
  ('Section 469', 'Passive Activity Losses', 'Rules limiting deduction of passive activity losses against non-passive income.', 'passive_activity', ARRAY['real_estate', 'oil_gas', 'alternative']),
  ('Section 613', 'Depletion Allowance', 'Allows deduction for depletion of oil, gas, and mineral properties.', 'deduction', ARRAY['oil_gas']),
  ('Section 47', 'Historic Tax Credit', 'Credit for qualified rehabilitation expenditures on historic structures.', 'credit', ARRAY['historic_tax_credit', 'real_estate']),
  ('Section 199A', 'Qualified Business Income Deduction', 'Up to 20% deduction for qualified business income from pass-through entities.', 'deduction', ARRAY['real_estate', 'private_equity', 'alternative'])
ON CONFLICT (code_number) DO NOTHING;
