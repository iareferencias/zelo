import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Camera, MapPin, Church } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    city: "",
    congregation: "",
    gender: "",
    bio: "",
    objetivo: "amizade",
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
        gender: data.gender || "",
        bio: data.testimony || "",
        objetivo: (data as any).life_goals || "amizade",
      });
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
      gender: form.gender,
      testimony: form.bio,
      life_goals: form.objetivo,
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
      <div className="mx-auto max-w-lg page-transition pb-24 md:pb-8">
        <div className="skeleton-shimmer h-8 w-36 mb-6" />
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-lg page-transition pb-24 md:pb-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Meu Perfil</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {form.full_name ? form.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
          </div>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Card className="border-border bg-card rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Nome completo *</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className="bg-secondary border-border rounded-2xl" />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Idade</Label>
                <Input type="number" min={18} max={99} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} className="bg-secondary border-border rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Gênero</Label>
                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                  <SelectTrigger className="bg-secondary border-border rounded-2xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Cidade
              </Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="bg-secondary border-border rounded-2xl" placeholder="Ex: São Paulo, SP" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Church className="h-3 w-3" /> Igreja
              </Label>
              <Input value={form.congregation} onChange={e => setForm(f => ({ ...f, congregation: e.target.value }))} className="bg-secondary border-border rounded-2xl" placeholder="Nome da sua congregação" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Objetivo</Label>
              <Select value={form.objetivo} onValueChange={v => setForm(f => ({ ...f, objetivo: v }))}>
                <SelectTrigger className="bg-secondary border-border rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="amizade">Amizade</SelectItem>
                  <SelectItem value="relacionamento">Relacionamento</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Bio curta</Label>
              <Textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Conte um pouco sobre você..."
                className="bg-secondary border-border resize-none rounded-2xl"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-2xl font-medium text-sm purple-gradient text-primary-foreground">
              {saving ? "Salvando..." : "Salvar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
