import { NextRequest, NextResponse } from "next/server";
import { coordinatesSchema } from "@/lib/validations";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

// Cache semplice (nota: inefficace in serverless, ma meglio di niente per ora)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minuti

function getCacheKey(lat: number, lon: number): string {
  return `weather:${lat.toFixed(2)}:${lon.toFixed(2)}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Validazione input
  const validation = coordinatesSchema.safeParse({
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  });

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 },
    );
  }

  const { lat: latitude, lon: longitude } = validation.data;

  // Controlla cache
  const cacheKey = getCacheKey(latitude, longitude);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  // Fetch da Open-Meteo
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
      hourly:
        "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m,dew_point_2m",
      daily:
        "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,et0_fao_evapotranspiration,wind_speed_10m_max,sunshine_duration",
      timezone: "auto",
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();

    // Salva in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati meteo" },
      { status: 500 },
    );
  }
}
