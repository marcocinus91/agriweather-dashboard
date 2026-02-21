"use client";

import { HourlyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Droplets, AlertTriangle, Info } from "lucide-react";

interface DiseaseRiskCardProps {
  hourly: HourlyWeather;
}

interface LeafWetnessHour {
  time: Date;
  isWet: boolean;
  humidity: number;
  temperature: number;
  dewPoint: number;
  precipitation: number;
}

interface DiseaseRisk {
  name: string;
  risk: "basso" | "moderato" | "alto" | "critico";
  conditions: string;
}

// Stima bagnatura fogliare basata su umidità, punto di rugiada e precipitazioni
function estimateLeafWetness(
  temperature: number,
  humidity: number,
  dewPoint: number,
  precipitation: number,
): boolean {
  if (precipitation > 0) return true;
  if (humidity >= 90) return true;
  if (temperature - dewPoint <= 2) return true;
  return false;
}

// Calcola rischio per diverse malattie fungine
function calculateDiseaseRisks(
  wetnessHours: number,
  avgTemperature: number,
  avgHumidity: number,
): DiseaseRisk[] {
  const risks: DiseaseRisk[] = [];

  // Peronospora (Downy Mildew)
  const peronospera = (() => {
    if (
      avgTemperature >= 10 &&
      avgTemperature <= 25 &&
      wetnessHours >= 6 &&
      avgHumidity >= 80
    ) {
      return "critico";
    } else if (
      avgTemperature >= 10 &&
      avgTemperature <= 25 &&
      wetnessHours >= 4 &&
      avgHumidity >= 70
    ) {
      return "alto";
    } else if (wetnessHours >= 3 && avgHumidity >= 60) {
      return "moderato";
    }
    return "basso";
  })();

  risks.push({
    name: "Peronospora",
    risk: peronospera,
    conditions: "T 10-25°C, umidità >80%, bagnatura >4h",
  });

  // Oidio (Powdery Mildew)
  const oidio = (() => {
    if (
      avgTemperature >= 20 &&
      avgTemperature <= 30 &&
      avgHumidity >= 40 &&
      avgHumidity <= 80
    ) {
      if (wetnessHours >= 4) return "alto";
      if (wetnessHours >= 2) return "moderato";
    }
    return "basso";
  })();

  risks.push({
    name: "Oidio",
    risk: oidio,
    conditions: "T 20-30°C, umidità 40-80%",
  });

  // Botrite (Botrytis)
  const botrite = (() => {
    if (
      avgTemperature >= 15 &&
      avgTemperature <= 25 &&
      wetnessHours >= 8 &&
      avgHumidity >= 85
    ) {
      return "critico";
    } else if (
      avgTemperature >= 15 &&
      avgTemperature <= 25 &&
      wetnessHours >= 6 &&
      avgHumidity >= 80
    ) {
      return "alto";
    } else if (wetnessHours >= 4 && avgHumidity >= 70) {
      return "moderato";
    }
    return "basso";
  })();

  risks.push({
    name: "Botrite",
    risk: botrite,
    conditions: "T 15-25°C, umidità >85%, bagnatura >6h",
  });

  // Ruggine (Rust)
  const ruggine = (() => {
    if (avgTemperature >= 15 && avgTemperature <= 25 && wetnessHours >= 8) {
      return "alto";
    } else if (
      avgTemperature >= 10 &&
      avgTemperature <= 28 &&
      wetnessHours >= 6
    ) {
      return "moderato";
    }
    return "basso";
  })();

  risks.push({
    name: "Ruggine",
    risk: ruggine,
    conditions: "T 15-25°C, bagnatura >6h",
  });

  return risks;
}

const riskColors = {
  basso: "text-green-600 dark:text-green-400",
  moderato: "text-yellow-600 dark:text-yellow-400",
  alto: "text-orange-600 dark:text-orange-400",
  critico: "text-red-600 dark:text-red-400",
};

const riskBgColors = {
  basso: "bg-green-100 dark:bg-green-900/30",
  moderato: "bg-yellow-100 dark:bg-yellow-900/30",
  alto: "bg-orange-100 dark:bg-orange-900/30",
  critico: "bg-red-100 dark:bg-red-900/30",
};

export function DiseaseRiskCard({ hourly }: DiseaseRiskCardProps) {
  const now = new Date();

  // Analizza le ultime 24 ore e prossime 24 ore
  const relevantHours: LeafWetnessHour[] = hourly.time
    .map((time, index) => ({
      time: new Date(time),
      isWet: estimateLeafWetness(
        hourly.temperature_2m[index],
        hourly.relative_humidity_2m[index],
        hourly.dew_point_2m[index],
        hourly.precipitation[index],
      ),
      humidity: hourly.relative_humidity_2m[index],
      temperature: hourly.temperature_2m[index],
      dewPoint: hourly.dew_point_2m[index],
      precipitation: hourly.precipitation[index],
    }))
    .filter((h) => {
      const hoursDiff = (h.time.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDiff >= -24 && hoursDiff <= 24;
    });

  // Conta ore di bagnatura
  const wetnessHours = relevantHours.filter((h) => h.isWet).length;

  // Medie
  const avgTemp =
    relevantHours.reduce((sum, h) => sum + h.temperature, 0) /
    relevantHours.length;
  const avgHumidity =
    relevantHours.reduce((sum, h) => sum + h.humidity, 0) /
    relevantHours.length;

  // Calcola rischi
  const diseaseRisks = calculateDiseaseRisks(
    wetnessHours,
    avgTemp,
    avgHumidity,
  );

  // Rischio massimo
  const maxRisk = diseaseRisks.reduce((max, d) => {
    const riskLevel = { basso: 0, moderato: 1, alto: 2, critico: 3 };
    return riskLevel[d.risk] > riskLevel[max.risk] ? d : max;
  }, diseaseRisks[0]);

  // Prossime 12 ore per visualizzazione bagnatura
  const next12Hours = relevantHours.filter((h) => h.time > now).slice(0, 12);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Bug className="h-5 w-5 text-purple-500" />
          Rischio Malattie Fungine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Riepilogo bagnatura */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{wetnessHours}h</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bagnatura (48h)
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{avgHumidity.toFixed(0)}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Umidità media
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Temp. media
            </p>
          </div>
        </div>

        {/* Alert se rischio alto/critico */}
        {(maxRisk.risk === "alto" || maxRisk.risk === "critico") && (
          <div
            className={`p-3 rounded-lg mb-4 flex items-start gap-2 ${riskBgColors[maxRisk.risk]}`}
          >
            <AlertTriangle
              className={`h-5 w-5 shrink-0 ${riskColors[maxRisk.risk]}`}
            />
            <div>
              <p className={`text-sm font-medium ${riskColors[maxRisk.risk]}`}>
                Rischio {maxRisk.risk} per {maxRisk.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Valuta trattamento preventivo. Condizioni favorevoli al
                patogeno.
              </p>
            </div>
          </div>
        )}

        {/* Griglia rischi malattie */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {diseaseRisks.map((disease) => (
            <div
              key={disease.name}
              className={`p-2 rounded-lg ${riskBgColors[disease.risk]}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{disease.name}</span>
                <span
                  className={`text-xs font-semibold capitalize ${riskColors[disease.risk]}`}
                >
                  {disease.risk}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Visualizzazione bagnatura prossime 12h */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
          <Droplets className="h-3 w-3" />
          Bagnatura fogliare prossime 12h:
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mb-3">
          {next12Hours.map((hour, index) => (
            <div
              key={index}
              className={`p-1 rounded text-center text-xs ${
                hour.isWet
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
              title={`${formatTime(hour.time)}: ${hour.isWet ? "Bagnato" : "Asciutto"} (UR: ${hour.humidity}%)`}
            >
              <div className="font-medium">
                {formatTime(hour.time).slice(0, 2)}
              </div>
              <div>
                {hour.isWet ? <Droplets className="h-3 w-3 mx-auto" /> : "·"}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Info className="h-3 w-3 shrink-0 mt-0.5" />
          <p>
            Bagnatura stimata da umidità, punto di rugiada e precipitazioni.
            Condizioni ideali per patogeni: T 15-25°C, UR &gt;80%, bagnatura
            &gt;4-6h.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
