import { useState, useRef } from 'react';
import { Upload, FileText, FileSpreadsheet, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ParsedBooking {
  property_name: string;
  guest_name?: string;
  check_in: string;
  check_out: string;
  source: 'direct' | 'airbnb' | 'vrbo' | 'other';
  revenue: number;
  cleaning_fee?: number;
  platform_fee?: number;
  notes?: string;
}

interface BookingImporterProps {
  onImportComplete: () => void;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function detectSource(text: string): 'direct' | 'airbnb' | 'vrbo' | 'other' {
  const lower = text.toLowerCase();
  if (lower.includes('airbnb')) return 'airbnb';
  if (lower.includes('vrbo')) return 'vrbo';
  if (lower.includes('direct')) return 'direct';
  return 'other';
}

function parseCurrency(val: string): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[$,\s]/g, ''));
  return isNaN(num) ? 0 : num;
}

function parseCSVBookings(text: string): ParsedBooking[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const bookings: ParsedBooking[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

    const propertyName = row['property'] || row['propertyname'] || row['propertyaddress'] || row['listing'] || row['name'] || '';
    const checkIn = row['checkin'] || row['checkindate'] || row['arrival'] || row['startdate'] || row['start'] || '';
    const checkOut = row['checkout'] || row['checkoutdate'] || row['departure'] || row['enddate'] || row['end'] || '';
    
    if (!propertyName || !checkIn) continue;

    bookings.push({
      property_name: propertyName,
      guest_name: row['guest'] || row['guestname'] || row['name'] || undefined,
      check_in: checkIn,
      check_out: checkOut || checkIn,
      source: detectSource(row['source'] || row['channel'] || row['platform'] || ''),
      revenue: parseCurrency(row['revenue'] || row['total'] || row['amount'] || row['payout'] || '0'),
      cleaning_fee: parseCurrency(row['cleaningfee'] || row['cleaning'] || '0'),
      platform_fee: parseCurrency(row['platformfee'] || row['servicefee'] || row['fee'] || '0'),
      notes: row['notes'] || row['comments'] || undefined,
    });
  }
  return bookings;
}

async function parsePDFBookings(file: File): Promise<ParsedBooking[]> {
  // Send PDF to edge function for AI-powered extraction
  const formData = new FormData();
  formData.append('file', file);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/parse-booking-pdf`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to parse PDF');
  }

  const data = await res.json();
  return data.bookings || [];
}

export function BookingImporter({ onImportComplete }: BookingImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ParsedBooking[]>([]);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      let bookings: ParsedBooking[] = [];

      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        const text = await file.text();
        bookings = parseCSVBookings(text);
      } else if (file.name.endsWith('.pdf')) {
        bookings = await parsePDFBookings(file);
      } else {
        toast.error('Unsupported file type. Use CSV, Excel, or PDF.');
        setLoading(false);
        return;
      }

      if (bookings.length === 0) {
        toast.error('No bookings found in file. Check the format.');
      } else {
        setPreview(bookings);
        toast.success(`Found ${bookings.length} bookings`);
      }
    } catch (err) {
      toast.error('Error parsing file');
      console.error(err);
    }
    setLoading(false);
  };

  const importBookings = async () => {
    setLoading(true);
    try {
      const rows = preview.map(b => ({
        property_name: b.property_name,
        guest_name: b.guest_name || null,
        check_in: b.check_in,
        check_out: b.check_out,
        source: b.source,
        revenue: b.revenue,
        cleaning_fee: b.cleaning_fee || 0,
        platform_fee: b.platform_fee || 0,
        notes: b.notes || null,
        imported_from: fileName,
      }));

      const { error } = await supabase.from('bookings' as never).insert(rows as never);
      if (error) throw error;

      toast.success(`Imported ${preview.length} bookings`);
      setPreview([]);
      setFileName('');
      setIsOpen(false);
      onImportComplete();
    } catch (err) {
      toast.error('Failed to import bookings');
      console.error(err);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs h-7"
        onClick={() => setIsOpen(true)}
      >
        <Upload className="h-3 w-3" /> Import
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3 animate-slide-in">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">Import Bookings</h4>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setIsOpen(false); setPreview([]); }}>
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex gap-2">
        <input ref={fileRef} type="file" accept=".csv,.pdf,.xlsx" className="hidden" onChange={handleFile} />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs flex-1"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileSpreadsheet className="h-3 w-3" />}
          CSV / Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs flex-1"
          onClick={() => { fileRef.current?.setAttribute('accept', '.pdf'); fileRef.current?.click(); }}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />}
          PDF
        </Button>
      </div>

      {fileName && (
        <p className="text-xs text-muted-foreground truncate">📄 {fileName}</p>
      )}

      {preview.length > 0 && (
        <>
          <div className="max-h-[120px] overflow-auto text-xs space-y-1">
            {preview.slice(0, 5).map((b, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-border/30">
                <div>
                  <span className="font-medium">{b.property_name}</span>
                  <span className={cn(
                    'ml-2 text-[10px] px-1 rounded',
                    b.source === 'direct' ? 'bg-success/20 text-success' :
                    b.source === 'airbnb' ? 'bg-critical/20 text-critical' :
                    'bg-warning/20 text-warning'
                  )}>
                    {b.source}
                  </span>
                </div>
                <span className="font-mono">${b.revenue.toLocaleString()}</span>
              </div>
            ))}
            {preview.length > 5 && (
              <p className="text-muted-foreground text-center">+{preview.length - 5} more</p>
            )}
          </div>
          <Button size="sm" className="w-full text-xs" onClick={importBookings} disabled={loading}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            Import {preview.length} Bookings
          </Button>
        </>
      )}
    </div>
  );
}
