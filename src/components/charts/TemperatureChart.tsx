"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DailyWeather } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemperatureChartProps {
  daily: DailyWeather;
}

export function TemperatureChart({ daily }: TemperatureChartProps) {
  // Trasforma i dati per Recharts
  const data = daily.time.map((date, index) => ({
    date: new Date(date).toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
    }),
    max: daily.temperature_2m_max[index],
    min: daily.temperature_2m_min[index],
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          🌡️ Temperature 7 giorni
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value !== undefined ? [`${value}°C`] : []
                }
                labelStyle={{ color: "#334155" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (value === "max" ? "Massima" : "Minima")}
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="min"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
