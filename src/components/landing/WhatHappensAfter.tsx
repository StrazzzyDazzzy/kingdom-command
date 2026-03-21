import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TIMELINE = [
  { day: 'Day 1', title: 'Kickoff Call', desc: 'Meet your success manager and map out your revenue workflow.' },
  { day: 'Day 2-3', title: 'Integration Setup', desc: 'Connect your CRM, email, and calendar. We handle the config.' },
  { day: 'Day 4-5', title: 'Agent Training', desc: 'AI agents learn your ICP, messaging, and qualification criteria.' },
  { day: 'Week 2', title: 'Soft Launch', desc: 'Agents start handling a portion of leads with human oversight.' },
  { day: 'Week 3+', title: 'Full Deployment', desc: 'All agents running autonomously. Your team focuses on closing.' },
];

export default function WhatHappensAfter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Onboarding timeline"
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
            What Happens <span className="text-[hsl(var(--gold))]">After You Sign Up</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            From kickoff to full deployment in under three weeks.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {TIMELINE.map((step, i) => (
              <motion.div
                key={step.day}
                className="relative pl-14"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                {/* Dot */}
                <div className="absolute left-[16px] top-1 w-4 h-4 rounded-full border-2 border-[hsl(var(--gold))] bg-background" />

                <div className="glass rounded-xl p-5">
                  <span className="text-xs font-mono font-semibold text-[hsl(var(--gold))] uppercase tracking-wider">
                    {step.day}
                  </span>
                  <h3 className="text-base font-semibold mt-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
