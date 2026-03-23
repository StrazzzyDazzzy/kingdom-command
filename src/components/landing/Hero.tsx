import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient noise">
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan" style={{ top: '10%', left: '15%', opacity: 0.15 }} />
        <div className="orb orb-gold" style={{ top: '60%', right: '10%', opacity: 0.1 }} />
        <div className="orb orb-emerald" style={{ bottom: '20%', left: '40%', opacity: 0.1 }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(210, 20%, 40%) 1px, transparent 1px), linear-gradient(90deg, hsl(210, 20%, 40%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 mb-8 opacity-0"
          style={{ animation: 'hero-fade-in 0.8s ease-out 0.2s forwards' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ai"></span>
          </span>
          <span className="text-xs font-medium text-muted-foreground">AI-Powered Business Command</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6">
          <span
            className="block text-display-lg font-display font-bold text-foreground opacity-0"
            style={{ animation: 'hero-text-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' }}
          >
            Command Your
          </span>
          <span
            className="block text-display-lg font-display font-bold text-gradient opacity-0"
            style={{ animation: 'hero-text-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards' }}
          >
            Kingdom
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto max-w-2xl text-body-lg text-muted-foreground mb-10 opacity-0"
          style={{ animation: 'hero-fade-in 1s ease-out 0.9s forwards' }}
        >
          Three pillars. One empire. Build unstoppable AI agents, host
          transformative retreats, and master strategic wealth — all from your
          command center.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
          style={{ animation: 'hero-fade-in 1s ease-out 1.1s forwards' }}
        >
          <a href="#contact" className="btn-primary group">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#services" className="btn-secondary group">
            <Play className="mr-2 h-4 w-4" />
            See How It Works
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto opacity-0"
          style={{ animation: 'hero-fade-in 1s ease-out 1.4s forwards' }}
        >
          <div>
            <p className="font-mono text-2xl font-bold text-foreground">500+</p>
            <p className="text-xs text-muted-foreground mt-1">Clients Served</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-ai">$2.4M</p>
            <p className="text-xs text-muted-foreground mt-1">Revenue Generated</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-foreground">20%</p>
            <p className="text-xs text-muted-foreground mt-1">Given to Kingdom</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        style={{ animation: 'hero-fade-in 1s ease-out 1.8s forwards' }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-muted-foreground/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
