import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PILLARS = [
  {
    title: 'Lead Qualification',
    color: 'var(--ai-agents)',
    agents: [
      { name: 'Intent Scorer', desc: 'Ranks leads by buying signals in real-time' },
      { name: 'Fit Analyzer', desc: 'Matches prospects to your ICP automatically' },
      { name: 'Enrichment Bot', desc: 'Pulls firmographic data from 50+ sources' },
    ],
  },
  {
    title: 'Pipeline Automation',
    color: 'var(--gold)',
    agents: [
      { name: 'Follow-Up Agent', desc: 'Sends personalized sequences at the right moment' },
      { name: 'Meeting Booker', desc: 'Handles scheduling without the back-and-forth' },
      { name: 'Deal Tracker', desc: 'Updates CRM fields so your data stays clean' },
    ],
  },
  {
    title: 'Revenue Intelligence',
    color: 'var(--purple)',
    agents: [
      { name: 'Forecast AI', desc: 'Predicts close probability with 90%+ accuracy' },
      { name: 'Churn Detector', desc: 'Flags at-risk accounts before they leave' },
      { name: 'Win/Loss Analyst', desc: 'Learns from every deal to optimize your playbook' },
    ],
  },
];

export default function AIAgentsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="agents"
      role="region"
      aria-label="AI Agents"
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
            Your AI <span className="text-[hsl(var(--gold))]">Agent Army</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Nine specialized agents working together to maximize every revenue opportunity.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {PILLARS.map((pillar, pi) => (
            <motion.div
              key={pillar.title}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: pi * 0.15 }}
            >
              <h3
                className="text-lg font-semibold mb-5 pb-3 border-b"
                style={{ borderColor: `hsl(${pillar.color} / 0.3)`, color: `hsl(${pillar.color})` }}
              >
                {pillar.title}
              </h3>
              <ul className="space-y-4">
                {pillar.agents.map((agent, ai) => (
                  <motion.li
                    key={agent.name}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: -15 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: pi * 0.15 + ai * 0.1 + 0.3 }}
                  >
                    <div
                      className="mt-1 h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: `hsl(${pillar.color})` }}
                    />
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
