import { DailyWeather } from "@/types/weather";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-blue-300 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl sm:text-2xl">🥶</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-blue-900 text-sm sm:text-base">
              Attenzione: rischio gelate
            </p>
            <ul className="mt-2 space-y-1">
              {frostDays.map((day, index) => (
                <li key={index} className="text-xs sm:text-sm text-blue-800">
                  • {day.date}:{" "}
                  <span className="font-medium">{day.minTemp}°C</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              Proteggi le colture sensibili al gelo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
