"use client";

import { Button } from "@/components/ui/button";
import {
  CloudSun,
  Sprout,
  AlertTriangle,
  CalendarDays,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface OnboardingTourProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Benvenuto in AgriWeather",
    description:
      "Una dashboard meteo progettata per agricoltori. Ti aiuta a prendere decisioni operative basate su dati meteorologici.",
    icon: CloudSun,
  },
  {
    title: "Navigazione a Tab",
    description:
      "L'interfaccia è organizzata in 4 sezioni: Oggi (decisioni immediate), Settimana (pianificazione), Colture (monitoraggio fenologico), Rischi (alert e malattie).",
    icon: CalendarDays,
  },
  {
    title: "Tab Oggi",
    description:
      "Nowcasting precipitazioni a 15 minuti, condizioni attuali e finestre di trattamento. Tutto ciò che serve per decidere se entrare in campo.",
    icon: CloudSun,
  },
  {
    title: "Tab Colture",
    description:
      "Gradi Giorno (GDD) accumulati dall'inizio della stagione e Ore di Freddo per frutticoltura. Dati storici reali, non stime.",
    icon: Sprout,
  },
  {
    title: "Tab Rischi",
    description:
      "Alert per gelate, vento forte e rischio malattie fungine (Peronospora, Oidio, Botrite, Ruggine). Basati su modelli agronomici.",
    icon: AlertTriangle,
  },
  {
    title: "Località",
    description:
      "Cerca una città o usa la geolocalizzazione. Puoi salvare fino a 5 località preferite per accesso rapido.",
    icon: MapPin,
  },
];

export function OnboardingTour({
  currentStep,
  onNext,
  onPrev,
  onComplete,
}: OnboardingTourProps) {
  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 dark:bg-green-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <StepIcon className="h-6 w-6" />
            </div>
            <button
              onClick={onComplete}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Chiudi"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-xl font-bold">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-green-600"
                    : index < currentStep
                      ? "bg-green-300"
                      : "bg-slate-200 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={onPrev}
              disabled={isFirstStep}
              className={isFirstStep ? "invisible" : ""}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Indietro
            </Button>

            {isLastStep ? (
              <Button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Inizia
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className="bg-green-600 hover:bg-green-700"
              >
                Avanti
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Skip */}
        <div className="px-6 pb-4 text-center">
          <button
            onClick={onComplete}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Salta introduzione
          </button>
        </div>
      </div>
    </div>
  );
}
