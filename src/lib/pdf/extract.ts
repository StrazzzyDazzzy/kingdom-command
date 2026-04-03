import { supabase } from '@/integrations/supabase/client';

/**
 * Extract text from a PDF file using the browser's FileReader.
 * We read the raw bytes and do a lightweight text extraction
 * by scanning for text stream operators in the PDF binary.
 * For production, this should be replaced with a server-side
 * extraction using pdf-parse or Claude API.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        const text = extractTextFromBytes(bytes);
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Lightweight client-side PDF text extraction.
 * Scans for text between BT/ET operators and Tj/TJ commands.
 * This is a best-effort extraction — complex PDFs may need server-side parsing.
 */
function extractTextFromBytes(bytes: Uint8Array): string {
  const raw = new TextDecoder('latin1').decode(bytes);
  const textParts: string[] = [];

  // Extract text from PDF stream content between BT and ET markers
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match: RegExpExecArray | null;

  while ((match = btEtRegex.exec(raw)) !== null) {
    const block = match[1];

    // Match Tj operator (show text string)
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textParts.push(tjMatch[1]);
    }

    // Match TJ operator (show text array)
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
    let tjArrayMatch: RegExpExecArray | null;
    while ((tjArrayMatch = tjArrayRegex.exec(block)) !== null) {
      const arrayContent = tjArrayMatch[1];
      const stringRegex = /\(([^)]*)\)/g;
      let strMatch: RegExpExecArray | null;
      while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
        textParts.push(strMatch[1]);
      }
    }
  }

  // Clean up extracted text
  const text = textParts
    .join(' ')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text || '(No text could be extracted from this PDF. Server-side extraction recommended.)';
}

/**
 * Update the parsed_text field for a document in the database.
 */
export async function saveExtractedText(documentId: string, parsedText: string): Promise<void> {
  const { error } = await supabase
    .from('investment_documents')
    .update({ parsed_text: parsedText } as Record<string, unknown>)
    .eq('id', documentId);
  if (error) throw error;
}

/**
 * Count approximate pages from PDF bytes by counting /Type /Page entries.
 */
export function estimatePageCount(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = new TextDecoder('latin1').decode(reader.result as ArrayBuffer);
        const pageMatches = raw.match(/\/Type\s*\/Page[^s]/g);
        resolve(pageMatches ? pageMatches.length : 0);
      } catch {
        resolve(0);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
