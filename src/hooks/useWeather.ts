"use client";

import { useState, useEffect } from "react";
import { WeatherResponse } from "@/types/weather";
import { getWeatherData } from "@/lib/api/openMeteo";

interface UseWeatherResult {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(
  latitude: number | null,
  longitude: number | null,
): UseWeatherResult {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    // Cattura i valori per TypeScript (non possono essere null a questo punto)
    const lat = latitude;
    const lng = longitude;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        const result = await getWeatherData(lat, lng);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  return { data, loading, error };
}
