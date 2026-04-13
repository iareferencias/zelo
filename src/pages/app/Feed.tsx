import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, MessageCircle, Briefcase, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/hooks/useDemoMode";

const demoPosts = [
  { id: "1", name: "Ana Souza", city: "São Paulo, SP", type: "ofereço" as const, description: "Sou designer gráfica e posso ajudar com identidade visual para sua igreja ou projeto.", avatar: "AS" },
  { id: "2", name: "Carlos Lima", city: "Curitiba, PR", type: "preciso" as const, description: "Preciso de um eletricista de confiança para reformar o salão da nossa congregação.", avatar: "CL" },
  { id: "3", name: "Maria Santos", city: "Belo Horizonte, MG", type: "ofereço" as const, description: "Ofereço aulas de violão para iniciantes. Posso ajudar no louvor da sua congregação.", avatar: "MS" },
  { id: "4", name: "João Oliveira", city: "Rio de Janeiro, RJ", type: "preciso" as const, description: "Procuro alguém para dividir apartamento na zona sul. Preferência por irmão da fé.", avatar: "JO" },
  { id: "5", name: "Priscila Mendes", city: "Campinas, SP", type: "ofereço" as const, description: "Sou nutricionista e ofereço consultas online com desconto para a comunidade.", avatar: "PM" },
];

export default function Feed() {
  const { isDemoMode } = useDemoMode();
  const [posts] = useState(isDemoMode ? demoPosts : demoPosts);
  const [open, setOpen] = useState(false);

  return (
    <div className="page-transition pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Feed</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Veja o que a comunidade está compartilhando</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-2xl purple-gradient text-primary-foreground gap-1.5">
              <Plus className="h-4 w-4" />
              Publicar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Nova publicação</DialogTitle>
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
                <Label className="text-xs text-muted-foreground">Descrição</Label>
                <Textarea className="bg-secondary border-border resize-none" rows={3} placeholder="Descreva o que você precisa ou oferece..." />
              </div>
              <Button className="w-full rounded-2xl purple-gradient text-primary-foreground" onClick={() => setOpen(false)}>
                Publicar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-4 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{post.name}</span>
                  <Badge variant="secondary" className={`text-[10px] px-2 py-0 rounded-full ${post.type === "ofereço" ? "bg-primary/15 text-primary" : "bg-orange-500/15 text-orange-400"}`}>
                    {post.type === "ofereço" ? <Briefcase className="h-3 w-3 mr-1" /> : <HandHeart className="h-3 w-3 mr-1" />}
                    {post.type === "ofereço" ? "Ofereço" : "Preciso"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {post.city}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{post.description}</p>
                <Button size="sm" variant="ghost" className="mt-3 text-primary hover:text-primary hover:bg-primary/10 rounded-xl gap-1.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Conectar (WhatsApp)
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
