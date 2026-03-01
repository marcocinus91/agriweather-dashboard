export interface HistoricalResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    et0_fao_evapotranspiration: number[];
  };
}

const BASE_URL = "https://archive-api.open-meteo.com/v1/archive";

/**
 * Recupera dati meteo storici per un periodo specifico
 */
export async function getHistoricalData(
  latitude: number,
  longitude: number,
  startDate: string, // formato YYYY-MM-DD
  endDate: string,
): Promise<HistoricalResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration",
    timezone: "auto",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Errore API Historical: ${response.status}`);
  }

  return response.json();
}

/**
 * Recupera dati storici per calcolo GDD stagionale
 * Dalla data di semina (o inizio stagione) ad oggi
 */
export async function getSeasonalGDDData(
  latitude: number,
  longitude: number,
  seasonStartDate: string,
): Promise<HistoricalResponse> {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  return getHistoricalData(latitude, longitude, seasonStartDate, endDate);
}

/**
 * Recupera dati storici per calcolo Chilling Hours
 * Dall'inizio dell'autunno (1 ottobre) ad oggi
 */
export async function getChillingSeasonData(
  latitude: number,
  longitude: number,
): Promise<HistoricalResponse> {
  const today = new Date();
  const year =
    today.getMonth() >= 9 ? today.getFullYear() : today.getFullYear() - 1;
  const startDate = `${year}-10-01`; // 1 ottobre
  const endDate = today.toISOString().split("T")[0];

  return getHistoricalData(latitude, longitude, startDate, endDate);
}

/**
 * Recupera dati dello stesso periodo dell'anno precedente per confronto
 */
export async function getLastYearComparison(
  latitude: number,
  longitude: number,
  daysBack: number = 30,
): Promise<HistoricalResponse> {
  const today = new Date();
  const lastYearEnd = new Date(today);
  lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);

  const lastYearStart = new Date(lastYearEnd);
  lastYearStart.setDate(lastYearStart.getDate() - daysBack);

  return getHistoricalData(
    latitude,
    longitude,
    lastYearStart.toISOString().split("T")[0],
    lastYearEnd.toISOString().split("T")[0],
  );
}
