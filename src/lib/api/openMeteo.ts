import { WeatherResponse } from "@/types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
    hourly:
      "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,et0_fao_evapotranspiration,wind_speed_10m_max,sunshine_duration",
    timezone: "auto",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Errore API: ${response.status}`);
  }

  return response.json();
}
