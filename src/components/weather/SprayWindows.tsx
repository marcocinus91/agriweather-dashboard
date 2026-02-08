"use client";

import { HourlyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SprayWindowsProps {
  hourly: HourlyWeather;
}

interface HourCondition {
  time: Date;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  precipitationProbability: number;
  humidity: number;
  isGood: boolean;
  issues: string[];
}

// Soglie per trattamenti
const THRESHOLDS = {
  maxWind: 15, // km/h
  maxPrecipitation: 0.1, // mm
  maxPrecipitationProbability: 30, // %
  minTemperature: 5, // °C
  maxTemperature: 30, // °C
  minHumidity: 40, // %
  maxHumidity: 90, // %
};

function evaluateHour(
  time: string,
  temperature: number,
  windSpeed: number,
  precipitation: number,
  precipitationProbability: number,
  humidity: number,
): HourCondition {
  const issues: string[] = [];

  if (windSpeed > THRESHOLDS.maxWind) {
    issues.push(`Vento ${windSpeed.toFixed(0)} km/h`);
  }
  if (precipitation > THRESHOLDS.maxPrecipitation) {
    issues.push(`Pioggia ${precipitation.toFixed(1)} mm`);
  }
  if (precipitationProbability > THRESHOLDS.maxPrecipitationProbability) {
    issues.push(`Prob. pioggia ${precipitationProbability}%`);
  }
  if (temperature < THRESHOLDS.minTemperature) {
    issues.push(`Temp. bassa ${temperature.toFixed(0)}°C`);
  }
  if (temperature > THRESHOLDS.maxTemperature) {
    issues.push(`Temp. alta ${temperature.toFixed(0)}°C`);
  }
  if (humidity < THRESHOLDS.minHumidity) {
    issues.push(`Umidità bassa ${humidity}%`);
  }
  if (humidity > THRESHOLDS.maxHumidity) {
    issues.push(`Umidità alta ${humidity}%`);
  }

  return {
    time: new Date(time),
    temperature,
    windSpeed,
    precipitation,
    precipitationProbability,
    humidity,
    isGood: issues.length === 0,
    issues,
  };
}

export function SprayWindows({ hourly }: SprayWindowsProps) {
  const now = new Date();

  // Analizza le prossime 48 ore
  const conditions: HourCondition[] = hourly.time
    .map((time, index) =>
      evaluateHour(
        time,
        hourly.temperature_2m[index],
        hourly.wind_speed_10m[index],
        hourly.precipitation[index],
        hourly.precipitation_probability[index],
        hourly.relative_humidity_2m[index],
      ),
    )
    .filter((c) => c.time > now)
    .slice(0, 48);

  // Trova finestre buone consecutive (almeno 2 ore)
  const goodWindows: { start: Date; end: Date; hours: number }[] = [];
  let windowStart: Date | null = null;
  let windowHours = 0;

  conditions.forEach((condition, index) => {
    if (condition.isGood) {
      if (!windowStart) {
        windowStart = condition.time;
        windowHours = 1;
      } else {
        windowHours++;
      }
    } else {
      if (windowStart && windowHours >= 2) {
        goodWindows.push({
          start: windowStart,
          end: conditions[index - 1].time,
          hours: windowHours,
        });
      }
      windowStart = null;
      windowHours = 0;
    }
  });

  // Chiudi l'ultima finestra se ancora aperta
  if (windowStart && windowHours >= 2) {
    goodWindows.push({
      start: windowStart,
      end: conditions[conditions.length - 1].time,
      hours: windowHours,
    });
  }

  // Prossime 12 ore per visualizzazione dettagliata
  const next12Hours = conditions.slice(0, 12);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const formatDay = (date: Date) =>
    date.toLocaleDateString("it-IT", { weekday: "short", day: "numeric" });

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          🚜 Finestre di Trattamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Finestre consigliate */}
        {goodWindows.length > 0 ? (
          <div className="mb-4">
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              ✅ Finestre consigliate (prossime 48h):
            </p>
            <div className="space-y-2">
              {goodWindows.slice(0, 3).map((window, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-sm"
                >
                  <span className="font-medium">
                    {formatDay(window.start)} {formatTime(window.start)} -{" "}
                    {formatTime(window.end)}
                  </span>
                  <span className="text-green-600 dark:text-green-400 ml-2">
                    ({window.hours}h)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ Nessuna finestra ideale nelle prossime 48 ore
            </p>
          </div>
        )}

        {/* Dettaglio prossime 12 ore */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Prossime 12 ore:
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
          {next12Hours.map((hour, index) => (
            <div
              key={index}
              className={`p-1 rounded text-center text-xs ${
                hour.isGood
                  ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
              }`}
              title={hour.isGood ? "Condizioni OK" : hour.issues.join(", ")}
            >
              <div className="font-medium">
                {formatTime(hour.time).slice(0, 2)}
              </div>
              <div>{hour.isGood ? "✓" : "✗"}</div>
            </div>
          ))}
        </div>

        {/* Soglie */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Condizioni ideali:
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>💨 Vento &lt;{THRESHOLDS.maxWind} km/h</span>
            <span>🌧️ No pioggia</span>
            <span>
              🌡️ {THRESHOLDS.minTemperature}-{THRESHOLDS.maxTemperature}°C
            </span>
            <span>
              💧 Umidità {THRESHOLDS.minHumidity}-{THRESHOLDS.maxHumidity}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
