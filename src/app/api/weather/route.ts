import { NextRequest, NextResponse } from "next/server";
import { coordinatesSchema } from "@/lib/validations";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

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
      { status: 400 }
    );
  }

  const { lat: latitude, lon: longitude } = validation.data;

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
      hourly: "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m,dew_point_2m",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,et0_fao_evapotranspiration,wind_speed_10m_max,sunshine_duration",
      timezone: "auto",
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params}`, {
      next: { revalidate: 600 }, // Cache Next.js: 10 minuti
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati meteo" },
      { status: 500 }
    );
  }
}