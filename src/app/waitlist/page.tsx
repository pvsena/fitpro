"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const FEATURES = [
  { id: "ai_personalization", label: "Personalização com IA", desc: "Treinos adaptados por inteligência artificial" },
  { id: "progress_tracking", label: "Acompanhamento de Progresso", desc: "Gráficos e métricas detalhadas" },
  { id: "nutrition_plan", label: "Plano Nutricional", desc: "Dieta personalizada para seus objetivos" },
  { id: "video_tutorials", label: "Vídeos Tutoriais", desc: "Aprenda a execução correta de cada exercício" },
  { id: "coach_support", label: "Suporte de Coach", desc: "Tire dúvidas com profissionais" },
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Em Breve
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              FitPro Premium
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos avançados para levar seu treino ao próximo nível.
              Entre na lista de espera e seja um dos primeiros a acessar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">O que vem por aí</h2>
              <div className="space-y-4">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.label}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Entre na Lista de Espera</CardTitle>
                  <CardDescription>
                    {submitted
                      ? "Obrigado! Você foi adicionado à lista."
                      : "Seja notificado quando o Premium estiver disponível."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-8 h-8 text-green-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Você está na lista!</h3>
                      <p className="text-muted-foreground mb-4">
                        Vamos te avisar assim que o FitPro Premium estiver disponível.
                      </p>
                      <Link href="/login">
                        <Button>Começar com o Gratuito</Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Quais recursos te interessam mais?</Label>
                        {FEATURES.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.id}
                              checked={interests[feature.id] || false}
                              onCheckedChange={(checked) =>
                                handleInterestChange(feature.id, checked as boolean)
                              }
                              disabled={loading}
                            />
                            <label
                              htmlFor={feature.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {feature.label}
                            </label>
                          </div>
                        ))}
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Cadastrando..." : "Entrar na Lista"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Não enviamos spam. Você pode cancelar a qualquer momento.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
