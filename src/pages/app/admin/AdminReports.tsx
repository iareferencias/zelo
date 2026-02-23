import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    setReports(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status atualizado para ${status}` });
      setReports(rs => rs.map(r => r.id === id ? { ...r, status } : r));
    }
  }

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Denúncias</h1>
      <p className="mb-6 text-sm text-muted-foreground">{reports.length} denúncias</p>

      {reports.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhuma denúncia registrada.</p>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{r.reason}</p>
                    {r.details && <p className="mt-1 text-sm text-muted-foreground">{r.details}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.status === "open" ? "destructive" : r.status === "resolved" ? "default" : "secondary"}>
                      {r.status}
                    </Badge>
                    <Select value={r.status} onValueChange={v => updateStatus(r.id, v)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Aberta</SelectItem>
                        <SelectItem value="reviewing">Analisando</SelectItem>
                        <SelectItem value="resolved">Resolvida</SelectItem>
                        <SelectItem value="dismissed">Descartada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
