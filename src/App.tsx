import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Investments from "./pages/Investments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portal from "./pages/portal/Portal";
import DealRoomPage from "./pages/portal/DealRoomPage";
import InvestmentDetailPage from "./pages/portal/InvestmentDetailPage";
import InvestmentEditPage from "./pages/portal/InvestmentEditPage";
import IrsCodesAdminPage from "./pages/portal/IrsCodesAdminPage";
import ComparisonPage from "./pages/portal/ComparisonPage";
import K1Tracker from "./pages/portal/K1Tracker";
import ComplianceDashboard from "./pages/portal/ComplianceDashboard";
import ActivityLogs from "./pages/portal/ActivityLogs";
import ClientPortfolio from "./pages/portal/ClientPortfolio";
import OnboardingWizard from "./pages/portal/OnboardingWizard";
import NotificationsPage from "./pages/portal/NotificationsPage";
import AffiliatePortal from "./pages/portal/AffiliatePortal";
import AnalyticsDashboard from "./pages/portal/AnalyticsDashboard";
import UserManagement from "./pages/portal/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/kingdom-command">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected data room routes */}
            <Route path="/portal" element={<ProtectedRoute><Portal /></ProtectedRoute>} />
            <Route path="/portal/investments/:slug" element={<ProtectedRoute allowedRoles={['admin']}><InvestmentDetailPage /></ProtectedRoute>} />
            <Route path="/portal/investments/:slug/edit" element={<ProtectedRoute allowedRoles={['admin']}><InvestmentEditPage /></ProtectedRoute>} />
            <Route path="/portal/irs-codes" element={<ProtectedRoute allowedRoles={['admin']}><IrsCodesAdminPage /></ProtectedRoute>} />
            <Route path="/portal/compare" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
            <Route path="/portal/deal-room/:slug" element={<ProtectedRoute><DealRoomPage /></ProtectedRoute>} />

            {/* Phase 3: Compliance & Reporting */}
            <Route path="/portal/k1-tracker" element={<ProtectedRoute allowedRoles={['admin']}><K1Tracker /></ProtectedRoute>} />
            <Route path="/portal/compliance" element={<ProtectedRoute allowedRoles={['admin']}><ComplianceDashboard /></ProtectedRoute>} />
            <Route path="/portal/activity" element={<ProtectedRoute allowedRoles={['admin']}><ActivityLogs /></ProtectedRoute>} />

            {/* Phase 4: Client Experience */}
            <Route path="/portal/portfolio" element={<ProtectedRoute allowedRoles={['client']}><ClientPortfolio /></ProtectedRoute>} />
            <Route path="/portal/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
            <Route path="/portal/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            {/* Phase 5: Scale & Integrate */}
            <Route path="/portal/affiliate" element={<ProtectedRoute allowedRoles={['affiliate']}><AffiliatePortal /></ProtectedRoute>} />
            <Route path="/portal/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/portal/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
