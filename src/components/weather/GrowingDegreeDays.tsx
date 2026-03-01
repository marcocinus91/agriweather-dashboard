"use client";

import { useState } from "react";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { useSeasonalGDD } from "@/hooks/useHistoricalData";
import { calculateDailyGDD, calculateCumulativeGDD } from "@/lib/agro/gdd";

interface GrowingDegreeDaysProps {
  daily: DailyWeather;
  latitude: number;
  longitude: number;
}

interface CropPreset {
  name: string;
  baseTemp: number;
  maturityGDD: number;
  defaultSeasonStart: string; // MM-DD
}

const CROP_PRESETS: CropPreset[] = [
  {
    name: "Mais",
    baseTemp: 10,
    maturityGDD: 2700,
    defaultSeasonStart: "04-15",
  },
  {
    name: "Grano",
    baseTemp: 5,
    maturityGDD: 1500,
    defaultSeasonStart: "11-01",
  },
  {
    name: "Pomodoro",
    baseTemp: 10,
    maturityGDD: 1400,
    defaultSeasonStart: "04-01",
  },
  {
    name: "Vite",
    baseTemp: 10,
    maturityGDD: 1800,
    defaultSeasonStart: "04-01",
  },
  {
    name: "Girasole",
    baseTemp: 8,
    maturityGDD: 1600,
    defaultSeasonStart: "04-15",
  },
];

function getSeasonStartDate(defaultMonthDay: string): string {
  const today = new Date();
  const [month, day] = defaultMonthDay.split("-").map(Number);
  let year = today.getFullYear();

  const seasonStart = new Date(year, month - 1, day);
  if (seasonStart > today) {
    year -= 1;
  }

  return `${year}-${defaultMonthDay}`;
}

export function GrowingDegreeDays({
  daily,
  latitude,
  longitude,
}: GrowingDegreeDaysProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropPreset>(CROP_PRESETS[0]);

  const seasonStartDate = getSeasonStartDate(selectedCrop.defaultSeasonStart);

  const { data: historicalData, isLoading: historicalLoading } = useSeasonalGDD(
    latitude,
    longitude,
    seasonStartDate,
  );

  // GDD dai prossimi 7 giorni (previsione)
  const forecastGDD = daily.time.map((_, index) =>
    calculateDailyGDD(
      daily.temperature_2m_max[index],
      daily.temperature_2m_min[index],
      selectedCrop.baseTemp,
    ),
  );
  const weeklyForecastGDD = forecastGDD.reduce((sum, gdd) => sum + gdd, 0);

  // GDD stagionali (storico)
  const seasonalGDD = historicalData
    ? calculateCumulativeGDD(
        historicalData.daily.temperature_2m_max,
        historicalData.daily.temperature_2m_min,
        selectedCrop.baseTemp,
      )
    : 0;

  // GDD totali (storico + previsione)
  const totalGDD = seasonalGDD + weeklyForecastGDD;

  // Progresso verso maturazione
  const progressPercent = Math.min(
    (totalGDD / selectedCrop.maturityGDD) * 100,
    100,
  );

  // Giorni dall'inizio stagione
  const daysSinceStart = historicalData?.daily.time.length || 0;

  // Media giornaliera stagionale
  const avgDailyGDD = daysSinceStart > 0 ? seasonalGDD / daysSinceStart : 0;

  // Stima giorni rimanenti
  const remainingGDD = selectedCrop.maturityGDD - totalGDD;
  const estimatedDaysRemaining =
    avgDailyGDD > 0 && remainingGDD > 0
      ? Math.round(remainingGDD / avgDailyGDD)
      : null;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-500" />
          Gradi Giorno (GDD) Stagionali
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selezione coltura */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CROP_PRESETS.map((crop) => (
            <button
              key={crop.name}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCrop.name === crop.name
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {crop.name}
            </button>
          ))}
        </div>

        {/* Dati GDD */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            {historicalLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
            ) : (
              <p className="text-2xl font-bold">{Math.round(totalGDD)}</p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              GDD totali
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round(seasonalGDD)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accumulati
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              +{Math.round(weeklyForecastGDD)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prossimi 7gg
            </p>
          </div>
        </div>

        {/* Info stagione */}
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {selectedCrop.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tbase: {selectedCrop.baseTemp}°C
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Stagione iniziata:{" "}
            {new Date(seasonStartDate).toLocaleDateString("it-IT")} (
            {daysSinceStart} giorni fa)
          </div>

          {/* Barra progresso */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Progresso maturazione</span>
              <span>
                {Math.round(totalGDD)} / {selectedCrop.maturityGDD} GDD
              </span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progressPercent >= 100
                    ? "bg-green-500"
                    : progressPercent >= 75
                      ? "bg-lime-500"
                      : progressPercent >= 50
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stima maturazione */}
          {estimatedDaysRemaining !== null && estimatedDaysRemaining > 0 ? (
            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Maturazione stimata tra ~{estimatedDaysRemaining} giorni
            </p>
          ) : progressPercent >= 100 ? (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Maturazione raggiunta
            </p>
          ) : null}
        </div>

        {/* Media giornaliera */}
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Media giornaliera stagione:</span>
          <span className="font-medium">
            {avgDailyGDD.toFixed(1)} GDD/giorno
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
