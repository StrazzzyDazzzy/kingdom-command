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

// ============================================
// PHASE 3: COMPLIANCE & REPORTING
// ============================================

export type K1Status = 'pending' | 'draft' | 'final' | 'amended' | 'distributed';

export interface K1Document {
  id: string;
  investment_id: string;
  client_id: string;
  tax_year: number;
  status: K1Status;
  file_url: string | null;
  file_name: string | null;
  distributed_at: string | null;
  opened_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ComplianceCategory = 'regulatory' | 'tax' | 'legal' | 'reporting' | 'operational';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'not_applicable';
export type CompliancePriority = 'low' | 'medium' | 'high' | 'critical';

export interface ComplianceItem {
  id: string;
  investment_id: string;
  title: string;
  description: string | null;
  category: ComplianceCategory;
  status: ComplianceStatus;
  due_date: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  priority: CompliancePriority;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// ============================================
// PHASE 4: CLIENT EXPERIENCE
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'action_required' | 'document' | 'k1' | 'investment';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type AccreditationType = 'income' | 'net_worth' | 'entity' | 'professional' | 'other';
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive' | 'speculative';
export type InvestmentHorizon = '1-3_years' | '3-5_years' | '5-10_years' | '10_plus_years';

export interface ClientOnboarding {
  id: string;
  client_id: string;
  step_profile: boolean;
  step_accreditation: boolean;
  step_risk_assessment: boolean;
  step_tax_info: boolean;
  step_agreements: boolean;
  accreditation_type: AccreditationType | null;
  risk_tolerance: RiskTolerance | null;
  investment_horizon: InvestmentHorizon | null;
  annual_income_range: string | null;
  tax_bracket: string | null;
  state_of_residence: string | null;
  has_cpa: boolean;
  cpa_name: string | null;
  cpa_email: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// PHASE 5: SCALE & INTEGRATE
// ============================================

export type ReferralStatus = 'pending' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  referred_name: string;
  referred_email: string;
  referred_phone: string | null;
  status: ReferralStatus;
  investment_id: string | null;
  commission_amount: number | null;
  commission_paid: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformAnalytics {
  id: string;
  metric_date: string;
  metric_type: string;
  metric_value: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const K1_STATUS_LABELS: Record<K1Status, string> = {
  pending: 'Pending',
  draft: 'Draft',
  final: 'Final',
  amended: 'Amended',
  distributed: 'Distributed',
};

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
  pending_review: 'Pending Review',
  not_applicable: 'N/A',
};

export const COMPLIANCE_CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  regulatory: 'Regulatory',
  tax: 'Tax',
  legal: 'Legal',
  reporting: 'Reporting',
  operational: 'Operational',
};

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost',
};
