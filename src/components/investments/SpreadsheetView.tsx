import { useState, useCallback, useRef, useEffect } from 'react';
import { evaluateFormula, formatCellValue } from '@/lib/formulaEngine';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search, Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column {
  key: string;
  label: string;
  width?: number;
  format?: 'currency' | 'percent' | 'number' | 'text' | 'date';
}

interface SpreadsheetViewProps {
  title: string;
  columns: Column[];
  initialData: Record<string, string | number>[];
  summaryFields?: Record<string, { formula: string; format?: Column['format'] }>;
  onCellChange?: (rowIdx: number, colKey: string, value: string | number) => void;
  className?: string;
}

export function SpreadsheetView({ title, columns, initialData, summaryFields, onCellChange, className }: SpreadsheetViewProps) {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [formulaBar, setFormulaBar] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const startEdit = useCallback((rowIdx: number, colKey: string) => {
    const val = data[rowIdx]?.[colKey];
    const strVal = val !== undefined && val !== null ? String(val) : '';
    setEditingCell({ row: rowIdx, col: colKey });
    setEditValue(strVal);
    setFormulaBar(strVal);
  }, [data]);

  const commitEdit = useCallback(() => {
    if (!editingCell) return;
    const { row, col } = editingCell;
    const newData = [...data];
    let finalValue: string | number = editValue;

    if (editValue.startsWith('=')) {
      // Build grid for formula eval
      const grid = newData.map(r => columns.map(c => r[c.key] ?? ''));
      const result = evaluateFormula(editValue, grid as (string | number)[][]);
      finalValue = result;
    } else {
      const num = parseFloat(editValue.replace(/[$,]/g, ''));
      if (!isNaN(num) && editValue.trim() !== '') finalValue = num;
    }

    newData[row] = { ...newData[row], [col]: finalValue };
    setData(newData);
    setEditingCell(null);
    setFormulaBar('');
    onCellChange?.(row, col, finalValue);
  }, [editingCell, editValue, data, columns, onCellChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { commitEdit(); }
    else if (e.key === 'Escape') { setEditingCell(null); setFormulaBar(''); }
    else if (e.key === 'Tab') { e.preventDefault(); commitEdit(); }
  }, [commitEdit]);

  const addRow = useCallback(() => {
    const newRow: Record<string, string | number> = {};
    columns.forEach(c => { newRow[c.key] = ''; });
    setData([...data, newRow]);
  }, [data, columns]);

  const deleteRow = useCallback((idx: number) => {
    setData(data.filter((_, i) => i !== idx));
    setSelectedRow(null);
  }, [data]);

  const filteredIndices = data.map((row, i) => {
    if (!searchTerm) return i;
    const match = Object.values(row).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
    return match ? i : -1;
  }).filter(i => i !== -1);

  // Compute summary row
  const summaryRow: Record<string, string> = {};
  if (summaryFields) {
    const grid = data.map(r => columns.map(c => r[c.key] ?? ''));
    Object.entries(summaryFields).forEach(([key, { formula, format }]) => {
      const result = evaluateFormula(formula, grid as (string | number)[][]);
      summaryRow[key] = formatCellValue(result, format);
    });
  }

  const exportCSV = useCallback(() => {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row => columns.map(c => {
      const v = row[c.key];
      return typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v ?? '');
    }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, columns, title]);

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-7 w-40 pl-7 text-xs bg-secondary border-0"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addRow} title="Add row">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={exportCSV} title="Export CSV">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Formula bar */}
      {editingCell && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-1 bg-secondary/50">
          <span className="text-[10px] font-mono text-muted-foreground w-12">
            {String.fromCharCode(65 + columns.findIndex(c => c.key === editingCell.col))}{editingCell.row + 1}
          </span>
          <span className="text-xs font-mono text-foreground">{formulaBar}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-secondary">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-8">#</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                  style={{ minWidth: col.width ?? 120 }}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-2 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {filteredIndices.map(rowIdx => (
              <tr
                key={rowIdx}
                className={cn(
                  'border-b border-border/50 transition-colors hover:bg-accent/30 cursor-pointer',
                  selectedRow === rowIdx && 'bg-accent/50'
                )}
                onClick={() => setSelectedRow(rowIdx === selectedRow ? null : rowIdx)}
              >
                <td className="px-2 py-1.5 text-muted-foreground font-mono">{rowIdx + 1}</td>
                {columns.map(col => {
                  const isEditing = editingCell?.row === rowIdx && editingCell?.col === col.key;
                  const rawValue = data[rowIdx][col.key];
                  const displayValue = formatCellValue(rawValue, col.format);

                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-1.5 font-mono',
                        isEditing && 'p-0',
                        col.format === 'currency' && 'text-right',
                        col.format === 'percent' && 'text-right',
                        col.format === 'number' && 'text-right',
                      )}
                      onDoubleClick={() => startEdit(rowIdx, col.key)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={e => { setEditValue(e.target.value); setFormulaBar(e.target.value); }}
                          onKeyDown={handleKeyDown}
                          onBlur={commitEdit}
                          className="w-full h-full px-3 py-1.5 bg-ring/20 text-foreground outline-none border border-ring font-mono text-xs"
                        />
                      ) : (
                        <span className={cn(
                          typeof rawValue === 'number' && rawValue < 0 && 'text-[hsl(var(--critical))]',
                          typeof rawValue === 'number' && rawValue > 0 && col.format === 'currency' && 'text-[hsl(var(--success))]'
                        )}>
                          {displayValue || '—'}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-1.5">
                  {selectedRow === rowIdx && (
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-[hsl(var(--critical))]" onClick={e => { e.stopPropagation(); deleteRow(rowIdx); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Summary */}
          {Object.keys(summaryRow).length > 0 && (
            <tfoot>
              <tr className="bg-secondary/80 border-t-2 border-border font-semibold">
                <td className="px-2 py-2 text-muted-foreground">Σ</td>
                {columns.map(col => (
                  <td key={col.key} className={cn('px-3 py-2 font-mono', (col.format === 'currency' || col.format === 'number' || col.format === 'percent') && 'text-right')}>
                    {summaryRow[col.key] || ''}
                  </td>
                ))}
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
