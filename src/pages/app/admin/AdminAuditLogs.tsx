import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs((data as AuditLog[]) || []);
    setLoading(false);
  }

  if (loading) return <div className="text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Logs de Auditoria</h1>
      <p className="mb-6 text-sm text-muted-foreground">Últimas 100 ações administrativas</p>

      {logs.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhum log registrado.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{l.action}</p>
                    {l.target_id && (
                      <p className="text-xs text-muted-foreground">Alvo: {l.target_id.slice(0, 8)}...</p>
                    )}
                    {Object.keys(l.metadata || {}).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(l.metadata)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
