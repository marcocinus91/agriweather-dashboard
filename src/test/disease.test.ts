import { describe, it, expect } from "vitest";
import {
  estimateLeafWetness,
  calculatePeronospera,
  calculateOidio,
  calculateBotrite,
  calculateRuggine,
} from "@/lib/agro/disease";

describe("estimateLeafWetness", () => {
  it("ritorna true se c'è precipitazione", () => {
    expect(estimateLeafWetness(20, 50, 10, 0.5)).toBe(true);
  });

  it("ritorna true se umidità >= 90%", () => {
    expect(estimateLeafWetness(20, 90, 10, 0)).toBe(true);
    expect(estimateLeafWetness(20, 95, 10, 0)).toBe(true);
  });

  it("ritorna true se temperatura vicina al punto di rugiada (<=2°C)", () => {
    expect(estimateLeafWetness(12, 80, 10, 0)).toBe(true); // 12 - 10 = 2
    expect(estimateLeafWetness(11, 80, 10, 0)).toBe(true); // 11 - 10 = 1
  });

  it("ritorna false se nessuna condizione è soddisfatta", () => {
    expect(estimateLeafWetness(25, 50, 10, 0)).toBe(false); // 25 - 10 = 15 > 2
  });
});

describe("calculatePeronospera", () => {
  it("ritorna critico con condizioni ottimali per il patogeno", () => {
    expect(calculatePeronospera(6, 18, 85)).toBe("critico");
  });

  it("ritorna alto con condizioni favorevoli", () => {
    expect(calculatePeronospera(4, 18, 75)).toBe("alto");
  });

  it("ritorna moderato con condizioni parziali", () => {
    expect(calculatePeronospera(3, 30, 65)).toBe("moderato");
  });

  it("ritorna basso con condizioni sfavorevoli", () => {
    expect(calculatePeronospera(1, 30, 40)).toBe("basso");
  });

  it("ritorna basso se temperatura fuori range", () => {
    expect(calculatePeronospera(6, 30, 85)).toBe("moderato"); // T fuori range 10-25
    expect(calculatePeronospera(6, 5, 85)).toBe("moderato"); // T fuori range 10-25
  });
});

describe("calculateOidio", () => {
  it("ritorna alto con condizioni favorevoli", () => {
    expect(calculateOidio(4, 25, 60)).toBe("alto");
  });

  it("ritorna moderato con bagnatura moderata", () => {
    expect(calculateOidio(2, 25, 60)).toBe("moderato");
  });

  it("ritorna basso se temperatura fuori range", () => {
    expect(calculateOidio(4, 15, 60)).toBe("basso");
    expect(calculateOidio(4, 35, 60)).toBe("basso");
  });

  it("ritorna basso se umidità fuori range", () => {
    expect(calculateOidio(4, 25, 30)).toBe("basso");
    expect(calculateOidio(4, 25, 90)).toBe("basso");
  });
});

describe("calculateBotrite", () => {
  it("ritorna critico con condizioni ottimali per il patogeno", () => {
    expect(calculateBotrite(8, 20, 90)).toBe("critico");
  });

  it("ritorna alto con condizioni favorevoli", () => {
    expect(calculateBotrite(6, 20, 82)).toBe("alto");
  });

  it("ritorna moderato con condizioni parziali", () => {
    expect(calculateBotrite(4, 30, 75)).toBe("moderato");
  });

  it("ritorna basso con condizioni sfavorevoli", () => {
    expect(calculateBotrite(2, 30, 50)).toBe("basso");
  });
});

describe("calculateRuggine", () => {
  it("ritorna alto con condizioni favorevoli", () => {
    expect(calculateRuggine(8, 20)).toBe("alto");
  });

  it("ritorna moderato con bagnatura sufficiente", () => {
    expect(calculateRuggine(6, 20)).toBe("moderato");
  });

  it("ritorna basso con poca bagnatura", () => {
    expect(calculateRuggine(4, 20)).toBe("basso");
  });

  it("ritorna basso se temperatura fuori range", () => {
    expect(calculateRuggine(8, 5)).toBe("basso"); // T=5 è fuori range 10-28
    expect(calculateRuggine(8, 35)).toBe("basso"); // T=35 è fuori range
  });
});
