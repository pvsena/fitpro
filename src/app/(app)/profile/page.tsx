import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getUserProfile } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Target, Dumbbell, Calendar, Scale, Ruler, Edit2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile();

  if (!profile) {
    redirect("/onboarding");
  }

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

  const genderLabels: Record<string, string> = {
    masculino: "Masculino",
    feminino: "Feminino",
    outro: "Outro",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Perfil</h1>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar & Name */}
            <div className="card-elevated p-6 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-elevated p-4 text-center">
                <Scale className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-lg font-bold">{profile.weight}</div>
                <div className="text-xs text-muted-foreground">kg</div>
              </div>
              <div className="card-elevated p-4 text-center">
                <Ruler className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-lg font-bold">{profile.height}</div>
                <div className="text-xs text-muted-foreground">cm</div>
              </div>
              <div className="card-elevated p-4 text-center">
                <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-lg font-bold">{profile.age}</div>
                <div className="text-xs text-muted-foreground">anos</div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Info */}
            <div className="card-elevated divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sexo</div>
                    <div className="font-medium">{genderLabels[profile.gender]}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Target className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Objetivo</div>
                    <div className="font-medium">{goalLabels[profile.goal]}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Nível</div>
                    <div className="font-medium">{levelLabels[profile.experience_level]}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Frequência</div>
                    <div className="font-medium">{profile.training_days_per_week}x por semana</div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Equipamento</div>
                    <div className="font-medium">{equipmentLabels[profile.equipment]}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card-elevated divide-y divide-border">
              <Link href="/onboarding" className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Editar Perfil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>

            {/* Logout */}
            <div className="flex justify-start">
              <LogoutButton variant="outline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
