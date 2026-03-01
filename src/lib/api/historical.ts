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

export async function getHistoricalData(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
): Promise<HistoricalResponse> {
  const response = await fetch(
    `/api/historical?lat=${latitude}&lon=${longitude}&start=${startDate}&end=${endDate}`,
  );

  if (!response.ok) {
    throw new Error(`Errore API Historical: ${response.status}`);
  }

  return response.json();
}

export async function getSeasonalGDDData(
  latitude: number,
  longitude: number,
  seasonStartDate: string,
): Promise<HistoricalResponse> {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  return getHistoricalData(latitude, longitude, seasonStartDate, endDate);
}

export async function getChillingSeasonData(
  latitude: number,
  longitude: number,
): Promise<HistoricalResponse> {
  const today = new Date();
  const year =
    today.getMonth() >= 9 ? today.getFullYear() : today.getFullYear() - 1;
  const startDate = `${year}-10-01`;
  const endDate = today.toISOString().split("T")[0];

  return getHistoricalData(latitude, longitude, startDate, endDate);
}

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
