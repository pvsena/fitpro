"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightContent?: React.ReactNode;
  transparent?: boolean;
}

export function AppHeader({
  title,
  showBack = false,
  backHref = "/dashboard",
  rightContent,
  transparent = false,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 py-3",
        transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-lg border-b border-border/50"
      )}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={backHref}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}
