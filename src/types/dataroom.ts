export type UserRole = 'admin' | 'client' | 'affiliate';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  is_active: boolean;
  assigned_rm: string | null;
}

export type InvestmentCategory =
  | 'tax_strategy' | 'real_estate' | 'alternative' | 'private_equity'
  | 'opportunity_zone' | 'oil_gas' | 'conservation_easement'
  | 'cost_segregation' | 'solar_itc' | 'historic_tax_credit'
  | 'land_conservation' | 'dstx_1031' | 'other';

export type InvestmentStatus = 'active' | 'closed' | 'coming_soon' | 'archived';

export interface Investment {
  id: string;
  title: string;
  slug: string;
  category: InvestmentCategory;
  status: InvestmentStatus;
  short_description: string | null;
  long_description: string | null;
  minimum_investment: number | null;
  target_return: string | null;
  hold_period: string | null;
  irs_codes: string[];
  has_1031: boolean;
  has_qoz: boolean;
  has_cost_seg: boolean;
  has_179d: boolean;
  has_section_45: boolean;
  has_material_participation: boolean;
  material_participation_notes: string | null;
  audit_history: unknown[];
  internal_audit_notes: string | null;
  compliance_notes: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type DocType =
  | 'ppm' | 'one_pager' | 'fact_sheet' | 'term_sheet' | 'tax_opinion'
  | 'audit_report' | 'k1_sample' | 'subscription_agreement'
  | 'legal_opinion' | 'irs_ruling' | 'other';

export interface InvestmentDocument {
  id: string;
  investment_id: string;
  doc_type: DocType;
  file_name: string;
  file_url: string;
  file_size: number | null;
  page_count: number | null;
  parsed_text: string | null;
  is_affiliate_visible: boolean;
  is_client_visible: boolean;
  uploaded_at: string;
}

export interface InvestmentLink {
  id: string;
  investment_id: string;
  label: string;
  url: string;
  link_type: string | null;
  is_public: boolean;
}

export interface InvestmentVideo {
  id: string;
  investment_id: string;
  title: string;
  embed_url: string;
  platform: 'youtube' | 'vimeo' | 'loom' | 'wistia';
  description: string | null;
  is_affiliate_visible: boolean;
  display_order: number;
}

export interface InvestmentScenario {
  id: string;
  investment_id: string;
  scenario_name: string;
  input_amount: number;
  projected_return: number | null;
  tax_savings_estimate: number | null;
  net_benefit: number | null;
  assumptions: string | null;
  hold_years: number | null;
  depreciation_schedule: unknown;
  created_by: string | null;
  created_at: string;
}

export interface IrsCode {
  id: string;
  code_number: string;
  title: string;
  summary: string | null;
  full_text_url: string | null;
  category: string | null;
  related_investment_types: string[];
}

export interface InvestmentAudit {
  id: string;
  investment_id: string;
  audit_year: number;
  auditor_name: string | null;
  auditor_firm: string | null;
  audit_type: 'irs' | 'internal' | 'third_party';
  outcome: 'sustained' | 'partially_sustained' | 'disallowed' | 'pending' | 'no_change' | null;
  success_rate_pct: number | null;
  notes: string | null;
  report_url: string | null;
}

export interface ClientDealAccess {
  id: string;
  client_id: string;
  investment_id: string;
  disclosure_acknowledged: boolean;
  acknowledged_at: string | null;
  first_viewed_at: string;
  last_viewed_at: string;
  documents_opened: string[];
  sent_to_advisor: boolean;
  sent_at: string | null;
}

export const CATEGORY_LABELS: Record<InvestmentCategory, string> = {
  tax_strategy: 'Tax Strategy',
  real_estate: 'Real Estate',
  alternative: 'Alternative',
  private_equity: 'Private Equity',
  opportunity_zone: 'Opportunity Zone',
  oil_gas: 'Oil & Gas',
  conservation_easement: 'Conservation Easement',
  cost_segregation: 'Cost Segregation',
  solar_itc: 'Solar ITC',
  historic_tax_credit: 'Historic Tax Credit',
  land_conservation: 'Land Conservation',
  dstx_1031: 'DST/1031 Exchange',
  other: 'Other',
};

export const STATUS_LABELS: Record<InvestmentStatus, string> = {
  active: 'Active',
  closed: 'Closed',
  coming_soon: 'Coming Soon',
  archived: 'Archived',
};

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  ppm: 'PPM',
  one_pager: 'One-Pager',
  fact_sheet: 'Fact Sheet',
  term_sheet: 'Term Sheet',
  tax_opinion: 'Tax Opinion',
  audit_report: 'Audit Report',
  k1_sample: 'K-1 Sample',
  subscription_agreement: 'Subscription Agreement',
  legal_opinion: 'Legal Opinion',
  irs_ruling: 'IRS Ruling',
  other: 'Other',
};
