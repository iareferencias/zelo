import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      navigate("/app");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link to="/" className="inline-block">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <span className="font-display text-5xl font-bold tracking-[0.3em] text-foreground">ZELO</span>
            </motion.div>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">Conexões com propósito</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h1 className="font-display text-2xl font-semibold text-foreground">Bem-vindo de volta</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Entre na sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-12 rounded-2xl border-border bg-secondary px-4 text-sm transition-all focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Senha
                  </Label>
                  <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-border bg-secondary px-4 text-sm transition-all focus:border-primary focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-2xl purple-gradient text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>

          <div className="border-t border-border px-8 py-5 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          Conexões guiadas pela fé e pelo propósito
        </p>
      </motion.div>
    </div>
  );
}
