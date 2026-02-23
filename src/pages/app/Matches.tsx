import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Seus Matches</h1>
      <p className="mb-6 text-sm text-muted-foreground">Conexões com interesse mútuo</p>

      {matches.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhum match ainda. Continue demonstrando interesse!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(m => (
            <Card key={m.matchId} className="transition-all hover:shadow-lg hover:border-accent/30">
              <CardHeader>
                <CardTitle className="font-serif text-lg">{m.partnerName}</CardTitle>
                {m.partnerCity && <p className="text-xs text-muted-foreground">{m.partnerCity}</p>}
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-muted-foreground">Match em {m.createdAt}</p>
                <Button size="sm" className="w-full" onClick={() => navigate(`/app/chat/${m.matchId}`)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Conversar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
