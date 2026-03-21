import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

function useAnimatedNumber(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  const animating = useRef(false);

  useEffect(() => {
    if (animating.current) return;
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    animating.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animating.current = false;
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return display;
}

export default function ROICalculator() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [reps, setReps] = useState(5);
  const [avgDeal, setAvgDeal] = useState(10000);
  const [closePct, setClosePct] = useState(20);

  const currentRevenue = reps * avgDeal * (closePct / 100) * 12;
  const projectedRevenue = reps * avgDeal * ((closePct * 1.4) / 100) * 12;
  const additionalRevenue = projectedRevenue - currentRevenue;

  const animatedAdditional = useAnimatedNumber(additionalRevenue);

  return (
    <section
      ref={ref}
      id="roi"
      role="region"
      aria-label="ROI Calculator"
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
            Calculate Your <span className="text-[hsl(var(--gold))]">ROI</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            See how much additional revenue Leep AI can generate for your team.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of sales reps
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full accent-[hsl(var(--gold))]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span className="font-mono font-semibold text-foreground text-sm">{reps}</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Average deal size ($)
              </label>
              <input
                type="number"
                value={avgDeal}
                onChange={(e) => setAvgDeal(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-[hsl(var(--gold)/0.5)] focus:border-[hsl(var(--gold))] outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current close rate (%)
              </label>
              <input
                type="range"
                min={5}
                max={60}
                value={closePct}
                onChange={(e) => setClosePct(Number(e.target.value))}
                className="w-full accent-[hsl(var(--gold))]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5%</span>
                <span className="font-mono font-semibold text-foreground text-sm">{closePct}%</span>
                <span>60%</span>
              </div>
            </div>
          </div>

          {/* Result card with glassmorphism */}
          <div className="mt-8 glass-strong rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Projected additional annual revenue</p>
            <p className="font-mono text-4xl sm:text-5xl font-bold text-[hsl(var(--gold))]">
              ${animatedAdditional.toLocaleString()}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Based on a 40% improvement in close rate with AI automation
            </p>
          </div>

          <div className="mt-6 text-center">
            <a
              href="#cta"
              className="btn-interactive inline-flex items-center rounded-lg bg-[hsl(var(--gold))] px-8 py-3 text-sm font-semibold text-black hover:shadow-[0_0_20px_hsl(var(--gold)/0.4)]"
            >
              Get Your Custom ROI Report
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
