import { useAuth } from '@/lib/auth';
import { PortalLayout } from '@/components/shared/PortalLayout';
import AdminDashboard from './AdminDashboard';
import InvestmentListing from './InvestmentListing';
import { Loader2 } from 'lucide-react';

export default function Portal() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PortalLayout>
      {profile?.role === 'admin' ? <AdminDashboard /> : <InvestmentListing />}
    </PortalLayout>
  );
}
