import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  approve_user: { label: "Aprovação", color: "bg-green-100 text-green-800" },
  unapprove_user: { label: "Reprovação", color: "bg-amber-100 text-amber-800" },
  ban_user: { label: "Banimento", color: "bg-red-100 text-red-800" },
  unban_user: { label: "Desbanimento", color: "bg-green-100 text-green-800" },
  set_warning_level: { label: "Aviso", color: "bg-amber-100 text-amber-800" },
  set_role: { label: "Role alterada", color: "bg-blue-100 text-blue-800" },
  remove_role: { label: "Role removida", color: "bg-gray-100 text-gray-800" },
  edit_user: { label: "Edição", color: "bg-blue-100 text-blue-800" },
  delete_user: { label: "Exclusão", color: "bg-red-100 text-red-800" },
  report_resolved: { label: "Denúncia resolvida", color: "bg-green-100 text-green-800" },
  report_dismissed: { label: "Denúncia descartada", color: "bg-gray-100 text-gray-800" },
  report_reviewing: { label: "Denúncia em análise", color: "bg-amber-100 text-amber-800" },
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setLogs((data as AuditLog[]) || []);
    setLoading(false);
  }

  const filtered = logs.filter(l =>
    !search.trim() ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target_user_id?.includes(search)
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]"><div className="animate-pulse text-muted-foreground">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Logs de Auditoria</h1>
        <p className="text-sm text-muted-foreground">{logs.length} ações registradas</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por ação..."
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhum log registrado.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => {
            const info = actionLabels[l.action] || { label: l.action, color: "bg-gray-100 text-gray-800" };
            return (
              <Card key={l.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${info.color} font-normal`}>{info.label}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {l.action}
                        </span>
                      </div>
                      {l.target_user_id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Alvo: <span className="font-mono">{l.target_user_id.slice(0, 12)}...</span>
                        </p>
                      )}
                      {l.admin_id && (
                        <p className="text-xs text-muted-foreground">
                          Por: <span className="font-mono">{l.admin_id.slice(0, 12)}...</span>
                        </p>
                      )}
                      {l.details && Object.keys(l.details).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 px-2 py-1 rounded">
                          {JSON.stringify(l.details)}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
