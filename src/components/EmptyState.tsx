import { motion } from "framer-motion";
import { Heart, Users, Search, Bell } from "lucide-react";

interface EmptyStateProps {
  type: "matches" | "notifications" | "compatibles";
}

const configs = {
  matches: {
    icon: Heart,
    title: "Ainda sem matches",
    message: "Continue demonstrando interesse em pessoas compatíveis. Quando o sentimento for mútuo, o match aparecerá aqui.",
    cta: "Ver perfis compatíveis",
  },
  notifications: {
    icon: Bell,
    title: "Tudo tranquilo por aqui",
    message: "Quando alguém demonstrar interesse em você ou um match for criado, você será notificado aqui.",
    cta: null,
  },
  compatibles: {
    icon: Search,
    title: "Nenhum perfil encontrado",
    message: "No momento não há perfis compatíveis. Volte mais tarde — novos membros estão chegando.",
    cta: null,
  },
};

export function EmptyState({ type }: EmptyStateProps) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
        {config.title}
      </h3>
      <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        {config.message}
      </p>
    </motion.div>
  );
}
