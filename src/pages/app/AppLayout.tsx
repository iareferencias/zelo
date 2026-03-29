import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { DemoProvider, useDemoMode } from "@/hooks/useDemoMode";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function DemoToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  return (
    <Button
      variant={isDemoMode ? "default" : "outline"}
      size="sm"
      onClick={toggleDemoMode}
      className={`gap-1.5 text-xs font-medium rounded-full ${
        isDemoMode ? "gold-gradient text-accent-foreground shadow-sm" : ""
      }`}
    >
      <FlaskConical className="h-3.5 w-3.5" />
      {isDemoMode ? "Demo Ativo" : "Demo"}
    </Button>
  );
}

function LayoutInner() {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            {isDemoMode && (
              <Badge variant="outline" className="border-accent/40 text-accent text-[10px] font-semibold uppercase tracking-wider">
                Modo Teste
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DemoToggle />
            <NotificationBell />
          </div>
        </header>
        <div className="flex-1 p-5 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
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
