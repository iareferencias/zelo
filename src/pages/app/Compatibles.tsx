import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, User, ChevronRight, Handshake } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { MatchCelebration } from "@/components/MatchCelebration";
import { StatusBadge } from "@/components/StatusBadge";
import { ProfileExpanded } from "@/components/ProfileExpanded";

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
  status_level?: string;
  family_vision?: string;
  spiritual_routine?: string;
  life_goals?: string;
}

type ConnectionMode = "relacionamento" | "amizade";

export default function Compatibles() {
  const { user } = useAuth();
  const { isDemoMode, demoProfiles, demoLikedIds, addDemoLike, demoTodayLikes } = useDemoMode();
  const [profiles, setProfiles] = useState<ProfileWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLikes, setTodayLikes] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<ConnectionMode>("relacionamento");
  const [matchCelebration, setMatchCelebration] = useState<{ matchId: string; partnerName: string } | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setProfiles(demoProfiles);
      setCurrentIndex(0);
      setLoading(false);
      return;
    }
    if (!user) return;
    loadData();
  }, [user, isDemoMode]);

  async function loadData() {
    if (!user) return;
    setLoading(true);

    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, age, city, congregation, testimony, gender, status_level, family_vision, spiritual_routine, life_goals")
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
      scored.push({ ...p, score: result.score, reasons: result.reasons || [] } as ProfileWithScore);
    }

    scored.sort((a, b) => b.score - a.score);
    setProfiles(scored);
    setCurrentIndex(0);
    setLoading(false);
  }

  function handleLike(toUser: string) {
    if (isDemoMode) {
      if (demoTodayLikes >= 3) {
        toast({ title: "Limite atingido", description: "Até 3 interesses por dia.", variant: "destructive" });
        return;
      }
      const isMutual = addDemoLike(toUser);
      if (isMutual) {
        setMatchCelebration({ matchId: "demo", partnerName: profiles.find(p => p.id === toUser)?.full_name || "Membro" });
      } else {
        toast({ title: "Interesse demonstrado", description: "Aguardando reciprocidade." });
      }
      return;
    }
    handleLikeReal(toUser);
  }

  async function handleLikeReal(toUser: string) {
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

      const partnerName = profiles.find(p => p.id === toUser)?.full_name || "Membro";
      setMatchCelebration({ matchId: match?.id || "", partnerName });
    } else {
      toast({ title: "Interesse demonstrado", description: "Aguardando reciprocidade." });
    }

    setLikedIds(prev => new Set(prev).add(toUser));
    setTodayLikes(prev => prev + 1);
  }

  const goNext = useCallback(() => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, profiles.length]);

  const currentProfile = profiles[currentIndex];
  const activeLikedIds = isDemoMode ? demoLikedIds : likedIds;
  const activeTodayLikes = isDemoMode ? demoTodayLikes : todayLikes;

  if (loading) {
    return (
      <div className="page-transition">
        <div className="mb-10">
          <div className="skeleton-shimmer h-8 w-48 mb-2" />
          <div className="skeleton-shimmer h-4 w-32" />
        </div>
        <div className="mx-auto max-w-md">
          <div className="skeleton-shimmer h-[480px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <MatchCelebration
        matchId={matchCelebration?.matchId || ""}
        partnerName={matchCelebration?.partnerName || ""}
        open={!!matchCelebration}
        onClose={() => setMatchCelebration(null)}
      />

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Compatíveis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profiles.length > 0
              ? `${currentIndex + 1} de ${profiles.length} perfis`
              : "Nenhum perfil encontrado"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-border bg-card p-0.5">
            <button
              onClick={() => setMode("relacionamento")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                mode === "relacionamento"
                  ? "gold-gradient text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="h-3 w-3" />
              Relacionamento
            </button>
            <button
              onClick={() => setMode("amizade")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                mode === "amizade"
                  ? "gold-gradient text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Handshake className="h-3 w-3" />
              Amizade
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-accent">{activeTodayLikes}</span>/3
          </span>
        </div>
      </div>

      {profiles.length === 0 ? (
        <EmptyState type="compatibles" />
      ) : (
        <div className="mx-auto max-w-md">
          <AnimatePresence mode="wait">
            {currentProfile && (
              <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                isLiked={activeLikedIds.has(currentProfile.id)}
                canLike={activeTodayLikes < 3}
                onLike={() => handleLike(currentProfile.id)}
                onNext={goNext}
                hasNext={currentIndex < profiles.length - 1}
                mode={mode}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface ProfileCardProps {
  profile: ProfileWithScore;
  isLiked: boolean;
  canLike: boolean;
  onLike: () => void;
  onNext: () => void;
  hasNext: boolean;
  mode: ConnectionMode;
}

function ProfileCard({ profile, isLiked, canLike, onLike, onNext, hasNext, mode }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">Compatibilidade</span>
          <span className="font-display text-2xl font-semibold text-accent">{profile.score}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gold-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${profile.score}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      <div className="px-6 pb-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground leading-tight">
                {profile.full_name || "Sem nome"}
              </h2>
              {profile.status_level && profile.status_level !== "new" && (
                <StatusBadge level={profile.status_level} />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              {profile.age && <span>{profile.age} anos</span>}
              {profile.city && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />{profile.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.congregation && (
          <p className="text-xs text-muted-foreground mb-4">
            <span className="font-medium text-foreground">Congregação:</span> {profile.congregation}
          </p>
        )}

        {profile.reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.reasons.map((r, idx) => (
              <span
                key={idx}
                className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-medium text-accent"
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {profile.testimony && (
          <div className="rounded-xl bg-muted/50 p-4 mb-4">
            <p className="text-xs font-medium text-foreground mb-1">Testemunho</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{profile.testimony}</p>
          </div>
        )}

        {(profile.family_vision || profile.spiritual_routine || profile.life_goals) && (
          <div className="mb-4">
            <ProfileExpanded
              familyVision={profile.family_vision || ""}
              spiritualRoutine={profile.spiritual_routine || ""}
              lifeGoals={profile.life_goals || ""}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 px-6 pb-6">
        <Button
          size="lg"
          variant={isLiked ? "outline" : "default"}
          className={`flex-1 text-sm font-medium rounded-xl ${
            !isLiked ? "gold-gradient text-accent-foreground shadow-md hover:shadow-lg transition-shadow" : ""
          }`}
          disabled={isLiked || !canLike}
          onClick={onLike}
        >
          <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          {isLiked
            ? "Interesse demonstrado"
            : mode === "amizade"
              ? "Quero conhecer"
              : "Demonstrar interesse"}
        </Button>
        {hasNext && (
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-4"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
