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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
