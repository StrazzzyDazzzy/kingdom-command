import { useEffect, useRef } from 'react';
import { MessageSquare, Lightbulb, Rocket, Crown } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'We map your vision, identify your bottlenecks, and design a custom strategy across all three pillars.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Strategy Blueprint',
    description: 'Your personalized Kingdom Blueprint — AI systems, retreat schedule, and tax strategy — all engineered to compound.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Deploy & Scale',
    description: 'We build your AI agents, book your retreats, and structure your entities. Everything launches in parallel.',
  },
  {
    number: '04',
    icon: Crown,
    title: 'Command & Grow',
    description: 'Monitor everything from your Command Center. Watch your empire grow while giving back 20% to the Kingdom.',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 section-gradient-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="reveal text-xs font-mono font-medium uppercase tracking-[0.2em] text-retreats mb-4">
            The Process
          </p>
          <h2 className="reveal reveal-delay-1 text-display-sm md:text-display-md font-display font-bold mb-6">
            From Vision to{' '}
            <span className="text-gradient-gold">Empire</span>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto max-w-2xl text-body-lg text-muted-foreground">
            Four steps. Zero guesswork. We've refined this process across hundreds
            of clients to maximize speed and impact.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`reveal reveal-delay-${index + 1} relative group`}
              >
                {/* Connector line (hidden on mobile, between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px">
                    <div className="h-full bg-gradient-to-r from-border to-border/0" />
                  </div>
                )}

                <div className="relative p-8 rounded-2xl bg-card/50 border border-border/30 hover:border-border/60 transition-all duration-500 hover:bg-card">
                  {/* Step number */}
                  <span className="absolute top-6 right-6 text-5xl font-bold font-mono text-foreground/[0.03] select-none">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-6">
                    <Icon className="h-6 w-6 text-foreground/70" />
                  </div>

                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
