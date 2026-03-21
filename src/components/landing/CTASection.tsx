import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CalendlySkeleton() {
  return (
    <div className="w-full h-[500px] rounded-xl bg-[hsl(var(--muted))] animate-pulse flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-[hsl(var(--border))]" />
      <div className="w-48 h-4 rounded bg-[hsl(var(--border))]" />
      <div className="w-32 h-4 rounded bg-[hsl(var(--border))]" />
      <div className="grid grid-cols-7 gap-2 mt-4">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded bg-[hsl(var(--border))]" />
        ))}
      </div>
    </div>
  );
}

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <section
      ref={ref}
      id="cta"
      role="region"
      aria-label="Book a demo"
      className="py-24 bg-[hsl(var(--card))]"
    >
      <div className="container px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to <span className="text-[hsl(var(--gold))]">10x Your Pipeline</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Book a 15-minute demo and see Leep AI in action with your own data.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto glass rounded-2xl p-6 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!iframeLoaded && <CalendlySkeleton />}
          <iframe
            src="https://meetings-na2.hubspot.com/aaron-strazicich/leep-ai-group-calendar"
            title="Book a call with Leep AI"
            className={`w-full h-[500px] rounded-xl border-0 ${iframeLoaded ? '' : 'hidden'}`}
            onLoad={() => setIframeLoaded(true)}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
