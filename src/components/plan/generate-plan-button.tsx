"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeneratePlanButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  label?: string;
  fullWidth?: boolean;
}

export function GeneratePlanButton({
  variant = "default",
  size = "default",
  label = "Gerar Plano",
  fullWidth = true,
}: GeneratePlanButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/plan/generate", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar plano");
      }

      toast.success("Plano gerado!", {
        description: "Seu novo plano de treino está pronto.",
      });

      router.push(`/plan/${data.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao gerar plano", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGenerate}
      disabled={loading}
      className={fullWidth ? "w-full" : ""}
    >
      {loading ? "Gerando..." : label}
    </Button>
  );
}
