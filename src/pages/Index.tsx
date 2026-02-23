import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fade = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <span className="text-sm font-semibold tracking-[0.2em] text-foreground">ZELO</span>
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
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-xl text-center">
          <motion.p
            className="mb-6 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground"
            initial="hidden" animate="visible" variants={fade} custom={0}
          >
            Corações guardados
          </motion.p>
          <motion.h1
            className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
            initial="hidden" animate="visible" variants={fade} custom={1}
          >
            ZELO
          </motion.h1>
          <motion.p
            className="mb-10 text-lg font-light leading-relaxed text-muted-foreground"
            initial="hidden" animate="visible" variants={fade} custom={2}
          >
            Propósitos alinhados.
          </motion.p>
          <motion.p
            className="mx-auto mb-12 max-w-md text-sm leading-relaxed text-muted-foreground"
            initial="hidden" animate="visible" variants={fade} custom={3}
          >
            Um espaço acolhedor para quem deseja construir uma família com propósito — sem pressão, sem exposição.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-4"
            initial="hidden" animate="visible" variants={fade} custom={4}
          >
            <Button
              size="lg"
              className="rounded-full px-10 py-6 text-sm font-medium tracking-wide"
              asChild
            >
              <Link to="/waitlist">
                Solicitar convite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
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
          <motion.p
            className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0}
          >
            Nosso jeito
          </motion.p>
          <motion.h2
            className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
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
        <div className="mx-auto grid max-w-2xl gap-px sm:grid-cols-2">
          {[
            { title: "Ambiente seguro", desc: "Cada perfil é validado antes de entrar." },
            { title: "Valores primeiro", desc: "Conexões baseadas no que importa." },
            { title: "Sem pressa", desc: "Máximo de 3 interesses por dia." },
            { title: "Privacidade total", desc: "Visível apenas para membros aprovados." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="p-8"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={i}
            >
              <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-2xl">
          <motion.p
            className="mb-4 text-center text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} custom={0}
          >
            Simples e direto
          </motion.p>
          <motion.h2
            className="mb-16 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
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
                <p className="mb-3 text-xs font-medium text-muted-foreground">{item.step}</p>
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
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Pronto pra dar esse passo?
          </h2>
          <p className="mb-10 text-sm text-muted-foreground">
            Entre pra uma comunidade que valoriza o que você valoriza.
          </p>
          <Button size="lg" className="rounded-full px-10 py-6 text-sm font-medium tracking-wide" asChild>
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
          <span className="text-xs font-semibold tracking-[0.2em] text-foreground">ZELO</span>
          <p className="mt-2 text-xs text-muted-foreground">
            Plataforma independente · Sem vínculo institucional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
