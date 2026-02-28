/**
 * Stima se la foglia è bagnata basandosi su umidità, punto di rugiada e precipitazioni
 */
export function estimateLeafWetness(
  temperature: number,
  humidity: number,
  dewPoint: number,
  precipitation: number,
): boolean {
  if (precipitation > 0) return true;
  if (humidity >= 90) return true;
  if (temperature - dewPoint <= 2) return true;
  return false;
}

export type RiskLevel = "basso" | "moderato" | "alto" | "critico";

/**
 * Calcola il rischio di Peronospora
 * Condizioni favorevoli: T 10-25°C, umidità >80%, bagnatura >4h
 */
export function calculatePeronospera(
  wetnessHours: number,
  avgTemperature: number,
  avgHumidity: number,
): RiskLevel {
  if (
    avgTemperature >= 10 &&
    avgTemperature <= 25 &&
    wetnessHours >= 6 &&
    avgHumidity >= 80
  ) {
    return "critico";
  }
  if (
    avgTemperature >= 10 &&
    avgTemperature <= 25 &&
    wetnessHours >= 4 &&
    avgHumidity >= 70
  ) {
    return "alto";
  }
  if (wetnessHours >= 3 && avgHumidity >= 60) {
    return "moderato";
  }
  return "basso";
}

/**
 * Calcola il rischio di Oidio
 * Condizioni favorevoli: T 20-30°C, umidità 40-80%
 */
export function calculateOidio(
  wetnessHours: number,
  avgTemperature: number,
  avgHumidity: number,
): RiskLevel {
  if (
    avgTemperature >= 20 &&
    avgTemperature <= 30 &&
    avgHumidity >= 40 &&
    avgHumidity <= 80
  ) {
    if (wetnessHours >= 4) return "alto";
    if (wetnessHours >= 2) return "moderato";
  }
  return "basso";
}

/**
 * Calcola il rischio di Botrite
 * Condizioni favorevoli: T 15-25°C, umidità >85%, bagnatura >6h
 */
export function calculateBotrite(
  wetnessHours: number,
  avgTemperature: number,
  avgHumidity: number,
): RiskLevel {
  if (
    avgTemperature >= 15 &&
    avgTemperature <= 25 &&
    wetnessHours >= 8 &&
    avgHumidity >= 85
  ) {
    return "critico";
  }
  if (
    avgTemperature >= 15 &&
    avgTemperature <= 25 &&
    wetnessHours >= 6 &&
    avgHumidity >= 80
  ) {
    return "alto";
  }
  if (wetnessHours >= 4 && avgHumidity >= 70) {
    return "moderato";
  }
  return "basso";
}

/**
 * Calcola il rischio di Ruggine
 * Condizioni favorevoli: T 15-25°C, bagnatura >6h
 */
export function calculateRuggine(
  wetnessHours: number,
  avgTemperature: number,
): RiskLevel {
  if (avgTemperature >= 15 && avgTemperature <= 25 && wetnessHours >= 8) {
    return "alto";
  }
  if (avgTemperature >= 10 && avgTemperature <= 28 && wetnessHours >= 6) {
    return "moderato";
  }
  return "basso";
}
