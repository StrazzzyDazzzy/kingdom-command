import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does it take to set up?',
    a: 'Most teams are fully onboarded in under 30 minutes. Our agents connect to your existing CRM and email tools with pre-built integrations — no engineering required.',
  },
  {
    q: 'Will AI replace my sales team?',
    a: 'No. Leep AI handles the repetitive tasks (qualifying, following up, scheduling) so your reps can focus on high-value conversations and closing deals.',
  },
  {
    q: 'What if the AI makes mistakes?',
    a: 'Our agents are trained on millions of sales interactions and include human-in-the-loop safeguards. You set the guardrails, and the AI operates within them.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We\'re SOC 2 Type II certified, all data is encrypted at rest and in transit, and we never use your data to train models for other customers.',
  },
  {
    q: 'Can I try it before committing?',
    a: 'Yes — every plan includes a 14-day free trial with full access to all features. No credit card required to start.',
  },
  {
    q: 'What integrations do you support?',
    a: 'Salesforce, HubSpot, Pipedrive, Gmail, Outlook, Google Calendar, Slack, and 30+ more. We also offer a REST API for custom integrations.',
  },
];

export default function ObjectionHandling() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      id="faq"
      role="region"
      aria-label="Frequently asked questions"
      className="py-24 bg-[hsl(var(--card))]"
    >
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked <span className="text-[hsl(var(--gold))]">Questions</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              className="glass rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
