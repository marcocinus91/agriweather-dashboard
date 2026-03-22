import { NextRequest, NextResponse } from "next/server";
import { coordinatesSchema, dateRangeSchema } from "@/lib/validations";

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

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
      { status: 400 }
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
      { status: 400 }
    );
  }

  const { lat: latitude, lon: longitude } = coordValidation.data;
  const { start: startDate, end: endDate } = dateValidation.data;

  // Valida che le date siano sensate
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Open-Meteo Archive non ha dati per il futuro e ha un ritardo di ~5 giorni
  const maxEndDate = new Date(today);
  maxEndDate.setDate(maxEndDate.getDate() - 5);

  // Se end date è troppo recente, aggiustala
  const adjustedEndDate = end > maxEndDate ? maxEndDate : end;

  // Se start date è dopo end date, errore
  if (start >= adjustedEndDate) {
    return NextResponse.json(
      { error: "Intervallo date non valido" },
      { status: 400 }
    );
  }

  const adjustedEndDateStr = adjustedEndDate.toISOString().split("T")[0];

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      start_date: startDate,
      end_date: adjustedEndDateStr,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration",
      timezone: "auto",
    });

    const url = `${ARCHIVE_URL}?${params}`;
    console.log("Historical API request:", url);

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Open-Meteo Archive error:", response.status, errorText);
      throw new Error(`Open-Meteo Archive error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Historical API error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dati storici" },
      { status: 500 }
    );
  }
}