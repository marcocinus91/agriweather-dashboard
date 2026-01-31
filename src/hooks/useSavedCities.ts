"use client";

import { useState, useEffect, useCallback } from "react";

export interface SavedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

const STORAGE_KEY = "agriweather-saved-cities";
const MAX_CITIES = 5;

// Funzione per leggere da localStorage (solo client-side)
function getStoredCities(): SavedCity[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error("Errore parsing città salvate");
    }
  }
  return [];
}

export function useSavedCities() {
  // Inizializzazione lazy: legge da localStorage solo al primo render
  const [cities, setCities] = useState<SavedCity[]>(getStoredCities);

  // Salva in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities]);

  const addCity = useCallback((city: SavedCity) => {
    setCities((prev) => {
      if (prev.some((c) => c.id === city.id)) {
        return prev;
      }
      const updated = [...prev, city];
      if (updated.length > MAX_CITIES) {
        updated.shift();
      }
      return updated;
    });
  }, []);

  const removeCity = useCallback((id: number) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const isSaved = useCallback(
    (id: number) => {
      return cities.some((c) => c.id === id);
    },
    [cities],
  );

  return {
    cities,
    addCity,
    removeCity,
    isSaved,
  };
}
