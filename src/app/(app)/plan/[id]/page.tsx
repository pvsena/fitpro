import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import { PlanViewer } from "@/components/plan/plan-viewer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
      {/* Header - Mobile only back button */}
      <div className="md:hidden px-4 py-4 border-b border-border/50">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:block px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Plano</span>
          </nav>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-6xl mx-auto">
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
