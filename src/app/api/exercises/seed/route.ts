import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import exercisesData from "@/data/exercises.seed.json";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    // Use service role key for seeding (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration. Set SUPABASE_SERVICE_ROLE_KEY in .env.local" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clear existing exercises first
    await supabase.from("exercises").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert exercises
    const { data, error } = await supabase
      .from("exercises")
      .insert(
        exercisesData.map((exercise) => ({
          ...exercise,
          secondary_muscles: exercise.secondary_muscles || [],
        }))
      )
      .select();

    if (error) {
      console.error("Seed error:", error);
      return NextResponse.json(
        { error: `Erro ao inserir exercícios: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${data?.length || 0} exercícios inseridos/atualizados com sucesso!`,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno" },
      { status: 500 }
    );
  }
}
