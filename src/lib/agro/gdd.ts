/**
 * Calcola i Gradi Giorno (Growing Degree Days)
 * Formula: GDD = max(0, ((Tmax + Tmin) / 2) - Tbase)
 */
export function calculateDailyGDD(
  tmax: number,
  tmin: number,
  tbase: number,
): number {
  const avgTemp = (tmax + tmin) / 2;
  const gdd = avgTemp - tbase;
  return Math.max(0, gdd);
}

/**
 * Calcola GDD cumulativi per un array di temperature
 */
export function calculateCumulativeGDD(
  tmaxArray: number[],
  tminArray: number[],
  tbase: number,
): number {
  return tmaxArray.reduce((sum, tmax, index) => {
    return sum + calculateDailyGDD(tmax, tminArray[index], tbase);
  }, 0);
}

/**
 * Stima giorni alla maturazione basata su GDD medi
 */
export function estimateDaysToMaturity(
  avgDailyGDD: number,
  targetGDD: number,
): number | null {
  if (avgDailyGDD <= 0) return null;
  return Math.round(targetGDD / avgDailyGDD);
}

/**
 * Temperature base per colture comuni
 */
export const CROP_BASE_TEMPS: Record<string, number> = {
  mais: 10,
  grano: 5,
  pomodoro: 10,
  vite: 10,
  girasole: 8,
};

/**
 * GDD tipici per maturazione
 */
export const CROP_MATURITY_GDD: Record<string, number> = {
  mais: 2700,
  grano: 1500,
  pomodoro: 1400,
  vite: 1800,
  girasole: 1600,
};
