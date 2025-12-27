import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { LogoutButton } from "@/components/logout-button";
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl">FitPro</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/waitlist">
              <Button variant="ghost" size="sm">Premium</Button>
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Histórico</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Histórico de Planos</h1>
            <p className="text-muted-foreground">
              {plans?.length || 0} plano(s) gerado(s)
            </p>
          </div>
          <div className="w-48">
            <GeneratePlanButton />
          </div>
        </div>

        {/* Plans List */}
        {plans && plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {plan.is_active && <Badge variant="secondary">Ativo</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{goalLabels[plan.goal]}</Badge>
                    <Badge variant="outline">{plan.training_days_per_week}x/semana</Badge>
                    <Badge variant="outline">{equipmentLabels[plan.equipment]}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(plan.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link href={`/plan/${plan.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Plano
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-lg mb-2">Nenhum plano ainda</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não gerou nenhum plano de treino.
              </p>
              <div className="max-w-xs mx-auto">
                <GeneratePlanButton size="lg" />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
