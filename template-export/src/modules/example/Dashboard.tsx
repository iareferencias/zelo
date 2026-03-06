import { useAuth } from "@/core/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/core/supabase-client";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: items, isLoading } = useQuery({
    queryKey: ["items", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-muted-foreground mb-8">
          Welcome, {user?.email}. This is your dashboard.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-sm text-card-foreground">{item.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No items yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create an "items" table in Supabase to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
