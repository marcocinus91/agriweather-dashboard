/**
 * Verifica se una temperatura contribuisce alle ore di freddo (modello 0-7°C)
 */
export function isChillingHour(temperature: number): boolean {
  return temperature >= 0 && temperature <= 7;
}

/**
 * Calcola Chill Units secondo il modello Utah semplificato
 */
export function calculateChillUnits(temperature: number): number {
  if (temperature < 1.5) return 0;
  if (temperature >= 1.5 && temperature < 2.5) return 0.5;
  if (temperature >= 2.5 && temperature < 9.2) return 1;
  if (temperature >= 9.2 && temperature < 12.5) return 0.5;
  if (temperature >= 12.5 && temperature < 16) return 0;
  if (temperature >= 16 && temperature < 18) return -0.5;
  if (temperature >= 18) return -1;
  return 0;
}

/**
 * Calcola ore di freddo totali da un array di temperature
 */
export function calculateChillingHours(temperatures: number[]): number {
  return temperatures.filter(isChillingHour).length;
}

/**
 * Calcola Chill Units totali da un array di temperature
 */
export function calculateTotalChillUnits(temperatures: number[]): number {
  return temperatures.reduce((sum, temp) => sum + calculateChillUnits(temp), 0);
}

/**
 * Fabbisogno ore di freddo per colture da frutto
 */
export const FRUIT_CHILLING_REQUIREMENTS: Record<
  string,
  { min: number; max: number }
> = {
  melo: { min: 800, max: 1200 },
  pero: { min: 600, max: 1000 },
  pesco: { min: 400, max: 800 },
  ciliegio: { min: 700, max: 1200 },
  albicocco: { min: 300, max: 600 },
  susino: { min: 500, max: 900 },
};
