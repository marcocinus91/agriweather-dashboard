"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrecipitationChartProps {
  daily: DailyWeather;
}

export function PrecipitationChart({ daily }: PrecipitationChartProps) {
  const data = daily.time.map((date, index) => ({
    date: new Date(date).toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
    }),
    precipitazioni: daily.precipitation_sum[index],
  }));

  const hasPrecipitation = data.some((d) => d.precipitazioni > 0);

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          💧 Precipitazioni 7 giorni
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          {hasPrecipitation ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                    value !== undefined ? [`${value} mm`, "Precipitazioni"] : []
                  }
                  labelStyle={{ color: "#334155" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                  }}
                />
                <Bar
                  dataKey="precipitazioni"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              ☀️ Nessuna precipitazione prevista
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
