import { describe, it, expect } from "vitest";
import {
  calculateDailyGDD,
  calculateCumulativeGDD,
  estimateDaysToMaturity,
  CROP_BASE_TEMPS,
} from "@/lib/agro/gdd";

describe("calculateDailyGDD", () => {
  it("calcola correttamente GDD con temperature sopra la base", () => {
    // (30 + 20) / 2 = 25, 25 - 10 = 15
    expect(calculateDailyGDD(30, 20, 10)).toBe(15);
  });

  it("ritorna 0 quando la media è sotto la temperatura base", () => {
    // (8 + 4) / 2 = 6, 6 - 10 = -4 → max(0, -4) = 0
    expect(calculateDailyGDD(8, 4, 10)).toBe(0);
  });

  it("ritorna 0 quando la media è uguale alla temperatura base", () => {
    // (15 + 5) / 2 = 10, 10 - 10 = 0
    expect(calculateDailyGDD(15, 5, 10)).toBe(0);
  });

  it("gestisce temperature negative", () => {
    // (-2 + -8) / 2 = -5, -5 - 5 = -10 → max(0, -10) = 0
    expect(calculateDailyGDD(-2, -8, 5)).toBe(0);
  });

  it("usa temperature base diverse per colture diverse", () => {
    const tmax = 25;
    const tmin = 15;
    // Media = 20
    expect(calculateDailyGDD(tmax, tmin, CROP_BASE_TEMPS.mais)).toBe(10); // 20 - 10
    expect(calculateDailyGDD(tmax, tmin, CROP_BASE_TEMPS.grano)).toBe(15); // 20 - 5
  });
});

describe("calculateCumulativeGDD", () => {
  it("somma correttamente GDD su più giorni", () => {
    const tmax = [25, 28, 30];
    const tmin = [15, 18, 20];
    const tbase = 10;
    // Giorno 1: (25+15)/2 - 10 = 10
    // Giorno 2: (28+18)/2 - 10 = 13
    // Giorno 3: (30+20)/2 - 10 = 15
    // Totale: 38
    expect(calculateCumulativeGDD(tmax, tmin, tbase)).toBe(38);
  });

  it("ignora giorni con GDD negativo", () => {
    const tmax = [25, 8, 30];
    const tmin = [15, 4, 20];
    const tbase = 10;
    // Giorno 1: 10, Giorno 2: 0 (6-10=-4→0), Giorno 3: 15
    // Totale: 25
    expect(calculateCumulativeGDD(tmax, tmin, tbase)).toBe(25);
  });

  it("ritorna 0 per array vuoti", () => {
    expect(calculateCumulativeGDD([], [], 10)).toBe(0);
  });
});

describe("estimateDaysToMaturity", () => {
  it("calcola correttamente i giorni alla maturazione", () => {
    // 15 GDD/giorno, target 1500 → 100 giorni
    expect(estimateDaysToMaturity(15, 1500)).toBe(100);
  });

  it("ritorna null se GDD medio è 0", () => {
    expect(estimateDaysToMaturity(0, 1500)).toBe(null);
  });

  it("ritorna null se GDD medio è negativo", () => {
    expect(estimateDaysToMaturity(-5, 1500)).toBe(null);
  });

  it("arrotonda al giorno più vicino", () => {
    // 14 GDD/giorno, target 1500 → 107.14 → 107
    expect(estimateDaysToMaturity(14, 1500)).toBe(107);
  });
});
