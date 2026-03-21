import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  {
    step: '01',
    title: 'Connect Your Stack',
    description: 'Plug in your CRM, email, and calendar in under 10 minutes. No code required.',
    color: 'var(--ai-agents)',
  },
  {
    step: '02',
    title: 'AI Agents Deploy',
    description: 'Our agents start qualifying leads, booking meetings, and following up — 24/7.',
    color: 'var(--gold)',
  },
  {
    step: '03',
    title: 'Revenue Accelerates',
    description: 'Watch your pipeline grow as AI handles the repetitive work your team used to do.',
    color: 'var(--purple)',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="how-it-works"
      role="region"
      aria-label="How it works"
      className="py-24"
    >
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How <span className="text-[hsl(var(--gold))]">Leep AI</span> Works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Three simple steps to transform your revenue operations.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className="relative glass rounded-2xl p-8 text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 font-mono text-xl font-bold"
                style={{
                  background: `hsl(${s.color} / 0.12)`,
                  color: `hsl(${s.color})`,
                }}
              >
                {s.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>

              {/* Connector line between steps on md+ */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
