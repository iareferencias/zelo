import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DemoProvider, useDemoMode } from "@/hooks/useDemoMode";
import { FlaskConical, Newspaper, Users, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { useIsMobile } from "@/hooks/use-mobile";

const bottomNavItems = [
  { title: "Feed", url: "/app", icon: Newspaper, end: true },
  { title: "Conexões", url: "/app/conexoes", icon: Users },
  { title: "Oportunidades", url: "/app/oportunidades", icon: Sparkles },
  { title: "Perfil", url: "/app/profile", icon: User },
];

function DemoToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  return (
    <Button
      variant={isDemoMode ? "default" : "outline"}
      size="sm"
      onClick={toggleDemoMode}
      className={`gap-1.5 text-xs font-medium rounded-full ${
        isDemoMode ? "purple-gradient text-primary-foreground shadow-sm" : ""
      }`}
    >
      <FlaskConical className="h-3.5 w-3.5" />
      {isDemoMode ? "Demo Ativo" : "Demo"}
    </Button>
  );
}

function LayoutInner() {
  const { isDemoMode } = useDemoMode();
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      {!isMobile && <AppSidebar />}
      
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-3">
            {!isMobile && <SidebarTrigger />}
            {isMobile && (
              <span className="font-display text-lg font-semibold text-foreground">ZELO</span>
            )}
            {isDemoMode && (
              <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-semibold uppercase tracking-wider">
                Modo Teste
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DemoToggle />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav className="bottom-nav border-border">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavItems.map((item) => {
              const isActive = item.end
                ? location.pathname === item.url
                : location.pathname.startsWith(item.url);
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  end={item.end}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
                  activeClassName=""
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {item.title}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function AppLayout() {
  return (
    <DemoProvider>
      <SidebarProvider>
        <LayoutInner />
      </SidebarProvider>
    </DemoProvider>
  );
}
