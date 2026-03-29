import { motion } from "framer-motion";
import { Check, X, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const freeBenefits = [
  { text: "Ver perfis compatíveis", included: true },
  { text: "3 curtidas por dia", included: true },
  { text: "Receber matches", included: true },
  { text: "Chat básico com matches", included: true },
  { text: "Curtidas ilimitadas", included: false },
  { text: "Ver quem curtiu você", included: false },
  { text: "Perfil em destaque", included: false },
  { text: "Filtros avançados", included: false },
];

const plusBenefits = [
  { text: "Ver perfis compatíveis", included: true },
  { text: "Curtidas ilimitadas", included: true },
  { text: "Receber matches", included: true },
  { text: "Chat completo com matches", included: true },
  { text: "Ver quem curtiu você", included: true },
  { text: "Perfil em destaque", included: true },
  { text: "Filtros avançados", included: true },
  { text: "Suporte prioritário", included: true },
];

export default function Plans() {
  function handleSelectPlan(plan: string) {
    if (plan === "free") {
      toast({ title: "Você já está no plano gratuito!" });
    } else {
      toast({ title: "Em breve!", description: "A integração de pagamento será ativada em breve." });
    }
  }

  return (
    <motion.div
      className="mx-auto max-w-4xl page-transition"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight mb-3">
          Escolha seu plano
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Encontre conexões verdadeiras. Escolha o plano ideal para sua jornada no Zelo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* FREE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative border-border/60 h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">Free</h3>
                <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-border text-muted-foreground">
                  Atual
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-foreground">R$ 0</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Comece sua jornada com recursos essenciais.
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {freeBenefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {b.included ? (
                      <Check className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={b.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full mt-6 rounded-lg"
                onClick={() => handleSelectPlan("free")}
              >
                Plano atual
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* ZELO+ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative border-accent/30 h-full flex flex-col overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />

            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold text-foreground">Zelo+</h3>
                  <Crown className="h-5 w-5 text-accent" />
                </div>
                <Badge className="gold-gradient text-accent-foreground text-[10px] tracking-wider uppercase border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold gold-text">R$ 19,70</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Desbloqueie tudo e encontre sua conexão com propósito.
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col relative">
              <ul className="space-y-3 flex-1">
                {plusBenefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-foreground">{b.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6 rounded-lg gold-gradient text-accent-foreground font-medium hover:opacity-90 transition-opacity"
                onClick={() => handleSelectPlan("plus")}
              >
                <Crown className="h-4 w-4 mr-1.5" />
                Assinar Zelo+
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Cancele quando quiser. Sem surpresas, sem burocracia.
      </p>
    </motion.div>
  );
}
