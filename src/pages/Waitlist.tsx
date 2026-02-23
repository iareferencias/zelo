import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle className="h-7 w-7 text-accent" />
            </div>
            <CardTitle className="font-serif text-2xl">Você está na fila!</CardTitle>
            <CardDescription>Assim que tivermos uma vaga, enviaremos seu convite por e-mail.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="ghost" asChild>
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mb-2 inline-block font-serif text-3xl font-bold tracking-widest text-foreground">ZELO</Link>
          <CardTitle className="font-serif text-xl">Solicitar Convite</CardTitle>
          <CardDescription>Deixe seus dados e entraremos em contato quando houver vaga.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade (opcional)</Label>
              <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Sua cidade" maxLength={100} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Entrar na fila"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Já tem convite?{" "}
              <Link to="/signup" className="text-accent hover:underline">Criar conta</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
