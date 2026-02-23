import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Banned() {
  const { user, loading } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["ban-check", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("banned_until")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse font-serif text-2xl text-foreground">ZELO</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const bannedUntil = profile?.banned_until ? new Date(profile.banned_until) : null;
  if (!bannedUntil || bannedUntil <= new Date()) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-3 font-serif text-2xl font-semibold text-foreground">
          Conta suspensa
        </h1>
        <p className="mb-2 text-sm text-muted-foreground">
          Sua conta foi suspensa temporariamente por violação dos termos de uso.
        </p>
        <p className="text-sm font-medium text-foreground">
          Suspensão até:{" "}
          <span className="text-destructive">
            {bannedUntil.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
    </div>
  );
}
