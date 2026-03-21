import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="Hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Background grid with parallax */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(var(--gold)/0.08)] blur-[100px]"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-[hsl(var(--purple)/0.08)] blur-[100px]"
          animate={{ x: [0, -30, 25, 0], y: [0, 30, -35, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[250px] h-[250px] rounded-full bg-[hsl(var(--ai-agents)/0.06)] blur-[80px]"
          animate={{ x: [0, 40, -15, 0], y: [0, -20, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block mb-6 rounded-full border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.08)] px-4 py-1.5 text-xs font-medium text-[hsl(var(--gold))] tracking-wide uppercase">
            AI-Powered Revenue Operations
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Stop Losing Revenue to{' '}
          <span className="text-[hsl(var(--gold))]">Manual Processes</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Leep AI deploys intelligent agents that automate your entire revenue pipeline —
          from lead qualification to close — so your team focuses on what matters.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <a
            href="#cta"
            className="btn-interactive inline-flex items-center rounded-lg bg-[hsl(var(--gold))] px-8 py-3.5 text-base font-semibold text-black hover:shadow-[0_0_30px_hsl(var(--gold)/0.4)] hover:scale-105 transition-all duration-200"
          >
            Book Your Demo
          </a>
          <a
            href="#how-it-works"
            className="btn-interactive inline-flex items-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground hover:bg-accent hover:scale-105 transition-all duration-200"
          >
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
