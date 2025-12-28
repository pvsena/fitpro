import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Dumbbell, TrendingUp, Zap, Crown, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border/50">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            100% Gratuito
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Seu Plano de Treino
            <span className="text-gradient block mt-1">Personalizado</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Gere planos de treino adaptados ao seu objetivo, nível e equipamentos.
            Simples, rápido e gratuito.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/login">
              <Button size="lg" className="w-full btn-primary-pill">
                Começar Agora
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/waitlist">
              <Button size="lg" variant="outline" className="w-full rounded-full">
                <Crown className="w-4 h-4 mr-2" />
                Lista Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 bg-card">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">
            Como Funciona
          </h2>
          <div className="space-y-4">
            <div className="card-elevated p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary-foreground">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Crie sua Conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastre-se com email e senha.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary-foreground">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Preencha seu Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Objetivo, nível e equipamentos.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary-foreground">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Receba seu Plano</h3>
                  <p className="text-sm text-muted-foreground">
                    Plano personalizado instantâneo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">
            Para Todos os Objetivos
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="card-elevated-hover p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Hipertrofia</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe massa muscular com volume e intensidade progressiva.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated-hover p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Emagrecimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Queime gordura com treinos de alta intensidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated-hover p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Fortalecimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Aumente força com baixas reps e cargas altas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="card-elevated overflow-hidden">
            <div className="bg-gradient-to-br from-primary/30 to-primary/5 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Premium em Breve</h2>
              <p className="text-sm text-muted-foreground mb-6">
                IA para personalização, progresso, nutrição e muito mais.
              </p>
              <Link href="/waitlist">
                <Button className="rounded-full">
                  Entrar na Lista de Espera
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-border/50">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">F</span>
            </div>
            <span className="font-semibold text-sm">FitPro</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} FitPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
