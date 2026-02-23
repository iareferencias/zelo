import { motion } from "framer-motion";
import { Shield, Heart, Users, MessageCircle, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <span className="font-serif text-2xl font-bold tracking-widest text-primary">ZELO</span>
          <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-sans text-xs tracking-wider uppercase">
            Solicitar Convite
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, hsl(43 50% 55% / 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(43 50% 55% / 0.1) 0%, transparent 50%)"
          }} />
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-6 inline-block text-sm font-sans tracking-[0.3em] uppercase text-gold">
              Corações guardados. Propósitos alinhados.
            </span>
          </motion.div>
          <motion.h1
            className="mx-auto mb-8 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Relacionamentos com propósito começam com{" "}
            <span className="text-gold">ZELO</span>.
          </motion.h1>
          <motion.p
            className="mx-auto mb-12 max-w-2xl font-sans text-lg font-light leading-relaxed text-primary-foreground/70 md:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Um ambiente reservado para quem deseja formar família no temor de Deus.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark font-sans text-sm tracking-wider uppercase px-10 py-6">
              Solicitar Convite
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Sobre */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-4 inline-block font-sans text-xs tracking-[0.3em] uppercase text-accent">Nosso Manifesto</span>
            <h2 className="mb-8 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Um lugar diferente de tudo que existe.
            </h2>
          </motion.div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              { icon: Shield, title: "Ambiente protegido", desc: "Cada perfil é validado antes de entrar na plataforma." },
              { icon: Heart, title: "Sem superficialidade", desc: "Conexões baseadas em valores, não em aparência." },
              { icon: Lock, title: "Sem cultura de swipe", desc: "Aqui não existe jogo. Existe propósito." },
              { icon: Users, title: "Sem exposição", desc: "Seu perfil é visível apenas para membros aprovados." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="group rounded-lg border border-border/50 bg-card p-8 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <item.icon className="mb-4 h-6 w-6 text-accent" />
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-32 bg-secondary/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-4 inline-block font-sans text-xs tracking-[0.3em] uppercase text-accent">Passo a Passo</span>
            <h2 className="mb-16 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Como funciona
            </h2>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-0 md:grid-cols-4">
            {[
              { step: "01", title: "Cadastro validado", desc: "Solicite seu convite e passe pela verificação." },
              { step: "02", title: "Perfil espiritual", desc: "Compartilhe seu testemunho e valores." },
              { step: "03", title: "Compatibilidade", desc: "Encontre pessoas com valores alinhados." },
              { step: "04", title: "Conexão", desc: "Converse com responsabilidade e propósito." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative flex flex-col items-center text-center px-6 py-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <span className="mb-4 font-serif text-5xl font-bold text-accent/20">{item.step}</span>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferencial */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="mb-4 inline-block font-sans text-xs tracking-[0.3em] uppercase text-accent">Por que ZELO</span>
            <h2 className="mb-16 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              O que nos diferencia
            </h2>
          </motion.div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: "Limite de conexões", desc: "Qualidade acima de quantidade. Cada conexão é intencional." },
              { icon: MessageCircle, title: "Moderação automática", desc: "Conversas protegidas por filtros inteligentes." },
              { icon: CheckCircle, title: "Preparação para casamento", desc: "Área dedicada com conteúdos sobre vida a dois." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-lg border border-border/50 bg-card p-8 text-center transition-all hover:border-accent/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className="py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <Shield className="mx-auto mb-6 h-10 w-10 text-gold" />
            <h2 className="mb-6 font-serif text-4xl font-semibold md:text-5xl">
              Segurança em primeiro lugar
            </h2>
            <p className="mx-auto max-w-xl font-sans text-lg font-light leading-relaxed text-primary-foreground/70">
              Plataforma independente, privada e moderada. Sem vínculo institucional. 
              Seus dados são protegidos e seu perfil é visível apenas para membros aprovados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="mb-4 font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Faça parte do <span className="text-accent">ZELO</span>.
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-sans text-lg text-muted-foreground">
              Um passo de fé em direção ao propósito que Deus tem para a sua vida.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-navy-light font-sans text-sm tracking-wider uppercase px-10 py-6">
              Solicitar Convite
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12">
        <div className="container mx-auto px-6 text-center">
          <span className="font-serif text-lg font-bold tracking-widest text-foreground">ZELO</span>
          <p className="mt-2 font-sans text-xs text-muted-foreground">
            Corações guardados. Propósitos alinhados.
          </p>
          <p className="mt-4 font-sans text-xs text-muted-foreground/50">
            Plataforma independente • Sem vínculo institucional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
