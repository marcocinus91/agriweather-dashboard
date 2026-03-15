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
      minutely_15: "precipitation,precipitation_probability",
      forecast_minutely_15: "96",
      timezone: "auto",
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params}`, {
      next: { revalidate: 300 }, // Cache Next.js: 5 minuti
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Nowcasting API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati nowcasting" },
      { status: 500 }
    );
  }
}