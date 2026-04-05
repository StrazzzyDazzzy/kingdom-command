import { useState, useRef, useEffect } from 'react';
import { askInvestmentQuestion, type ChatMessage } from '@/lib/ai/claude';
import { chunkDocument, getRelevantContext, type DocumentChunk } from '@/lib/ai/chunker';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { MessageSquare, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import type { Investment, InvestmentDocument } from '@/types/dataroom';

interface InvestmentChatProps {
  investment: Investment;
  documents: InvestmentDocument[];
}

export function InvestmentChat({ investment, documents }: InvestmentChatProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build document chunks on mount
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  useEffect(() => {
    const allChunks: DocumentChunk[] = [];
    for (const doc of documents) {
      if (doc.parsed_text && doc.parsed_text.length > 50) {
        const docChunks = chunkDocument(doc.parsed_text, {
          documentId: doc.id,
          investmentId: investment.id,
          fileName: doc.file_name,
        });
        allChunks.push(...docChunks);
      }
    }
    setChunks(allChunks);
  }, [documents, investment.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Get relevant context from chunked documents
      const contextParts = chunks.length > 0
        ? getRelevantContext(chunks, q)
        : documents
            .filter(d => d.parsed_text && d.parsed_text.length > 50)
            .map(d => d.parsed_text!.slice(0, 3000));

      const response = await askInvestmentQuestion(
        q,
        investment.title,
        contextParts,
        messages.slice(-10), // Last 10 messages for conversation context
      );

      const assistantMsg: ChatMessage = { role: 'assistant', content: response.answer };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error processing your question. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    `What are the key risk factors for ${investment.title}?`,
    'What tax benefits does this investment offer?',
    'What is the minimum investment and hold period?',
    'Does this require material participation?',
  ];

  return (
    <div className="space-y-4">
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            Ask About This Investment
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            AI-powered Q&A grounded in {documents.filter(d => d.parsed_text).length} parsed document{documents.filter(d => d.parsed_text).length !== 1 ? 's' : ''}
            {chunks.length > 0 && ` (${chunks.length} indexed chunks)`}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* Chat Messages */}
          <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Ask anything about <strong>{investment.title}</strong>
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="text-xs rounded-full border border-border/50 px-3 py-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2.5 max-w-[80%] text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground'
                      }`}
                    >
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} className={j > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-lg bg-muted/50 px-4 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border/50 p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this investment..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Disclaimer variant="ai" />
    </div>
  );
}
