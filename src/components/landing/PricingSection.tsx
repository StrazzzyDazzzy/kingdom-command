import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PLANS = [
  {
    name: 'Starter',
    price: '$497',
    period: '/mo',
    description: 'For teams getting started with AI automation',
    features: [
      '3 AI Agents',
      '1,000 lead actions/mo',
      'CRM integration',
      'Email sequences',
      'Basic analytics',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$1,497',
    period: '/mo',
    description: 'For scaling teams that need full pipeline coverage',
    features: [
      'All 9 AI Agents',
      '10,000 lead actions/mo',
      'All integrations',
      'Advanced analytics',
      'Custom playbooks',
      'Priority support',
    ],
    cta: 'Book a Demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with complex revenue operations',
    features: [
      'Unlimited agents & actions',
      'Custom AI training',
      'Dedicated success manager',
      'SLA guarantees',
      'SOC 2 compliance',
      'On-prem deployment option',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="pricing"
      role="region"
      aria-label="Pricing"
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
            Simple, Transparent <span className="text-[hsl(var(--gold))]">Pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl p-8 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                plan.featured
                  ? 'glass-strong border-2 border-[hsl(var(--gold)/0.4)] shadow-[0_0_40px_hsl(var(--gold)/0.08)]'
                  : 'glass'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--gold))] px-4 py-1 text-xs font-semibold text-black">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6 mb-6">
                <span className="font-mono text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-[hsl(var(--success))] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`btn-interactive block w-full text-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  plan.featured
                    ? 'bg-[hsl(var(--gold))] text-black hover:shadow-[0_0_20px_hsl(var(--gold)/0.4)]'
                    : 'border border-border hover:bg-accent'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
