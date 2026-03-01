"use client";

import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Wheat, LogIn, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Wheat className="h-6 w-6 text-green-600" />
        <span className="font-semibold text-lg">AgriWeather</span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
          Meteo Agricolo
        </span>

        {/* Auth */}
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Esci"
            >
              <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:block">Accedi</span>
          </Link>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Cambia tema"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-slate-300" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </button>
      </div>
    </nav>
  );
}
