import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Ban, AlertTriangle, ShieldCheck, Shield, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileRow {
  id: string;
  full_name: string;
  city: string;
  congregation: string;
  approved: boolean;
  created_at: string;
  warning_level: number;
  banned_until: string | null;
  status_level: string;
  behavior_score: number;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [banDays, setBanDays] = useState("7");
  const [banTarget, setBanTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<ProfileRow | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", city: "", congregation: "" });
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: profileData }, { data: roleData }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, city, congregation, approved, created_at, warning_level, banned_until, status_level, behavior_score")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    setProfiles((profileData as ProfileRow[]) || []);

    const roleMap = new Map<string, string>();
    (roleData as UserRole[] || []).forEach((r) => roleMap.set(r.user_id, r.role));
    setRoles(roleMap);
    setLoading(false);
  }

  async function logAudit(action: string, targetId: string, details: Record<string, unknown> = {}) {
    if (!user) return;
    await supabase.from("audit_logs").insert({
      admin_id: user.id,
      action,
      target_user_id: targetId,
      details,
    });
  }

  async function toggleApproval(id: string, approved: boolean) {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: approved ? "Usuário aprovado" : "Aprovação removida" });
      await logAudit(approved ? "approve_user" : "unapprove_user", id);
      setProfiles(ps => ps.map(p => p.id === id ? { ...p, approved } : p));
    }
  }

  async function banUser(id: string) {
    const days = parseInt(banDays) || 7;
    const until = new Date();
    until.setDate(until.getDate() + days);
    const { error } = await supabase.from("profiles").update({ banned_until: until.toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Usuário banido por ${days} dias` });
      await logAudit("ban_user", id, { days });
      setProfiles(ps => ps.map(p => p.id === id ? { ...p, banned_until: until.toISOString() } : p));
    }
    setBanTarget(null);
  }

  async function unban(id: string) {
    await supabase.from("profiles").update({ banned_until: null }).eq("id", id);
    await logAudit("unban_user", id);
    toast({ title: "Ban removido" });
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, banned_until: null } : p));
  }

  async function setWarning(id: string, level: number) {
    await supabase.from("profiles").update({ warning_level: level }).eq("id", id);
    await logAudit("set_warning_level", id, { level });
    toast({ title: `Warning level: ${level}` });
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, warning_level: level } : p));
  }

  async function setRole(id: string, newRole: string) {
    if (newRole === "user") {
      // Remove role entry (default is user)
      await supabase.from("user_roles").delete().eq("user_id", id);
      setRoles(prev => { const m = new Map(prev); m.delete(id); return m; });
      await logAudit("remove_role", id);
      toast({ title: "Role removida — agora é usuário comum" });
    } else {
      // Upsert role
      const existing = roles.get(id);
      if (existing) {
        await supabase.from("user_roles").update({ role: newRole as any }).eq("user_id", id);
      } else {
        await supabase.from("user_roles").insert({ user_id: id, role: newRole as any });
      }
      setRoles(prev => new Map(prev).set(id, newRole));
      await logAudit("set_role", id, { role: newRole });
      toast({ title: `Promovido a ${newRole}` });
    }
  }

  function openEdit(p: ProfileRow) {
    setEditForm({ full_name: p.full_name, city: p.city || "", congregation: p.congregation || "" });
    setEditTarget(p);
  }

  async function saveEdit() {
    if (!editTarget) return;
    const { error } = await supabase.from("profiles").update({
      full_name: editForm.full_name,
      city: editForm.city,
      congregation: editForm.congregation,
    }).eq("id", editTarget.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado" });
      await logAudit("edit_user", editTarget.id, editForm);
      setProfiles(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...editForm } : p));
    }
    setEditTarget(null);
  }

  async function deleteUser(id: string) {
    const { error } = await supabase.functions.invoke("delete-user", { body: { userId: id } });
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário excluído" });
      await logAudit("delete_user", id);
      setProfiles(ps => ps.filter(p => p.id !== id));
    }
  }

  const isBanned = (p: ProfileRow) => p.banned_until && new Date(p.banned_until) > new Date();

  const filtered = profiles.filter(p =>
    !search.trim() ||
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.congregation?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (id: string) => {
    const role = roles.get(id);
    if (role === "admin") return <Badge className="bg-accent text-accent-foreground">Admin</Badge>;
    if (role === "moderator") return <Badge variant="outline" className="border-blue-400 text-blue-600">Moderador</Badge>;
    return null;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[200px]"><div className="animate-pulse text-muted-foreground">Carregando...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Gerenciar Usuários</h1>
        <p className="text-sm text-muted-foreground">{profiles.length} usuários cadastrados</p>
      </div>

      <Input
        placeholder="Buscar por nome, cidade ou congregação..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="space-y-3">
        {filtered.map(p => (
          <Card key={p.id} className={isBanned(p) ? "border-destructive/30" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{p.full_name || "Sem nome"}</p>
                    {getRoleBadge(p.id)}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.city || "—"} • {p.congregation || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR")} · Score: {p.behavior_score} · {p.status_level}
                  </p>
                  <div className="mt-1.5 flex gap-1.5 flex-wrap">
                    <Badge variant={p.approved ? "default" : "secondary"}>
                      {p.approved ? "Aprovado" : "Pendente"}
                    </Badge>
                    {p.warning_level > 0 && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Aviso {p.warning_level}
                      </Badge>
                    )}
                    {isBanned(p) && (
                      <Badge variant="destructive">
                        <Ban className="mr-1 h-3 w-3" />
                        Banido até {new Date(p.banned_until!).toLocaleDateString("pt-BR")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {/* Approve/Unapprove */}
                  {p.approved ? (
                    <Button size="sm" variant="ghost" onClick={() => toggleApproval(p.id, false)} title="Remover aprovação">
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => toggleApproval(p.id, true)} title="Aprovar">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  {/* Warning level */}
                  <Select value={String(p.warning_level)} onValueChange={v => setWarning(p.id, parseInt(v))}>
                    <SelectTrigger className="w-[80px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Nível 0</SelectItem>
                      <SelectItem value="1">Nível 1</SelectItem>
                      <SelectItem value="2">Nível 2</SelectItem>
                      <SelectItem value="3">Nível 3</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Ban / Unban */}
                  {isBanned(p) ? (
                    <Button size="sm" variant="outline" onClick={() => unban(p.id)} className="text-xs">
                      Desbanir
                    </Button>
                  ) : (
                    <Dialog open={banTarget === p.id} onOpenChange={o => setBanTarget(o ? p.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" title="Banir">
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-serif">Banir {p.full_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <label className="text-sm text-muted-foreground">Duração (dias)</label>
                          <Input type="number" value={banDays} onChange={e => setBanDays(e.target.value)} min="1" max="365" />
                          <Button className="w-full" variant="destructive" onClick={() => banUser(p.id)}>
                            Confirmar banimento
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Role management */}
                  <Select value={roles.get(p.id) || "user"} onValueChange={v => setRole(p.id, v)}>
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Edit */}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(p)} title="Editar">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir {p.full_name || "este usuário"}? Esta ação é irreversível.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteUser(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            {search ? "Nenhum resultado encontrado." : "Nenhum usuário cadastrado."}
          </p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={o => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Nome</Label>
              <Input value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm">Cidade</Label>
              <Input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm">Congregação</Label>
              <Input value={editForm.congregation} onChange={e => setEditForm(f => ({ ...f, congregation: e.target.value }))} />
            </div>
            <Button className="w-full" onClick={saveEdit}>Salvar alterações</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
