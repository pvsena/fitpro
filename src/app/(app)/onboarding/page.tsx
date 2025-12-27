"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { userProfileSchema, type UserProfileInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Dados Básicos", description: "Informações pessoais" },
  { id: 2, title: "Objetivos", description: "Seu objetivo e nível" },
  { id: 3, title: "Treino", description: "Frequência e equipamentos" },
  { id: 4, title: "Opcional", description: "Medidas e restrições" },
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
      // Validate the form data
      const validatedData = userProfileSchema.parse(formData);

      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Erro de autenticação", {
          description: "Faça login novamente.",
        });
        router.push("/login");
        return;
      }

      // Insert profile
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from("user_profiles")
        .insert({
          user_id: user.id,
          ...validatedData,
        });

      if (profileError) {
        // Check if profile already exists
        if (profileError.code === "23505") {
          // Update instead
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

      // Track event
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
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-1 w-12 md:w-24 mx-2 ${
                      step > s.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="font-semibold">{STEPS[step - 1].title}</h2>
            <p className="text-sm text-muted-foreground">{STEPS[step - 1].description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Conte-nos sobre você"}
              {step === 2 && "Qual é seu objetivo?"}
              {step === 3 && "Como você treina?"}
              {step === 4 && "Informações adicionais"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Essas informações nos ajudam a personalizar seu plano."}
              {step === 2 && "Vamos adaptar os exercícios ao seu objetivo."}
              {step === 3 && "Configuraremos o treino ideal para sua rotina."}
              {step === 4 && "Opcional: adicione detalhes extras para melhor personalização."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateField("gender", value as UserProfileInput["gender"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", parseInt(e.target.value) || undefined)}
                    min={10}
                    max={120}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight || ""}
                      onChange={(e) => updateField("weight", parseFloat(e.target.value) || undefined)}
                      step="0.1"
                      min={1}
                      max={500}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height || ""}
                      onChange={(e) => updateField("height", parseFloat(e.target.value) || undefined)}
                      min={1}
                      max={300}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Objetivo Principal</Label>
                  <div className="grid gap-3">
                    {[
                      { value: "hipertrofia", label: "Hipertrofia", desc: "Ganhar massa muscular" },
                      { value: "emagrecimento", label: "Emagrecimento", desc: "Perder gordura corporal" },
                      { value: "fortalecimento", label: "Fortalecimento", desc: "Aumentar força" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.goal === option.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => updateField("goal", option.value as UserProfileInput["goal"])}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nível de Experiência</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => updateField("experience_level", value as UserProfileInput["experience_level"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante (menos de 1 ano)</SelectItem>
                      <SelectItem value="intermediario">Intermediário (1-3 anos)</SelectItem>
                      <SelectItem value="avancado">Avançado (mais de 3 anos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Training */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Dias de Treino por Semana</Label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map((days) => (
                      <Button
                        key={days}
                        type="button"
                        variant={formData.training_days_per_week === days ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => updateField("training_days_per_week", days)}
                      >
                        {days}x
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Equipamentos Disponíveis</Label>
                  <div className="grid gap-3">
                    {[
                      { value: "academia_completa", label: "Academia Completa", desc: "Acesso a todos os equipamentos" },
                      { value: "halteres", label: "Halteres", desc: "Apenas halteres e banco" },
                      { value: "elasticos", label: "Elásticos", desc: "Bandas elásticas e peso corporal" },
                      { value: "casa", label: "Casa", desc: "Apenas peso corporal" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.equipment === option.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => updateField("equipment", option.value as UserProfileInput["equipment"])}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Optional */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="restrictions">Restrições ou Lesões</Label>
                  <Textarea
                    id="restrictions"
                    placeholder="Ex: Tenho uma lesão no ombro direito, evitar exercícios com carga alta acima da cabeça..."
                    value={formData.restrictions || ""}
                    onChange={(e) => updateField("restrictions", e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Opcional. Informe qualquer limitação física que devemos considerar.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Medidas Corporais</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recurso disponível em breve na versão Premium.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Adicionar Medidas
                  </Button>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Bioimpedância</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recurso disponível em breve na versão Premium.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Adicionar Dados
                  </Button>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Voltar
                </Button>
              )}
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Salvando..." : "Concluir"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
