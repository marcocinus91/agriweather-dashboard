"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";

interface FeatureHintProps {
  id: string;
  title: string;
  description: string;
  isDismissed: boolean;
  onDismiss: (id: string) => void;
}

export function FeatureHint({
  id,
  title,
  description,
  isDismissed,
  onDismiss,
}: FeatureHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="p-1 bg-amber-100 dark:bg-amber-800 rounded">
          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {title}
            </p>
            <button
              onClick={() => onDismiss(id)}
              className="p-0.5 text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 transition-colors"
              aria-label="Chiudi suggerimento"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
