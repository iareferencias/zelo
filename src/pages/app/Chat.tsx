import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

const BAD_WORDS = ["idiota", "burro", "imbecil", "merda", "porra", "caralho", "puta"];

function filterMessage(text: string): string {
  let filtered = text;
  BAD_WORDS.forEach(w => {
    const regex = new RegExp(w, "gi");
    filtered = filtered.replace(regex, "***");
  });
  return filtered;
}

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;
    loadMatch();
    loadMessages();

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMatch() {
    if (!matchId || !user) return;
    const { data } = await supabase.from("matches").select("user_a, user_b").eq("id", matchId).single();
    if (!data) return;
    const pid = data.user_a === user.id ? data.user_b : data.user_a;
    setPartnerId(pid);
    const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", pid).single();
    setPartnerName(prof?.full_name || "Membro");
  }

  async function loadMessages() {
    if (!matchId) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || !matchId || !user) return;
    const filtered = filterMessage(newMsg);
    await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, body: filtered });
    setNewMsg("");
  }

  async function submitReport() {
    if (!user || !partnerId || !reportReason.trim()) return;
    await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_id: partnerId,
      reason: reportReason,
    });
    toast({ title: "Denúncia enviada", description: "Obrigado por ajudar a manter o ZELO seguro." });
    setReportOpen(false);
    setReportReason("");
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">{partnerName}</h2>
          <p className="text-xs text-muted-foreground">Chat privado</p>
        </div>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
              <Flag className="mr-1 h-4 w-4" />
              Denunciar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Denunciar usuário</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Descreva o motivo da denúncia..."
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
            />
            <Button onClick={submitReport} disabled={!reportReason.trim()}>Enviar denúncia</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
              m.sender_id === user?.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-foreground"
            }`}>
              {m.body}
              <div className="mt-1 text-[10px] opacity-60">
                {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMsg.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
