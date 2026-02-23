import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, ChevronRight, ChevronLeft, Heart, Shield, Eye } from "lucide-react";

const TAGS_OPTIONS = [
  "Louvor / Música",
  "Ensino / Escola dominical",
  "Obra da piedade",
  "Mocidade",
  "Visitação",
  "Organista",
  "Porteiro(a)",
  "Cooperador(a)",
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [accepted, setAccepted] = useState(false);

  // Step 2
  const [congregation, setCongregation] = useState("");
  const [testimony, setTestimony] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Step 3
  const [showPhoto, setShowPhoto] = useState(false);
  const [showCongregation, setShowCongregation] = useState(true);

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  async function handleFinish() {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        congregation: congregation.trim(),
        testimony: testimony.trim(),
        participation_tags: tags,
        show_photo: showPhoto,
        show_congregation: showCongregation,
        onboarding_completed: true,
      })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bem-vindo ao ZELO! 🎉" });
      navigate("/app", { replace: true });
    }
  }

  const steps = [
    { icon: Heart, title: "Compromisso", subtitle: "Respeito e propósito" },
    { icon: Shield, title: "Seu perfil", subtitle: "Dados espirituais" },
    { icon: Eye, title: "Privacidade", subtitle: "Suas preferências" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 rounded transition-colors ${i < step ? "bg-accent" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-accent" />; })()}
            </div>
            <CardTitle className="font-serif text-xl">{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].subtitle}</CardDescription>
          </CardHeader>

          <CardContent>
            {step === 0 && (
              <div className="space-y-6">
                <div className="rounded-xl bg-muted/50 p-5 text-sm leading-relaxed text-muted-foreground">
                  <p className="mb-3 font-semibold text-foreground">Ao usar o ZELO, você se compromete a:</p>
                  <ul className="space-y-2">
                    <li>✦ Tratar todas as pessoas com respeito e dignidade</li>
                    <li>✦ Não enviar conteúdo impróprio ou ofensivo</li>
                    <li>✦ Ser honesto(a) nas informações do seu perfil</li>
                    <li>✦ Usar a plataforma com propósito sincero de formar família</li>
                    <li>✦ Respeitar os limites de cada pessoa</li>
                  </ul>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="accept"
                    checked={accepted}
                    onCheckedChange={(v) => setAccepted(v === true)}
                  />
                  <Label htmlFor="accept" className="text-sm leading-relaxed cursor-pointer">
                    Li e concordo com o compromisso de respeito acima
                  </Label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="congregation">Congregação</Label>
                  <Input
                    id="congregation"
                    value={congregation}
                    onChange={e => setCongregation(e.target.value)}
                    placeholder="Ex: Central de São Paulo"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimony">Seu testemunho (opcional)</Label>
                  <Textarea
                    id="testimony"
                    value={testimony}
                    onChange={e => setTestimony(e.target.value)}
                    placeholder="Conte um pouco da sua caminhada na fé..."
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">{testimony.length}/500</p>
                </div>
                <div className="space-y-3">
                  <Label>Participação na igreja</Label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS_OPTIONS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          tags.includes(tag)
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-background text-muted-foreground hover:border-accent/40"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Escolha o que outros membros podem ver no seu perfil.</p>
                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Mostrar foto</p>
                      <p className="text-xs text-muted-foreground">Sua foto ficará visível para outros membros</p>
                    </div>
                    <Switch checked={showPhoto} onCheckedChange={setShowPhoto} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Mostrar congregação</p>
                      <p className="text-xs text-muted-foreground">Outros membros verão sua congregação</p>
                    </div>
                    <Switch checked={showCongregation} onCheckedChange={setShowCongregation} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            ) : <div />}

            {step < 2 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !accepted}
              >
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading}>
                {loading ? "Salvando..." : "Finalizar"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
