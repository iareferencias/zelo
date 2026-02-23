import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";

interface MatchWithProfile {
  matchId: string;
  partnerId: string;
  partnerName: string;
  partnerCity: string;
  createdAt: string;
}

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadMatches();
  }, [user]);

  async function loadMatches() {
    if (!user) return;
    const { data } = await supabase
      .from("matches")
      .select("id, user_a, user_b, created_at")
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!data) { setLoading(false); return; }

    const partnerIds = data.map(m => m.user_a === user.id ? m.user_b : m.user_a);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, city")
      .in("id", partnerIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    setMatches(data.map(m => {
      const pid = m.user_a === user.id ? m.user_b : m.user_a;
      const prof = profileMap.get(pid);
      return {
        matchId: m.id,
        partnerId: pid,
        partnerName: prof?.full_name || "Membro",
        partnerCity: prof?.city || "",
        createdAt: new Date(m.created_at).toLocaleDateString("pt-BR"),
      };
    }));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="mb-8">
          <div className="skeleton-shimmer h-8 w-44 mb-2" />
          <div className="skeleton-shimmer h-4 w-56" />
        </div>
        <GridSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight">Seus Matches</h1>
        <p className="mt-1 text-sm text-muted-foreground">Conexões com interesse mútuo</p>
      </div>

      {matches.length === 0 ? (
        <EmptyState type="matches" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m, i) => (
            <motion.div
              key={m.matchId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="card-hover border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">{m.partnerName}</h3>
                      {m.partnerCity && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />{m.partnerCity}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mb-4 text-[11px] text-muted-foreground">Match em {m.createdAt}</p>
                  <Button
                    size="sm"
                    className="w-full rounded-lg font-medium text-xs tracking-wide"
                    onClick={() => navigate(`/app/chat/${m.matchId}`)}
                  >
                    <MessageCircle className="mr-2 h-3.5 w-3.5" />
                    Conversar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
