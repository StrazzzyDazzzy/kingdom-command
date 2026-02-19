export interface PayoutEntry {
  id: string;
  name: string;
  investments: number;
  expectedAnnualPayout: number;
  yearIncome: number;
  initiationDate: string;
  firstPayoutDate: string;
  investmentEndDate: string;
  expectedMonthlyPayout: number;
  monthlyMortgage: number;
  noiMonthly: number;
  interestRate: string;
  notes: string;
  remainingOnLoan: string;
  payoutVariance: number;
  payoutCompletion: number;
  year: number;
}

export interface PortfolioEntry {
  id: string;
  propertyAddress: string;
  estimatedValue: number;
}

export interface CompanyEntry {
  id: string;
  company: string;
  ein: string;
  entityType: string;
  state: string;
  formationDate: string;
  registeredAgent: string;
  associatedProperty: string;
}

export interface SpreadsheetCell {
  value: string | number;
  formula?: string;
  format?: 'currency' | 'percent' | 'number' | 'text' | 'date';
  editable?: boolean;
}

export type SpreadsheetRow = Record<string, SpreadsheetCell>;

export interface SpreadsheetData {
  id: string;
  label: string;
  columns: { key: string; label: string; width?: number; format?: SpreadsheetCell['format'] }[];
  rows: SpreadsheetRow[];
  summaryRow?: SpreadsheetRow;
}
