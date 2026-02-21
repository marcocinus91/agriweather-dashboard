import { DailyWeather } from "@/types/weather";
import { Card, CardContent } from "@/components/ui/card";
import { Snowflake } from "lucide-react";

interface FrostAlertProps {
  daily: DailyWeather;
}

interface FrostDay {
  date: string;
  minTemp: number;
}

export function FrostAlert({ daily }: FrostAlertProps) {
  const frostDays: FrostDay[] = daily.time
    .map((date, index) => ({
      date: new Date(date).toLocaleDateString("it-IT", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      minTemp: daily.temperature_2m_min[index],
    }))
    .filter((day) => day.minTemp < 2);

  if (frostDays.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <Snowflake className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base">
              Attenzione: rischio gelate
            </p>
            <ul className="mt-2 space-y-1">
              {frostDays.map((day, index) => (
                <li
                  key={index}
                  className="text-xs sm:text-sm text-blue-800 dark:text-blue-200"
                >
                  • {day.date}:{" "}
                  <span className="font-medium">{day.minTemp}°C</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              Proteggi le colture sensibili al gelo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
