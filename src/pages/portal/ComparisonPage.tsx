import { PortalLayout } from '@/components/shared/PortalLayout';
import { InvestmentComparison } from '@/components/ai/InvestmentComparison';

export default function ComparisonPage() {
  return (
    <PortalLayout>
      <div className="p-6 lg:p-8">
        <InvestmentComparison />
      </div>
    </PortalLayout>
  );
}
