"use client";

import { useState, useMemo } from "react";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Calendar, TrendingUp, Loader2, Plus, LogIn } from "lucide-react";
import { useSeasonalGDD } from "@/hooks/useHistoricalData";
import { useCrops } from "@/hooks/useCrops";
import { calculateDailyGDD, calculateCumulativeGDD } from "@/lib/agro/gdd";
import Link from "next/link";

interface GrowingDegreeDaysProps {
  daily: DailyWeather;
  latitude: number;
  longitude: number;
}

interface CropOption {
  name: string;
  baseTemp: number;
  maturityGDD: number;
  seasonStart: string;
}

const DEFAULT_PRESETS: CropOption[] = [
  { name: "Mais", baseTemp: 10, maturityGDD: 2700, seasonStart: "04-15" },
  { name: "Grano", baseTemp: 5, maturityGDD: 1500, seasonStart: "11-01" },
  { name: "Pomodoro", baseTemp: 10, maturityGDD: 1400, seasonStart: "04-01" },
  { name: "Vite", baseTemp: 10, maturityGDD: 1800, seasonStart: "04-01" },
  { name: "Girasole", baseTemp: 8, maturityGDD: 1600, seasonStart: "04-15" },
];

function getSeasonStartDate(seasonStart: string): string {
  const today = new Date();

  if (seasonStart.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return seasonStart;
  }

  const [month, day] = seasonStart.split("-").map(Number);
  let year = today.getFullYear();

  const seasonStartDate = new Date(year, month - 1, day);
  if (seasonStartDate > today) {
    year -= 1;
  }

  return `${year}-${seasonStart}`;
}

export function GrowingDegreeDays({ daily, latitude, longitude }: GrowingDegreeDaysProps) {
  const { crops: customCrops, isLoading: cropsLoading, isAuthenticated, saveCrop } = useCrops();

  // Determina quali colture mostrare
  const displayCrops = useMemo<CropOption[]>(() => {
    if (!isAuthenticated) {
      return DEFAULT_PRESETS;
    }

    if (customCrops.length > 0) {
      return customCrops.map((c) => ({
        name: c.cropName,
        baseTemp: c.baseTemp,
        maturityGDD: c.targetGDD,
        seasonStart: c.seasonStartDate,
      }));
    }

    return DEFAULT_PRESETS;
  }, [isAuthenticated, customCrops]);

  const hasCustomCrops = isAuthenticated && customCrops.length > 0;

  const [selectedCropName, setSelectedCropName] = useState<string>("");

  // Seleziona la prima coltura se non selezionata
  const effectiveSelectedName = selectedCropName || displayCrops[0]?.name || "Mais";

  const selectedCrop = useMemo(() => {
    return displayCrops.find((c) => c.name === effectiveSelectedName) || displayCrops[0] || DEFAULT_PRESETS[0];
  }, [displayCrops, effectiveSelectedName]);

  const seasonStartDate = getSeasonStartDate(selectedCrop.seasonStart);

  const { data: historicalData, isLoading: historicalLoading } = useSeasonalGDD(
    latitude,
    longitude,
    seasonStartDate
  );

  // Calcoli GDD
  const forecastGDD = daily.time.map((_, index) =>
    calculateDailyGDD(
      daily.temperature_2m_max[index],
      daily.temperature_2m_min[index],
      selectedCrop.baseTemp
    )
  );
  const weeklyForecastGDD = forecastGDD.reduce((sum, gdd) => sum + gdd, 0);

  const seasonalGDD = historicalData
    ? calculateCumulativeGDD(
        historicalData.daily.temperature_2m_max,
        historicalData.daily.temperature_2m_min,
        selectedCrop.baseTemp
      )
    : 0;

  const totalGDD = seasonalGDD + weeklyForecastGDD;
  const progressPercent = Math.min((totalGDD / selectedCrop.maturityGDD) * 100, 100);
  const daysSinceStart = historicalData?.daily.time.length || 0;
  const avgDailyGDD = daysSinceStart > 0 ? seasonalGDD / daysSinceStart : 0;
  const remainingGDD = selectedCrop.maturityGDD - totalGDD;
  const estimatedDaysRemaining =
    avgDailyGDD > 0 && remainingGDD > 0 ? Math.round(remainingGDD / avgDailyGDD) : null;

  // Adotta preset come coltura custom
  const handleAdoptPreset = (preset: CropOption) => {
    const today = new Date();
    const [month, day] = preset.seasonStart.split("-").map(Number);
    let year = today.getFullYear();
    const seasonDate = new Date(year, month - 1, day);
    if (seasonDate > today) year -= 1;

    saveCrop({
      cropName: preset.name,
      baseTemp: preset.baseTemp,
      targetGDD: preset.maturityGDD,
      seasonStartDate: `${year}-${preset.seasonStart}`,
    });
  };

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
          {cropsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : (
            displayCrops.map((crop) => (
              <button
                key={crop.name}
                onClick={() => setSelectedCropName(crop.name)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedCrop.name === crop.name
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {crop.name}
              </button>
            ))
          )}
        </div>

        {/* CTA per non autenticati */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
              Stai usando colture predefinite.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline"
            >
              <LogIn className="h-3 w-3" />
              Accedi per personalizzare
            </Link>
          </div>
        )}

        {/* CTA per autenticati senza colture custom */}
        {isAuthenticated && !hasCustomCrops && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
              Clicca su una coltura per aggiungerla ai tuoi preferiti e personalizzarla.
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleAdoptPreset(preset)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dati GDD */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            {historicalLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
            ) : (
              <p className="text-2xl font-bold">{Math.round(totalGDD)}</p>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300">GDD totali</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round(seasonalGDD)}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Accumulati</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">+{Math.round(weeklyForecastGDD)}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Prossimi 7gg</p>
          </div>
        </div>

        {/* Info stagione */}
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {selectedCrop.name}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Tbase: {selectedCrop.baseTemp}°C
            </span>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
            Stagione iniziata: {new Date(seasonStartDate).toLocaleDateString("it-IT")} ({daysSinceStart} giorni fa)
          </div>

          {/* Barra progresso */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
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
            <p className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
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
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
          <span>Media giornaliera stagione:</span>
          <span className="font-medium">{avgDailyGDD.toFixed(1)} GDD/giorno</span>
        </div>
      </CardContent>
    </Card>
  );
}