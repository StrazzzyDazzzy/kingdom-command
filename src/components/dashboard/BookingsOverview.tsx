import { Booking } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface BookingsOverviewProps {
  bookings: Booking[];
}

const sourceStyles = {
  direct: { label: 'Direct', className: 'bg-success/20 text-success border-success/30' },
  airbnb: { label: 'Airbnb', className: 'bg-critical/20 text-critical border-critical/30' },
  vrbo: { label: 'VRBO', className: 'bg-warning/20 text-warning border-warning/30' },
};

export function BookingsOverview({ bookings }: BookingsOverviewProps) {
  const directRevenue = bookings.filter(b => b.source === 'direct').reduce((sum, b) => sum + b.revenue, 0);
  const platformRevenue = bookings.filter(b => b.source !== 'direct').reduce((sum, b) => sum + b.revenue, 0);
  const totalRevenue = directRevenue + platformRevenue;
  const directPercent = totalRevenue > 0 ? (directRevenue / totalRevenue) * 100 : 0;
  
  const bySource = {
    direct: bookings.filter(b => b.source === 'direct'),
    airbnb: bookings.filter(b => b.source === 'airbnb'),
    vrbo: bookings.filter(b => b.source === 'vrbo'),
  };

  return (
    <div className="rounded-lg bg-card border border-border/50 card-glow-retreats p-5 animate-slide-in">
      <h2 className="text-sm font-semibold mb-4">Booking Sources</h2>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Direct vs Platform</span>
          <span className={cn(directPercent >= 50 ? 'text-success' : 'text-warning')}>
            {directPercent.toFixed(0)}% Direct
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden flex">
          <div
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${directPercent}%` }}
          />
          <div
            className="h-full bg-critical/60"
            style={{ width: `${100 - directPercent}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.entries(bySource).map(([source, sourceBookings]) => {
          const style = sourceStyles[source as keyof typeof sourceStyles];
          const revenue = sourceBookings.reduce((sum, b) => sum + b.revenue, 0);
          
          return (
            <div key={source} className="text-center p-2 rounded-lg bg-secondary/30">
              <span className={cn('inline-block rounded px-1.5 py-0.5 text-xs font-medium border mb-1', style.className)}>
                {style.label}
              </span>
              <p className="font-mono text-sm font-semibold">
                ${(revenue / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted-foreground">
                {sourceBookings.length} booking{sourceBookings.length !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
        {bookings.slice(0, 5).map((booking) => {
          const style = sourceStyles[booking.source];
          
          return (
            <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2">
                <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium border', style.className)}>
                  {style.label.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium">{booking.property}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="font-mono text-sm">${booking.revenue.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
