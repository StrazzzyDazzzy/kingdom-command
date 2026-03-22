import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500, suffix: '+', label: 'Clients Served', color: 'text-foreground' },
  { value: 2.4, suffix: 'M', prefix: '$', label: 'Revenue Generated', color: 'text-ai' },
  { value: 50, suffix: 'M+', prefix: '$', label: 'Capital Managed', color: 'text-tax' },
  { value: 10, suffix: 'K+', label: 'AI Tasks / Month', color: 'text-retreats' },
  { value: 20, suffix: '%', label: 'Kingdom Give-Back', color: 'text-foreground' },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);

  return value;
}

function StatItem({ stat, visible }: { stat: typeof stats[0]; visible: boolean }) {
  const count = useCountUp(stat.value, 2000, visible);
  const isDecimal = stat.value % 1 !== 0;

  return (
    <div className="text-center px-4">
      <p className={`stat-number ${stat.color}`}>
        {stat.prefix || ''}
        {isDecimal ? count.toFixed(1) : Math.round(count)}
        {stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-20">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} visible={visible} />
          ))}
        </div>
      </div>

      {/* Top/bottom border lines */}
      <div className="absolute top-0 left-0 right-0 divider-gradient" />
      <div className="absolute bottom-0 left-0 right-0 divider-gradient" />
    </section>
  );
}
