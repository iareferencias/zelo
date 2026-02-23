import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface ProfileRow {
  id: string;
  full_name: string;
  city: string;
  congregation: string;
  approved: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, city, congregation, approved, created_at")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }

  async function toggleApproval(id: string, approved: boolean) {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: approved ? "Usuário aprovado" : "Aprovação removida" });
      setProfiles(ps => ps.map(p => p.id === id ? { ...p, approved } : p));
    }
  }

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Gerenciar Usuários</h1>
      <p className="mb-6 text-sm text-muted-foreground">{profiles.length} usuários cadastrados</p>
      <div className="space-y-3">
        {profiles.map(p => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">{p.full_name || "Sem nome"}</p>
                <p className="text-xs text-muted-foreground">{p.city} • {p.congregation}</p>
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.approved ? "default" : "secondary"}>
                  {p.approved ? "Aprovado" : "Pendente"}
                </Badge>
                {p.approved ? (
                  <Button size="sm" variant="ghost" onClick={() => toggleApproval(p.id, false)}>
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => toggleApproval(p.id, true)}>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
