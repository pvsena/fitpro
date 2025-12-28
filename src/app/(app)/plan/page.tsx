import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { Dumbbell, ChevronRight, Target, Calendar } from "lucide-react";
import Link from "next/link";
import type { WorkoutPlan } from "@/types/database";

export default async function PlanIndexPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Get latest active workout plan
  const { data: latestPlanData } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const latestPlan = latestPlanData as WorkoutPlan | null;

  const goalLabels: Record<string, string> = {
    hipertrofia: "Hipertrofia",
    emagrecimento: "Emagrecimento",
    fortalecimento: "Fortalecimento",
  };

  const equipmentLabels: Record<string, string> = {
    academia_completa: "Academia",
    casa: "Casa",
    halteres: "Halteres",
    elasticos: "Elásticos",
  };

  // If there's an active plan, redirect to it
  if (latestPlan) {
    redirect(`/plan/${latestPlan.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Treino" />

      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* No Plan State */}
        <div className="card-elevated p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold mb-2">Nenhum plano ativo</h1>
          <p className="text-muted-foreground mb-8">
            Gere seu primeiro plano de treino personalizado e comece a treinar!
          </p>
          <GeneratePlanButton size="lg" />
        </div>

        {/* Quick Tips */}
        <div className="mt-8 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Como funciona
          </h2>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground">1</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Complete seu perfil</h3>
                <p className="text-xs text-muted-foreground">
                  Objetivo, equipamentos e frequência
                </p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground">2</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Gere seu plano</h3>
                <p className="text-xs text-muted-foreground">
                  Plano personalizado instantaneamente
                </p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground">3</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Comece a treinar</h3>
                <p className="text-xs text-muted-foreground">
                  Siga o plano e acompanhe seu progresso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
