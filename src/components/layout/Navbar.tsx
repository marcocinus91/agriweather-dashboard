"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <span className="font-semibold text-lg hidden sm:inline">
            AgriWeather
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-slate-500 dark:text-slate-400">
            Meteo Agricolo
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
