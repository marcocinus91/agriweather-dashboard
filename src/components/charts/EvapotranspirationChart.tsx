"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EvapotranspirationChartProps {
  daily: DailyWeather;
}

export function EvapotranspirationChart({
  daily,
}: EvapotranspirationChartProps) {
  const data = daily.time.map((date, index) => ({
    date: new Date(date).toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
    }),
    et: daily.et0_fao_evapotranspiration[index],
  }));

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          💧 Evapotraspirazione 7 giorni
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#475569"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickLine={false}
                tickFormatter={(value) => `${value}mm`}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value !== undefined ? [`${value.toFixed(1)} mm`, "ET₀"] : []
                }
                labelStyle={{ color: "#334155" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              />
              {/* Linee di riferimento per i livelli */}
              <ReferenceLine y={3} stroke="#22c55e" strokeDasharray="3 3" />
              <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" />
              <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="et"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#etGradient)"
              />
              <defs>
                <linearGradient id="etGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-green-500"></span> Basso (&lt;3mm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-500"></span> Moderato (3-5mm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500"></span> Alto (&gt;5mm)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
