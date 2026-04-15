import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/hooks/useClientExperience';

/**
 * Gates portal access on onboarding completion for client role.
 * Admins and affiliates skip this check.
 * Onboarding route itself is excluded.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const { data: onboarding, isLoading } = useOnboarding();
  const location = useLocation();

  // Non-clients skip onboarding entirely
  if (profile?.role !== 'client') return <>{children}</>;

  // Already on onboarding page — let them through
  if (location.pathname === '/portal/onboarding') return <>{children}</>;

  // Still loading — avoid redirect flash
  if (isLoading) return <>{children}</>;

  // No onboarding record OR not completed
  const isComplete = !!onboarding?.completed_at;
  if (!isComplete) {
    return <Navigate to="/portal/onboarding" replace />;
  }

  return <>{children}</>;
}
