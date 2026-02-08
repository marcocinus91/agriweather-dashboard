"use client";

import { useState } from "react";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GrowingDegreeDaysProps {
  daily: DailyWeather;
}

interface CropPreset {
  name: string;
  baseTemp: number;
  icon: string;
  maturityGDD: number; // GDD necessari per maturazione
}

const CROP_PRESETS: CropPreset[] = [
  { name: "Mais", baseTemp: 10, icon: "🌽", maturityGDD: 2700 },
  { name: "Grano", baseTemp: 5, icon: "🌾", maturityGDD: 1500 },
  { name: "Pomodoro", baseTemp: 10, icon: "🍅", maturityGDD: 1400 },
  { name: "Vite", baseTemp: 10, icon: "🍇", maturityGDD: 1800 },
  { name: "Girasole", baseTemp: 8, icon: "🌻", maturityGDD: 1600 },
];

function calculateDailyGDD(tmax: number, tmin: number, tbase: number): number {
  const avgTemp = (tmax + tmin) / 2;
  const gdd = avgTemp - tbase;
  return Math.max(0, gdd); // GDD non può essere negativo
}

export function GrowingDegreeDays({ daily }: GrowingDegreeDaysProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropPreset>(CROP_PRESETS[0]);

  // Calcola GDD per ogni giorno
  const dailyGDD = daily.time.map((_, index) =>
    calculateDailyGDD(
      daily.temperature_2m_max[index],
      daily.temperature_2m_min[index],
      selectedCrop.baseTemp,
    ),
  );

  // Totale GDD dei prossimi 7 giorni
  const weeklyGDD = dailyGDD.reduce((sum, gdd) => sum + gdd, 0);

  // Media giornaliera
  const avgDailyGDD = weeklyGDD / dailyGDD.length;

  // Stima giorni per raggiungere maturazione (approssimativo)
  const daysToMaturity =
    avgDailyGDD > 0 ? Math.round(selectedCrop.maturityGDD / avgDailyGDD) : null;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          🌱 Gradi Giorno (GDD)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selezione coltura */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CROP_PRESETS.map((crop) => (
            <button
              key={crop.name}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                selectedCrop.name === crop.name
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span>{crop.icon}</span>
              <span>{crop.name}</span>
            </button>
          ))}
        </div>

        {/* Dati GDD */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{dailyGDD[0].toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              GDD oggi
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{weeklyGDD.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              GDD 7 giorni
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{avgDailyGDD.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Media/giorno
            </p>
          </div>
        </div>

        {/* Info coltura */}
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {selectedCrop.icon} {selectedCrop.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tbase: {selectedCrop.baseTemp}°C
            </span>
          </div>

          {/* Barra progresso verso maturazione */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Progresso stimato (7gg)</span>
              <span>
                {weeklyGDD.toFixed(0)} / {selectedCrop.maturityGDD} GDD
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{
                  width: `${Math.min((weeklyGDD / selectedCrop.maturityGDD) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {daysToMaturity && (
            <p className="text-xs text-slate-600 dark:text-slate-300">
              📅 A questo ritmo, maturazione stimata in ~{daysToMaturity} giorni
              dalla semina
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3">
          GDD = accumulo termico per sviluppo colturale. Più alto = crescita più
          rapida.
        </p>
      </CardContent>
    </Card>
  );
}
