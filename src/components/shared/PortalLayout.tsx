import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Crown,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  BookOpen,
  LogOut,
  Shield,
  Briefcase,
  Menu,
  X,
  ArrowLeftRight,
} from 'lucide-react';
import { useState } from 'react';

const ADMIN_NAV = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/portal/investments', label: 'Investments', icon: Building2 },
  { to: '/portal/users', label: 'Users', icon: Users },
  { to: '/portal/documents', label: 'Documents', icon: FileText },
  { to: '/portal/irs-codes', label: 'IRS Codes', icon: BookOpen },
];

const CLIENT_NAV = [
  { to: '/portal', label: 'Browse Investments', icon: Building2 },
  { to: '/portal/compare', label: 'Compare', icon: ArrowLeftRight },
  { to: '/portal/my-deals', label: 'My Deal Rooms', icon: Briefcase },
];

const AFFILIATE_NAV = [
  { to: '/portal', label: 'My Investments', icon: Building2 },
  { to: '/portal/resources', label: 'Resources', icon: FileText },
];

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = profile?.role === 'admin' ? ADMIN_NAV
    : profile?.role === 'affiliate' ? AFFILIATE_NAV
    : CLIENT_NAV;

  const roleLabel = profile?.role === 'admin' ? 'Administrator'
    : profile?.role === 'affiliate' ? 'Growth Partner'
    : 'Client';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border/50 bg-card/30">
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <Crown className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Kingdom</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {profile?.full_name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{profile?.full_name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                {roleLabel}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-display text-base font-semibold">Kingdom</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-background/95 pt-14 lg:hidden">
          <nav className="space-y-1 p-4">
            {nav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
