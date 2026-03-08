"use client";

import { useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { X, Cloud } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "agriweather-login-banner-dismissed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return true; // Server: assume dismissed per evitare hydration mismatch
}

export function LoginBanner() {
  const { data: session, status } = useSession();
  const dismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (status === "loading") return null;
  if (session || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
          <Cloud className="h-4 w-4" />
          <span>
            <Link
              href="/login"
              className="font-medium underline hover:no-underline"
            >
              Accedi
            </Link>{" "}
            per salvare città e preferenze su tutti i tuoi dispositivi
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded transition-colors"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4 text-green-600 dark:text-green-400" />
        </button>
      </div>
    </div>
  );
}
