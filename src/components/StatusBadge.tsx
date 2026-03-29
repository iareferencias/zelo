import { cn } from "@/lib/utils";
import { ShieldCheck, Star, Sparkles, Eye, AlertTriangle } from "lucide-react";

type StatusLevel = "new" | "active" | "verified" | "prepared" | "flagged";

const statusConfig: Record<StatusLevel, { label: string; icon: React.ElementType; className: string }> = {
  new: {
    label: "Novo",
    icon: Star,
    className: "border-border bg-muted text-muted-foreground",
  },
  active: {
    label: "Ativo",
    icon: Eye,
    className: "border-accent/20 bg-accent/5 text-accent",
  },
  verified: {
    label: "Verificado",
    icon: ShieldCheck,
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  prepared: {
    label: "Preparado",
    icon: Sparkles,
    className: "border-accent/40 bg-accent/15 text-accent",
  },
  flagged: {
    label: "Em análise",
    icon: AlertTriangle,
    className: "border-destructive/20 bg-destructive/5 text-destructive",
  },
};

interface StatusBadgeProps {
  level: string;
  size?: "sm" | "md";
}

export function StatusBadge({ level, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[(level as StatusLevel)] || statusConfig.new;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        config.className,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      <Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {config.label}
    </div>
  );
}
