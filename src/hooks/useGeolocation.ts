"use client";

import { useState, useCallback } from "react";

export const DEFAULT_COORDS = {
  latitude: 39.2238,
  longitude: 9.1217,
  name: "Cagliari",
} as const;

interface GeolocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
}

function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Permesso negato. Consenti l'accesso alla posizione nelle impostazioni del browser.";
    case error.POSITION_UNAVAILABLE:
      return "Posizione non disponibile. Verifica che il GPS sia attivo.";
    case error.TIMEOUT:
      return "Timeout nella richiesta. Riprova.";
    default:
      return "Errore sconosciuto nel rilevamento della posizione.";
  }
}

function isGeolocationSupported(): boolean {
  return typeof window !== "undefined" && "geolocation" in navigator;
}

export function useGeolocation() {
  // Parte con coordinate di default, niente loading iniziale
  const [state, setState] = useState<GeolocationState>({
    latitude: DEFAULT_COORDS.latitude,
    longitude: DEFAULT_COORDS.longitude,
    loading: false,
    error: null,
    isUsingFallback: true,
  });

  // Funzione da chiamare su click utente
  const requestPosition = useCallback(() => {
    if (!isGeolocationSupported()) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation non supportata dal browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
          isUsingFallback: false,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: getErrorMessage(error),
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 300000,
      },
    );
  }, []);

  return {
    ...state,
    requestPosition,
  };
}
