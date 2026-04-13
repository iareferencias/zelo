import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, MessageCircle, Briefcase, HandHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoMode } from "@/hooks/useDemoMode";

const demoOportunidades = [
  { id: "1", name: "Marcos Silva", city: "São Paulo, SP", type: "preciso" as const, description: "Preciso de um contador de confiança para abrir MEI.", avatar: "MS", date: "Hoje" },
  { id: "2", name: "Fernanda Lima", city: "Curitiba, PR", type: "ofereço" as const, description: "Ofereço serviços de confeitaria para eventos. Preços especiais para irmãos.", avatar: "FL", date: "Hoje" },
  { id: "3", name: "Thiago Reis", city: "São Paulo, SP", type: "ofereço" as const, description: "Sou advogado trabalhista e posso orientar gratuitamente irmãos com dúvidas.", avatar: "TR", date: "Ontem" },
  { id: "4", name: "Amanda Costa", city: "Rio de Janeiro, RJ", type: "preciso" as const, description: "Procuro costureira para ajustar vestido. Urgente!", avatar: "AC", date: "Ontem" },
  { id: "5", name: "Bruno Neto", city: "Campinas, SP", type: "ofereço" as const, description: "Faço manutenção de computadores e celulares. Atendo em domicílio.", avatar: "BN", date: "2 dias" },
  { id: "6", name: "Sara Oliveira", city: "Belo Horizonte, MG", type: "preciso" as const, description: "Preciso de alguém que dê aulas de inglês para meu filho de 10 anos.", avatar: "SO", date: "2 dias" },
];

export default function Oportunidades() {
  const { isDemoMode } = useDemoMode();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("todos");
  const items = isDemoMode ? demoOportunidades : demoOportunidades;

  const filtered = tab === "todos" ? items : items.filter(i => i.type === tab);

  return (
    <div className="page-transition pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-foreground">Oportunidades</h1>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Conecte-se a quem precisa ou oferece</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-2xl purple-gradient text-primary-foreground gap-1.5">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Nova oportunidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Select>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preciso">Preciso de...</SelectItem>
                    <SelectItem value="ofereço">Ofereço...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Descrição curta</Label>
                <Textarea className="bg-secondary border-border resize-none" rows={3} placeholder="Descreva brevemente..." />
              </div>
              <Button className="w-full rounded-2xl purple-gradient text-primary-foreground" onClick={() => setOpen(false)}>
                Publicar oportunidade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-secondary border border-border rounded-2xl p-1">
          <TabsTrigger value="todos" className="rounded-xl text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Todos</TabsTrigger>
          <TabsTrigger value="preciso" className="rounded-xl text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Preciso</TabsTrigger>
          <TabsTrigger value="ofereço" className="rounded-xl text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ofereço</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{item.name}</span>
                    <Badge variant="secondary" className={`text-[10px] px-2 py-0 rounded-full ${item.type === "ofereço" ? "bg-primary/15 text-primary" : "bg-orange-500/15 text-orange-400"}`}>
                      {item.type === "ofereço" ? <Briefcase className="h-3 w-3 mr-1" /> : <HandHeart className="h-3 w-3 mr-1" />}
                      {item.type === "ofereço" ? "Ofereço" : "Preciso"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {item.city}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{item.description}</p>
                <Button size="sm" className="mt-3 rounded-xl purple-gradient text-primary-foreground gap-1.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
