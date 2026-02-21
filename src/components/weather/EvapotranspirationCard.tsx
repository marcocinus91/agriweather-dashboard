import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";

interface EvapotranspirationCardProps {
  daily: DailyWeather;
}

function getIrrigationAdvice(et: number): {
  level: "basso" | "moderato" | "alto" | "molto alto";
  color: string;
  advice: string;
} {
  if (et < 3) {
    return {
      level: "basso",
      color: "text-green-600 dark:text-green-400",
      advice: "Fabbisogno idrico basso. Irrigazione minima necessaria.",
    };
  } else if (et < 5) {
    return {
      level: "moderato",
      color: "text-yellow-600 dark:text-yellow-400",
      advice: "Fabbisogno idrico moderato. Irrigazione regolare consigliata.",
    };
  } else if (et < 7) {
    return {
      level: "alto",
      color: "text-orange-600 dark:text-orange-400",
      advice: "Fabbisogno idrico alto. Aumentare frequenza irrigazione.",
    };
  } else {
    return {
      level: "molto alto",
      color: "text-red-600 dark:text-red-400",
      advice: "Fabbisogno idrico critico. Irrigazione frequente necessaria.",
    };
  }
}

export function EvapotranspirationCard({ daily }: EvapotranspirationCardProps) {
  const avgET =
    daily.et0_fao_evapotranspiration.reduce((sum, val) => sum + val, 0) /
    daily.et0_fao_evapotranspiration.length;

  const todayET = daily.et0_fao_evapotranspiration[0];

  const weeklyTotal = daily.et0_fao_evapotranspiration.reduce(
    (sum, val) => sum + val,
    0,
  );

  const { level, color, advice } = getIrrigationAdvice(todayET);

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Droplet className="h-5 w-5 text-cyan-500" />
          Evapotraspirazione (ET₀)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{todayET.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              mm/oggi
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{avgET.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              mm/giorno (media)
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{weeklyTotal.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              mm/settimana
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">Fabbisogno idrico:</span>
            <span className={`text-sm font-semibold capitalize ${color}`}>
              {level}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">{advice}</p>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          ET₀ = acqua persa da evaporazione e traspirazione delle piante
        </p>
      </CardContent>
    </Card>
  );
}
