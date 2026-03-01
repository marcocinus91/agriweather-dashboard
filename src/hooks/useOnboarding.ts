"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "agriweather-onboarding";

interface OnboardingState {
  completed: boolean;
  currentStep: number;
  dismissedTooltips: string[];
}

const DEFAULT_STATE: OnboardingState = {
  completed: false,
  currentStep: 0,
  dismissedTooltips: [],
};

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignora errori di parsing
        }
      }
    }
    return DEFAULT_STATE;
  });
  const [mounted] = useState(typeof window !== "undefined");

  // Funzione per aggiornare stato e salvare
  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const nextStep = useCallback(() => {
    updateState({ currentStep: state.currentStep + 1 });
  }, [state.currentStep, updateState]);

  const prevStep = useCallback(() => {
    updateState({ currentStep: Math.max(0, state.currentStep - 1) });
  }, [state.currentStep, updateState]);

  const completeOnboarding = useCallback(() => {
    updateState({ completed: true, currentStep: 0 });
  }, [updateState]);

  const resetOnboarding = useCallback(() => {
    updateState(DEFAULT_STATE);
  }, [updateState]);

  const dismissTooltip = useCallback(
    (id: string) => {
      if (!state.dismissedTooltips.includes(id)) {
        updateState({
          dismissedTooltips: [...state.dismissedTooltips, id],
        });
      }
    },
    [state.dismissedTooltips, updateState],
  );

  const isTooltipDismissed = useCallback(
    (id: string) => state.dismissedTooltips.includes(id),
    [state.dismissedTooltips],
  );

  return {
    completed: state.completed,
    currentStep: state.currentStep,
    dismissedTooltips: state.dismissedTooltips,
    mounted,
    showOnboarding: mounted && !state.completed,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding,
    dismissTooltip,
    isTooltipDismissed,
  };
}
