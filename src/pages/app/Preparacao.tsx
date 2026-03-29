import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Heart, Users, Home, MessageCircle, Shield, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Module {
  key: string;
  icon: React.ElementType;
  title: string;
  category: string;
  desc: string;
}

const modules: Module[] = [
  {
    key: "comunicacao_1",
    icon: MessageCircle,
    title: "Comunicação honesta",
    category: "Comunicação",
    desc: "Como desenvolver uma comunicação respeitosa e edificante no relacionamento.",
  },
  {
    key: "comunicacao_2",
    icon: MessageCircle,
    title: "Resolução de conflitos",
    category: "Comunicação",
    desc: "Evitar conflitos destrutivos e transformar desentendimentos em crescimento.",
  },
  {
    key: "financas_1",
    icon: Home,
    title: "Planejamento financeiro",
    category: "Finanças",
    desc: "Princípios de administração financeira para casais. Planejamento e economia.",
  },
  {
    key: "financas_2",
    icon: Home,
    title: "Generosidade e prioridades",
    category: "Finanças",
    desc: "Como alinhar valores financeiros e praticar generosidade como casal.",
  },
  {
    key: "proposito_1",
    icon: BookOpen,
    title: "O propósito do casamento",
    category: "Propósito",
    desc: "Entender o plano de Deus para a vida a dois, segundo as Escrituras.",
  },
  {
    key: "proposito_2",
    icon: Heart,
    title: "Preparação emocional",
    category: "Propósito",
    desc: "Desenvolver maturidade emocional para um relacionamento saudável.",
  },
  {
    key: "proposito_3",
    icon: Users,
    title: "Família e valores",
    category: "Propósito",
    desc: "Compartilhar valores fundamentais e construir sobre alicerces sólidos.",
  },
  {
    key: "proposito_4",
    icon: Shield,
    title: "Limites e pureza",
    category: "Propósito",
    desc: "Manter limites saudáveis durante o período de conhecimento.",
  },
];

export default function Preparacao() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProgress();
  }, [user]);

  async function loadProgress() {
    if (!user) return;
    const { data } = await supabase
      .from("preparation_progress")
      .select("module_key")
      .eq("user_id", user.id)
      .eq("completed", true);
    setCompleted(new Set((data || []).map((d: any) => d.module_key)));
    setLoading(false);
  }

  async function toggleModule(key: string) {
    if (!user) return;
    const isCompleted = completed.has(key);

    if (isCompleted) {
      await supabase
        .from("preparation_progress")
        .update({ completed: false, completed_at: null })
        .eq("user_id", user.id)
        .eq("module_key", key);
      setCompleted(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    } else {
      await supabase
        .from("preparation_progress")
        .upsert({
          user_id: user.id,
          module_key: key,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      setCompleted(prev => new Set(prev).add(key));

      const newCount = completed.size + 1;
      if (newCount === modules.length) {
        toast({ title: "🎉 Trilha completa!", description: "Você recebeu o badge 'Preparado'." });
        await supabase.from("profiles").update({ status_level: "prepared" }).eq("id", user.id);
      } else {
        toast({ title: "✓ Módulo concluído" });
      }
    }
  }

  const progress = Math.round((completed.size / modules.length) * 100);
  const allDone = completed.size === modules.length;

  const categories = [...new Set(modules.map(m => m.category))];

  if (loading) {
    return (
      <div className="page-transition">
        <div className="skeleton-shimmer h-8 w-64 mb-4" />
        <div className="skeleton-shimmer h-4 w-40 mb-8" />
        <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-xl" />
        ))}</div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
            Trilha de Preparação
          </h1>
          {allDone && (
            <Badge variant="secondary" className="gap-1 text-accent border-accent/20 bg-accent/10">
              <Sparkles className="h-3 w-3" />
              Preparado
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Complete os módulos para se preparar para um relacionamento sólido.
        </p>
      </div>

      <div className="mb-8 max-w-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progresso</span>
          <span className="text-xs font-semibold text-accent">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-1 text-[11px] text-muted-foreground">
          {completed.size} de {modules.length} módulos concluídos
        </p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 px-1">
            {cat}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {modules.filter(m => m.category === cat).map((m, i) => {
              const done = completed.has(m.key);
              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Card className={`card-hover border-border/60 h-full transition-colors ${done ? "border-accent/20 bg-accent/[0.03]" : ""}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                          <m.icon className="h-4 w-4 text-accent" />
                        </div>
                        {done && (
                          <CheckCircle className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <CardTitle className="font-display text-base mt-2">{m.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
                      <Button
                        size="sm"
                        variant={done ? "outline" : "default"}
                        className={`w-full text-xs ${!done ? "gold-gradient text-accent-foreground" : ""}`}
                        onClick={() => toggleModule(m.key)}
                      >
                        {done ? "Desmarcar" : "Concluir módulo"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
