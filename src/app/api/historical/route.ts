import { NextRequest, NextResponse } from "next/server";
import { coordinatesSchema, dateRangeSchema } from "@/lib/validations";

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 ora

function getCacheKey(
  lat: number,
  lon: number,
  start: string,
  end: string,
): string {
  return `historical:${lat.toFixed(2)}:${lon.toFixed(2)}:${start}:${end}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Validazione coordinate
  const coordValidation = coordinatesSchema.safeParse({
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  });

  if (!coordValidation.success) {
    return NextResponse.json(
      { error: coordValidation.error.issues[0].message },
      { status: 400 },
    );
  }

  // Validazione date
  const dateValidation = dateRangeSchema.safeParse({
    start: searchParams.get("start"),
    end: searchParams.get("end"),
  });

  if (!dateValidation.success) {
    return NextResponse.json(
      { error: dateValidation.error.issues[0].message },
      { status: 400 },
    );
  }

  const { lat: latitude, lon: longitude } = coordValidation.data;
  const { start: startDate, end: endDate } = dateValidation.data;

  const cacheKey = getCacheKey(latitude, longitude, startDate, endDate);
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
      start_date: startDate,
      end_date: endDate,
      daily:
        "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration",
      timezone: "auto",
    });

    const response = await fetch(`${ARCHIVE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Open-Meteo Archive error: ${response.status}`);
    }

    const data = await response.json();

    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Historical API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati storici" },
      { status: 500 },
    );
  }
}
