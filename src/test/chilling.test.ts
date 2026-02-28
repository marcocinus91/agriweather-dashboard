import { describe, it, expect } from "vitest";
import {
  isChillingHour,
  calculateChillUnits,
  calculateChillingHours,
  calculateTotalChillUnits,
} from "@/lib/agro/chilling";

describe("isChillingHour", () => {
  it("ritorna true per temperature tra 0 e 7°C", () => {
    expect(isChillingHour(0)).toBe(true);
    expect(isChillingHour(3.5)).toBe(true);
    expect(isChillingHour(7)).toBe(true);
  });

  it("ritorna false per temperature sotto 0°C", () => {
    expect(isChillingHour(-1)).toBe(false);
    expect(isChillingHour(-10)).toBe(false);
  });

  it("ritorna false per temperature sopra 7°C", () => {
    expect(isChillingHour(7.1)).toBe(false);
    expect(isChillingHour(15)).toBe(false);
  });
});

describe("calculateChillUnits", () => {
  it("ritorna 0 per temperature sotto 1.5°C", () => {
    expect(calculateChillUnits(0)).toBe(0);
    expect(calculateChillUnits(1)).toBe(0);
    expect(calculateChillUnits(-5)).toBe(0);
  });

  it("ritorna 0.5 per temperature tra 1.5 e 2.5°C", () => {
    expect(calculateChillUnits(1.5)).toBe(0.5);
    expect(calculateChillUnits(2)).toBe(0.5);
  });

  it("ritorna 1 per temperature tra 2.5 e 9.2°C (range ottimale)", () => {
    expect(calculateChillUnits(2.5)).toBe(1);
    expect(calculateChillUnits(5)).toBe(1);
    expect(calculateChillUnits(9)).toBe(1);
  });

  it("ritorna 0.5 per temperature tra 9.2 e 12.5°C", () => {
    expect(calculateChillUnits(9.2)).toBe(0.5);
    expect(calculateChillUnits(11)).toBe(0.5);
  });

  it("ritorna 0 per temperature tra 12.5 e 16°C", () => {
    expect(calculateChillUnits(12.5)).toBe(0);
    expect(calculateChillUnits(14)).toBe(0);
  });

  it("ritorna -0.5 per temperature tra 16 e 18°C", () => {
    expect(calculateChillUnits(16)).toBe(-0.5);
    expect(calculateChillUnits(17)).toBe(-0.5);
  });

  it("ritorna -1 per temperature sopra 18°C", () => {
    expect(calculateChillUnits(18)).toBe(-1);
    expect(calculateChillUnits(25)).toBe(-1);
  });
});

describe("calculateChillingHours", () => {
  it("conta correttamente le ore di freddo", () => {
    const temps = [2, 5, 8, 3, 0, -2, 15];
    // 2, 5, 3, 0 sono nel range → 4 ore
    expect(calculateChillingHours(temps)).toBe(4);
  });

  it("ritorna 0 per array senza ore di freddo", () => {
    const temps = [15, 20, 25, -5, -10];
    expect(calculateChillingHours(temps)).toBe(0);
  });

  it("ritorna 0 per array vuoto", () => {
    expect(calculateChillingHours([])).toBe(0);
  });
});

describe("calculateTotalChillUnits", () => {
  it("somma correttamente i chill units", () => {
    const temps = [5, 5, 5]; // 1 + 1 + 1 = 3
    expect(calculateTotalChillUnits(temps)).toBe(3);
  });

  it("gestisce chill units negativi", () => {
    const temps = [5, 5, 20]; // 1 + 1 + (-1) = 1
    expect(calculateTotalChillUnits(temps)).toBe(1);
  });

  it("ritorna 0 per array vuoto", () => {
    expect(calculateTotalChillUnits([])).toBe(0);
  });
});
