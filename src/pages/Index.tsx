import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Heart, Users, Eye, Briefcase, MessageCircle, Menu, X, Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fade = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const menuSections = [
  { id: "hero", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "valores", label: "Valores" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "planos", label: "Planos" },
];

const freeBenefits = [
  { text: "Feed de oportunidades", included: true },
  { text: "Conectar via WhatsApp", included: true },
  { text: "Ver conexões próximas", included: true },
  { text: "Perfil básico", included: true },
  { text: "Filtros avançados", included: false },
  { text: "Perfil em destaque", included: false },
];

const plusBenefits = [
  { text: "Feed de oportunidades", included: true },
  { text: "Conectar via WhatsApp", included: true },
  { text: "Ver conexões próximas", included: true },
  { text: "Perfil completo", included: true },
  { text: "Filtros avançados", included: true },
  { text: "Perfil em destaque", included: true },
  { text: "Suporte prioritário", included: true },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id: string) {
    setMenuOpen(false);
    setTimeout(() => {
      if (id === "hero") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-bold tracking-[0.2em] text-foreground">ZELO</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs font-medium text-muted-foreground hover:text-foreground" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
              <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-1">
                {menuSections.map((s) => (
                  <button key={s.id} onClick={() => scrollTo(s.id)} className="text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-14 relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <motion.p className="mb-5 text-xs font-semibold tracking-[0.4em] uppercase text-primary" initial="hidden" animate="visible" variants={fade} custom={1}>
            Comunidade · Conexão · Propósito
          </motion.p>
          <motion.h1 className="mb-6 font-display text-6xl font-bold leading-[1.05] text-foreground sm:text-8xl tracking-tight" initial="hidden" animate="visible" variants={fade} custom={2}>
            ZELO
          </motion.h1>
          <motion.p className="mb-4 text-lg font-medium text-foreground/80 sm:text-xl" initial="hidden" animate="visible" variants={fade} custom={3}>
            Conecte-se com propósito.
          </motion.p>
          <motion.p className="mx-auto mb-12 max-w-md text-sm leading-relaxed text-muted-foreground" initial="hidden" animate="visible" variants={fade} custom={4}>
            Uma plataforma para a comunidade cristã. Encontre amizades, relacionamentos e oportunidades entre pessoas com os mesmos valores.
          </motion.p>
          <motion.div className="flex flex-col items-center gap-5" initial="hidden" animate="visible" variants={fade} custom={5}>
            <Button size="lg" className="rounded-2xl purple-gradient px-12 py-6 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow" asChild>
              <Link to="/waitlist">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Como funciona
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-32 px-6">
        <div className="mx-auto max-w-xl text-center">
          <motion.div className="mx-auto mb-6 h-px w-16 purple-gradient" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0} />
          <motion.h2 className="mb-6 font-display text-3xl font-semibold text-foreground sm:text-4xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={1}>
            Diferente de tudo que você já viu.
          </motion.h2>
          <motion.p className="text-sm leading-relaxed text-muted-foreground" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={2}>
            Sem swipe. Sem joguinho. Conexões reais entre pessoas com valores reais — para amizade, networking ou um futuro relacionamento.
          </motion.p>
        </div>
      </section>

      {/* Valores */}
      <section id="valores" className="pb-32 px-6">
        <div className="mx-auto grid max-w-3xl gap-1 sm:grid-cols-2">
          {[
            { icon: Shield, title: "Ambiente seguro", desc: "Cada perfil é validado antes de entrar na comunidade." },
            { icon: Users, title: "Conexão real", desc: "Encontre amizades, parceiros e oportunidades." },
            { icon: Briefcase, title: "Oportunidades", desc: "Precisa de algo? Oferece algo? Conecte-se." },
            { icon: Eye, title: "Privacidade total", desc: "Visível apenas para membros verificados." },
          ].map((item, i) => (
            <motion.div key={item.title} className="group rounded-2xl p-8 transition-colors hover:bg-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={i}>
              <item.icon className="mb-4 h-5 w-5 text-primary" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <motion.div className="mx-auto mb-6 h-px w-16 purple-gradient" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0} />
          <motion.h2 className="mb-20 text-center font-display text-3xl font-semibold text-foreground sm:text-4xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={1}>
            Como funciona
          </motion.h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Crie sua conta" },
              { step: "02", title: "Monte seu perfil" },
              { step: "03", title: "Explore o feed" },
              { step: "04", title: "Conecte-se" },
            ].map((item, i) => (
              <motion.div key={item.step} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={i}>
                <p className="mb-3 font-display text-2xl font-bold text-primary">{item.step}</p>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <motion.div className="mx-auto mb-6 h-px w-16 purple-gradient" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0} />
          <motion.h2 className="mb-4 text-center font-display text-3xl font-semibold text-foreground sm:text-4xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={1}>
            Escolha seu plano
          </motion.h2>
          <motion.p className="mx-auto mb-14 max-w-md text-center text-sm leading-relaxed text-muted-foreground" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={2}>
            Comece gratuitamente e evolua quando quiser.
          </motion.p>

          <div className="grid gap-6 sm:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={3} className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-foreground">R$ 0</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Comece sua jornada na comunidade.</p>
              <ul className="space-y-3 flex-1">
                {freeBenefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {b.included ? <Check className="h-4 w-4 text-primary shrink-0" /> : <X className="h-4 w-4 text-muted-foreground/30 shrink-0" />}
                    <span className={b.included ? "text-foreground" : "text-muted-foreground/40"}>{b.text}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-6 rounded-2xl border-border" asChild>
                <Link to="/waitlist">Começar grátis</Link>
              </Button>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={4} className="relative rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 flex flex-col overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
              <div className="relative flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-2xl font-semibold text-foreground">Zelo+</h3>
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div className="inline-flex items-center gap-1 mb-2 w-fit px-2.5 py-0.5 rounded-full purple-gradient">
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-primary-foreground">Recomendado</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold purple-text">R$ 19,70</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">Desbloqueie tudo na comunidade.</p>
                <ul className="space-y-3 flex-1">
                  {plusBenefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{b.text}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 rounded-2xl purple-gradient text-primary-foreground font-medium hover:opacity-90 transition-opacity" asChild>
                  <Link to="/waitlist">
                    <Crown className="h-4 w-4 mr-1.5" />
                    Quero o Zelo+
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">Cancele quando quiser. Sem surpresas.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 text-center">
        <span className="font-display text-lg font-bold tracking-[0.2em] text-foreground/30">ZELO</span>
        <p className="mt-2 text-xs text-muted-foreground/50">Conexões guiadas pela fé e pelo propósito</p>
      </footer>
    </div>
  );
};

export default Index;
