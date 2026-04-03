import jsPDF from 'jspdf';
import type { Investment, InvestmentDocument, InvestmentAudit, IrsCode } from '@/types/dataroom';
import { CATEGORY_LABELS } from '@/types/dataroom';

interface PacketData {
  investment: Investment;
  documents: InvestmentDocument[];
  audits: InvestmentAudit[];
  irsCodes: IrsCode[];
  clientName: string;
}

/**
 * Generate a branded "Send to CPA/Attorney" PDF packet
 * containing investment summary, IRS codes, audit history, and document list.
 */
export function generateAdvisorPacket(data: PacketData): void {
  const { investment, documents, audits, irsCodes, clientName } = data;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

  const PAGE_WIDTH = 612;
  const MARGIN = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
  let y = 50;

  const NAVY = [10, 22, 40] as const;
  const GOLD = [201, 168, 76] as const;
  const SLATE = [107, 123, 141] as const;
  const WHITE = [244, 241, 236] as const;

  function addPage() {
    doc.addPage();
    y = 50;
  }

  function checkPage(needed: number) {
    if (y + needed > 720) addPage();
  }

  // ==============================
  // HEADER
  // ==============================
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 120, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Kingdom Investors', MARGIN, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GOLD);
  doc.text('Investment Data Room — Advisor Packet', MARGIN, 70);

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(9);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Prepared for: ${clientName}  |  ${date}`, MARGIN, 95);

  y = 145;

  // ==============================
  // INVESTMENT SUMMARY
  // ==============================
  doc.setTextColor(...NAVY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(investment.title, MARGIN, y);
  y += 20;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE);
  doc.text(`Category: ${CATEGORY_LABELS[investment.category]}  |  Status: ${investment.status.replace('_', ' ').toUpperCase()}`, MARGIN, y);
  y += 25;

  // Key metrics
  const metrics: [string, string][] = [];
  if (investment.minimum_investment) metrics.push(['Minimum Investment', `$${investment.minimum_investment.toLocaleString()}`]);
  if (investment.target_return) metrics.push(['Target Return', investment.target_return]);
  if (investment.hold_period) metrics.push(['Hold Period', investment.hold_period]);

  if (metrics.length > 0) {
    doc.setFillColor(245, 245, 242);
    doc.roundedRect(MARGIN, y - 5, CONTENT_WIDTH, 20 * metrics.length + 15, 4, 4, 'F');
    y += 10;
    for (const [label, value] of metrics) {
      doc.setTextColor(...SLATE);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(label, MARGIN + 10, y);
      doc.setTextColor(...NAVY);
      doc.setFont('helvetica', 'bold');
      doc.text(value, MARGIN + 180, y);
      y += 18;
    }
    y += 10;
  }

  // Description
  if (investment.short_description) {
    checkPage(60);
    doc.setTextColor(...NAVY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(investment.short_description, CONTENT_WIDTH);
    doc.text(lines, MARGIN, y);
    y += lines.length * 14 + 10;
  }

  // Tax strategy features
  const taxFeatures: string[] = [];
  if (investment.has_1031) taxFeatures.push('1031 Exchange Eligible');
  if (investment.has_qoz) taxFeatures.push('Qualified Opportunity Zone');
  if (investment.has_cost_seg) taxFeatures.push('Cost Segregation');
  if (investment.has_179d) taxFeatures.push('Section 179D');
  if (investment.has_section_45) taxFeatures.push('Section 45 PTC');
  if (investment.has_material_participation) taxFeatures.push('Material Participation Required');

  if (taxFeatures.length > 0) {
    checkPage(40);
    doc.setTextColor(...GOLD);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Strategy Features', MARGIN, y);
    y += 16;
    doc.setTextColor(...NAVY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(taxFeatures.join('  •  '), MARGIN, y);
    y += 20;
  }

  // Material participation
  if (investment.has_material_participation && investment.material_participation_notes) {
    checkPage(50);
    doc.setFillColor(255, 248, 230);
    const mpLines = doc.splitTextToSize(investment.material_participation_notes, CONTENT_WIDTH - 20);
    doc.roundedRect(MARGIN, y - 5, CONTENT_WIDTH, mpLines.length * 13 + 20, 4, 4, 'F');
    doc.setTextColor(180, 140, 40);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Material Participation Requirements', MARGIN + 10, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...NAVY);
    doc.text(mpLines, MARGIN + 10, y + 22);
    y += mpLines.length * 13 + 30;
  }

  // ==============================
  // IRS CODE REFERENCES
  // ==============================
  const relevantCodes = irsCodes.filter(code =>
    investment.irs_codes?.includes(code.code_number)
  );

  if (relevantCodes.length > 0) {
    checkPage(40 + relevantCodes.length * 40);
    doc.setTextColor(...GOLD);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('IRS Code References', MARGIN, y);
    y += 16;

    for (const code of relevantCodes) {
      checkPage(45);
      doc.setTextColor(...NAVY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${code.code_number} — ${code.title}`, MARGIN, y);
      y += 14;
      if (code.summary) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...SLATE);
        const summaryLines = doc.splitTextToSize(code.summary, CONTENT_WIDTH);
        doc.text(summaryLines, MARGIN, y);
        y += summaryLines.length * 12 + 8;
      }
    }
    y += 5;
  }

  // ==============================
  // AUDIT HISTORY
  // ==============================
  if (audits.length > 0) {
    checkPage(40 + audits.length * 25);
    doc.setTextColor(...GOLD);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit History', MARGIN, y);
    y += 16;

    for (const audit of audits) {
      checkPage(25);
      doc.setTextColor(...NAVY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${audit.audit_year} ${audit.audit_type.toUpperCase()} Audit`, MARGIN, y);
      doc.setFont('helvetica', 'normal');
      const outcomeText = audit.outcome ? ` — ${audit.outcome.replace('_', ' ')}` : '';
      const rateText = audit.success_rate_pct != null ? ` (${audit.success_rate_pct}% success rate)` : '';
      doc.text(`${outcomeText}${rateText}`, MARGIN + 160, y);
      y += 14;
      if (audit.auditor_firm) {
        doc.setTextColor(...SLATE);
        doc.text(`Firm: ${audit.auditor_firm}${audit.notes ? ` — ${audit.notes}` : ''}`, MARGIN, y);
        y += 14;
      }
    }
    y += 5;

    // Audit disclaimer
    doc.setTextColor(180, 140, 40);
    doc.setFontSize(7);
    doc.text('Audit outcomes are historical and do not guarantee future results.', MARGIN, y);
    y += 15;
  }

  // ==============================
  // DOCUMENT LIST
  // ==============================
  if (documents.length > 0) {
    checkPage(30 + documents.length * 18);
    doc.setTextColor(...GOLD);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Available Documents', MARGIN, y);
    y += 16;

    for (const d of documents) {
      checkPage(18);
      doc.setTextColor(...NAVY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const sizeText = d.file_size ? ` (${(d.file_size / 1024 / 1024).toFixed(1)} MB)` : '';
      doc.text(`• ${d.file_name}${sizeText}`, MARGIN, y);
      y += 14;
    }
    y += 10;
  }

  // ==============================
  // FOOTER DISCLAIMER
  // ==============================
  checkPage(60);
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 15;

  doc.setTextColor(...SLATE);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'This material is for informational purposes only and does not constitute investment, tax, or legal advice. Past performance is not indicative of future results. Please consult your attorney and CPA before making any investment decision. IRS code references are for educational purposes. Tax treatment varies by individual circumstance.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, CONTENT_WIDTH);
  doc.text(disclaimerLines, MARGIN, y);
  y += disclaimerLines.length * 10 + 10;

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.text('POSFER Plus LLC d/b/a Kingdom Investors — Confidential', MARGIN, y);

  // Save
  const fileName = `Kingdom-Investors-${investment.slug}-advisor-packet.pdf`;
  doc.save(fileName);
}
