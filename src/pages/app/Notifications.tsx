import { useNotifications, getNotificationLabel } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeletons";

export default function Notifications() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <div className="page-transition">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Todas lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={markAllRead}>
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
            Marcar lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState type="notifications" />
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02, duration: 0.15 }}
              onClick={() => !n.read && markRead(n.id)}
              className="flex w-full items-center gap-3 py-4 text-left transition-colors duration-150 hover:bg-muted/30"
            >
              {!n.read && (
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              )}
              <div className={!n.read ? "" : "pl-[14px]"}>
                <p className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {getNotificationLabel(n.type)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(n.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
