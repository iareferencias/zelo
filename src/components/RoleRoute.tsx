import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface RoleRouteProps {
  children: React.ReactNode;
  /** "admin" = admin only, "staff" = admin or moderator */
  access: "admin" | "staff";
}

export function RoleRoute({ children, access }: RoleRouteProps) {
  const { loading, isAdmin, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const hasAccess = access === "admin" ? isAdmin : isStaff;

  if (!hasAccess) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
