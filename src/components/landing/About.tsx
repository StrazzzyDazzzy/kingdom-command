import { useEffect, useRef } from 'react';
import { Crown, Heart, Target, Shield } from 'lucide-react';

const values = [
  {
    icon: Crown,
    title: 'Kingdom Mindset',
    description: 'We build empires, not side hustles. Every decision is measured against a generational vision.',
  },
  {
    icon: Heart,
    title: '20% Give-Back',
    description: 'A fifth of every dollar goes back to the Kingdom — funding missions, communities, and the next generation.',
  },
  {
    icon: Target,
    title: 'Precision Execution',
    description: 'No fluff. No theory. Every strategy is battle-tested and designed for immediate, measurable impact.',
  },
  {
    icon: Shield,
    title: 'Protective Structure',
    description: 'We fortify your wealth with proper entities, tax strategy, and asset protection from day one.',
  },
];

export function About() {
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
    <section id="about" ref={sectionRef} className="relative py-32 section-gradient-3">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left: Story */}
          <div>
            <p className="reveal text-xs font-mono font-medium uppercase tracking-[0.2em] text-tax mb-4">
              Our Mission
            </p>
            <h2 className="reveal reveal-delay-1 text-display-sm font-display font-bold mb-8">
              Built to Build{' '}
              <span className="text-gradient-emerald">Kingdoms</span>
            </h2>
            <div className="reveal reveal-delay-2 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Kingdom Command was born from a simple belief: the most successful
                people don't just build businesses — they build empires that outlast
                them and uplift everyone around them.
              </p>
              <p>
                We fused cutting-edge AI technology, world-class retreat experiences,
                and elite financial strategy into a single command center. Because
                the future belongs to those who can operate across all three.
              </p>
              <p className="text-foreground font-medium">
                And we made a covenant: 20% of everything goes back. To missions.
                To communities. To the Kingdom that made it all possible.
              </p>
            </div>
          </div>

          {/* Right: Values Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className={`reveal reveal-delay-${index + 1} p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-border/60 transition-all duration-500 group`}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-4 group-hover:bg-secondary/80 transition-colors">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
