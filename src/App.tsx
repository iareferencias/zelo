import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleRoute } from "@/components/RoleRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Waitlist from "./pages/Waitlist";
import AppLayout from "./pages/app/AppLayout";
import Feed from "./pages/app/Feed";
import Conexoes from "./pages/app/Conexoes";
import Oportunidades from "./pages/app/Oportunidades";
import Profile from "./pages/app/Profile";
import Preparacao from "./pages/app/Preparacao";
import Notifications from "./pages/app/Notifications";
import Plans from "./pages/app/Plans";
import Chat from "./pages/app/Chat";
import Matches from "./pages/app/Matches";
import Compatibles from "./pages/app/Compatibles";
import AdminDashboard from "./pages/app/admin/AdminDashboard";
import AdminUsers from "./pages/app/admin/AdminUsers";
import AdminReports from "./pages/app/admin/AdminReports";
import AdminInvites from "./pages/app/admin/AdminInvites";
import AdminAuditLogs from "./pages/app/admin/AdminAuditLogs";
import AdminInviteTree from "./pages/app/admin/AdminInviteTree";
import Onboarding from "./pages/Onboarding";
import Banned from "./pages/Banned";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/banned" element={<Banned />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Feed />} />
              <Route path="conexoes" element={<Conexoes />} />
              <Route path="oportunidades" element={<Oportunidades />} />
              <Route path="compatibles" element={<Compatibles />} />
              <Route path="matches" element={<Matches />} />
              <Route path="chat/:matchId" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="preparacao" element={<Preparacao />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="plans" element={<Plans />} />
              <Route path="admin/dashboard" element={<RoleRoute access="admin"><AdminDashboard /></RoleRoute>} />
              <Route path="admin/users" element={<RoleRoute access="admin"><AdminUsers /></RoleRoute>} />
              <Route path="admin/reports" element={<RoleRoute access="staff"><AdminReports /></RoleRoute>} />
              <Route path="admin/invites" element={<RoleRoute access="admin"><AdminInvites /></RoleRoute>} />
              <Route path="admin/audit" element={<RoleRoute access="staff"><AdminAuditLogs /></RoleRoute>} />
              <Route path="admin/invite-tree" element={<RoleRoute access="admin"><AdminInviteTree /></RoleRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
