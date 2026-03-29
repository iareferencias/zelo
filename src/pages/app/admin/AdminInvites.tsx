import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Ban, Copy } from "lucide-react";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ZELO-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function AdminInvites() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["admin-invites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    },
  });

  const { data: waitlist = [] } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invites").update({ status: "revoked" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invites"] });
      toast({ title: "Convite revogado" });
    },
  });

  async function generateBatch() {
    setGenerating(true);
    const { data: { user } } = await supabase.auth.getUser();
    const codes = Array.from({ length: 100 }, () => ({
      code: generateCode(),
      created_by: user?.id ?? null,
      status: "active" as const,
    }));
    const { error } = await supabase.from("invites").insert(codes);
    setGenerating(false);
    if (error) {
      toast({ title: "Erro ao gerar códigos", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin-invites"] });
      toast({ title: "100 convites gerados!" });
    }
  }

  const activeCount = invites.filter(i => i.status === "active").length;
  const usedCount = invites.filter(i => i.status === "used").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Convites</h1>
        <p className="text-sm text-muted-foreground">Gerencie os códigos de convite</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-accent">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{usedCount}</p>
            <p className="text-xs text-muted-foreground">Usados</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">{waitlist.length}</p>
            <p className="text-xs text-muted-foreground">Na fila</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button onClick={generateBatch} disabled={generating}>
          <Plus className="mr-2 h-4 w-4" />
          {generating ? "Gerando..." : "Gerar 100 convites"}
        </Button>
      </div>

      {/* Convites */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Códigos de convite</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead>Código</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Criado por</TableHead>
                     <TableHead>Usado por</TableHead>
                     <TableHead>Criado em</TableHead>
                     <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.slice(0, 50).map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-sm">{inv.code}</TableCell>
                       <TableCell>
                         <Badge variant={inv.status === "active" ? "default" : inv.status === "used" ? "secondary" : "destructive"}>
                           {inv.status}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-xs text-muted-foreground">{inv.created_by ? inv.created_by.substring(0, 8) + "..." : "Admin"}</TableCell>
                       <TableCell className="text-xs text-muted-foreground">{inv.used_by ? inv.used_by.substring(0, 8) + "..." : "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { navigator.clipboard.writeText(inv.code); toast({ title: "Código copiado!" }); }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {inv.status === "active" && (
                          <Button variant="ghost" size="icon" onClick={() => revokeMutation.mutate(inv.id)}>
                            <Ban className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {invites.length > 50 && (
                <p className="mt-2 text-xs text-muted-foreground text-center">Mostrando 50 de {invites.length}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waitlist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de espera</CardTitle>
        </CardHeader>
        <CardContent>
          {waitlist.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma solicitação ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{w.email}</TableCell>
                    <TableCell>{w.city || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(w.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
