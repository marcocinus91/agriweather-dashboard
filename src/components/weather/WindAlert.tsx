import { DailyWeather } from "@/types/weather";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, AlertTriangle } from "lucide-react";

interface WindAlertProps {
  daily: DailyWeather;
}

interface WindyDay {
  date: string;
  windSpeed: number;
  level: "moderato" | "forte" | "molto forte";
}

function getWindLevel(
  speed: number,
): "moderato" | "forte" | "molto forte" | null {
  if (speed >= 60) return "molto forte";
  if (speed >= 40) return "forte";
  if (speed >= 30) return "moderato";
  return null;
}

export function WindAlert({ daily }: WindAlertProps) {
  const windyDays: WindyDay[] = daily.time
    .map((date, index) => {
      const windSpeed = daily.wind_speed_10m_max[index];
      const level = getWindLevel(windSpeed);
      return {
        date: new Date(date).toLocaleDateString("it-IT", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        windSpeed,
        level: level!,
      };
    })
    .filter((day) => day.level !== null);

  if (windyDays.length === 0) {
    return null;
  }

  const maxLevel = windyDays.some((d) => d.level === "molto forte")
    ? "molto forte"
    : windyDays.some((d) => d.level === "forte")
      ? "forte"
      : "moderato";

  const cardStyles = {
    moderato:
      "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30",
    forte:
      "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30",
    "molto forte":
      "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30",
  };

  const iconBgStyles = {
    moderato: "bg-yellow-100 dark:bg-yellow-800",
    forte: "bg-orange-100 dark:bg-orange-800",
    "molto forte": "bg-red-100 dark:bg-red-800",
  };

  const iconStyles = {
    moderato: "text-yellow-600 dark:text-yellow-300",
    forte: "text-orange-600 dark:text-orange-300",
    "molto forte": "text-red-600 dark:text-red-300",
  };

  const textStyles = {
    moderato: "text-yellow-900 dark:text-yellow-100",
    forte: "text-orange-900 dark:text-orange-100",
    "molto forte": "text-red-900 dark:text-red-100",
  };

  const subTextStyles = {
    moderato: "text-yellow-800 dark:text-yellow-200",
    forte: "text-orange-800 dark:text-orange-200",
    "molto forte": "text-red-800 dark:text-red-200",
  };

  const adviceStyles = {
    moderato: "text-yellow-700 dark:text-yellow-300",
    forte: "text-orange-700 dark:text-orange-300",
    "molto forte": "text-red-700 dark:text-red-300",
  };

  const advice = {
    moderato: "Verifica la stabilità di serre e tunnel.",
    forte: "Rinforza protezioni e rimanda trattamenti fogliari.",
    "molto forte":
      "Rischio danni alle colture. Metti in sicurezza strutture e attrezzature.",
  };

  return (
    <Card className={cardStyles[maxLevel]}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${iconBgStyles[maxLevel]}`}>
            {maxLevel === "molto forte" ? (
              <AlertTriangle className={`h-5 w-5 ${iconStyles[maxLevel]}`} />
            ) : (
              <Wind className={`h-5 w-5 ${iconStyles[maxLevel]}`} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`font-semibold text-sm sm:text-base ${textStyles[maxLevel]}`}
            >
              Attenzione: vento {maxLevel}
            </p>
            <ul className="mt-2 space-y-1">
              {windyDays.map((day, index) => (
                <li
                  key={index}
                  className={`text-xs sm:text-sm ${subTextStyles[maxLevel]}`}
                >
                  • {day.date}:{" "}
                  <span className="font-medium">{day.windSpeed} km/h</span>
                </li>
              ))}
            </ul>
            <p className={`text-xs mt-2 ${adviceStyles[maxLevel]}`}>
              {advice[maxLevel]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
