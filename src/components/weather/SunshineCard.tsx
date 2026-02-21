import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun } from "lucide-react";

interface SunshineCardProps {
  daily: DailyWeather;
}

function secondsToHours(seconds: number): number {
  return seconds / 3600;
}

function formatHoursMinutes(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

function getSunshineLevel(hours: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (hours >= 10) {
    return {
      label: "Eccellente",
      color: "text-yellow-500",
      advice: "Condizioni ottimali per la fotosintesi.",
    };
  } else if (hours >= 6) {
    return {
      label: "Buono",
      color: "text-amber-500",
      advice: "Buone condizioni per la crescita delle colture.",
    };
  } else if (hours >= 3) {
    return {
      label: "Moderato",
      color: "text-orange-500",
      advice: "Crescita rallentata per colture esigenti.",
    };
  } else {
    return {
      label: "Scarso",
      color: "text-slate-500",
      advice: "Condizioni sfavorevoli. Possibile stress per le piante.",
    };
  }
}

export function SunshineCard({ daily }: SunshineCardProps) {
  const sunshineHours = daily.sunshine_duration.map(secondsToHours);

  const todaySunshine = sunshineHours[0];
  const todayLevel = getSunshineLevel(todaySunshine);

  const weeklyTotal = sunshineHours.reduce((sum, h) => sum + h, 0);
  const weeklyAvg = weeklyTotal / sunshineHours.length;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          Ore di Sole
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Dati principali */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatHoursMinutes(todaySunshine)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Oggi</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatHoursMinutes(weeklyAvg)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Media/giorno
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatHoursMinutes(weeklyTotal)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Totale 7gg
            </p>
          </div>
        </div>

        {/* Livello di oggi */}
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">Irraggiamento oggi:</span>
            <span className={`text-sm font-semibold ${todayLevel.color}`}>
              {todayLevel.label}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {todayLevel.advice}
          </p>
        </div>

        {/* Mini grafico settimanale */}
        <div className="flex items-end justify-between gap-1 h-16">
          {sunshineHours.map((hours, index) => {
            const heightPercent = Math.min((hours / 14) * 100, 100);
            const day = new Date(daily.time[index]).toLocaleDateString(
              "it-IT",
              {
                weekday: "short",
              },
            );
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-yellow-400 dark:bg-yellow-500 rounded-t transition-all"
                  style={{ height: `${heightPercent}%`, minHeight: "4px" }}
                  title={`${formatHoursMinutes(hours)}`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Ore di sole = durata irraggiamento diretto. Importante per fotosintesi
          e maturazione.
        </p>
      </CardContent>
    </Card>
  );
}
