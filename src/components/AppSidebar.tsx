import { Newspaper, Users, Sparkles, User, Shield, LogOut, Ticket, LayoutDashboard, Bell, ScrollText, Crown, TreePine } from "lucide-react";
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
  { title: "Feed", url: "/app", icon: Newspaper },
  { title: "Conexões", url: "/app/conexoes", icon: Users },
  { title: "Oportunidades", url: "/app/oportunidades", icon: Sparkles },
  { title: "Perfil", url: "/app/profile", icon: User },
];

const adminItems = [
  { title: "Dashboard", url: "/app/admin/dashboard", icon: LayoutDashboard },
  { title: "Usuários", url: "/app/admin/users", icon: Users },
  { title: "Convites", url: "/app/admin/invites", icon: Ticket },
  { title: "Árvore de Convites", url: "/app/admin/invite-tree", icon: TreePine },
];

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

  const adminMenuItems = isAdmin
    ? [...adminItems, ...staffItems]
    : isModerator
      ? staffItems
      : [];

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent>
        <div className="px-5 py-6">
          <span className="font-display text-xl font-bold tracking-wider text-foreground">ZELO</span>
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
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150 rounded-xl"
                      activeClassName="text-primary bg-primary/10 font-medium"
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
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150 rounded-xl"
                        activeClassName="text-primary bg-primary/10 font-medium"
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
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground" onClick={handleLogout}>
          <LogOut className="mr-2.5 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
