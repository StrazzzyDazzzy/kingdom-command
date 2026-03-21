import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  target: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  inView: boolean;
}

function AnimatedNumber({ target, suffix = '', prefix = '', duration = 1200, inView }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(prefix + '0' + suffix);

  const animate = useCallback(() => {
    const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPart)) {
      setDisplay(prefix + target + suffix);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericPart;
      const formatted = target.includes('.')
        ? current.toFixed(target.split('.')[1]?.replace(/[^0-9]/g, '').length || 0)
        : Math.round(current).toString();
      setDisplay(prefix + formatted + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, suffix, prefix, duration]);

  useEffect(() => {
    if (inView) animate();
  }, [inView, animate]);

  return <span>{display}</span>;
}

const STATS = [
  { value: '21', suffix: 'x', label: 'More likely to close with fast follow-up', icon: '⚡' },
  { value: '35', suffix: '%', label: 'Revenue lost to slow response times', icon: '📉' },
  { value: '55', suffix: '%', label: 'Of reps miss quota every quarter', icon: '🎯' },
];

export default function RevenueLeakage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Revenue leakage statistics"
      className="py-24 relative"
    >
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your Revenue Is <span className="text-[hsl(var(--critical))]">Leaking</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every hour without AI automation costs you deals. Here's what the data says.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-[hsl(var(--gold))]">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
