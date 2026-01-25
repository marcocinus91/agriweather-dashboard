"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

// Coordinate di fallback: Cagliari
const DEFAULT_LAT = 39.2238;
const DEFAULT_LNG = 9.1217;

export function useGeolocation() {
  // Stato iniziale uguale per server e client per evitare hydration mismatch
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Controlla il supporto geolocation solo sul client (dentro useEffect)
    if (!navigator.geolocation) {
      // Usa requestAnimationFrame per rendere la chiamata asincrona
      // ed evitare il warning del React Compiler
      requestAnimationFrame(() => {
        setState({
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LNG,
          loading: false,
          error: "Geolocation non supportata",
        });
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Successo
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      // Errore
      (error) => {
        setState({
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LNG,
          loading: false,
          error: error.message,
        });
      },
      // Opzioni
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache 5 minuti
      },
    );
  }, []);

  return state;
}
