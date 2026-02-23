import { useNotifications, getNotificationLabel } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeletons";

export default function Notifications() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <div className="page-transition">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight">Notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Todas lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="text-xs" onClick={markAllRead}>
            <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
            Marcar lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState type="notifications" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  !n.read ? "border-accent/20 bg-accent/[0.03]" : "border-border/60"
                }`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {!n.read && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    <div>
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
