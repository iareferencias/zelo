import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Flag, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

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

function PrayerGate({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md text-center px-6"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Heart className="h-8 w-8 text-accent" />
        </div>
        <h2 className="mb-3 font-serif text-2xl font-semibold text-foreground">
          Momento de oração
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          Antes de iniciar esta conversa, reserve um momento de oração.
          Peça a Deus sabedoria, respeito e sinceridade para cada palavra.
        </p>
        <Button
          size="lg"
          className="rounded-full px-8"
          onClick={onProceed}
        >
          Prosseguir com respeito
        </Button>
      </motion.div>
    </div>
  );
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
  const [gateLoading, setGateLoading] = useState(true);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [dailyMsgCount, setDailyMsgCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check prayer gate
  useEffect(() => {
    if (!matchId || !user) return;
    (async () => {
      const { data } = await supabase
        .from("match_gate")
        .select("prayed")
        .eq("match_id", matchId)
        .eq("user_id", user.id)
        .maybeSingle();
      setHasPrayed(data?.prayed === true);
      setGateLoading(false);
    })();
  }, [matchId, user]);

  // Load daily message count
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("daily_message_count, last_like_reset")
        .eq("id", user.id)
        .single();
      if (data) {
        const lastReset = new Date(data.last_like_reset);
        const now = new Date();
        if (lastReset.toDateString() !== now.toDateString()) {
          setDailyMsgCount(0);
        } else {
          setDailyMsgCount(data.daily_message_count || 0);
        }
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!matchId || !user || !hasPrayed) return;
    loadMatch();
    loadMessages();

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, user, hasPrayed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleProceed() {
    if (!matchId || !user) return;
    await supabase.from("match_gate").upsert({
      match_id: matchId,
      user_id: user.id,
      prayed: true,
    }, { onConflict: "match_id,user_id" });
    setHasPrayed(true);
  }

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

    // Check daily message limit
    if (dailyMsgCount >= 50) {
      toast({
        title: "Limite de mensagens atingido",
        description: "Você pode enviar até 50 mensagens por dia.",
        variant: "destructive",
      });
      return;
    }

    const filtered = filterMessage(newMsg);
    await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, body: filtered });

    // Update daily message count
    setDailyMsgCount(prev => prev + 1);
    await supabase.from("profiles").update({
      daily_message_count: dailyMsgCount + 1,
    }).eq("id", user.id);

    // Send notification to partner
    if (partnerId) {
      await supabase.from("notifications").insert({
        user_id: partnerId,
        type: "new_message",
        reference_id: matchId as string,
      } as any);
    }

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

  if (gateLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="animate-pulse font-serif text-xl text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!hasPrayed) {
    return <PrayerGate onProceed={handleProceed} />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">{partnerName}</h2>
          <p className="text-xs text-muted-foreground">Chat privado • {dailyMsgCount}/50 mensagens hoje</p>
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
          placeholder={dailyMsgCount >= 50 ? "Limite diário atingido" : "Digite sua mensagem..."}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          className="flex-1"
          disabled={dailyMsgCount >= 50}
        />
        <Button type="submit" size="icon" disabled={!newMsg.trim() || dailyMsgCount >= 50}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
