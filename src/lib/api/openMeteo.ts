import { WeatherResponse } from "@/types/weather";

export async function getWeatherData(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);

  if (!response.ok) {
    throw new Error(`Errore API: ${response.status}`);
  }

  return response.json();
}
