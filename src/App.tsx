import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OnboardingGate } from "@/components/shared/OnboardingGate";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { PageSkeleton } from "@/components/shared/Skeleton";

// Eagerly loaded (public + auth)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy-loaded (auth-gated portal pages)
const Index = lazy(() => import("./pages/Index"));
const Investments = lazy(() => import("./pages/Investments"));
const Portal = lazy(() => import("./pages/portal/Portal"));
const DealRoomPage = lazy(() => import("./pages/portal/DealRoomPage"));
const InvestmentDetailPage = lazy(() => import("./pages/portal/InvestmentDetailPage"));
const InvestmentEditPage = lazy(() => import("./pages/portal/InvestmentEditPage"));
const IrsCodesAdminPage = lazy(() => import("./pages/portal/IrsCodesAdminPage"));
const ComparisonPage = lazy(() => import("./pages/portal/ComparisonPage"));
const K1Tracker = lazy(() => import("./pages/portal/K1Tracker"));
const ComplianceDashboard = lazy(() => import("./pages/portal/ComplianceDashboard"));
const ActivityLogs = lazy(() => import("./pages/portal/ActivityLogs"));
const ClientPortfolio = lazy(() => import("./pages/portal/ClientPortfolio"));
const OnboardingWizard = lazy(() => import("./pages/portal/OnboardingWizard"));
const NotificationsPage = lazy(() => import("./pages/portal/NotificationsPage"));
const AffiliatePortal = lazy(() => import("./pages/portal/AffiliatePortal"));
const AnalyticsDashboard = lazy(() => import("./pages/portal/AnalyticsDashboard"));
const UserManagement = lazy(() => import("./pages/portal/UserManagement"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const withGuards = (el: React.ReactNode, roles?: Array<'admin' | 'client' | 'affiliate'>) => (
  <ProtectedRoute allowedRoles={roles}>
    <OnboardingGate>
      <Suspense fallback={<PageSkeleton />}>{el}</Suspense>
    </OnboardingGate>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/kingdom-command">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><Index /></Suspense>} />
              <Route path="/investments" element={<Suspense fallback={<PageSkeleton />}><Investments /></Suspense>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Portal */}
              <Route path="/portal" element={withGuards(<Portal />)} />
              <Route path="/portal/investments/:slug" element={withGuards(<InvestmentDetailPage />, ['admin'])} />
              <Route path="/portal/investments/:slug/edit" element={withGuards(<InvestmentEditPage />, ['admin'])} />
              <Route path="/portal/irs-codes" element={withGuards(<IrsCodesAdminPage />, ['admin'])} />
              <Route path="/portal/compare" element={withGuards(<ComparisonPage />)} />
              <Route path="/portal/deal-room/:slug" element={withGuards(<DealRoomPage />)} />

              {/* Phase 3 */}
              <Route path="/portal/k1-tracker" element={withGuards(<K1Tracker />, ['admin'])} />
              <Route path="/portal/compliance" element={withGuards(<ComplianceDashboard />, ['admin'])} />
              <Route path="/portal/activity" element={withGuards(<ActivityLogs />, ['admin'])} />

              {/* Phase 4 */}
              <Route path="/portal/portfolio" element={withGuards(<ClientPortfolio />, ['client'])} />
              <Route path="/portal/onboarding" element={withGuards(<OnboardingWizard />)} />
              <Route path="/portal/notifications" element={withGuards(<NotificationsPage />)} />

              {/* Phase 5 */}
              <Route path="/portal/affiliate" element={withGuards(<AffiliatePortal />, ['affiliate'])} />
              <Route path="/portal/analytics" element={withGuards(<AnalyticsDashboard />, ['admin'])} />
              <Route path="/portal/users" element={withGuards(<UserManagement />, ['admin'])} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
