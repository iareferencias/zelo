import { Users, Heart, BookOpen, User, Shield, LogOut, Ticket } from "lucide-react";
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
  { title: "Preparação", url: "/app/preparacao", icon: BookOpen },
  { title: "Perfil", url: "/app/profile", icon: User },
];

export function AppSidebar() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarContent>
        <div className="p-4 pb-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-widest text-foreground">ZELO</span>
            {isAdmin && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">Admin</span>
            )}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Área do membro</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/app"} className="hover:bg-muted/50" activeClassName="bg-muted text-accent font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/admin/users" className="hover:bg-muted/50" activeClassName="bg-muted text-accent font-medium">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Usuários</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/admin/reports" className="hover:bg-muted/50" activeClassName="bg-muted text-accent font-medium">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Denúncias</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/admin/invites" className="hover:bg-muted/50" activeClassName="bg-muted text-accent font-medium">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>Convites</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
