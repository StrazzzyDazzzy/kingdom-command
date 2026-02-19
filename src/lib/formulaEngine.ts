// Lightweight formula engine for spreadsheet cells
// Supports: =SUM(A1:A5), =AVG(A1:A5), =COUNT(A1:A5), =A1+A2, =A1*1.5, basic math

export type CellRef = { col: number; row: number };

function colLetterToIndex(letter: string): number {
  let index = 0;
  for (let i = 0; i < letter.length; i++) {
    index = index * 26 + (letter.charCodeAt(i) - 64);
  }
  return index - 1;
}

function parseCellRef(ref: string): CellRef | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { col: colLetterToIndex(match[1]), row: parseInt(match[2]) - 1 };
}

function parseRange(range: string): CellRef[] {
  const [start, end] = range.split(':').map(parseCellRef);
  if (!start || !end) return [];
  const refs: CellRef[] = [];
  for (let r = start.row; r <= end.row; r++) {
    for (let c = start.col; c <= end.col; c++) {
      refs.push({ col: c, row: r });
    }
  }
  return refs;
}

function getCellValue(data: (string | number)[][], ref: CellRef): number {
  const val = data[ref.row]?.[ref.col];
  if (val === undefined || val === '' || val === null) return 0;
  if (typeof val === 'number') return val;
  const parsed = parseFloat(String(val).replace(/[$,%]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function evaluateFormula(formula: string, data: (string | number)[][]): number | string {
  if (!formula.startsWith('=')) return formula;
  const expr = formula.substring(1).trim().toUpperCase();

  try {
    // =SUM(range)
    const sumMatch = expr.match(/^SUM\(([A-Z]+\d+:[A-Z]+\d+)\)$/);
    if (sumMatch) {
      const refs = parseRange(sumMatch[1]);
      return refs.reduce((s, r) => s + getCellValue(data, r), 0);
    }

    // =AVG(range) or =AVERAGE(range)
    const avgMatch = expr.match(/^(?:AVG|AVERAGE)\(([A-Z]+\d+:[A-Z]+\d+)\)$/);
    if (avgMatch) {
      const refs = parseRange(avgMatch[1]);
      const sum = refs.reduce((s, r) => s + getCellValue(data, r), 0);
      return refs.length > 0 ? sum / refs.length : 0;
    }

    // =COUNT(range)
    const countMatch = expr.match(/^COUNT\(([A-Z]+\d+:[A-Z]+\d+)\)$/);
    if (countMatch) {
      const refs = parseRange(countMatch[1]);
      return refs.filter(r => getCellValue(data, r) !== 0).length;
    }

    // =MIN(range)
    const minMatch = expr.match(/^MIN\(([A-Z]+\d+:[A-Z]+\d+)\)$/);
    if (minMatch) {
      const refs = parseRange(minMatch[1]);
      const vals = refs.map(r => getCellValue(data, r));
      return Math.min(...vals);
    }

    // =MAX(range)
    const maxMatch = expr.match(/^MAX\(([A-Z]+\d+:[A-Z]+\d+)\)$/);
    if (maxMatch) {
      const refs = parseRange(maxMatch[1]);
      const vals = refs.map(r => getCellValue(data, r));
      return Math.max(...vals);
    }

    // Simple cell reference arithmetic: =A1+A2, =A1*1.5, =A1-A2, =A1/A2
    const replaced = expr.replace(/[A-Z]+\d+/g, (match) => {
      const ref = parseCellRef(match);
      return ref ? String(getCellValue(data, ref)) : '0';
    });

    // Safe eval for simple math
    const sanitized = replaced.replace(/[^0-9+\-*/.() ]/g, '');
    if (sanitized.length > 0) {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return typeof result === 'number' && !isNaN(result) ? result : '#ERROR';
    }

    return '#ERROR';
  } catch {
    return '#ERROR';
  }
}

export function formatCellValue(value: string | number, format?: 'currency' | 'percent' | 'number' | 'text' | 'date'): string {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value === 'string' && value.startsWith('#')) return value;

  switch (format) {
    case 'currency': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(num)) return String(value);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
    }
    case 'percent': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(num)) return String(value);
      return `${num.toFixed(1)}%`;
    }
    case 'number': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(num)) return String(value);
      return num.toLocaleString();
    }
    default:
      return String(value);
  }
}
