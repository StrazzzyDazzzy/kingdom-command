
-- Bookings table for imported booking data
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_name TEXT NOT NULL,
  guest_name TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('direct', 'airbnb', 'vrbo', 'other')),
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  cleaning_fee NUMERIC(10,2) DEFAULT 0,
  platform_fee NUMERIC(10,2) DEFAULT 0,
  net_revenue NUMERIC(12,2) GENERATED ALWAYS AS (revenue - COALESCE(cleaning_fee, 0) - COALESCE(platform_fee, 0)) STORED,
  nights INTEGER GENERATED ALWAYS AS ((check_out - check_in)) STORED,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  imported_from TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public read/write for now (single user app, no auth yet)
CREATE POLICY "Allow all access to bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Payments table for webhook-received payment data
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'stripe',
  external_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  description TEXT,
  customer_email TEXT,
  customer_name TEXT,
  business_unit TEXT CHECK (business_unit IN ('ai_agents', 'retreats', 'tax_strategy')),
  metadata JSONB DEFAULT '{}',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- HubSpot deals cache
CREATE TABLE public.hubspot_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hubspot_deal_id TEXT UNIQUE NOT NULL,
  deal_name TEXT NOT NULL,
  stage TEXT,
  amount NUMERIC(12,2),
  close_date DATE,
  pipeline TEXT,
  owner_name TEXT,
  company_name TEXT,
  days_in_stage INTEGER,
  created_date TIMESTAMPTZ,
  last_modified TIMESTAMPTZ,
  properties JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hubspot_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to hubspot_deals" ON public.hubspot_deals FOR ALL USING (true) WITH CHECK (true);

-- Occupancy tracking (derived from bookings)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
