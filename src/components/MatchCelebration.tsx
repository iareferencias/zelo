import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchCelebrationProps {
  matchId: string;
  partnerName: string;
  open: boolean;
  onClose: () => void;
}

export function MatchCelebration({ matchId, partnerName, open, onClose }: MatchCelebrationProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mx-4 max-w-sm w-full rounded-2xl border border-border bg-card p-10 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full gold-gradient"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <span className="text-2xl">✦</span>
            </motion.div>

            <motion.h2
              className="font-display text-2xl font-semibold text-foreground mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Existe algo em comum entre vocês.
            </motion.h2>

            <motion.p
              className="text-sm text-muted-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Você e <span className="font-medium text-foreground">{partnerName}</span> demonstraram interesse mútuo.
            </motion.p>

            <motion.p
              className="text-xs text-muted-foreground/70 italic mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Conectem-se com respeito.
            </motion.p>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                className="w-full gold-gradient text-accent-foreground rounded-xl font-medium"
                size="lg"
                onClick={() => {
                  onClose();
                  navigate(`/app/chat/${matchId}`);
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Iniciar conversa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground text-xs"
                onClick={onClose}
              >
                Conversar depois
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
