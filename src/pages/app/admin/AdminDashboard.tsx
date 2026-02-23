import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, MessageSquare, AlertTriangle, Ban } from "lucide-react";

interface Stats {
  totalUsers: number;
  matchesToday: number;
  messagesToday: number;
  openReports: number;
  bannedUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    matchesToday: 0,
    messagesToday: 0,
    openReports: 0,
    bannedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const [
      { count: totalUsers },
      { count: matchesToday },
      { count: messagesToday },
      { count: openReports },
      { data: bannedData },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("messages").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("profiles").select("id").gt("banned_until", new Date().toISOString()),
    ]);

    setStats({
      totalUsers: totalUsers || 0,
      matchesToday: matchesToday || 0,
      messagesToday: messagesToday || 0,
      openReports: openReports || 0,
      bannedUsers: bannedData?.length || 0,
    });
    setLoading(false);
  }

  const cards = [
    { label: "Total Usuários", value: stats.totalUsers, icon: Users, color: "text-accent" },
    { label: "Matches Hoje", value: stats.matchesToday, icon: Heart, color: "text-accent" },
    { label: "Mensagens Hoje", value: stats.messagesToday, icon: MessageSquare, color: "text-accent" },
    { label: "Denúncias Abertas", value: stats.openReports, icon: AlertTriangle, color: "text-destructive" },
    { label: "Usuários Banidos", value: stats.bannedUsers, icon: Ban, color: "text-destructive" },
  ];

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-foreground">Dashboard Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
