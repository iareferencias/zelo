import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Flag, Heart } from "lucide-react";
import { GuidedQuestions } from "@/components/GuidedQuestions";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-sm text-center"
      >
        <Heart className="mx-auto mb-6 h-6 w-6 text-muted-foreground" />
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
          Momento de oração
        </h2>
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
          Antes de iniciar esta conversa, reserve um momento de oração.
          Peça a Deus sabedoria e respeito para cada palavra.
        </p>
        <Button
          className="rounded-full px-8 text-sm font-medium"
          onClick={onProceed}
        >
          Prosseguir
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
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    if (!newMsg.trim() || !matchId || !user || sending) return;

    if (dailyMsgCount >= 50) {
      toast({ title: "Limite atingido", description: "Até 50 mensagens por dia.", variant: "destructive" });
      return;
    }

    setSending(true);
    const filtered = filterMessage(newMsg);
    setNewMsg("");

    await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, body: filtered });

    setDailyMsgCount(prev => prev + 1);
    await supabase.from("profiles").update({
      daily_message_count: dailyMsgCount + 1,
    }).eq("id", user.id);

    if (partnerId) {
      await supabase.from("notifications").insert({
        user_id: partnerId,
        type: "new_message",
        reference_id: matchId as string,
      } as any);
    }

    setSending(false);
  }

  async function submitReport() {
    if (!user || !partnerId || !reportReason.trim()) return;
    await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_id: partnerId,
      reason: reportReason,
    });
    toast({ title: "Denúncia enviada" });
    setReportOpen(false);
    setReportReason("");
  }

  if (gateLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!hasPrayed) {
    return <PrayerGate onProceed={handleProceed} />;
  }

  return (
    <div className="page-transition flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {partnerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{partnerName}</h2>
            <p className="text-[11px] text-muted-foreground">{dailyMsgCount}/50 mensagens</p>
          </div>
        </div>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Flag className="mr-1 h-3.5 w-3.5" />
              Denunciar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Denunciar</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Descreva o motivo..."
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
            />
            <Button onClick={submitReport} disabled={!reportReason.trim()}>Enviar</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.sender_id === user?.id
                  ? "bg-foreground text-background rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}>
                {m.body}
                <div className={`mt-1 text-[10px] ${
                  m.sender_id === user?.id ? "text-background/40" : "text-muted-foreground/50"
                }`}>
                  {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
        <GuidedQuestions onSelectQuestion={(q) => setNewMsg(q)} />
        <Input
          placeholder={dailyMsgCount >= 50 ? "Limite atingido" : "Mensagem..."}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-accent transition-colors duration-150"
          disabled={dailyMsgCount >= 50}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="shrink-0 text-muted-foreground hover:text-accent"
          disabled={!newMsg.trim() || dailyMsgCount >= 50 || sending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
