"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap e gestione tastiera
  useEffect(() => {
    if (!isOpen) return;

    // Focus sul bottone annulla all'apertura
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // Previeni scroll del body
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full ${
                variant === "danger"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              }`}
              aria-hidden="true"
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  variant === "danger"
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              />
            </div>
            <div>
              <h2
                id="dialog-title"
                className="font-semibold text-lg"
              >
                {title}
              </h2>
              <p
                id="dialog-description"
                className="text-sm text-slate-500 dark:text-slate-400 mt-1"
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}