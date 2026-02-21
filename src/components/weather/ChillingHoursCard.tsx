"use client";

import { HourlyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Snowflake, Info, ThermometerSnowflake } from "lucide-react";

interface ChillingHoursCardProps {
  hourly: HourlyWeather;
}

interface FruitCrop {
  name: string;
  minHours: number;
  maxHours: number;
}

const FRUIT_CROPS: FruitCrop[] = [
  { name: "Melo", minHours: 800, maxHours: 1200 },
  { name: "Pero", minHours: 600, maxHours: 1000 },
  { name: "Pesco", minHours: 400, maxHours: 800 },
  { name: "Ciliegio", minHours: 700, maxHours: 1200 },
  { name: "Albicocco", minHours: 300, maxHours: 600 },
  { name: "Susino", minHours: 500, maxHours: 900 },
];

// Calcola ore di freddo (modello 0-7°C)
function isChillingHour(temperature: number): boolean {
  return temperature >= 0 && temperature <= 7;
}

// Calcola Chill Units (modello Utah semplificato)
function calculateChillUnits(temperature: number): number {
  if (temperature < 1.5) return 0;
  if (temperature >= 1.5 && temperature < 2.5) return 0.5;
  if (temperature >= 2.5 && temperature < 9.2) return 1;
  if (temperature >= 9.2 && temperature < 12.5) return 0.5;
  if (temperature >= 12.5 && temperature < 16) return 0;
  if (temperature >= 16 && temperature < 18) return -0.5;
  if (temperature >= 18) return -1;
  return 0;
}

export function ChillingHoursCard({ hourly }: ChillingHoursCardProps) {
  // Calcola ore di freddo dalle ultime ore disponibili (proxy per stagione)
  // In produzione si userebbe uno storico da inizio autunno
  const chillingHours = hourly.temperature_2m.filter(isChillingHour).length;

  // Calcola Chill Units (Utah)
  const chillUnits = hourly.temperature_2m.reduce(
    (sum, temp) => sum + calculateChillUnits(temp),
    0,
  );

  // Prossime 24 ore - quante ore di freddo previste
  const next24Hours = hourly.temperature_2m.slice(0, 24);
  const forecastChillingHours = next24Hours.filter(isChillingHour).length;

  // Stima soddisfazione fabbisogno per colture
  // Nota: in produzione si userebbe l'accumulo stagionale reale
  const getProgress = (crop: FruitCrop) => {
    // Usiamo chillingHours come proxy (in realtà servirebbe storico stagionale)
    const estimated = chillingHours * 10; // Fattore di scala per demo
    const percentage = Math.min((estimated / crop.minHours) * 100, 100);
    return percentage;
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <ThermometerSnowflake className="h-5 w-5 text-cyan-500" />
          Ore di Freddo (Chilling Hours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Dati principali */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{chillingHours}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ore 0-7°C (7gg)
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{chillUnits.toFixed(0)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chill Units
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{forecastChillingHours}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Previste (24h)
            </p>
          </div>
        </div>

        {/* Fabbisogno per coltura */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Fabbisogno vernalizzazione (ore tipiche):
        </p>
        <div className="space-y-2 mb-4">
          {FRUIT_CROPS.map((crop) => {
            const progress = getProgress(crop);
            return (
              <div key={crop.name} className="flex items-center gap-2">
                <span className="text-xs w-20 truncate">{crop.name}</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress >= 100
                        ? "bg-green-500"
                        : progress >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 w-20 text-right">
                  {crop.minHours}-{crop.maxHours}h
                </span>
              </div>
            );
          })}
        </div>

        {/* Grafico temperature prossime 24h */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
          <Snowflake className="h-3 w-3" />
          Temperature prossime 24h:
        </p>
        <div className="flex items-end justify-between gap-0.5 h-12 mb-3">
          {next24Hours.map((temp, index) => {
            const isChilling = isChillingHour(temp);
            const height = Math.max(((temp + 5) / 35) * 100, 5); // Scala -5 a 30°C
            return (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all ${
                  isChilling
                    ? "bg-cyan-400 dark:bg-cyan-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                style={{ height: `${Math.min(height, 100)}%` }}
                title={`${hourly.time[index]?.slice(11, 16)}: ${temp.toFixed(1)}°C`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mb-3">
          <span>Ora</span>
          <span>+24h</span>
        </div>

        {/* Legenda */}
        <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-cyan-400 dark:bg-cyan-500 rounded" />
            0-7°C (efficace)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded" />
            Fuori range
          </span>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Info className="h-3 w-3 shrink-0 mt-0.5" />
          <p>
            Le ore di freddo (0-7°C) sono necessarie per la dormienza delle
            piante da frutto. Accumulo insufficiente causa fioritura irregolare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
