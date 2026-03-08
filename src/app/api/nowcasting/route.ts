import { NextRequest, NextResponse } from "next/server";
import { coordinatesSchema } from "@/lib/validations";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minuti

function getCacheKey(lat: number, lon: number): string {
  return `nowcast:${lat.toFixed(2)}:${lon.toFixed(2)}`;
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
