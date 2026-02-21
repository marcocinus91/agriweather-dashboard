"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CloudRain,
  Umbrella,
  Sun,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { getNowcastingData, NowcastingResponse } from "@/lib/api/nowcasting";

interface NowcastingCardProps {
  latitude: number;
  longitude: number;
}

interface PrecipitationSlot {
  time: Date;
  precipitation: number;
  probability: number;
  label: string;
}

export function NowcastingCard({ latitude, longitude }: NowcastingCardProps) {
  const [data, setData] = useState<NowcastingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getNowcastingData(latitude, longitude);
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Impossibile caricare nowcasting");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Aggiorna ogni 5 minuti
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  if (loading && !data) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="h-48 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">
            {error || "Dati non disponibili"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const now = new Date();

  // Prossimi 2 ore (8 slot da 15 min)
  const slots: PrecipitationSlot[] = data.minutely_15.time
    .map((time, index) => ({
      time: new Date(time),
      precipitation: data.minutely_15.precipitation[index],
      probability: data.minutely_15.precipitation_probability[index],
      label: new Date(time).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))
    .filter((slot) => slot.time >= now)
    .slice(0, 8); // Prossimi 2 ore

  // Calcola quando pioverà
  const firstRainSlot = slots.find(
    (s) => s.precipitation > 0.1 || s.probability > 50,
  );
  const hasRainComing = !!firstRainSlot;

  // Minuti alla pioggia
  const minutesToRain = firstRainSlot
    ? Math.round((firstRainSlot.time.getTime() - now.getTime()) / (1000 * 60))
    : null;

  // Precipitazione totale prevista prossime 2h
  const totalPrecipitation = slots.reduce((sum, s) => sum + s.precipitation, 0);

  // Probabilità massima
  const maxProbability = Math.max(...slots.map((s) => s.probability));

  // Determina lo stato
  const getStatus = () => {
    if (hasRainComing && minutesToRain !== null && minutesToRain <= 30) {
      return {
        type: "warning" as const,
        message: `Pioggia prevista tra ${minutesToRain} minuti`,
        icon: AlertTriangle,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        borderColor: "border-orange-300 dark:border-orange-700",
        textColor: "text-orange-700 dark:text-orange-300",
      };
    }
    if (hasRainComing && minutesToRain !== null && minutesToRain <= 60) {
      return {
        type: "caution" as const,
        message: `Pioggia possibile entro ${minutesToRain} minuti`,
        icon: Umbrella,
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        borderColor: "border-yellow-300 dark:border-yellow-700",
        textColor: "text-yellow-700 dark:text-yellow-300",
      };
    }
    if (hasRainComing) {
      return {
        type: "info" as const,
        message: `Pioggia prevista entro 2 ore`,
        icon: CloudRain,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        borderColor: "border-blue-300 dark:border-blue-700",
        textColor: "text-blue-700 dark:text-blue-300",
      };
    }
    return {
      type: "clear" as const,
      message: "Nessuna precipitazione prevista",
      icon: Sun,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-300 dark:border-green-700",
      textColor: "text-green-700 dark:text-green-300",
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            Nowcasting Precipitazioni
          </CardTitle>
          {lastUpdate && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdate.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Status Alert */}
        <div
          className={`p-3 rounded-lg mb-4 flex items-center gap-3 ${status.bgColor} border ${status.borderColor}`}
        >
          <StatusIcon className={`h-5 w-5 shrink-0 ${status.textColor}`} />
          <div>
            <p className={`text-sm font-medium ${status.textColor}`}>
              {status.message}
            </p>
            {hasRainComing && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Precipitazione totale stimata: {totalPrecipitation.toFixed(1)}{" "}
                mm
              </p>
            )}
          </div>
        </div>

        {/* Dati riassuntivi */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {minutesToRain !== null ? `${minutesToRain}'` : "--"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Min. a pioggia
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {totalPrecipitation.toFixed(1)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              mm (2h)
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{maxProbability}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prob. max
            </p>
          </div>
        </div>

        {/* Timeline precipitazioni */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Prossime 2 ore (intervalli 15 min):
        </p>
        <div className="flex gap-1 mb-2">
          {slots.map((slot, index) => {
            const intensity =
              slot.precipitation > 2
                ? "bg-blue-600"
                : slot.precipitation > 0.5
                  ? "bg-blue-500"
                  : slot.precipitation > 0.1
                    ? "bg-blue-400"
                    : slot.probability > 50
                      ? "bg-blue-300"
                      : "bg-slate-200 dark:bg-slate-600";

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-full h-8 rounded ${intensity} transition-all`}
                  title={`${slot.label}: ${slot.precipitation.toFixed(1)} mm (${slot.probability}%)`}
                />
                {index % 2 === 0 && (
                  <span className="text-xs text-slate-400">{slot.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-slate-200 dark:bg-slate-600 rounded" />
            Asciutto
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-300 rounded" />
            Prob. pioggia
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 rounded" />
            Pioggia
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-600 rounded" />
            Pioggia intensa
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
