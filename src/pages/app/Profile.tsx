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
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
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
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      city: form.city,
      congregation: form.congregation,
      testimony: form.testimony,
      marriage_intent: form.marriage_intent,
      wants_children: form.wants_children,
      gender: form.gender,
    }).eq("id", user.id);

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
    }
  }

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-serif text-3xl font-semibold text-foreground">Meu Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Informações pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input type="number" min={18} max={99} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Congregação</Label>
                <Input value={form.congregation} onChange={e => setForm(f => ({ ...f, congregation: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Gênero</Label>
                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Testemunho</Label>
              <Textarea
                rows={4}
                value={form.testimony}
                onChange={e => setForm(f => ({ ...f, testimony: e.target.value }))}
                placeholder="Compartilhe um pouco da sua caminhada de fé..."
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
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
