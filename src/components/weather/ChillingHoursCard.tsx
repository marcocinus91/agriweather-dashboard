"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSnowflake, Info, Loader2, Calendar } from "lucide-react";
import { useChillingSeason } from "@/hooks/useHistoricalData";
import { FRUIT_CHILLING_REQUIREMENTS } from "@/lib/agro/chilling";

interface ChillingHoursCardProps {
  latitude: number;
  longitude: number;
}

// Stima ore di freddo giornaliere dalle temperature min/max
function estimateDailyChillingHours(tmin: number, tmax: number): number {
  // Approssimazione: ore nel range 0-7°C basate su distribuzione temperatura
  const avgTemp = (tmin + tmax) / 2;

  if (avgTemp < 0) return Math.max(0, 24 - Math.abs(tmin) * 2);
  if (avgTemp > 10) return 0;

  // Stima ore basata su quanto della giornata è nel range 0-7°C
  const hoursInRange = Math.max(
    0,
    Math.min(24, 24 - Math.abs(avgTemp - 3.5) * 3),
  );
  return hoursInRange;
}

// Stima chill units giornalieri
function estimateDailyChillUnits(tmin: number, tmax: number): number {
  const avgTemp = (tmin + tmax) / 2;

  if (avgTemp >= 2.5 && avgTemp < 9.2) return 24; // Massimo
  if (avgTemp >= 1.5 && avgTemp < 2.5) return 12;
  if (avgTemp >= 9.2 && avgTemp < 12.5) return 12;
  if (avgTemp >= 12.5 && avgTemp < 16) return 0;
  if (avgTemp >= 16 && avgTemp < 18) return -12;
  if (avgTemp >= 18) return -24;
  return 0;
}

export function ChillingHoursCard({
  latitude,
  longitude,
}: ChillingHoursCardProps) {
  const { data: historicalData, isLoading } = useChillingSeason(
    latitude,
    longitude,
  );

  // Calcola ore di freddo e chill units dalla stagione
  const seasonalChillingHours = historicalData
    ? historicalData.daily.temperature_2m_min.reduce((sum, tmin, index) => {
        const tmax = historicalData.daily.temperature_2m_max[index];
        return sum + estimateDailyChillingHours(tmin, tmax);
      }, 0)
    : 0;

  const seasonalChillUnits = historicalData
    ? historicalData.daily.temperature_2m_min.reduce((sum, tmin, index) => {
        const tmax = historicalData.daily.temperature_2m_max[index];
        return sum + estimateDailyChillUnits(tmin, tmax);
      }, 0)
    : 0;

  // Giorni dall'inizio stagione
  const daysSinceStart = historicalData?.daily.time.length || 0;

  // Data inizio stagione
  const seasonStart = historicalData?.daily.time[0]
    ? new Date(historicalData.daily.time[0]).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "--";

  // Progresso per colture
  const crops = Object.entries(FRUIT_CHILLING_REQUIREMENTS).map(
    ([name, req]) => {
      const progress = Math.min((seasonalChillingHours / req.min) * 100, 100);
      return { name, ...req, progress };
    },
  );

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <ThermometerSnowflake className="h-5 w-5 text-cyan-500" />
          Ore di Freddo Stagionali
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Info stagione */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Calendar className="h-3 w-3" />
          <span>
            Stagione dal {seasonStart} ({daysSinceStart} giorni)
          </span>
        </div>

        {/* Dati principali */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-500" />
            ) : (
              <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                {Math.round(seasonalChillingHours)}
              </p>
            )}
            <p className="text-xs text-cyan-600 dark:text-cyan-400">
              Ore di freddo (0-7°C)
            </p>
          </div>
          <div className="text-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
            ) : (
              <p className="text-2xl font-bold">
                {Math.round(seasonalChillUnits)}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chill Units (Utah)
            </p>
          </div>
        </div>

        {/* Fabbisogno per coltura */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Fabbisogno vernalizzazione:
        </p>
        <div className="space-y-2 mb-4">
          {crops.map((crop) => (
            <div key={crop.name} className="flex items-center gap-2">
              <span className="text-xs w-20 truncate capitalize">
                {crop.name}
              </span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    crop.progress >= 100
                      ? "bg-green-500"
                      : crop.progress >= 75
                        ? "bg-lime-500"
                        : crop.progress >= 50
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                  }`}
                  style={{ width: `${crop.progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 w-24 text-right">
                {Math.round(seasonalChillingHours)}/{crop.min}h
              </span>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Info className="h-3 w-3 shrink-0 mt-0.5" />
          <p>
            Accumulo dal 1° ottobre. Le ore di freddo sono necessarie per la
            dormienza delle piante da frutto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
