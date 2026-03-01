"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  title?: string;
}

export function InfoTooltip({ content, title }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="Mostra informazioni"
      >
        <Info className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay per chiudere */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg">
            {title && <p className="font-medium mb-1">{title}</p>}
            <p className="text-slate-200">{content}</p>

            {/* Freccia */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800 dark:border-t-slate-700" />
          </div>
        </>
      )}
    </div>
  );
}
