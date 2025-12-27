import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWorkoutPlan, generatePlanName, generatePlanDescription } from "@/lib/plan/generator";
import { workoutPlanDataSchema } from "@/lib/validations";
import type { UserProfile, Exercise } from "@/types/database";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Perfil não encontrado. Complete o onboarding primeiro." },
        { status: 400 }
      );
    }

    const profile = profileData as UserProfile;

    // Get exercises from database
    const { data: exercisesData, error: exercisesError } = await supabase
      .from("exercises")
      .select("*");

    if (exercisesError || !exercisesData || exercisesData.length === 0) {
      return NextResponse.json(
        { error: "Nenhum exercício disponível. Execute o seed de exercícios." },
        { status: 500 }
      );
    }

    const exercises = exercisesData as Exercise[];

    // Generate the workout plan
    const planData = generateWorkoutPlan(profile, exercises);

    // Validate the generated plan
    const validatedPlan = workoutPlanDataSchema.parse(planData);

    // Set previous active plans to inactive
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("workout_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Save the new plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: savedPlan, error: saveError } = await (supabase as any)
      .from("workout_plans")
      .insert({
        user_id: user.id,
        name: generatePlanName(profile),
        description: generatePlanDescription(profile),
        goal: profile.goal,
        experience_level: profile.experience_level,
        training_days_per_week: profile.training_days_per_week,
        equipment: profile.equipment,
        plan_data: validatedPlan,
        is_active: true,
      })
      .select()
      .single();

    if (saveError || !savedPlan) {
      console.error("Error saving plan:", saveError);
      return NextResponse.json(
        { error: "Erro ao salvar o plano" },
        { status: 500 }
      );
    }

    // Track event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("events").insert({
      user_id: user.id,
      event_name: "plan_generated",
      event_data: {
        plan_id: savedPlan.id,
        goal: profile.goal,
        level: profile.experience_level,
        days: profile.training_days_per_week,
      },
    });

    return NextResponse.json({
      id: savedPlan.id,
      message: "Plano gerado com sucesso!",
    });
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno" },
      { status: 500 }
    );
  }
}
