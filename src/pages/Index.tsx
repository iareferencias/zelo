import { motion } from "framer-motion";
import { ArrowRight, Shield, Heart, Clock, Eye } from "lucide-react";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-semibold text-foreground">Zelo</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-14">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient warm-glow"
            initial="hidden" animate="visible" variants={fade} custom={0}
          >
            <Heart className="h-7 w-7 text-accent-foreground" />
          </motion.div>
          <motion.p
            className="mb-5 text-xs font-medium tracking-[0.35em] uppercase text-accent"
            initial="hidden" animate="visible" variants={fade} custom={1}
          >
            Corações guardados
          </motion.p>
          <motion.h1
            className="mb-6 font-display text-5xl font-semibold leading-[1.1] text-foreground sm:text-7xl"
            initial="hidden" animate="visible" variants={fade} custom={2}
          >
            Zelo
          </motion.h1>
          <motion.p
            className="mb-4 font-display text-xl font-normal italic text-muted-foreground sm:text-2xl"
            initial="hidden" animate="visible" variants={fade} custom={3}
          >
            Propósitos alinhados.
          </motion.p>
          <motion.p
            className="mx-auto mb-12 max-w-md text-sm leading-relaxed text-muted-foreground"
            initial="hidden" animate="visible" variants={fade} custom={4}
          >
            Um espaço acolhedor para quem deseja construir uma família com propósito — sem pressão, sem exposição.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-5"
            initial="hidden" animate="visible" variants={fade} custom={5}
          >
            <Button
              size="lg"
              className="rounded-full gold-gradient px-12 py-6 text-sm font-medium tracking-wide text-accent-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
              asChild
            >
              <Link to="/waitlist">
                Solicitar convite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <button
              className="text-xs text-muted-foreground hover:text-accent transition-colors duration-200"
              onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
            >
              Como funciona
            </button>
          </motion.div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-xl text-center">
          <motion.div
            className="mx-auto mb-6 h-px w-16 gold-gradient"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0}
          />
          <motion.h2
            className="mb-6 font-display text-3xl font-semibold text-foreground sm:text-4xl"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={1}
          >
            Diferente de tudo que você já viu.
          </motion.h2>
          <motion.p
            className="text-sm leading-relaxed text-muted-foreground"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={2}
          >
            Nada de swipe infinito. Nada de joguinho. Cada conexão é pensada com carinho e respeito.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="pb-32 px-6">
        <div className="mx-auto grid max-w-2xl gap-1 sm:grid-cols-2">
          {[
            { icon: Shield, title: "Ambiente seguro", desc: "Cada perfil é validado antes de entrar." },
            { icon: Heart, title: "Valores primeiro", desc: "Conexões baseadas no que importa." },
            { icon: Clock, title: "Sem pressa", desc: "Máximo de 3 interesses por dia." },
            { icon: Eye, title: "Privacidade total", desc: "Visível apenas para membros aprovados." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="group rounded-xl p-8 transition-colors duration-200 hover:bg-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={i}
            >
              <item.icon className="mb-4 h-5 w-5 text-accent" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mx-auto mb-6 h-px w-16 gold-gradient"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0}
          />
          <motion.h2
            className="mb-20 text-center font-display text-3xl font-semibold text-foreground sm:text-4xl"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={1}
          >
            Como funciona
          </motion.h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Crie sua conta" },
              { step: "02", title: "Monte seu perfil" },
              { step: "03", title: "Encontre compatíveis" },
              { step: "04", title: "Conecte-se" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={i}
              >
                <p className="mb-3 font-display text-2xl font-semibold text-accent">{item.step}</p>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <motion.div
          className="mx-auto max-w-md text-center"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0}
        >
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Pronto pra dar esse passo?
          </h2>
          <p className="mb-10 text-sm text-muted-foreground">
            Entre pra uma comunidade que valoriza o que você valoriza.
          </p>
          <Button
            size="lg"
            className="rounded-full gold-gradient px-12 py-6 text-sm font-medium tracking-wide text-accent-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
            asChild
          >
            <Link to="/waitlist">
              Solicitar convite
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-display text-lg font-semibold text-foreground">Zelo</span>
          <p className="mt-2 text-xs text-muted-foreground">
            Plataforma independente · Sem vínculo institucional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
