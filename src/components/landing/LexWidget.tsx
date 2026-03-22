import { useState } from 'react';
import { Mic, X, MessageCircle } from 'lucide-react';

/**
 * Lex Voice AI Widget
 *
 * This is the Lex voice AI floating widget. It provides a voice-first
 * AI assistant interface. The widget can be connected to Amazon Lex,
 * a custom voice API, or any conversational AI backend.
 *
 * DO NOT MODIFY this component without explicit permission.
 */
export function LexWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lex-widget-trigger"
          aria-label="Talk to Lex AI"
        >
          <MessageCircle className="h-7 w-7 text-background" />
        </button>
      )}

      {/* Expanded widget panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 animate-slide-in">
          <div className="rounded-2xl overflow-hidden glass-strong shadow-2xl shadow-black/30">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-ai/10 to-transparent border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai to-ai/60 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-background" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Lex</p>
                  <p className="text-xs text-muted-foreground">Voice AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); setIsListening(false); }}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Chat area */}
            <div className="p-5 min-h-[280px] flex flex-col">
              {/* Welcome message */}
              <div className="mb-4">
                <div className="inline-block bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                  <p className="text-sm leading-relaxed">
                    Hey! I'm <span className="font-semibold text-ai">Lex</span>, your Kingdom Command AI assistant.
                    I can help you learn about our services, book a strategy call, or answer any questions.
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1 ml-1">Just now</p>
              </div>

              <div className="flex-1" />

              {/* Voice/text input area */}
              <div className="space-y-3">
                {/* Listening indicator */}
                {isListening && (
                  <div className="flex items-center justify-center gap-1 py-3">
                    <div className="flex items-end gap-1 h-8">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-ai rounded-full"
                          style={{
                            height: '100%',
                            animation: `pulse-glow ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                            maxHeight: `${12 + Math.random() * 20}px`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-ai ml-2">Listening...</span>
                  </div>
                )}

                {/* Input controls */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-ai/50 transition-colors"
                  />
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                      isListening
                        ? 'bg-ai text-background shadow-lg shadow-ai/30'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground/70'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-[10px] text-center text-muted-foreground/40">
                  Powered by Kingdom Command AI
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
