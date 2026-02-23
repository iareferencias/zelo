import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Home, MessageCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  {
    icon: BookOpen,
    title: "O propósito do casamento",
    desc: "Entender o plano de Deus para a vida a dois, segundo as Escrituras. O casamento é uma aliança que reflete o amor de Cristo pela Igreja.",
  },
  {
    icon: Heart,
    title: "Preparação emocional",
    desc: "Como desenvolver maturidade emocional para um relacionamento saudável. Aprender a lidar com expectativas, frustrações e comunicação.",
  },
  {
    icon: Users,
    title: "Família e valores",
    desc: "A importância de compartilhar os mesmos valores fundamentais. Como construir uma família sobre alicerces sólidos.",
  },
  {
    icon: Home,
    title: "Vida financeira a dois",
    desc: "Princípios de administração financeira para casais. Planejamento, economia e generosidade como pilares.",
  },
  {
    icon: MessageCircle,
    title: "Comunicação no relacionamento",
    desc: "Como desenvolver uma comunicação honesta, respeitosa e edificante. Evitar conflitos destrutivos.",
  },
  {
    icon: Shield,
    title: "Limites e pureza",
    desc: "A importância de manter limites saudáveis durante o período de conhecimento. Honrar a Deus em cada etapa.",
  },
];

export default function Preparacao() {
  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight">Preparação para o Casamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Conteúdos para edificar sua jornada</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card className="card-hover border-border/60 h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <t.icon className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="font-serif text-lg">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
