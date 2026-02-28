"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "@/lib/api/openMeteo";
import { WeatherResponse } from "@/types/weather";

export function useWeather(latitude: number, longitude: number) {
  const query = useQuery<WeatherResponse, Error>({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => getWeatherData(latitude, longitude),
    enabled: !!latitude && !!longitude,
    staleTime: 10 * 60 * 1000, // 10 minuti
    gcTime: 30 * 60 * 1000, // 30 minuti
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
    isStale: query.isStale,
  };
}
