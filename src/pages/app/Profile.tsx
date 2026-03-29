import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShieldCheck, UserCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ProfileExpanded } from "@/components/ProfileExpanded";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [statusLevel, setStatusLevel] = useState("new");
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    city: "",
    congregation: "",
    testimony: "",
    marriage_intent: true,
    wants_children: false,
    gender: "",
    family_vision: "",
    spiritual_routine: "",
    life_goals: "",
  });

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  async function loadProfile() {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setForm({
        full_name: data.full_name || "",
        age: data.age?.toString() || "",
        city: data.city || "",
        congregation: data.congregation || "",
        testimony: data.testimony || "",
        marriage_intent: data.marriage_intent ?? true,
        wants_children: data.wants_children ?? false,
        gender: data.gender || "",
        family_vision: (data as any).family_vision || "",
        spiritual_routine: (data as any).spiritual_routine || "",
        life_goals: (data as any).life_goals || "",
      });
      setStatusLevel((data as any).status_level || "new");

      if ((data as any).invited_by) {
        const { data: inviter } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", (data as any).invited_by)
          .maybeSingle();
        if (inviter) setInviterName(inviter.full_name);
      }
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.full_name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      city: form.city,
      congregation: form.congregation,
      testimony: form.testimony,
      marriage_intent: form.marriage_intent,
      wants_children: form.wants_children,
      gender: form.gender,
      family_vision: form.family_vision,
      spiritual_routine: form.spiritual_routine,
      life_goals: form.life_goals,
      updated_at: new Date().toISOString(),
    } as any);

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✓ Perfil atualizado" });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl page-transition">
        <div className="skeleton-shimmer h-8 w-36 mb-6" />
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-2xl page-transition"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">Meu Perfil</h1>
        <StatusBadge level={statusLevel} size="md" />
      </div>

      {inviterName && (
        <Card className="mb-6 border-accent/30 bg-accent/5">
          <CardContent className="flex items-center gap-3 py-4">
            <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Selo de Confiança</p>
              <p className="text-xs text-muted-foreground">
                Convidado por <span className="font-medium text-foreground">{inviterName}</span>
              </p>
            </div>
            <Badge variant="secondary" className="text-xs gap-1">
              <UserCheck className="h-3 w-3" />
              Verificado
            </Badge>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/60 mb-6">
        <CardHeader>
          <CardTitle className="font-display text-lg">Informações pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Nome completo *</Label>
                <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Idade</Label>
                <Input type="number" min={18} max={99} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Cidade</Label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Congregação</Label>
                <Input value={form.congregation} onChange={e => setForm(f => ({ ...f, congregation: e.target.value }))} className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Gênero</Label>
                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                  <SelectTrigger className="border-border/60"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Testemunho</Label>
              <Textarea
                rows={3}
                value={form.testimony}
                onChange={e => setForm(f => ({ ...f, testimony: e.target.value }))}
                placeholder="Compartilhe um pouco da sua caminhada de fé..."
                className="border-border/60 resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                Sobre mim
              </h3>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Visão de família</Label>
                <Textarea
                  rows={2}
                  value={form.family_vision}
                  onChange={e => setForm(f => ({ ...f, family_vision: e.target.value }))}
                  placeholder="Como você imagina sua família no futuro..."
                  className="border-border/60 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Rotina espiritual</Label>
                <Textarea
                  rows={2}
                  value={form.spiritual_routine}
                  onChange={e => setForm(f => ({ ...f, spiritual_routine: e.target.value }))}
                  placeholder="Como é sua rotina de oração e estudo..."
                  className="border-border/60 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Objetivos de vida</Label>
                <Textarea
                  rows={2}
                  value={form.life_goals}
                  onChange={e => setForm(f => ({ ...f, life_goals: e.target.value }))}
                  placeholder="Quais seus maiores objetivos e sonhos..."
                  className="border-border/60 resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="marriage" checked={form.marriage_intent} onCheckedChange={v => setForm(f => ({ ...f, marriage_intent: !!v }))} />
                <Label htmlFor="marriage" className="text-sm">Tenho intenção de casar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="children" checked={form.wants_children} onCheckedChange={v => setForm(f => ({ ...f, wants_children: !!v }))} />
                <Label htmlFor="children" className="text-sm">Desejo ter filhos</Label>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-xl font-medium text-sm gold-gradient text-accent-foreground">
              {saving ? "Salvando..." : "Salvar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview of expanded profile */}
      {(form.family_vision || form.spiritual_routine || form.life_goals) && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Prévia do perfil expandido</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileExpanded
              familyVision={form.family_vision}
              spiritualRoutine={form.spiritual_routine}
              lifeGoals={form.life_goals}
            />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
