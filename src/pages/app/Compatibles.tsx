import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Church, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileWithScore {
  id: string;
  full_name: string;
  age: number | null;
  city: string;
  congregation: string;
  testimony: string;
  gender: string;
  score: number;
  reasons: string[];
}

export default function Compatibles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLikes, setTodayLikes] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    setLoading(true);

    // Get profiles (excluding self)
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, age, city, congregation, testimony, gender")
      .neq("id", user.id)
      .eq("approved", true)
      .eq("marriage_intent", true);

    // Get today's likes count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: likes } = await supabase
      .from("likes")
      .select("id, to_user")
      .eq("from_user", user.id)
      .gte("created_at", today.toISOString());

    const likedSet = new Set((likes || []).map(l => l.to_user));
    setLikedIds(likedSet);
    setTodayLikes(likes?.length || 0);

    // Compute scores for each profile
    const scored: ProfileWithScore[] = [];
    for (const p of profs || []) {
      const { data: scoreData } = await supabase.rpc("compute_match_score", {
        viewer_id: user.id,
        candidate_id: p.id,
      });
      const result = scoreData?.[0] || { score: 0, reasons: [] };
      scored.push({ ...p, score: result.score, reasons: result.reasons || [] });
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    setProfiles(scored);
    setLoading(false);
  }

  async function handleLike(toUser: string) {
    if (!user) return;
    if (todayLikes >= 3) {
      toast({ title: "Limite atingido", description: "Você pode demonstrar interesse em até 3 pessoas por dia.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("likes").insert({ from_user: user.id, to_user: toUser });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Interesse já demonstrado", variant: "destructive" });
      } else {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
      return;
    }

    // Check for mutual like → create match
    const { data: mutual } = await supabase
      .from("likes")
      .select("id")
      .eq("from_user", toUser)
      .eq("to_user", user.id)
      .maybeSingle();

    if (mutual) {
      const [a, b] = [user.id, toUser].sort();
      await supabase.from("matches").insert({ user_a: a, user_b: b });
      toast({ title: "🎉 Match criado!", description: "Vocês demonstraram interesse mútuo." });
    } else {
      toast({ title: "Interesse demonstrado" });
    }

    setLikedIds(prev => new Set(prev).add(toUser));
    setTodayLikes(prev => prev + 1);
  }

  function scoreColor(score: number) {
    if (score >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-muted-foreground bg-muted border-border";
  }

  if (loading) return <div className="text-center text-muted-foreground py-12">Carregando perfis...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Perfis Compatíveis</h1>
          <p className="text-sm text-muted-foreground">Ordenados por compatibilidade</p>
        </div>
        <div className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
          {todayLikes}/3 interesses hoje
        </div>
      </div>

      {profiles.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhum perfil compatível encontrado no momento.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map(p => (
            <Card key={p.id} className="transition-all hover:shadow-lg hover:border-accent/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="font-serif text-lg">{p.full_name || "Sem nome"}</CardTitle>
                  <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${scoreColor(p.score)}`}>
                    <Sparkles className="h-3 w-3" />
                    {p.score}%
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {p.age && <span>{p.age} anos</span>}
                  {p.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</span>}
                  {p.congregation && <span className="flex items-center gap-1"><Church className="h-3 w-3" />{p.congregation}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.reasons.slice(0, 3).map((r, i) => (
                      <span key={i} className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
                {p.testimony && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.testimony}</p>
                )}
                <Button
                  size="sm"
                  className="w-full"
                  disabled={likedIds.has(p.id) || todayLikes >= 3}
                  onClick={() => handleLike(p.id)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {likedIds.has(p.id) ? "Interesse demonstrado" : "Demonstrar interesse"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
