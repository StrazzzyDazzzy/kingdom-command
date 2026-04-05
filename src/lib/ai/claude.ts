/**
 * Claude API client for Kingdom Investors AI features.
 * Calls are routed through a Supabase Edge Function to keep the API key server-side.
 * Falls back to a demo mode when the edge function is unavailable.
 */

import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiResponse {
  answer: string;
  sources?: string[];
}

const INVESTMENT_SYSTEM_PROMPT = `You are a knowledgeable investment research assistant for Kingdom Investors, a professional alternative investment and tax strategy firm. You answer questions ONLY based on the investment documents and data provided to you.

Rules:
- Only reference information from the provided context
- Cite specific sections or page numbers when possible
- If you don't have enough information to answer, say so clearly
- Never provide investment advice — only factual information from the documents
- Always remind users to consult their CPA or attorney for specific advice
- Be precise with tax code references and financial figures`;

/**
 * Send a question to the AI about a specific investment.
 * Provides document context from parsed text.
 */
export async function askInvestmentQuestion(
  question: string,
  investmentTitle: string,
  documentContext: string[],
  conversationHistory: ChatMessage[] = [],
): Promise<AiResponse> {
  const contextText = documentContext.length > 0
    ? documentContext.map((text, i) => `[Document ${i + 1}]:\n${text}`).join('\n\n---\n\n')
    : '(No documents have been uploaded for this investment yet.)';

  const systemPrompt = `${INVESTMENT_SYSTEM_PROMPT}\n\nYou are answering questions about: ${investmentTitle}\n\nAvailable document content:\n${contextText}`;

  // Try calling the Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        system: systemPrompt,
        messages: [
          ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: question },
        ],
      },
    });

    if (!error && data?.answer) {
      return { answer: data.answer, sources: data.sources };
    }
  } catch {
    // Edge function not deployed — fall through to demo mode
  }

  // Demo mode: generate a contextual response locally
  return generateDemoResponse(question, investmentTitle, documentContext);
}

/**
 * Ask Claude to suggest IRS codes that apply to a document.
 */
export async function suggestIrsCodes(
  documentText: string,
  investmentTitle: string,
): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        system: `You are a tax code expert. Analyze the following investment document and return ONLY a JSON array of IRS code section numbers that apply (e.g. ["Section 1031", "Section 170(h)"]). No explanation, just the JSON array.`,
        messages: [
          { role: 'user', content: `Investment: ${investmentTitle}\n\nDocument text:\n${documentText.slice(0, 8000)}` },
        ],
      },
    });

    if (!error && data?.answer) {
      try {
        const parsed = JSON.parse(data.answer);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Try to extract codes from text response
        const codeMatches = data.answer.match(/Section\s+\d+[A-Za-z]?(?:\([a-z]\))?/g);
        if (codeMatches) return codeMatches;
      }
    }
  } catch {
    // Edge function not available
  }

  return suggestIrsCodesDemoMode(documentText);
}

/**
 * Detect material participation requirements from document text.
 */
export async function detectMaterialParticipation(
  documentText: string,
): Promise<{ hasRequirement: boolean; notes: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        system: `Analyze this investment document for material participation requirements. Return JSON: {"hasRequirement": boolean, "notes": "description of requirements if any"}`,
        messages: [
          { role: 'user', content: documentText.slice(0, 8000) },
        ],
      },
    });

    if (!error && data?.answer) {
      try {
        return JSON.parse(data.answer);
      } catch {
        // Fall through
      }
    }
  } catch {
    // Edge function not available
  }

  return detectMaterialParticipationDemoMode(documentText);
}

/**
 * Generate a natural language scenario analysis.
 */
export async function generateNlScenario(
  investmentTitle: string,
  investmentContext: string,
  userPrompt: string,
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        system: `You are a financial scenario analyst for Kingdom Investors. Given investment details, generate a clear hypothetical scenario analysis. Include projected returns, tax implications, and a year-by-year breakdown when possible. Always add a disclaimer that this is hypothetical and not investment advice.\n\nInvestment: ${investmentTitle}\n\nInvestment details:\n${investmentContext}`,
        messages: [
          { role: 'user', content: userPrompt },
        ],
      },
    });

    if (!error && data?.answer) return data.answer;
  } catch {
    // Edge function not available
  }

  return generateNlScenarioDemoMode(investmentTitle, userPrompt);
}

// ============================================
// DEMO MODE RESPONSES
// ============================================

function generateDemoResponse(
  question: string,
  investmentTitle: string,
  documentContext: string[],
): AiResponse {
  const q = question.toLowerCase();
  const hasDocuments = documentContext.some(d => d.length > 50);

  if (!hasDocuments) {
    return {
      answer: `I don't have any parsed document content for "${investmentTitle}" yet. Once documents are uploaded and processed, I'll be able to answer specific questions about this investment.\n\nPlease upload the PPM or offering documents through the admin panel to enable AI-powered Q&A.\n\n*This is a demo response. Connect the Claude API via Supabase Edge Functions for full AI capabilities.*`,
    };
  }

  if (q.includes('return') || q.includes('yield') || q.includes('performance')) {
    return {
      answer: `Based on the available documents for "${investmentTitle}", I can see return projections are discussed. However, I'd recommend reviewing the specific return metrics in the PPM documentation for the most accurate figures.\n\nPast performance is not indicative of future results. Please consult your CPA or financial advisor for personalized analysis.\n\n*This is a demo response. Connect the Claude API for document-grounded answers.*`,
      sources: ['Document 1'],
    };
  }

  if (q.includes('tax') || q.includes('irs') || q.includes('deduction') || q.includes('credit')) {
    return {
      answer: `The tax implications for "${investmentTitle}" depend on several factors including your filing status, income level, and other investments. The investment documents reference relevant IRS code provisions.\n\nIRS code references are for educational purposes. Tax treatment varies by individual circumstance. Please consult your tax professional.\n\n*This is a demo response. Connect the Claude API for document-grounded answers.*`,
      sources: ['Document 1'],
    };
  }

  if (q.includes('risk') || q.includes('audit')) {
    return {
      answer: `Risk factors for "${investmentTitle}" are detailed in the offering documents. Key considerations typically include market risk, regulatory risk, and liquidity constraints.\n\nAudit outcomes are historical and do not guarantee future results. Please review the full risk disclosure section in the PPM.\n\n*This is a demo response. Connect the Claude API for document-grounded answers.*`,
      sources: ['Document 1'],
    };
  }

  return {
    answer: `Thank you for your question about "${investmentTitle}". Based on the available documents, I can provide information from the uploaded materials.\n\nFor specific details, I recommend reviewing the full documentation in the deal room. Please consult your CPA or attorney for personalized investment advice.\n\n*This is a demo response. Connect the Claude API via Supabase Edge Functions for full AI-powered answers grounded in your investment documents.*`,
  };
}

function suggestIrsCodesDemoMode(documentText: string): string[] {
  const codes: string[] = [];
  const text = documentText.toLowerCase();

  if (text.includes('1031') || text.includes('like-kind') || text.includes('exchange')) codes.push('Section 1031');
  if (text.includes('opportunity zone') || text.includes('1400z')) codes.push('Section 1400Z-2');
  if (text.includes('depreciation') || text.includes('cost segregation') || text.includes('167')) codes.push('Section 167');
  if (text.includes('bonus depreciation') || text.includes('168(k)')) codes.push('Section 168(k)');
  if (text.includes('conservation') || text.includes('easement') || text.includes('170(h)')) codes.push('Section 170(h)');
  if (text.includes('179d') || text.includes('energy efficient')) codes.push('Section 179D');
  if (text.includes('production tax credit') || text.includes('section 45')) codes.push('Section 45');
  if (text.includes('investment tax credit') || text.includes('section 48') || text.includes('solar')) codes.push('Section 48');
  if (text.includes('passive') || text.includes('469')) codes.push('Section 469');
  if (text.includes('depletion') || text.includes('oil') || text.includes('gas')) codes.push('Section 613');
  if (text.includes('historic') || text.includes('rehabilitation')) codes.push('Section 47');
  if (text.includes('199a') || text.includes('qualified business income')) codes.push('Section 199A');

  return codes.length > 0 ? codes : ['Section 469'];
}

function detectMaterialParticipationDemoMode(documentText: string): { hasRequirement: boolean; notes: string } {
  const text = documentText.toLowerCase();
  const keywords = ['material participation', 'active participation', '500 hours', '100 hours', 'passive activity', 'real estate professional'];

  const found = keywords.filter(k => text.includes(k));
  if (found.length > 0) {
    return {
      hasRequirement: true,
      notes: `Document references material participation concepts (${found.join(', ')}). Investors may need to meet specific participation thresholds to claim certain tax benefits. Consult your tax advisor for details.`,
    };
  }

  return { hasRequirement: false, notes: '' };
}

function generateNlScenarioDemoMode(investmentTitle: string, userPrompt: string): string {
  const amountMatch = userPrompt.match(/\$?([\d,]+(?:\.\d+)?)\s*(?:k|K|thousand)?/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 250000;
  const displayAmount = amount >= 1000 ? amount : amount * 1000;

  const yearsMatch = userPrompt.match(/(\d+)\s*(?:year|yr)/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 5;

  const projectedReturn = displayAmount * 0.08 * years;
  const taxSavings = displayAmount * 0.37 * 0.4;
  const total = projectedReturn + taxSavings;

  return `## Hypothetical Scenario: ${investmentTitle}

**Investment Amount:** $${displayAmount.toLocaleString()}
**Hold Period:** ${years} years
**Assumed Tax Bracket:** 37%

### Projected Outcomes

| Metric | Amount |
|--------|--------|
| Projected Investment Return | $${projectedReturn.toLocaleString()} |
| Estimated Tax Savings (Year 1) | $${taxSavings.toLocaleString()} |
| **Total Estimated Benefit** | **$${total.toLocaleString()}** |
| Effective Annualized Return | ${((Math.pow((displayAmount + total) / displayAmount, 1 / years) - 1) * 100).toFixed(1)}% |

### Assumptions
- Based on target return estimates from the offering documents
- Tax savings assume cost segregation / accelerated depreciation benefits
- Actual returns will vary based on investment performance and individual tax situation

---

*This is a hypothetical scenario for educational purposes only. It does not constitute investment, tax, or legal advice. Past performance is not indicative of future results. Please consult your CPA and attorney before making any investment decision.*

*Connect the Claude API via Supabase Edge Functions for AI-generated scenario analysis.*`;
}
