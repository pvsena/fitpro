import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/waitlist">
              <Button variant="ghost">Premium</Button>
            </Link>
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Seu Plano de Treino
              <span className="text-primary block">Personalizado</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gere planos de treino adaptados ao seu objetivo, nível de experiência
              e equipamentos disponíveis. Simples, rápido e gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/waitlist">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Lista de Espera Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Crie sua Conta</h3>
                <p className="text-muted-foreground">
                  Cadastre-se gratuitamente usando seu email.
                  Sem senha, apenas um link mágico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Preencha seu Perfil</h3>
                <p className="text-muted-foreground">
                  Informe seus dados, objetivo, nível de experiência
                  e equipamentos disponíveis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Receba seu Plano</h3>
                <p className="text-muted-foreground">
                  Gere seu plano de treino personalizado instantaneamente
                  e comece a treinar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Para Todos os Objetivos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="font-semibold text-lg mb-2">Hipertrofia</h3>
              <p className="text-sm text-muted-foreground">
                Ganhe massa muscular com treinos focados em volume e intensidade progressiva.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-semibold text-lg mb-2">Emagrecimento</h3>
              <p className="text-sm text-muted-foreground">
                Queime gordura com treinos de alta intensidade e menor descanso.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="font-semibold text-lg mb-2">Fortalecimento</h3>
              <p className="text-sm text-muted-foreground">
                Aumente sua força com treinos de baixas repetições e cargas altas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Premium em Breve
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Estamos preparando recursos exclusivos: IA para personalização avançada,
            acompanhamento de progresso, planos nutricionais e muito mais.
          </p>
          <Link href="/waitlist">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Entrar na Lista de Espera
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <span className="font-semibold">FitPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FitPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
