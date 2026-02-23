import { motion } from "framer-motion";
import { Heart, Search, Bell } from "lucide-react";

interface EmptyStateProps {
  type: "matches" | "notifications" | "compatibles";
}

const configs = {
  matches: {
    icon: Heart,
    title: "Ainda sem matches",
    message: "Continue demonstrando interesse. Quando for mútuo, aparecerá aqui.",
  },
  notifications: {
    icon: Bell,
    title: "Tudo tranquilo",
    message: "Quando alguém demonstrar interesse ou um match for criado, você será notificado.",
  },
  compatibles: {
    icon: Search,
    title: "Nenhum perfil encontrado",
    message: "Volte mais tarde — novos membros estão chegando.",
  },
};

export function EmptyState({ type }: EmptyStateProps) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center py-24 px-6"
    >
      <Icon className="mb-5 h-6 w-6 text-muted-foreground" />
      <h3 className="mb-2 text-base font-semibold text-foreground">
        {config.title}
      </h3>
      <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        {config.message}
      </p>
    </motion.div>
  );
}
