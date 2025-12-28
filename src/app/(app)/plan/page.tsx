import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { Dumbbell } from "lucide-react";
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

  // If there's an active plan, redirect to it
  if (latestPlan) {
    redirect(`/plan/${latestPlan.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Treino</h1>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        {/* No Plan State */}
        <div className="card-elevated p-8 md:p-12 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Nenhum plano ativo</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Gere seu primeiro plano de treino personalizado e comece a treinar!
          </p>
          <div className="max-w-xs mx-auto">
            <GeneratePlanButton size="lg" />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 md:mt-12 grid md:grid-cols-3 gap-4">
          <div className="card-elevated p-4 md:p-5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground md:text-lg">1</span>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Complete seu perfil</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Objetivo, equipamentos e frequência
                </p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4 md:p-5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground md:text-lg">2</span>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Gere seu plano</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Plano personalizado instantaneamente
                </p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4 md:p-5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary-foreground md:text-lg">3</span>
              </div>
              <div>
                <h3 className="font-medium text-sm md:text-base">Comece a treinar</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
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
