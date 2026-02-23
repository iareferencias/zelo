import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, getNotificationLabel } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();

  const recent = notifications.slice(0, 10);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0 border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-xs font-semibold text-foreground">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-[11px] text-muted-foreground" onClick={markAllRead}>
              <CheckCheck className="mr-1 h-3 w-3" />
              Lidas
            </Button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto">
          {recent.length === 0 ? (
            <p className="p-6 text-center text-xs text-muted-foreground">
              Sem notificações
            </p>
          ) : (
            recent.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className="w-full text-left px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors duration-100"
              >
                <div className="flex items-start gap-2">
                  {!n.read && (
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                  )}
                  <div className={!n.read ? "" : "pl-[14px]"}>
                    <p className={`text-sm leading-snug ${!n.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {getNotificationLabel(n.type)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(n.created_at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            onClick={() => navigate("/app/notifications")}
          >
            Ver todas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
