import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { Target, Dumbbell, Calendar, ChevronRight, ClipboardList } from "lucide-react";
import type { WorkoutPlan } from "@/types/database";

export default async function HistoryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data: plansData } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const plans = plansData as WorkoutPlan[] | null;

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Histórico" showBack backHref="/dashboard" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Seus Planos</h1>
            <p className="text-sm text-muted-foreground">
              {plans?.length || 0} plano(s) gerado(s)
            </p>
          </div>
        </div>

        {/* Plans List */}
        {plans && plans.length > 0 ? (
          <div className="space-y-3">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/plan/${plan.id}`}>
                <div className="card-elevated-hover p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{plan.name}</h3>
                        {plan.is_active && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium flex-shrink-0">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {plan.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                      <Target className="w-3 h-3" />
                      {goalLabels[plan.goal]}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                      <Dumbbell className="w-3 h-3" />
                      {equipmentLabels[plan.equipment]}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                      <Calendar className="w-3 h-3" />
                      {plan.training_days_per_week}x/sem
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {new Date(plan.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Nenhum plano ainda</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Você ainda não gerou nenhum plano de treino.
            </p>
            <GeneratePlanButton />
          </div>
        )}

        {/* Generate New Plan */}
        {plans && plans.length > 0 && (
          <div className="mt-6">
            <GeneratePlanButton variant="secondary" label="Gerar Novo Plano" />
          </div>
        )}
      </div>
    </div>
  );
}
