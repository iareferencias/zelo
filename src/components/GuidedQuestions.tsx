import { useState } from "react";
import { MessageCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const GUIDED_QUESTIONS = [
  {
    category: "Fé & Vida Espiritual",
    questions: [
      "Como foi o seu primeiro contato com a Congregação?",
      "O que a fé significa no seu dia a dia?",
      "Qual foi um momento marcante na sua caminhada espiritual?",
      "Como você costuma orar e buscar a Deus?",
    ],
  },
  {
    category: "Família & Valores",
    questions: [
      "Como é a sua família? Me conta um pouco.",
      "O que significa constituir uma família pra você?",
      "Qual valor você considera mais importante em um relacionamento?",
      "Como você imagina a vida em família no futuro?",
    ],
  },
  {
    category: "Sonhos & Propósito",
    questions: [
      "Qual é um sonho que você tem para os próximos anos?",
      "O que te faz sentir realizado(a)?",
      "Se pudesse mudar uma coisa no mundo, o que seria?",
      "O que te trouxe ao Zelo?",
    ],
  },
  {
    category: "Conhecendo melhor",
    questions: [
      "O que você gosta de fazer no tempo livre?",
      "Qual foi o último livro ou hino que te marcou?",
      "Você prefere cidade pequena ou grande? Por quê?",
      "O que te faz rir?",
    ],
  },
];

interface GuidedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export function GuidedQuestions({ onSelectQuestion }: GuidedQuestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const category = GUIDED_QUESTIONS[currentCategory];

  function nextCategory() {
    setCurrentCategory((prev) => (prev + 1) % GUIDED_QUESTIONS.length);
  }

  function handleSelect(question: string) {
    onSelectQuestion(question);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-accent hover:text-accent/80 hover:bg-accent/10"
        onClick={() => setIsOpen(!isOpen)}
        title="Sugestões de conversa"
      >
        <Sparkles className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 w-72 rounded-xl border border-border bg-card p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-semibold text-foreground">{category.category}</span>
              </div>
              <button
                onClick={nextCategory}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-accent transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Próximo tema
              </button>
            </div>
            <div className="space-y-1.5">
              {category.questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(q)}
                  className="w-full text-left rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent/5 hover:text-foreground transition-colors duration-150 leading-relaxed"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
