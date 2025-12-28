import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUser, getUserProfile } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { Target, Dumbbell, TrendingUp, ChevronRight, Zap, Crown } from "lucide-react";
import type { WorkoutPlan } from "@/types/database";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  const supabase = await createClient();

  // Get latest workout plan
  const { data: latestPlanData } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const latestPlan = latestPlanData as WorkoutPlan | null;

  // Get plan count
  const { count: planCount } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const goalLabels: Record<string, string> = {
    hipertrofia: "Hipertrofia",
    emagrecimento: "Emagrecimento",
    fortalecimento: "Fortalecimento",
  };

  const goalIcons: Record<string, string> = {
    hipertrofia: "💪",
    emagrecimento: "🔥",
    fortalecimento: "🏋️",
  };

  const equipmentLabels: Record<string, string> = {
    academia_completa: "Academia",
    casa: "Casa",
    halteres: "Halteres",
    elasticos: "Elásticos",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-muted-foreground text-sm">Bem-vindo de volta</p>
            <h1 className="text-2xl font-bold">Olá! 👋</h1>
          </div>
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-primary">{planCount || 0}</div>
            <div className="text-xs text-muted-foreground">Planos</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold">{profile.weight}</div>
            <div className="text-xs text-muted-foreground">kg</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold">{profile.training_days_per_week}x</div>
            <div className="text-xs text-muted-foreground">semana</div>
          </div>
        </div>

        {/* Current Goal Card */}
        <div className="card-elevated p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                {goalIcons[profile.goal]}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Objetivo atual</div>
                <div className="font-semibold">{goalLabels[profile.goal]}</div>
              </div>
            </div>
            <Link href="/profile">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Current Plan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Plano Atual</h2>
            {latestPlan && (
              <Link href="/history" className="text-sm text-primary">
                Ver todos
              </Link>
            )}
          </div>

          {latestPlan ? (
            <Link href={`/plan/${latestPlan.id}`}>
              <div className="card-elevated-hover p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{latestPlan.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {latestPlan.description}
                    </p>
                  </div>
                  <div className="ml-3 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    Ativo
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                    <Target className="w-3 h-3" />
                    {goalLabels[latestPlan.goal]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                    <Dumbbell className="w-3 h-3" />
                    {equipmentLabels[latestPlan.equipment]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                    <TrendingUp className="w-3 h-3" />
                    {latestPlan.training_days_per_week}x/sem
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="card-elevated p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Nenhum plano ativo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gere seu primeiro plano de treino personalizado!
              </p>
              <GeneratePlanButton />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <GeneratePlanButton
              variant="default"
              label="Novo Plano"
              fullWidth={true}
            />
            <Link href="/history" className="block">
              <Button variant="secondary" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="card-elevated overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  FitPro Premium
                  <Zap className="w-4 h-4 text-primary" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  IA, nutrição e mais recursos
                </p>
              </div>
              <Link href="/waitlist">
                <Button size="sm">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
