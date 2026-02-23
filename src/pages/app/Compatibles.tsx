import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, User } from "lucide-react";
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
      
      toast({ title: "Match criado", description: "Vocês demonstraram interesse mútuo." });
    } else {
      toast({ title: "Interesse demonstrado", description: "Aguardando reciprocidade." });
    }

    setLikedIds(prev => new Set(prev).add(toUser));
    setTodayLikes(prev => prev + 1);
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="mb-10">
          <div className="skeleton-shimmer h-7 w-48 mb-2" />
          <div className="skeleton-shimmer h-4 w-32" />
        </div>
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Compatíveis</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ordenados por compatibilidade</p>
        </div>
        <span className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{todayLikes}</span>/3 hoje
        </span>
      </div>

      {profiles.length === 0 ? (
        <EmptyState type="compatibles" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            >
              <div className="rounded-xl border border-border bg-card p-6 card-hover">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {p.full_name || "Sem nome"}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        {p.age && <span>{p.age}</span>}
                        {p.city && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />{p.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{p.score}%</span>
                </div>

                {/* Reasons */}
                {p.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.reasons.slice(0, 3).map((r, idx) => (
                      <span key={idx} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Testimony */}
                {p.testimony && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {p.testimony}
                  </p>
                )}

                {/* CTA */}
                <Button
                  size="sm"
                  variant={likedIds.has(p.id) ? "outline" : "default"}
                  className="w-full text-xs font-medium"
                  disabled={likedIds.has(p.id) || todayLikes >= 3}
                  onClick={() => handleLike(p.id)}
                >
                  <Heart className={`mr-1.5 h-3.5 w-3.5 ${likedIds.has(p.id) ? "fill-current" : ""}`} />
                  {likedIds.has(p.id) ? "Interesse demonstrado" : "Demonstrar interesse"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
