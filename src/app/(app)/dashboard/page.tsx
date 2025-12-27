import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getUser, getUserProfile } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { LogoutButton } from "@/components/logout-button";
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

  const levelLabels: Record<string, string> = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };

  const equipmentLabels: Record<string, string> = {
    academia_completa: "Academia Completa",
    casa: "Casa",
    halteres: "Halteres",
    elasticos: "Elásticos",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" size="sm">Histórico</Button>
            </Link>
            <Link href="/waitlist">
              <Button variant="ghost" size="sm">Premium</Button>
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá! 👋</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu dashboard. Aqui você pode gerenciar seus planos de treino.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seu Perfil</CardTitle>
              <CardDescription>Configurações atuais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Objetivo</span>
                <Badge>{goalLabels[profile.goal]}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nível</span>
                <Badge variant="outline">{levelLabels[profile.experience_level]}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Frequência</span>
                <span className="font-medium">{profile.training_days_per_week}x/semana</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Equipamento</span>
                <span className="font-medium text-sm">{equipmentLabels[profile.equipment]}</span>
              </div>
              <div className="pt-2">
                <Link href="/onboarding">
                  <Button variant="outline" size="sm" className="w-full">
                    Editar Perfil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
              <CardDescription>Seu progresso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold text-primary">{planCount || 0}</div>
                <div className="text-sm text-muted-foreground">Planos gerados</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{profile.weight}kg</div>
                  <div className="text-xs text-muted-foreground">Peso</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{profile.height}cm</div>
                  <div className="text-xs text-muted-foreground">Altura</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              <CardDescription>O que você quer fazer?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <GeneratePlanButton />
              <Link href="/history" className="block">
                <Button variant="outline" className="w-full">
                  Ver Histórico
                </Button>
              </Link>
              <Link href="/waitlist" className="block">
                <Button variant="secondary" className="w-full">
                  Lista Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Current Plan */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Plano Atual</h2>
          {latestPlan ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{latestPlan.name}</CardTitle>
                    <CardDescription>{latestPlan.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">Ativo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{goalLabels[latestPlan.goal]}</Badge>
                  <Badge variant="outline">{latestPlan.training_days_per_week}x/semana</Badge>
                  <Badge variant="outline">{equipmentLabels[latestPlan.equipment]}</Badge>
                </div>
                <div className="flex gap-4">
                  <Link href={`/plan/${latestPlan.id}`}>
                    <Button>Ver Plano Completo</Button>
                  </Link>
                  <GeneratePlanButton variant="outline" label="Gerar Novo" fullWidth={false} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-4xl mb-4">🏋️</div>
                <h3 className="font-semibold text-lg mb-2">Nenhum plano ativo</h3>
                <p className="text-muted-foreground mb-4">
                  Gere seu primeiro plano de treino personalizado!
                </p>
                <GeneratePlanButton size="lg" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Premium CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">Quer recursos avançados?</h3>
                <p className="text-muted-foreground">
                  Entre na lista de espera para o FitPro Premium com IA, nutrição e mais!
                </p>
              </div>
              <Link href="/waitlist">
                <Button>Entrar na Lista</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
