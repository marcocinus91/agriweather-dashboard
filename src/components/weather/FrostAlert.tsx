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
  // Trova i giorni con rischio gelata (temp min < 2°C)
  const frostDays: FrostDay[] = daily.time
    .map((date, index) => ({
      date: new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
      minTemp: daily.temperature_2m_min[index],
    }))
    .filter((day) => day.minTemp < 2);

  // Nessun rischio gelata
  if (frostDays.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-300 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🥶</span>
          <div>
            <p className="font-semibold text-blue-900">
              Attenzione: rischio gelate
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Temperature sotto i 2°C previste nei prossimi giorni:
            </p>
            <ul className="mt-2 space-y-1">
              {frostDays.map((day, index) => (
                <li key={index} className="text-sm text-blue-800">
                  • {day.date}:{" "}
                  <span className="font-medium">{day.minTemp}°C</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              Proteggi le colture sensibili al gelo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
