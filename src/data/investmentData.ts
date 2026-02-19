import { PayoutEntry, PortfolioEntry, CompanyEntry, SpreadsheetData } from '@/types/investments';

// ── 2025 Payout Tracker ──
export const payoutTracker2025: PayoutEntry[] = [
  { id: 'p25-1', name: 'DF - R1 CIT', investments: 400000, expectedAnnualPayout: 144000, yearIncome: 144000, initiationDate: '11/27/2024', firstPayoutDate: '1/27/2025', investmentEndDate: '1/27/2026', expectedMonthlyPayout: 12000, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Received', notes: 'Payout received as expected.', remainingOnLoan: '', payoutVariance: 132000, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-2', name: 'DF - R2 CIT', investments: 200000, expectedAnnualPayout: 72000, yearIncome: 42000, initiationDate: '3/14/2025', firstPayoutDate: '6/17/2025', investmentEndDate: '7/15/2026', expectedMonthlyPayout: 6000, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Expected', notes: 'Awaiting payout.', remainingOnLoan: '', payoutVariance: 66000, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-3', name: 'DF - R3 Mango 125 + 75 (200 CIT) + 345 Hunt Heloc', investments: 545000, expectedAnnualPayout: 196200, yearIncome: 98000, initiationDate: '4/29/2025', firstPayoutDate: '7/30/2025', investmentEndDate: '7/30/2026', expectedMonthlyPayout: 16350, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Received', notes: 'Payout processed successfully.', remainingOnLoan: '', payoutVariance: 179850, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-4', name: 'DF - R4 100K 90 Allianz / 10 CIT', investments: 100000, expectedAnnualPayout: 36000, yearIncome: 0, initiationDate: '12/24/2025', firstPayoutDate: '3/24/2026', investmentEndDate: '3/24/2027', expectedMonthlyPayout: 3000, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 33000, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-5', name: 'Homestir 11365 8th St. E, Treasure Island', investments: 50000, expectedAnnualPayout: 12500, yearIncome: 12500, initiationDate: '7/25/2025', firstPayoutDate: '8/22/2025', investmentEndDate: '1/25/2026', expectedMonthlyPayout: 1041, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 11459, payoutCompletion: 1201, year: 2025 },
  { id: 'p25-6', name: 'Sr Living 1', investments: 200000, expectedAnnualPayout: 8000, yearIncome: 8000, initiationDate: '6/5/2025', firstPayoutDate: '7/1/2025', investmentEndDate: '9/1/2025', expectedMonthlyPayout: 666, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: 'got paid first month aug 7th - now pending 2nd', remainingOnLoan: 'got origination of 6k', payoutVariance: 7334, payoutCompletion: 1201, year: 2025 },
  { id: 'p25-7', name: 'Sr Living 2', investments: 200000, expectedAnnualPayout: 9000, yearIncome: 9000, initiationDate: '6/30/2025', firstPayoutDate: '7/3/2025', investmentEndDate: '10/1/2025', expectedMonthlyPayout: 750, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: 'got paid 3k monthly', remainingOnLoan: 'pending origination 6k', payoutVariance: 8250, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-8', name: 'Florida Mango STR', investments: 615000, expectedAnnualPayout: 120000, yearIncome: 0, initiationDate: '9/20/2024', firstPayoutDate: '9/20/2024', investmentEndDate: '', expectedMonthlyPayout: 10000, monthlyMortgage: 5580, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 110000, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-9', name: '247 N. Eaglewood Dr., Saratoga Springs, UT', investments: 100000, expectedAnnualPayout: 4584, yearIncome: 4500, initiationDate: '3/15/2022', firstPayoutDate: '12/1/2024', investmentEndDate: '5/31/2026', expectedMonthlyPayout: 382, monthlyMortgage: 2163, noiMonthly: 360, interestRate: 'US Bank - 4.25%', notes: '145 for HOA - Jacks Enterprises', remainingOnLoan: 'remaining 381K mortgage', payoutVariance: 4202, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-10', name: '1806 W. Newcastle Ln. #B101, Saratoga Springs, UT', investments: 100000, expectedAnnualPayout: 3948, yearIncome: 3900, initiationDate: '2/18/2022', firstPayoutDate: '3/1/2022', investmentEndDate: '', expectedMonthlyPayout: 329, monthlyMortgage: 1436, noiMonthly: 315, interestRate: 'Chase - 3.75%', notes: '280 for HOA - Walt Enterprises', remainingOnLoan: 'remaining 266K mortgage', payoutVariance: 3619, payoutCompletion: 1200, year: 2025 },
  { id: 'p25-11', name: 'Decatur Alabama', investments: 100000, expectedAnnualPayout: 6500, yearIncome: 5000, initiationDate: '11/1/2023', firstPayoutDate: '1/1/2025', investmentEndDate: '', expectedMonthlyPayout: 500, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 6000, payoutCompletion: 1300, year: 2025 },
  { id: 'p25-12', name: 'Homestir - 7800 3rd Ave S', investments: 50000, expectedAnnualPayout: 12500, yearIncome: 0, initiationDate: '8/14/2025', firstPayoutDate: '9/5/2025', investmentEndDate: '2/14/2025', expectedMonthlyPayout: 1041, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 11459, payoutCompletion: 1201, year: 2025 },
];

// ── 2026 Payout Tracker ──
export const payoutTracker2026: PayoutEntry[] = [
  { id: 'p26-1', name: 'DF - R1 CIT', investments: 400000, expectedAnnualPayout: 144000, yearIncome: 144000, initiationDate: '11/27/2024', firstPayoutDate: '1/27/2025', investmentEndDate: '1/27/2026', expectedMonthlyPayout: 12000, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Received', notes: 'Payout received as expected.', remainingOnLoan: '', payoutVariance: 132000, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-2', name: 'DF - R2 CIT', investments: 200000, expectedAnnualPayout: 72000, yearIncome: 72000, initiationDate: '3/14/2025', firstPayoutDate: '6/17/2025', investmentEndDate: '7/15/2026', expectedMonthlyPayout: 6000, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Expected', notes: 'Awaiting payout.', remainingOnLoan: '', payoutVariance: 66000, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-3', name: 'DF - R3 Mango 125 + 75 (200 CIT) + 345 Hunt Heloc', investments: 545000, expectedAnnualPayout: 196200, yearIncome: 196000, initiationDate: '4/29/2025', firstPayoutDate: '7/30/2025', investmentEndDate: '7/30/2026', expectedMonthlyPayout: 16350, monthlyMortgage: 0, noiMonthly: 0, interestRate: 'Received', notes: 'Payout processed successfully.', remainingOnLoan: '', payoutVariance: 179850, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-4', name: 'DF - R4 100K 90 Allianz / 10 CIT', investments: 100000, expectedAnnualPayout: 36000, yearIncome: 30000, initiationDate: '12/24/2025', firstPayoutDate: '3/24/2026', investmentEndDate: '3/24/2027', expectedMonthlyPayout: 3000, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 33000, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-5', name: 'Florida Mango STR', investments: 615000, expectedAnnualPayout: 120000, yearIncome: 0, initiationDate: '9/20/2024', firstPayoutDate: '9/20/2024', investmentEndDate: '', expectedMonthlyPayout: 10000, monthlyMortgage: 5580, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 110000, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-6', name: '247 N. Eaglewood Dr., Saratoga Springs, UT', investments: 100000, expectedAnnualPayout: 4584, yearIncome: 4500, initiationDate: '3/15/2022', firstPayoutDate: '12/1/2024', investmentEndDate: '5/31/2026', expectedMonthlyPayout: 382, monthlyMortgage: 2163, noiMonthly: 360, interestRate: 'US Bank - 4.25%', notes: '145 for HOA - Jacks Enterprises', remainingOnLoan: 'remaining 381K mortgage', payoutVariance: 4202, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-7', name: '1806 W. Newcastle Ln. #B101, Saratoga Springs, UT', investments: 100000, expectedAnnualPayout: 3948, yearIncome: 3900, initiationDate: '2/18/2022', firstPayoutDate: '3/1/2022', investmentEndDate: '', expectedMonthlyPayout: 329, monthlyMortgage: 1436, noiMonthly: 315, interestRate: 'Chase - 3.75%', notes: '280 for HOA - Walt Enterprises', remainingOnLoan: 'remaining 266K mortgage', payoutVariance: 3619, payoutCompletion: 1200, year: 2026 },
  { id: 'p26-8', name: 'Decatur Alabama', investments: 100000, expectedAnnualPayout: 6500, yearIncome: 5000, initiationDate: '11/1/2023', firstPayoutDate: '1/1/2025', investmentEndDate: '', expectedMonthlyPayout: 500, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 6000, payoutCompletion: 1300, year: 2026 },
  { id: 'p26-9', name: 'Homestir 11365 8th St. E, Treasure Island', investments: 50000, expectedAnnualPayout: 0, yearIncome: 1600, initiationDate: '7/25/2025', firstPayoutDate: '8/22/2025', investmentEndDate: '1/25/2026', expectedMonthlyPayout: 0, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: 'Interest paid, principal not returned', remainingOnLoan: '', payoutVariance: 11459, payoutCompletion: 1201, year: 2026 },
  { id: 'p26-10', name: 'Homestir - 7800 3rd Ave S', investments: 50000, expectedAnnualPayout: 0, yearIncome: 14000, initiationDate: '8/14/2025', firstPayoutDate: '9/5/2025', investmentEndDate: '2/14/2026', expectedMonthlyPayout: 0, monthlyMortgage: 0, noiMonthly: 0, interestRate: '', notes: '', remainingOnLoan: '', payoutVariance: 11459, payoutCompletion: 1201, year: 2026 },
];

// ── Portfolio ──
export const portfolioData: PortfolioEntry[] = [
  { id: 'port-1', propertyAddress: '1806 W Newcastle', estimatedValue: 385000 },
  { id: 'port-2', propertyAddress: '1550 S Florida Mango Rd', estimatedValue: 1340000 },
  { id: 'port-3', propertyAddress: 'Decatur Alabama', estimatedValue: 100000 },
  { id: 'port-4', propertyAddress: 'Allianz Variable Life', estimatedValue: 75700 },
  { id: 'port-5', propertyAddress: '2409 Huntington Ln', estimatedValue: 1165000 },
  { id: 'port-6', propertyAddress: 'Huntington Lane', estimatedValue: 500000 },
  { id: 'port-7', propertyAddress: '247 N Eaglewood', estimatedValue: 500000 },
];

// ── Company Directory ──
export const companyDirectory: CompanyEntry[] = [
  { id: 'co-1', company: 'Walt Enterprises Inc', ein: '88-0592565', entityType: 'S-Corporation', state: 'UT', formationDate: '2/1/2022', registeredAgent: 'Utah Property Condo', associatedProperty: '1806 W Newcastle Ln Unit B101, Saratoga Springs, UT' },
  { id: 'co-2', company: 'Jacks Enterprises Inc', ein: '88-0591395', entityType: 'S-Corporation', state: 'UT', formationDate: '2/1/2022', registeredAgent: 'not using as of 2025', associatedProperty: '247 N Eaglewood Dr (TH 109), Saratoga Springs, UT' },
  { id: 'co-3', company: 'Jones & Straz Enterprises Inc', ein: '88-0615303', entityType: 'S-Corporation', state: 'UT', formationDate: '2/1/2022', registeredAgent: 'Utah Property Townhome', associatedProperty: '247 N Eaglewood Dr, Saratoga Springs, UT' },
  { id: 'co-4', company: 'LA Vision LLC', ein: '93-4070570', entityType: 'Partnership LLC', state: 'UT', formationDate: '10/24/2023', registeredAgent: 'Alabama Syndication', associatedProperty: '227 8th St SW, Decatur, AL' },
  { id: 'co-5', company: 'Pause 4 Plus LLC', ein: '33-4777132', entityType: 'Single Member LLC', state: 'CA', formationDate: '4/24/2025', registeredAgent: 'Real estate consulting', associatedProperty: '2409 Huntington Ln Unit A, Redondo Beach, CA' },
  { id: 'co-6', company: 'LA Freedom LLC', ein: '99-5039937', entityType: 'Partnership LLC', state: 'CA', formationDate: '9/20/2024', registeredAgent: 'Florida STR', associatedProperty: '1550 Florida Mango Rd, West Palm Beach, FL' },
  { id: 'co-7', company: 'Peace Beyond Perfection LLC', ein: '39-2264047', entityType: 'Single Member LLC', state: 'CA', formationDate: '5/21/2025', registeredAgent: 'DBA Kingdom Investors', associatedProperty: '2409 Huntington Ln Unit A, Redondo Beach, CA' },
  { id: 'co-8', company: 'Leep AI', ein: '41-3070263', entityType: 'C Corp', state: 'Delaware/CA', formationDate: '12/12/2025', registeredAgent: 'AI Company', associatedProperty: '2409 Huntington Ln Unit A, Redondo Beach, CA' },
];

// Helper to compute summary stats
export function getPayoutSummary(entries: PayoutEntry[]) {
  const totalInvested = entries.reduce((s, e) => s + e.investments, 0);
  const totalExpectedAnnual = entries.reduce((s, e) => s + e.expectedAnnualPayout, 0);
  const totalIncome = entries.reduce((s, e) => s + e.yearIncome, 0);
  const totalMonthlyPayout = entries.reduce((s, e) => s + e.expectedMonthlyPayout, 0);
  const totalMortgage = entries.reduce((s, e) => s + e.monthlyMortgage, 0);
  const avgYield = totalInvested > 0 ? (totalExpectedAnnual / totalInvested) * 100 : 0;
  const incomeVsExpected = totalExpectedAnnual > 0 ? (totalIncome / totalExpectedAnnual) * 100 : 0;

  return { totalInvested, totalExpectedAnnual, totalIncome, totalMonthlyPayout, totalMortgage, avgYield, incomeVsExpected };
}

export function getPortfolioSummary(entries: PortfolioEntry[]) {
  const totalValue = entries.reduce((s, e) => s + e.estimatedValue, 0);
  return { totalValue, propertyCount: entries.length };
}
