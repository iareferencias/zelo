import { createContext, useContext, useState, useCallback } from "react";

export interface DemoProfile {
  id: string;
  full_name: string;
  age: number;
  city: string;
  congregation: string;
  testimony: string;
  gender: string;
  score: number;
  reasons: string[];
}

export interface DemoMatch {
  matchId: string;
  partnerId: string;
  partnerName: string;
  partnerCity: string;
  createdAt: string;
}

export interface DemoMessage {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "demo-1",
    full_name: "Ana Carolina",
    age: 24,
    city: "São Paulo",
    congregation: "Brás",
    testimony: "Nasci na Congregação e desde pequena aprendi o valor da fé. Busco alguém que compartilhe dos mesmos princípios e que queira construir uma família nos caminhos de Deus.",
    gender: "feminino",
    score: 92,
    reasons: ["Mesma cidade", "Intenção de casar", "Deseja filhos", "Faixa etária próxima"],
  },
  {
    id: "demo-2",
    full_name: "Lucas Ferreira",
    age: 27,
    city: "Campinas",
    congregation: "Central de Campinas",
    testimony: "Fui batizado aos 18 anos e desde então minha vida mudou completamente. Trabalho como professor e amo servir na obra de Deus.",
    gender: "masculino",
    score: 85,
    reasons: ["Intenção de casar", "Deseja filhos", "Valores alinhados"],
  },
  {
    id: "demo-3",
    full_name: "Maria Eduarda",
    age: 22,
    city: "Curitiba",
    congregation: "Boqueirão",
    testimony: "A música sacra é uma das coisas que mais me conecta com Deus. Toco órgão na Congregação e busco viver cada dia com propósito e gratidão.",
    gender: "feminino",
    score: 78,
    reasons: ["Intenção de casar", "Faixa etária próxima"],
  },
  {
    id: "demo-4",
    full_name: "Gabriel Santos",
    age: 29,
    city: "São Paulo",
    congregation: "Vila Maria",
    testimony: "Engenheiro, mas minha verdadeira vocação é servir. Participo dos ensaios de jovens e procuro alguém que valorize a simplicidade e a fé sincera.",
    gender: "masculino",
    score: 88,
    reasons: ["Mesma cidade", "Intenção de casar", "Deseja filhos"],
  },
  {
    id: "demo-5",
    full_name: "Isabela Oliveira",
    age: 25,
    city: "Belo Horizonte",
    congregation: "Pampulha",
    testimony: "Cresci vendo o exemplo dos meus pais na fé. Quero encontrar alguém que busque a Deus em primeiro lugar e que sonhe junto comigo.",
    gender: "feminino",
    score: 81,
    reasons: ["Intenção de casar", "Deseja filhos", "Valores alinhados"],
  },
];

const DEMO_MATCHES: DemoMatch[] = [
  {
    matchId: "match-demo-1",
    partnerId: "demo-1",
    partnerName: "Ana Carolina",
    partnerCity: "São Paulo",
    createdAt: new Date(Date.now() - 86400000).toLocaleDateString("pt-BR"),
  },
  {
    matchId: "match-demo-2",
    partnerId: "demo-4",
    partnerName: "Gabriel Santos",
    partnerCity: "São Paulo",
    createdAt: new Date(Date.now() - 172800000).toLocaleDateString("pt-BR"),
  },
  {
    matchId: "match-demo-3",
    partnerId: "demo-5",
    partnerName: "Isabela Oliveira",
    partnerCity: "Belo Horizonte",
    createdAt: new Date(Date.now() - 259200000).toLocaleDateString("pt-BR"),
  },
];

const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  "match-demo-1": [
    { id: "msg-1", sender_id: "demo-1", body: "Olá! Vi que temos bastante em comum 😊", created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
    { id: "msg-2", sender_id: "current-user", body: "Oi Ana! Sim, que legal! Você é de qual Congregação?", created_at: new Date(Date.now() - 3600000 * 2.5).toISOString() },
    { id: "msg-3", sender_id: "demo-1", body: "Sou do Brás! E você?", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "msg-4", sender_id: "current-user", body: "Que lindo! Sou de Campinas. Como é a sua caminhada na fé?", created_at: new Date(Date.now() - 3600000 * 1.5).toISOString() },
    { id: "msg-5", sender_id: "demo-1", body: "Nasci na Congregação, desde pequena. A fé é a base de tudo na minha vida 🙏", created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  "match-demo-2": [
    { id: "msg-6", sender_id: "demo-4", body: "A paz de Deus! Que bom que deu match!", created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: "msg-7", sender_id: "current-user", body: "A paz! Também fiquei feliz. Conta mais sobre você!", created_at: new Date(Date.now() - 5400000).toISOString() },
  ],
  "match-demo-3": [
    { id: "msg-8", sender_id: "demo-5", body: "Oi! Vi no seu perfil que você também gosta de música sacra! 🎵", created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
};

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoProfiles: DemoProfile[];
  demoMatches: DemoMatch[];
  getDemoMessages: (matchId: string) => DemoMessage[];
  addDemoMessage: (matchId: string, msg: DemoMessage) => void;
  demoLikedIds: Set<string>;
  addDemoLike: (id: string) => boolean; // returns true if match
  demoTodayLikes: number;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoLikedIds, setDemoLikedIds] = useState<Set<string>>(new Set());
  const [demoTodayLikes, setDemoTodayLikes] = useState(0);
  const [extraMessages, setExtraMessages] = useState<Record<string, DemoMessage[]>>({});
  const [extraMatches, setExtraMatches] = useState<DemoMatch[]>([]);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => !prev);
    // Reset state when toggling
    setDemoLikedIds(new Set());
    setDemoTodayLikes(0);
    setExtraMessages({});
    setExtraMatches([]);
  }, []);

  const getDemoMessages = useCallback((matchId: string): DemoMessage[] => {
    return [...(DEMO_MESSAGES[matchId] || []), ...(extraMessages[matchId] || [])];
  }, [extraMessages]);

  const addDemoMessage = useCallback((matchId: string, msg: DemoMessage) => {
    setExtraMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), msg],
    }));

    // Auto-reply after 2s
    setTimeout(() => {
      const replies = [
        "Que lindo! Me conta mais 😊",
        "Concordo totalmente! A fé nos une.",
        "Amém! Que Deus nos abençoe nessa jornada.",
        "Isso é muito bonito! Também penso assim.",
        "Que bênção poder conversar com você!",
        "🙏 Que Deus guie nossos passos.",
      ];
      const autoReply: DemoMessage = {
        id: `auto-${Date.now()}`,
        sender_id: matchId === "match-demo-1" ? "demo-1" : matchId === "match-demo-2" ? "demo-4" : "demo-5",
        body: replies[Math.floor(Math.random() * replies.length)],
        created_at: new Date().toISOString(),
      };
      setExtraMessages(p => ({
        ...p,
        [matchId]: [...(p[matchId] || []), autoReply],
      }));
    }, 2000);
  }, []);

  const addDemoLike = useCallback((profileId: string): boolean => {
    setDemoLikedIds(prev => new Set(prev).add(profileId));
    setDemoTodayLikes(prev => prev + 1);

    // 50% chance of mutual match for demo
    const isMutual = Math.random() > 0.5;
    if (isMutual) {
      const profile = DEMO_PROFILES.find(p => p.id === profileId);
      if (profile) {
        const newMatch: DemoMatch = {
          matchId: `match-${profileId}`,
          partnerId: profileId,
          partnerName: profile.full_name,
          partnerCity: profile.city,
          createdAt: new Date().toLocaleDateString("pt-BR"),
        };
        setExtraMatches(prev => [newMatch, ...prev]);
      }
    }
    return isMutual;
  }, []);

  const allMatches = [...extraMatches, ...DEMO_MATCHES];

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      toggleDemoMode,
      demoProfiles: DEMO_PROFILES,
      demoMatches: allMatches,
      getDemoMessages,
      addDemoMessage,
      demoLikedIds,
      addDemoLike,
      demoTodayLikes,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoProvider");
  return ctx;
}
