/**
 * Document chunking pipeline for semantic search.
 * Splits document text into overlapping chunks suitable for embedding.
 * In production, embeddings would be generated via OpenAI or a similar API
 * and stored in pgvector for semantic retrieval.
 */

export interface DocumentChunk {
  text: string;
  index: number;
  startChar: number;
  endChar: number;
  metadata: {
    documentId: string;
    investmentId: string;
    fileName: string;
  };
}

const DEFAULT_CHUNK_SIZE = 1500;
const DEFAULT_OVERLAP = 200;

/**
 * Split document text into overlapping chunks for embedding.
 */
export function chunkDocument(
  text: string,
  metadata: { documentId: string; investmentId: string; fileName: string },
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP,
): DocumentChunk[] {
  if (!text || text.trim().length === 0) return [];

  const chunks: DocumentChunk[] = [];
  const sentences = splitIntoSentences(text);
  let currentChunk = '';
  let startChar = 0;
  let charPos = 0;

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        index: chunks.length,
        startChar,
        endChar: charPos,
        metadata,
      });

      // Keep overlap from the end of current chunk
      const overlapText = currentChunk.slice(-overlap);
      startChar = charPos - overlapText.length;
      currentChunk = overlapText;
    }
    currentChunk += sentence;
    charPos += sentence.length;
  }

  // Add final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunks.length,
      startChar,
      endChar: charPos,
      metadata,
    });
  }

  return chunks;
}

/**
 * Split text into sentences, preserving whitespace.
 */
function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) ?? [text];
}

/**
 * Simple keyword-based search across chunks (used as fallback when pgvector is unavailable).
 * Returns chunks ranked by keyword frequency.
 */
export function searchChunks(chunks: DocumentChunk[], query: string, topK = 5): DocumentChunk[] {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const scored = chunks.map(chunk => {
    const lowerText = chunk.text.toLowerCase();
    let score = 0;
    for (const token of queryTokens) {
      const matches = lowerText.split(token).length - 1;
      score += matches;
    }
    // Boost exact phrase matches
    if (lowerText.includes(query.toLowerCase())) {
      score += 10;
    }
    return { chunk, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}

/**
 * Get relevant context from document chunks for a question.
 * Combines keyword search with a character limit for the context window.
 */
export function getRelevantContext(
  chunks: DocumentChunk[],
  question: string,
  maxChars = 6000,
): string[] {
  const relevant = searchChunks(chunks, question, 10);

  const contextParts: string[] = [];
  let totalChars = 0;

  for (const chunk of relevant) {
    if (totalChars + chunk.text.length > maxChars) break;
    contextParts.push(chunk.text);
    totalChars += chunk.text.length;
  }

  return contextParts;
}
