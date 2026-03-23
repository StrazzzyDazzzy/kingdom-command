import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Williams',
    role: 'CEO, Atlas Ventures',
    quote:
      'Kingdom Command didn\'t just build our AI systems — they restructured our entire operation. Revenue is up 340% and I\'m working half the hours.',
    color: 'ai',
  },
  {
    name: 'Sarah Chen',
    role: 'Founder, Luxe Living Co.',
    quote:
      'The retreat changed everything for me. I came in with a $500K business and left with a $5M blueprint. The network alone was worth 100x the investment.',
    color: 'retreats',
  },
  {
    name: 'David Okafor',
    role: 'Managing Partner, Pinnacle Capital',
    quote:
      'Their tax strategy saved us $1.2M in the first year. The entity structure they built is something my previous CPAs never even considered.',
    color: 'tax',
  },
  {
    name: 'Rachel Torres',
    role: 'Founder, Nova Digital',
    quote:
      'I was skeptical about AI agents replacing my team\'s work. Now I can\'t imagine operating without them. We\'ve 10x\'d our lead response time.',
    color: 'ai',
  },
  {
    name: 'James Blackwell',
    role: 'Serial Entrepreneur',
    quote:
      'The Kingdom give-back model isn\'t just generous — it\'s genius. It attracts the right people, builds trust, and creates a legacy beyond profit.',
    color: 'retreats',
  },
  {
    name: 'Angela Kim',
    role: 'COO, Heritage Group',
    quote:
      'We deployed across all three pillars. The compounding effect is real. AI feeds the pipeline, retreats close the deals, tax keeps the wealth.',
    color: 'tax',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-32 section-gradient-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="reveal text-xs font-mono font-medium uppercase tracking-[0.2em] text-ai mb-4">
            Testimonials
          </p>
          <h2 className="reveal reveal-delay-1 text-display-sm md:text-display-md font-display font-bold mb-6">
            Kingdom{' '}
            <span className="text-gradient-cyan">Builders</span>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto max-w-2xl text-body-lg text-muted-foreground">
            Hear from the leaders, founders, and visionaries who've used Kingdom
            Command to build empires.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const borderColor =
              testimonial.color === 'ai' ? 'border-l-ai' :
              testimonial.color === 'retreats' ? 'border-l-retreats' : 'border-l-tax';
            const quoteColor =
              testimonial.color === 'ai' ? 'text-ai/20' :
              testimonial.color === 'retreats' ? 'text-retreats/20' : 'text-tax/20';

            return (
              <div
                key={testimonial.name}
                className={`reveal reveal-delay-${(index % 3) + 1} relative p-8 rounded-2xl bg-card/50 border border-border/30 border-l-2 ${borderColor} hover:bg-card/80 transition-all duration-500`}
              >
                {/* Quote icon */}
                <Quote className={`absolute top-6 right-6 h-8 w-8 ${quoteColor}`} />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-retreats text-retreats" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground/90 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground/70">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
