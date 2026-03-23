import { useEffect, useRef } from 'react';
import { Bot, Home, Landmark, ArrowUpRight, Zap, Users, Shield, TrendingUp, Brain, Sparkles } from 'lucide-react';

const services = [
  {
    id: 'ai-agents',
    title: 'AI Agents',
    subtitle: 'Intelligent Automation',
    description:
      'Deploy custom AI agents that work 24/7 — handling leads, qualifying prospects, managing operations, and scaling your business while you sleep.',
    features: ['Custom GPT Agents', 'Lead Qualification Bots', 'Workflow Automation', 'Voice AI Assistants'],
    icon: Bot,
    color: 'ai',
    gradient: 'from-ai/20 to-transparent',
    cardClass: 'service-card-ai',
    stats: { label: 'Tasks Automated', value: '10K+' },
    featureIcons: [Brain, Zap, Sparkles, Users],
  },
  {
    id: 'retreats',
    title: 'Retreats',
    subtitle: 'Transformative Experiences',
    description:
      'Curated luxury retreats designed for high-performers. Reconnect with purpose, build alliances with visionaries, and return with a battle plan.',
    features: ['Leadership Intensives', 'Luxury Venues', 'Expert Facilitators', 'Lifetime Network'],
    icon: Home,
    color: 'retreats',
    gradient: 'from-retreats/20 to-transparent',
    cardClass: 'service-card-retreats',
    stats: { label: 'Leaders Transformed', value: '200+' },
    featureIcons: [Users, Sparkles, Shield, TrendingUp],
  },
  {
    id: 'tax-capital',
    title: 'Tax & Capital',
    subtitle: 'Strategic Wealth Building',
    description:
      'Optimize your tax strategy, protect your assets, and accelerate capital growth through proven frameworks used by the top 1%.',
    features: ['Tax Optimization', 'Entity Structuring', 'Investment Strategy', 'Asset Protection'],
    icon: Landmark,
    color: 'tax',
    gradient: 'from-tax/20 to-transparent',
    cardClass: 'service-card-tax',
    stats: { label: 'Capital Deployed', value: '$50M+' },
    featureIcons: [Shield, TrendingUp, Brain, Zap],
  },
];

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-32 section-gradient-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="reveal text-xs font-mono font-medium uppercase tracking-[0.2em] text-ai mb-4">
            The Three Pillars
          </p>
          <h2 className="reveal reveal-delay-1 text-display-sm md:text-display-md font-display font-bold mb-6">
            One Kingdom.{' '}
            <span className="text-gradient">Three Empires.</span>
          </h2>
          <p className="reveal reveal-delay-2 mx-auto max-w-2xl text-body-lg text-muted-foreground">
            Each pillar is designed to compound the others. AI drives efficiency.
            Retreats build vision. Capital fuels growth. Together, they're unstoppable.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colorClass =
              service.color === 'ai' ? 'text-ai' :
              service.color === 'retreats' ? 'text-retreats' : 'text-tax';
            const bgColorClass =
              service.color === 'ai' ? 'bg-ai' :
              service.color === 'retreats' ? 'bg-retreats' : 'bg-tax';

            return (
              <div
                key={service.id}
                className={`reveal reveal-delay-${index + 1} service-card ${service.cardClass} group p-8`}
              >
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${service.gradient}`} />

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${bgColorClass}/10 mb-6`}>
                  <Icon className={`h-7 w-7 ${colorClass}`} />
                </div>

                {/* Content */}
                <p className={`text-xs font-mono uppercase tracking-widest ${colorClass} mb-2`}>
                  {service.subtitle}
                </p>
                <h3 className="text-heading-lg font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => {
                    const FeatureIcon = service.featureIcons[i];
                    return (
                      <div key={feature} className="flex items-center gap-3">
                        <FeatureIcon className={`h-4 w-4 ${colorClass} opacity-60`} />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <p className={`font-mono text-xl font-bold ${colorClass}`}>{service.stats.value}</p>
                    <p className="text-xs text-muted-foreground">{service.stats.label}</p>
                  </div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColorClass}/10 transition-all duration-300 group-hover:${bgColorClass}/20`}>
                    <ArrowUpRight className={`h-5 w-5 ${colorClass} transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
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
