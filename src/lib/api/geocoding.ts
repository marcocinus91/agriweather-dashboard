export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // Regione/provincia
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "it",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
  );

  if (!response.ok) {
    throw new Error("Errore nella ricerca città");
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}
