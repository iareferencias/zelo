import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, MessageSquare, AlertTriangle, Ban, Clock, TreePine, Crown, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  matchesTotal: number;
  matchesToday: number;
  messagesToday: number;
  openReports: number;
  bannedUsers: number;
  activeInvites: number;
  usedInvites: number;
  waitlistCount: number;
  preparedUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    matchesTotal: 0,
    matchesToday: 0,
    messagesToday: 0,
    openReports: 0,
    bannedUsers: 0,
    activeInvites: 0,
    usedInvites: 0,
    waitlistCount: 0,
    preparedUsers: 0,
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
      { count: approvedUsers },
      { count: pendingUsers },
      { count: matchesTotal },
      { count: matchesToday },
      { count: messagesToday },
      { count: openReports },
      { data: bannedData },
      { count: activeInvites },
      { count: usedInvites },
      { count: waitlistCount },
      { count: preparedUsers },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approved", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approved", false),
      supabase.from("matches").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("messages").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("profiles").select("id").gt("banned_until", new Date().toISOString()),
      supabase.from("invites").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("invites").select("*", { count: "exact", head: true }).eq("status", "used"),
      supabase.from("waitlist").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status_level", "prepared"),
    ]);

    setStats({
      totalUsers: totalUsers || 0,
      approvedUsers: approvedUsers || 0,
      pendingUsers: pendingUsers || 0,
      matchesTotal: matchesTotal || 0,
      matchesToday: matchesToday || 0,
      messagesToday: messagesToday || 0,
      openReports: openReports || 0,
      bannedUsers: bannedData?.length || 0,
      activeInvites: activeInvites || 0,
      usedInvites: usedInvites || 0,
      waitlistCount: waitlistCount || 0,
      preparedUsers: preparedUsers || 0,
    });
    setLoading(false);
  }

  const sections = [
    {
      title: "Usuários",
      cards: [
        { label: "Total", value: stats.totalUsers, icon: Users, color: "text-accent" },
        { label: "Aprovados", value: stats.approvedUsers, icon: Users, color: "text-green-600" },
        { label: "Pendentes", value: stats.pendingUsers, icon: Clock, color: "text-amber-500" },
        { label: "Banidos", value: stats.bannedUsers, icon: Ban, color: "text-destructive" },
        { label: "Preparados", value: stats.preparedUsers, icon: Crown, color: "text-accent" },
      ],
    },
    {
      title: "Engajamento",
      cards: [
        { label: "Matches Total", value: stats.matchesTotal, icon: Heart, color: "text-accent" },
        { label: "Matches Hoje", value: stats.matchesToday, icon: TrendingUp, color: "text-accent" },
        { label: "Msgs Hoje", value: stats.messagesToday, icon: MessageSquare, color: "text-accent" },
      ],
    },
    {
      title: "Convites & Moderação",
      cards: [
        { label: "Convites Ativos", value: stats.activeInvites, icon: TreePine, color: "text-accent" },
        { label: "Convites Usados", value: stats.usedInvites, icon: TreePine, color: "text-muted-foreground" },
        { label: "Lista de Espera", value: stats.waitlistCount, icon: Clock, color: "text-amber-500" },
        { label: "Denúncias", value: stats.openReports, icon: AlertTriangle, color: "text-destructive" },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-muted-foreground">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma ZELO</p>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
            {section.title}
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {section.cards.map((c) => (
              <Card key={c.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
