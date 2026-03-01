import { NextRequest, NextResponse } from "next/server";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minuti

function getCacheKey(lat: number, lon: number): string {
  return `nowcast:${lat.toFixed(2)}:${lon.toFixed(2)}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Parametri lat e lon richiesti" },
      { status: 400 },
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Coordinate non valide" },
      { status: 400 },
    );
  }

  const cacheKey = getCacheKey(latitude, longitude);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      minutely_15: "precipitation,precipitation_probability",
      forecast_minutely_15: "96",
      timezone: "auto",
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();

    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Nowcasting API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati nowcasting" },
      { status: 500 },
    );
  }
}
