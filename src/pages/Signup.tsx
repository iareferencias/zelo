import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      toast({ title: "Insira o código de convite", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha deve ter ao menos 6 caracteres", variant: "destructive" });
      return;
    }

    setLoading(true);

    // 1. Verificar convite
    const { data: invite, error: invErr } = await supabase
      .from("invites")
      .select("id, status, created_by, tree_depth")
      .eq("code", code)
      .eq("status", "active")
      .maybeSingle();

    if (invErr || !invite) {
      setLoading(false);
      toast({ title: "Código inválido ou já utilizado", variant: "destructive" });
      return;
    }

    // 2. Criar conta
    const { error, data: signUpData } = await signUp(email, password);
    if (error) {
      setLoading(false);
      toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
      return;
    }

    // 3. Marcar convite como usado e rastrear árvore
    const userId = signUpData?.user?.id;
    if (userId) {
      await supabase
        .from("invites")
        .update({ used_by: userId, status: "used", used_at: new Date().toISOString() })
        .eq("id", invite.id);

      // Atualizar perfil com quem convidou e profundidade na árvore
      const invitedBy = invite.created_by;
      const newDepth = (invite.tree_depth ?? 0) + 1;
      await supabase
        .from("profiles")
        .update({ invited_by: invitedBy, invite_tree_depth: newDepth })
        .eq("id", userId);
    }

    setLoading(false);
    toast({ title: "Cadastro realizado!", description: "Verifique seu e-mail para confirmar a conta." });
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md border-border/30 bg-card shadow-2xl">
        <CardHeader className="text-center">
          <Link to="/" className="mb-2 inline-block font-serif text-3xl font-bold tracking-widest text-foreground">ZELO</Link>
          <CardTitle className="font-serif text-xl">Criar Conta</CardTitle>
          <CardDescription>Use seu código de convite para acessar o ZELO</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite">Código de convite</Label>
              <Input
                id="invite"
                required
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                placeholder="ZELO-XXXXXX"
                className="font-mono tracking-wider text-center uppercase"
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 caracteres" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar Senha</Label>
              <Input id="confirm" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repita a senha" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Não tem convite?{" "}
              <Link to="/waitlist" className="text-accent hover:underline">Entrar na fila</Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="text-accent hover:underline">Entrar</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
