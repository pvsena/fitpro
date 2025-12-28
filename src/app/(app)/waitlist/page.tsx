"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Crown, Sparkles, TrendingUp, Video, MessageCircle, Salad, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  { id: "ai_personalization", label: "IA Avançada", desc: "Treinos adaptados por inteligência artificial", icon: Sparkles },
  { id: "progress_tracking", label: "Progresso", desc: "Gráficos e métricas detalhadas", icon: TrendingUp },
  { id: "nutrition_plan", label: "Nutrição", desc: "Dieta personalizada para seus objetivos", icon: Salad },
  { id: "video_tutorials", label: "Vídeos", desc: "Aprenda a execução correta", icon: Video },
  { id: "coach_support", label: "Coach", desc: "Suporte de profissionais", icon: MessageCircle },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInterestChange = (id: string, checked: boolean) => {
    setInterests((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      setSubmitted(true);
      toast.success("Cadastro realizado!", {
        description: "Você será notificado quando o Premium estiver disponível.",
      });
    } catch (error) {
      toast.error("Erro ao cadastrar", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Premium</h1>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8 md:mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Em Breve
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">FitPro Premium</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Recursos avançados para levar seu treino ao próximo nível.
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="card-elevated p-8 md:p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Você está na lista!</h2>
            <p className="text-muted-foreground mb-6">
              Vamos te avisar assim que o FitPro Premium estiver disponível.
            </p>
            <Button variant="secondary" className="rounded-xl" onClick={() => window.location.href = "/dashboard"}>
              Voltar ao Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h3 className="font-semibold mb-4 md:text-lg">O que vem por aí</h3>
              <div className="space-y-3">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="card-elevated p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm md:text-base">{feature.label}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-1 md:text-lg">Entre na Lista</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Seja notificado quando o Premium estiver disponível.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="mt-2 h-12 bg-secondary border-border/50 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Quais recursos te interessam?</Label>
                  {FEATURES.map((feature) => (
                    <label
                      key={feature.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        interests[feature.id]
                          ? "border-primary bg-primary/10"
                          : "border-border bg-secondary hover:border-primary/50"
                      )}
                    >
                      <Checkbox
                        id={feature.id}
                        checked={interests[feature.id] || false}
                        onCheckedChange={(checked) =>
                          handleInterestChange(feature.id, checked as boolean)
                        }
                        disabled={loading}
                      />
                      <span className="text-sm font-medium">{feature.label}</span>
                    </label>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Entrar na Lista"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Não enviamos spam. Cancele a qualquer momento.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
