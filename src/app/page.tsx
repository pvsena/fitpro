import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Dumbbell, TrendingUp, Zap, Crown, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg md:text-xl">F</span>
            </div>
            <span className="font-bold text-xl md:text-2xl">FitPro</span>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
            <Link href="/waitlist" className="hidden md:block">
              <Button variant="ghost">Premium</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="md:size-default">Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                100% Gratuito
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Seu Plano de Treino
                <span className="text-gradient block mt-1">Personalizado</span>
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 md:text-lg">
                Gere planos de treino adaptados ao seu objetivo, nível e equipamentos.
                Simples, rápido e gratuito.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto md:mx-0">
                <Link href="/login" className="flex-1">
                  <Button size="lg" className="w-full btn-primary-pill">
                    Começar Agora
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/waitlist" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full rounded-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Lista Premium
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Feature cards (desktop only) */}
            <div className="hidden md:block space-y-4">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="card-elevated p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <div>
                  <h3 className="font-semibold md:text-lg">Crie sua Conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastre-se com email e senha.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <div>
                  <h3 className="font-semibold md:text-lg">Preencha seu Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Objetivo, nível e equipamentos.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <div>
                  <h3 className="font-semibold md:text-lg">Receba seu Plano</h3>
                  <p className="text-sm text-muted-foreground">
                    Plano personalizado instantâneo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section - Mobile only */}
      <section className="md:hidden px-4 py-12">
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
      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="card-elevated overflow-hidden">
            <div className="bg-gradient-to-br from-primary/30 to-primary/5 p-6 md:p-12">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Premium em Breve</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto md:mx-0">
                    IA para personalização avançada, acompanhamento de progresso, planos nutricionais e muito mais.
                  </p>
                  <Link href="/waitlist">
                    <Button className="rounded-full">
                      Entrar na Lista de Espera
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-elevated p-4 text-center">
                      <div className="text-3xl font-bold text-primary">IA</div>
                      <div className="text-sm text-muted-foreground">Personalização</div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-3xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-muted-foreground">Suporte</div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-3xl font-bold text-primary">100+</div>
                      <div className="text-sm text-muted-foreground">Exercícios</div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-3xl font-bold text-primary">Pro</div>
                      <div className="text-sm text-muted-foreground">Nutrição</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
