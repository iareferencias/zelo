import { Users, Heart, BookOpen, User, Shield, LogOut, Ticket, LayoutDashboard, Bell, ScrollText } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Compatíveis", url: "/app", icon: Users },
  { title: "Matches", url: "/app/matches", icon: Heart },
  { title: "Notificações", url: "/app/notifications", icon: Bell },
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
    <Sidebar className="border-r border-border/40">
      <SidebarContent>
        <div className="p-5 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-xl font-bold tracking-[0.25em] text-foreground">ZELO</span>
            {isAdmin && (
              <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">Admin</span>
            )}
          </div>
          <p className="mt-0.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Área do membro</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/50 px-5">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/app"} className="hover:bg-muted/50 transition-colors duration-150" activeClassName="bg-muted text-foreground font-medium">
                      <item.icon className="mr-2.5 h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <>
            <Separator className="mx-5 my-1" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/50 px-5">Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { title: "Dashboard", url: "/app/admin/dashboard", icon: LayoutDashboard },
                    { title: "Usuários", url: "/app/admin/users", icon: Users },
                    { title: "Denúncias", url: "/app/admin/reports", icon: Shield },
                    { title: "Convites", url: "/app/admin/invites", icon: Ticket },
                    { title: "Auditoria", url: "/app/admin/audit", icon: ScrollText },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className="hover:bg-muted/50 transition-colors duration-150" activeClassName="bg-muted text-foreground font-medium">
                          <item.icon className="mr-2.5 h-4 w-4" />
                          <span className="text-sm">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground text-sm" onClick={handleLogout}>
          <LogOut className="mr-2.5 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
