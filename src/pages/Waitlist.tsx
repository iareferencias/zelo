import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Users, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [totalActive, setTotalActive] = useState<number>(0);
  const [totalWaitlist, setTotalWaitlist] = useState<number>(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [{ count: activeCount }, { count: waitCount }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approved", true),
      supabase.from("waitlist").select("id", { count: "exact", head: true }),
    ]);
    setTotalActive(activeCount || 0);
    setTotalWaitlist(waitCount || 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Preencha nome e e-mail", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({ name: name.trim(), email: email.trim(), city: city.trim() || null });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      setPosition(totalWaitlist + 1);
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center border-border/60">
            <CardHeader className="pb-4">
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gold-gradient"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-7 w-7 text-accent-foreground" />
              </motion.div>
              <CardTitle className="font-display text-2xl">Você está na fila</CardTitle>
              <CardDescription className="mt-2">
                Assim que tivermos uma vaga, enviaremos seu convite por e-mail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {position && (
                <motion.div
                  className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Sua posição</p>
                  <p className="font-display text-3xl font-semibold text-accent">#{position}</p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="ghost" asChild>
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-border/60">
          <CardHeader className="text-center pb-4">
            <Link to="/" className="mb-3 inline-block font-display text-2xl font-semibold tracking-[0.2em] text-foreground">
              ZELO
            </Link>
            <CardTitle className="font-display text-xl">Solicitar Acesso</CardTitle>
            <CardDescription className="mt-1">
              O acesso ao ZELO é controlado para garantir qualidade e segurança.
            </CardDescription>
          </CardHeader>

          {/* Stats */}
          <CardContent className="pb-2">
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <Users className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                <p className="font-display text-lg font-semibold text-foreground">{totalActive}</p>
                <p className="text-[10px] text-muted-foreground">Membros ativos</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <Clock className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                <p className="font-display text-lg font-semibold text-foreground">{totalWaitlist}</p>
                <p className="text-[10px] text-muted-foreground">Na fila</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                <p className="font-display text-lg font-semibold text-foreground">100%</p>
                <p className="text-[10px] text-muted-foreground">Verificados</p>
              </div>
            </div>
          </CardContent>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Nome completo</Label>
                <Input id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" maxLength={100} className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">E-mail</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" maxLength={255} className="border-border/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">Cidade (opcional)</Label>
                <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Sua cidade" maxLength={100} className="border-border/60" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full gold-gradient text-accent-foreground rounded-xl font-medium" disabled={loading}>
                {loading ? "Enviando..." : "Entrar na fila de espera"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Já tem convite?{" "}
                <Link to="/signup" className="text-accent hover:underline font-medium">Criar conta</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
