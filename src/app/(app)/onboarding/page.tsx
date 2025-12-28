"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { userProfileSchema, type UserProfileInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Check, Target, Dumbbell, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Dados", icon: User },
  { id: 2, title: "Objetivo", icon: Target },
  { id: 3, title: "Treino", icon: Dumbbell },
  { id: 4, title: "Extra", icon: Calendar },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileInput>>({
    gender: undefined,
    age: undefined,
    weight: undefined,
    height: undefined,
    goal: undefined,
    experience_level: undefined,
    training_days_per_week: undefined,
    equipment: undefined,
    restrictions: "",
    body_measurements: null,
    bioimpedance: null,
  });

  const updateField = <K extends keyof UserProfileInput>(
    field: K,
    value: UserProfileInput[K] | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.gender && formData.age && formData.weight && formData.height;
      case 2:
        return formData.goal && formData.experience_level;
      case 3:
        return formData.training_days_per_week && formData.equipment;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const validatedData = userProfileSchema.parse(formData);
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Erro de autenticação", {
          description: "Faça login novamente.",
        });
        router.push("/login");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from("user_profiles")
        .insert({
          user_id: user.id,
          ...validatedData,
        });

      if (profileError) {
        if (profileError.code === "23505") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateError } = await (supabase as any)
            .from("user_profiles")
            .update(validatedData)
            .eq("user_id", user.id);

          if (updateError) {
            throw updateError;
          }
        } else {
          throw profileError;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("events").insert({
        user_id: user.id,
        event_name: "onboarding_completed",
        event_data: { goal: validatedData.goal, level: validatedData.experience_level },
      });

      toast.success("Perfil salvo!", {
        description: "Redirecionando para o dashboard...",
      });

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Erro ao salvar perfil", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
          ) : (
            <div />
          )}
          <span className="text-sm text-muted-foreground">
            Passo {step} de 4
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;

            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 mx-1",
                      step > s.id ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Seus Dados</h1>
                <p className="text-muted-foreground mt-1">
                  Informações básicas para personalizar seu treino
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Sexo</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "masculino", label: "Masculino" },
                      { value: "feminino", label: "Feminino" },
                      { value: "outro", label: "Outro" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("gender", option.value as UserProfileInput["gender"])}
                        className={cn(
                          "p-3 rounded-xl border text-sm font-medium transition-all",
                          formData.gender === option.value
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-border bg-card hover:border-primary/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm text-muted-foreground">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", parseInt(e.target.value) || undefined)}
                    min={10}
                    max={120}
                    className="mt-2 h-12 bg-card border-border/50 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight" className="text-sm text-muted-foreground">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight || ""}
                      onChange={(e) => updateField("weight", parseFloat(e.target.value) || undefined)}
                      step="0.1"
                      min={1}
                      max={500}
                      className="mt-2 h-12 bg-card border-border/50 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm text-muted-foreground">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height || ""}
                      onChange={(e) => updateField("height", parseFloat(e.target.value) || undefined)}
                      min={1}
                      max={300}
                      className="mt-2 h-12 bg-card border-border/50 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Seu Objetivo</h1>
                <p className="text-muted-foreground mt-1">
                  Vamos adaptar os exercícios ao seu objetivo
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-sm text-muted-foreground block">Objetivo Principal</Label>
                <div className="space-y-3">
                  {[
                    { value: "hipertrofia", label: "Hipertrofia", desc: "Ganhar massa muscular", icon: "💪" },
                    { value: "emagrecimento", label: "Emagrecimento", desc: "Perder gordura corporal", icon: "🔥" },
                    { value: "fortalecimento", label: "Fortalecimento", desc: "Aumentar força", icon: "🏋️" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("goal", option.value as UserProfileInput["goal"])}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4",
                        formData.goal === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <Label className="text-sm text-muted-foreground block">Nível de Experiência</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "iniciante", label: "Iniciante" },
                    { value: "intermediario", label: "Intermediário" },
                    { value: "avancado", label: "Avançado" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("experience_level", option.value as UserProfileInput["experience_level"])}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium transition-all",
                        formData.experience_level === option.value
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Training */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Seu Treino</h1>
                <p className="text-muted-foreground mt-1">
                  Configuraremos o treino ideal para sua rotina
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-sm text-muted-foreground block">Dias por Semana</Label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => updateField("training_days_per_week", days)}
                      className={cn(
                        "flex-1 h-14 rounded-xl border text-lg font-bold transition-all",
                        formData.training_days_per_week === days
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      {days}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <Label className="text-sm text-muted-foreground block">Equipamentos Disponíveis</Label>
                <div className="space-y-3">
                  {[
                    { value: "academia_completa", label: "Academia Completa", desc: "Todos os equipamentos" },
                    { value: "halteres", label: "Halteres", desc: "Halteres e banco" },
                    { value: "elasticos", label: "Elásticos", desc: "Bandas e peso corporal" },
                    { value: "casa", label: "Casa", desc: "Apenas peso corporal" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("equipment", option.value as UserProfileInput["equipment"])}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all",
                        formData.equipment === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Optional */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Informações Extras</h1>
                <p className="text-muted-foreground mt-1">
                  Opcional: adicione detalhes para melhor personalização
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="restrictions" className="text-sm text-muted-foreground">
                  Restrições ou Lesões
                </Label>
                <Textarea
                  id="restrictions"
                  placeholder="Ex: Tenho uma lesão no ombro direito..."
                  value={formData.restrictions || ""}
                  onChange={(e) => updateField("restrictions", e.target.value)}
                  rows={4}
                  className="bg-card border-border/50 rounded-xl resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Opcional. Informe qualquer limitação física.
                </p>
              </div>

              <div className="card-elevated p-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-lg">📊</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Medidas e Bioimpedância</h4>
                    <p className="text-xs text-muted-foreground">Em breve no Premium</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-border/50">
        <div className="max-w-lg mx-auto">
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              {loading ? "Salvando..." : "Concluir"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
