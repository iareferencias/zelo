import { BookOpen, Target, Users } from "lucide-react";

interface ProfileExpandedProps {
  familyVision: string;
  spiritualRoutine: string;
  lifeGoals: string;
}

export function ProfileExpanded({ familyVision, spiritualRoutine, lifeGoals }: ProfileExpandedProps) {
  const sections = [
    { icon: Users, label: "Visão de família", value: familyVision },
    { icon: BookOpen, label: "Rotina espiritual", value: spiritualRoutine },
    { icon: Target, label: "Objetivos de vida", value: lifeGoals },
  ].filter(s => s.value);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
        Sobre mim
      </h3>
      <div className="space-y-3">
        {sections.map(s => (
          <div key={s.label} className="rounded-xl bg-muted/30 border border-border/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-foreground">{s.label}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
