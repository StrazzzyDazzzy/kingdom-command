import { PortalLayout } from '@/components/shared/PortalLayout';
import DealRoom from './DealRoom';

// Admin investment detail view reuses DealRoom
export default function InvestmentDetailPage() {
  return (
    <PortalLayout>
      <DealRoom />
    </PortalLayout>
  );
}
