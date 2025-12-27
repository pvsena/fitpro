import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { waitlistSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = waitlistSchema.parse(body);

    const supabase = await createClient();

    // Try to get current user (optional for waitlist)
    const { data: { user } } = await supabase.auth.getUser();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", validatedData.email)
      .single();

    if (existing) {
      // Update interests if already exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from("waitlist")
        .update({
          interests: validatedData.interests,
          user_id: user?.id || null,
        })
        .eq("email", validatedData.email);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        message: "Interesses atualizados com sucesso!",
      });
    }

    // Insert new waitlist entry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("waitlist")
      .insert({
        email: validatedData.email,
        interests: validatedData.interests,
        user_id: user?.id || null,
      });

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Este email já está na lista de espera" },
          { status: 400 }
        );
      }
      throw insertError;
    }

    // Track event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("events").insert({
      user_id: user?.id || null,
      event_name: "waitlist_signup",
      event_data: {
        email: validatedData.email,
        interests: validatedData.interests,
      },
    });

    return NextResponse.json({
      message: "Cadastro realizado com sucesso!",
    });
  } catch (error) {
    console.error("Waitlist error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar cadastro" },
      { status: 500 }
    );
  }
}
