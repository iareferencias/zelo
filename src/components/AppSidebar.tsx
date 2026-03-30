import { Users, Heart, BookOpen, User, Shield, LogOut, Ticket, LayoutDashboard, Bell, ScrollText, Crown, TreePine } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Compatíveis", url: "/app", icon: Users },
  { title: "Matches", url: "/app/matches", icon: Heart },
  { title: "Notificações", url: "/app/notifications", icon: Bell },
  { title: "Preparação", url: "/app/preparacao", icon: BookOpen },
  { title: "Perfil", url: "/app/profile", icon: User },
  { title: "Planos", url: "/app/plans", icon: Crown },
];

// Admin-only items
const adminItems = [
  { title: "Dashboard", url: "/app/admin/dashboard", icon: LayoutDashboard },
  { title: "Usuários", url: "/app/admin/users", icon: Users },
  { title: "Convites", url: "/app/admin/invites", icon: Ticket },
  { title: "Árvore de Convites", url: "/app/admin/invite-tree", icon: TreePine },
];

// Items accessible by both admin and moderator
const staffItems = [
  { title: "Denúncias", url: "/app/admin/reports", icon: Shield },
  { title: "Auditoria", url: "/app/admin/audit", icon: ScrollText },
];

export function AppSidebar() {
  const { isAdmin, isModerator, isStaff, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  // Build admin menu based on role
  const adminMenuItems = isAdmin
    ? [...adminItems, ...staffItems]
    : isModerator
      ? staffItems
      : [];

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="px-5 py-6">
          <span className="font-display text-lg font-semibold text-foreground">Zelo</span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/app"}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors duration-150"
                      activeClassName="text-foreground bg-accent/10 font-medium"
                    >
                      <item.icon className="mr-2.5 h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isStaff && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground px-5">
              {isAdmin ? "Admin" : "Moderação"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors duration-150"
                        activeClassName="text-foreground bg-accent/10 font-medium"
                      >
                        <item.icon className="mr-2.5 h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2.5 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
