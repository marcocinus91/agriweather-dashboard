export interface NowcastingResponse {
  latitude: number;
  longitude: number;
  minutely_15: {
    time: string[];
    precipitation: number[];
    precipitation_probability: number[];
  };
}

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getNowcastingData(
  latitude: number,
  longitude: number,
): Promise<NowcastingResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    minutely_15: "precipitation,precipitation_probability",
    forecast_minutely_15: "96", // 24 ore di dati a 15 min
    timezone: "auto",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Errore API Nowcasting: ${response.status}`);
  }

  return response.json();
}
