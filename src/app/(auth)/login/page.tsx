"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        // Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          toast.error("Erro ao criar conta", {
            description: error.message,
          });
          return;
        }

        toast.success("Conta criada!", {
          description: "Você já pode fazer login.",
        });
        setIsSignUp(false);
        setPassword("");
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Erro ao entrar", {
            description: error.message === "Invalid login credentials"
              ? "Email ou senha incorretos"
              : error.message,
          });
          return;
        }

        toast.success("Login realizado!", {
          description: "Redirecionando...",
        });

        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Erro inesperado", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FitPro</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? "Criar Conta" : "Entrar no FitPro"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Preencha os dados para criar sua conta"
                : "Entre com seu email e senha"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isSignUp ? "Mínimo 6 caracteres" : "Sua senha"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? (isSignUp ? "Criando..." : "Entrando...")
                  : (isSignUp ? "Criar Conta" : "Entrar")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword("");
                }}
              >
                {isSignUp ? "Fazer login" : "Criar conta"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
