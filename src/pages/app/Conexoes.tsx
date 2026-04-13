import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoMode } from "@/hooks/useDemoMode";

const demoPeople = [
  { id: "1", name: "Rafael Costa", city: "São Paulo, SP", objetivo: "networking", bio: "Empreendedor e músico. Buscando parcerias na fé.", avatar: "RC" },
  { id: "2", name: "Juliana Ferreira", city: "Curitiba, PR", objetivo: "amizade", bio: "Professora. Amo viajar e conhecer novas congregações.", avatar: "JF" },
  { id: "3", name: "Pedro Almeida", city: "Campinas, SP", objetivo: "relacionamento", bio: "Engenheiro civil. Servo fiel na minha congregação.", avatar: "PA" },
  { id: "4", name: "Beatriz Nascimento", city: "Belo Horizonte, MG", objetivo: "amizade", bio: "Enfermeira. Gosto de servir e ajudar ao próximo.", avatar: "BN" },
  { id: "5", name: "Lucas Martins", city: "São Paulo, SP", objetivo: "networking", bio: "Desenvolvedor de software. Irmão na CCB desde criança.", avatar: "LM" },
  { id: "6", name: "Camila Rocha", city: "Florianópolis, SC", objetivo: "relacionamento", bio: "Arquiteta apaixonada por design e propósito.", avatar: "CR" },
];

const objetivoColors: Record<string, string> = {
  amizade: "bg-blue-500/15 text-blue-400",
  relacionamento: "bg-pink-500/15 text-pink-400",
  networking: "bg-primary/15 text-primary",
};

export default function Conexoes() {
  const { isDemoMode } = useDemoMode();
  const [search, setSearch] = useState("");
  const [filtroObjetivo, setFiltroObjetivo] = useState("todos");
  const people = isDemoMode ? demoPeople : demoPeople;

  const filtered = people.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchObjetivo = filtroObjetivo === "todos" || p.objetivo === filtroObjetivo;
    return matchSearch && matchObjetivo;
  });

  return (
    <div className="page-transition pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">Conexões</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Encontre pessoas da comunidade</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="pl-10 bg-secondary border-border rounded-2xl"
          />
        </div>
        <Select value={filtroObjetivo} onValueChange={setFiltroObjetivo}>
          <SelectTrigger className="w-full sm:w-44 bg-secondary border-border rounded-2xl">
            <SelectValue placeholder="Objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="amizade">Amizade</SelectItem>
            <SelectItem value="relacionamento">Relacionamento</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((person, i) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {person.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{person.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {person.city}
                  </span>
                  <Badge variant="secondary" className={`text-[10px] px-2 py-0 rounded-full capitalize ${objetivoColors[person.objetivo]}`}>
                    {person.objetivo}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed mb-3">{person.bio}</p>
                <Button size="sm" className="rounded-xl purple-gradient text-primary-foreground gap-1.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Conectar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma pessoa encontrada</p>
        </div>
      )}
    </div>
  );
}
