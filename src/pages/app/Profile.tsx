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

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    city: "",
    congregation: "",
    testimony: "",
    marriage_intent: true,
    wants_children: false,
    gender: "",
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
      });

      // Load inviter name for trust seal
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
      updated_at: new Date().toISOString(),
    });

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
      <h1 className="mb-6 font-serif text-3xl font-semibold text-foreground tracking-tight">Meu Perfil</h1>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Informações pessoais</CardTitle>
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
                rows={4}
                value={form.testimony}
                onChange={e => setForm(f => ({ ...f, testimony: e.target.value }))}
                placeholder="Compartilhe um pouco da sua caminhada de fé..."
                className="border-border/60 resize-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="marriage"
                  checked={form.marriage_intent}
                  onCheckedChange={v => setForm(f => ({ ...f, marriage_intent: !!v }))}
                />
                <Label htmlFor="marriage" className="text-sm">Tenho intenção de casar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="children"
                  checked={form.wants_children}
                  onCheckedChange={v => setForm(f => ({ ...f, wants_children: !!v }))}
                />
                <Label htmlFor="children" className="text-sm">Desejo ter filhos</Label>
              </div>
            </div>
            <Button type="submit" disabled={saving} className="w-full rounded-lg font-medium text-sm tracking-wide">
              {saving ? "Salvando..." : "Salvar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
