import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Church, Sparkles, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";

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

    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, age, city, congregation, testimony, gender")
      .neq("id", user.id)
      .eq("approved", true)
      .eq("marriage_intent", true);

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

    const scored: ProfileWithScore[] = [];
    for (const p of profs || []) {
      const { data: scoreData } = await supabase.rpc("compute_match_score", {
        viewer_id: user.id,
        candidate_id: p.id,
      });
      const result = scoreData?.[0] || { score: 0, reasons: [] };
      scored.push({ ...p, score: result.score, reasons: result.reasons || [] });
    }

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

    await supabase.from("notifications").insert({
      user_id: toUser,
      type: "like_received",
      reference_id: user.id,
    } as any);

    const { data: mutual } = await supabase
      .from("likes")
      .select("id")
      .eq("from_user", toUser)
      .eq("to_user", user.id)
      .maybeSingle();

    if (mutual) {
      const [a, b] = [user.id, toUser].sort();
      const { data: match } = await supabase.from("matches").insert({ user_a: a, user_b: b }).select("id").single();
      
      await supabase.from("notifications").insert([
        { user_id: user.id, type: "match_created", reference_id: match?.id },
        { user_id: toUser, type: "match_created", reference_id: match?.id },
      ] as any);
      
      toast({ title: "🎉 Match criado!", description: "Vocês demonstraram interesse mútuo." });
    } else {
      toast({ title: "💛 Interesse demonstrado", description: "Aguardando reciprocidade." });
    }

    setLikedIds(prev => new Set(prev).add(toUser));
    setTodayLikes(prev => prev + 1);
  }

  function scoreColor(score: number) {
    if (score >= 70) return "text-accent bg-accent/10 border-accent/20";
    if (score >= 40) return "text-muted-foreground bg-muted border-border";
    return "text-muted-foreground bg-muted border-border";
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="skeleton-shimmer h-8 w-56 mb-2" />
            <div className="skeleton-shimmer h-4 w-36" />
          </div>
          <div className="skeleton-shimmer h-9 w-36 rounded-full" />
        </div>
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight">Perfis Compatíveis</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ordenados por compatibilidade</p>
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
          <span className="text-foreground font-semibold">{todayLikes}</span>/3 interesses hoje
        </div>
      </div>

      {profiles.length === 0 ? (
        <EmptyState type="compatibles" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="card-hover overflow-hidden border-border/60">
                <CardContent className="p-5 space-y-4">
                  {/* Header with avatar placeholder + score */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground leading-tight truncate">
                            {p.full_name || "Sem nome"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            {p.age && <span>{p.age} anos</span>}
                            {p.city && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />{p.city}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shrink-0 ${scoreColor(p.score)}`}>
                          <Sparkles className="h-3 w-3" />
                          {p.score}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Congregation */}
                  {p.congregation && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Church className="h-3.5 w-3.5" />
                      <span>{p.congregation}</span>
                    </div>
                  )}

                  {/* Reason chips */}
                  {p.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.reasons.slice(0, 3).map((r, idx) => (
                        <span key={idx} className="rounded-full bg-accent/8 border border-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Testimony preview */}
                  {p.testimony && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      "{p.testimony}"
                    </p>
                  )}

                  {/* CTA */}
                  <Button
                    size="sm"
                    className="w-full rounded-lg font-medium text-xs tracking-wide"
                    variant={likedIds.has(p.id) ? "outline" : "default"}
                    disabled={likedIds.has(p.id) || todayLikes >= 3}
                    onClick={() => handleLike(p.id)}
                  >
                    <Heart className={`mr-2 h-3.5 w-3.5 ${likedIds.has(p.id) ? "fill-accent text-accent" : ""}`} />
                    {likedIds.has(p.id) ? "Interesse demonstrado" : "Demonstrar interesse"}
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
