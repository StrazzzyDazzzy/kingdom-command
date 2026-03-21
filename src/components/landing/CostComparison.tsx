import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ROWS = [
  { feature: 'Lead Qualification', manual: '4-6 hours/day', leepAi: 'Instant, 24/7', savings: '95%' },
  { feature: 'Follow-Up Emails', manual: '2-3 hours/day', leepAi: 'Automated', savings: '100%' },
  { feature: 'Meeting Scheduling', manual: '45 min/day', leepAi: 'Zero-touch', savings: '100%' },
  { feature: 'CRM Updates', manual: '1 hour/day', leepAi: 'Real-time sync', savings: '100%' },
  { feature: 'Pipeline Forecasting', manual: 'Weekly guesswork', leepAi: 'AI-powered daily', savings: '90%' },
  { feature: 'Cost per SDR', manual: '$65,000/year', leepAi: '$497/month', savings: '91%' },
];

export default function CostComparison() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Cost comparison"
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
            Manual vs. <span className="text-[hsl(var(--gold))]">Leep AI</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            See exactly where AI automation saves your team time and money.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 text-sm font-semibold">Feature</th>
                <th className="py-3 px-4 text-sm font-semibold text-muted-foreground">Manual Process</th>
                <th className="py-3 px-4 text-sm font-semibold text-[hsl(var(--gold))]">Leep AI</th>
                <th className="py-3 px-4 text-sm font-semibold text-[hsl(var(--success))]">Time Saved</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  className="border-b border-border/50 hover:bg-[hsl(var(--accent)/0.5)] transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <td className="py-4 px-4 text-sm font-medium">{row.feature}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{row.manual}</td>
                  <td className="py-4 px-4 text-sm text-[hsl(var(--gold))]">{row.leepAi}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex rounded-full bg-[hsl(var(--success)/0.12)] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--success))]">
                      {row.savings}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
