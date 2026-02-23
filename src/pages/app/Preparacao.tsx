import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Home, MessageCircle, Shield } from "lucide-react";

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
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Preparação para o Casamento</h1>
      <p className="mb-8 text-sm text-muted-foreground">Conteúdos para edificar sua jornada</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(t => (
          <Card key={t.title} className="transition-all hover:shadow-lg hover:border-accent/30">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <t.icon className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="font-serif text-lg">{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
