import { motion } from "framer-motion";
import { Shield, Heart, Users, MessageCircle, Lock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <span className="font-serif text-2xl font-bold tracking-widest text-primary">ZELO</span>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-gold-dark font-sans text-xs tracking-wider uppercase rounded-full px-6" asChild>
            <Link to="/signup">Criar conta</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section — mais leve e acolhedor */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, hsl(30 60% 58% / 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(222 40% 28% / 0.06) 0%, transparent 50%)"
          }} />
        </div>
        <div className="container relative z-10 mx-auto px-6 pt-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-sans tracking-widest uppercase text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Corações guardados. Propósitos alinhados.
            </span>
          </motion.div>
          <motion.h1
            className="mx-auto mb-6 max-w-3xl font-serif text-4xl font-semibold leading-snug text-foreground sm:text-5xl md:text-6xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Encontre alguém que compartilha{" "}
            <span className="text-accent">a mesma fé</span>.
          </motion.h1>
          <motion.p
            className="mx-auto mb-10 max-w-xl font-sans text-base font-light leading-relaxed text-muted-foreground md:text-lg"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Um espaço acolhedor para membros da CCB que desejam construir uma família com propósito — sem pressão, sem exposição.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark font-sans text-sm tracking-wider rounded-full px-10 py-6 shadow-md shadow-accent/20" asChild>
              <Link to="/signup">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="font-sans text-sm text-muted-foreground hover:text-foreground" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Como funciona?
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Manifesto — tom mais caloroso */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-3 inline-block font-sans text-xs tracking-[0.25em] uppercase text-accent">Nosso jeito</span>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Diferente de tudo que você já viu.
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              Nada de swipe infinito. Nada de joguinho. Aqui cada conexão é pensada com carinho e respeito.
            </p>
          </motion.div>
          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {[
              { icon: Shield, title: "Ambiente seguro", desc: "Cada perfil é validado antes de entrar." },
              { icon: Heart, title: "Valores em primeiro lugar", desc: "Conexões baseadas no que realmente importa." },
              { icon: Lock, title: "Sem swipe, sem pressa", desc: "Máximo de 3 interesses por dia. Qualidade > quantidade." },
              { icon: Users, title: "Privacidade total", desc: "Seu perfil é visível apenas para membros aprovados." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-accent/40 hover:shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-secondary/40">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-3 inline-block font-sans text-xs tracking-[0.25em] uppercase text-accent">Simples e direto</span>
            <h2 className="mb-14 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Como funciona
            </h2>
          </motion.div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", title: "Crie sua conta", desc: "Cadastro simples e rápido." },
              { step: "2", title: "Monte seu perfil", desc: "Compartilhe seu testemunho e valores." },
              { step: "3", title: "Encontre compatíveis", desc: "Veja perfis alinhados com você." },
              { step: "4", title: "Conecte-se", desc: "Converse com quem fez sentido." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-sans font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-3 inline-block font-sans text-xs tracking-[0.25em] uppercase text-accent">Por que ZELO</span>
            <h2 className="mb-14 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Feito pra quem leva a sério
            </h2>
          </motion.div>
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-3">
            {[
              { icon: Users, title: "Limite diário", desc: "No máximo 3 interesses por dia. Cada um conta." },
              { icon: MessageCircle, title: "Chat protegido", desc: "Conversas moderadas e respeitosas." },
              { icon: CheckCircle, title: "Preparação", desc: "Conteúdos sobre vida a dois e família." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-border/60 bg-card p-7 text-center transition-all hover:border-accent/40 hover:shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-1.5 font-sans text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança — mais suave */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Segurança e privacidade
            </h2>
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              Plataforma independente e moderada. Sem vínculo institucional com a igreja. 
              Seus dados são protegidos e seu perfil só aparece para membros aprovados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Pronto pra dar esse passo?
            </h2>
            <p className="mx-auto mb-8 max-w-md font-sans text-base text-muted-foreground">
              Entre pra uma comunidade que valoriza o que você valoriza.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark font-sans text-sm tracking-wider rounded-full px-10 py-6 shadow-md shadow-accent/20" asChild>
              <Link to="/signup">
                Criar minha conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-10">
        <div className="container mx-auto px-6 text-center">
          <span className="font-serif text-lg font-bold tracking-widest text-foreground">ZELO</span>
          <p className="mt-1.5 font-sans text-xs text-muted-foreground">
            Corações guardados. Propósitos alinhados.
          </p>
          <p className="mt-3 font-sans text-xs text-muted-foreground/50">
            Plataforma independente • Sem vínculo institucional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
