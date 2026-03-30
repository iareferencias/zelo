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
import Compatibles from "./pages/app/Compatibles";
import Matches from "./pages/app/Matches";
import Chat from "./pages/app/Chat";
import Profile from "./pages/app/Profile";
import Preparacao from "./pages/app/Preparacao";
import Notifications from "./pages/app/Notifications";
import Plans from "./pages/app/Plans";
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
              <Route index element={<Compatibles />} />
              <Route path="matches" element={<Matches />} />
              <Route path="chat/:matchId" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="preparacao" element={<Preparacao />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="plans" element={<Plans />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/reports" element={<AdminReports />} />
              <Route path="admin/invites" element={<AdminInvites />} />
              <Route path="admin/audit" element={<AdminAuditLogs />} />
              <Route path="admin/invite-tree" element={<AdminInviteTree />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
