import { useNotifications, getNotificationLabel } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";

export default function Notifications() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Notificações</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} não lidas</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground mt-12">Nenhuma notificação.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${!n.read ? "border-accent/30 bg-accent/5" : ""}`}
              onClick={() => !n.read && markRead(n.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {getNotificationLabel(n.type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                {!n.read && (
                  <div className="h-2 w-2 rounded-full bg-accent" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
