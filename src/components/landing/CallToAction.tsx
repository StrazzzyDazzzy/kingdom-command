import { useEffect, useRef } from 'react';
import { ArrowRight, Command } from 'lucide-react';

export function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.2 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan" style={{ top: '20%', right: '20%', opacity: 0.08 }} />
        <div className="orb orb-gold" style={{ bottom: '20%', left: '20%', opacity: 0.06 }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="reveal inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ai via-retreats to-tax mb-8">
          <Command className="h-8 w-8 text-background" />
        </div>

        <h2 className="reveal reveal-delay-1 text-display-sm md:text-display-md font-display font-bold mb-6">
          Ready to Command{' '}
          <span className="text-gradient">Your Kingdom?</span>
        </h2>

        <p className="reveal reveal-delay-2 mx-auto max-w-xl text-body-lg text-muted-foreground mb-10">
          Book a free strategy call. We'll map your vision across all three pillars
          and show you exactly how to build your empire.
        </p>

        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#" className="btn-primary group text-lg !px-10 !py-5">
            Book Strategy Call
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#services" className="btn-secondary text-lg !px-10 !py-5">
            Explore Services
          </a>
        </div>

        {/* Trust signals */}
        <div className="reveal reveal-delay-4 mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Free 30-min strategy call
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            No commitment required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Custom blueprint included
          </span>
        </div>
      </div>
    </section>
  );
}
