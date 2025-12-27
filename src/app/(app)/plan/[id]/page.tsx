import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PlanViewer } from "@/components/plan/plan-viewer";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { LogoutButton } from "@/components/logout-button";
import type { WorkoutPlanData } from "@/lib/validations";
import type { WorkoutPlan } from "@/types/database";

interface PlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data: planData, error } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !planData) {
    notFound();
  }

  const plan = planData as WorkoutPlan;
  const planContent = plan.plan_data as WorkoutPlanData;

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
            <Link href="/history">
              <Button variant="ghost" size="sm">Histórico</Button>
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
            <span className="text-foreground">Plano</span>
          </nav>
        </div>

        {/* Plan Viewer */}
        <PlanViewer
          planData={planContent}
          planName={plan.name}
          planDescription={plan.description || undefined}
        />

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Voltar ao Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <GeneratePlanButton variant="secondary" label="Gerar Novo Plano" />
          </div>
        </div>

        {/* Plan Metadata */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p>
            Criado em:{" "}
            {new Date(plan.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}
