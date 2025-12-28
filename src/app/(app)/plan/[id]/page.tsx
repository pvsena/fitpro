import { redirect, notFound } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { PlanViewer } from "@/components/plan/plan-viewer";
import { AppHeader } from "@/components/app/app-header";
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
    <div className="min-h-screen bg-background">
      <AppHeader title="Plano de Treino" showBack backHref="/dashboard" />

      <div className="px-4 max-w-lg mx-auto">
        <PlanViewer
          planData={planContent}
          planName={plan.name}
          planDescription={plan.description || undefined}
          createdAt={plan.created_at}
        />
      </div>
    </div>
  );
}
