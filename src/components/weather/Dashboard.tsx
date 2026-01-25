"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { Map } from "@/components/map/Map";

export function Dashboard() {
  const {
    latitude,
    longitude,
    loading: geoLoading,
    error: geoError,
  } = useGeolocation();
  const {
    data: weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(latitude, longitude);

  // Loading geolocation
  if (geoLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Rilevamento posizione...</p>
        </div>
      </div>
    );
  }

  // Loading meteo
  if (weatherLoading || !weather) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Caricamento dati meteo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Mappa */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full">
        <Map center={[latitude!, longitude!]} zoom={9} />
      </div>

      {/* Dati meteo */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
        {/* Mostra avviso se geolocation fallita */}
        {geoError && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            ⚠️ {geoError} - Uso posizione di default (Cagliari)
          </div>
        )}

        {/* Mostra errore meteo se presente */}
        {weatherError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            ❌ Errore meteo: {weatherError}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">
          📍 {latitude?.toFixed(2)}°N, {longitude?.toFixed(2)}°E
        </h1>

        {/* Card meteo */}
        <div className="p-4 bg-slate-100 rounded-lg mb-4">
          <p className="text-4xl font-bold">
            {weather.current.temperature_2m}°C
          </p>
          <p className="text-slate-600">
            Umidità: {weather.current.relative_humidity_2m}%
          </p>
          <p className="text-slate-600">
            Vento: {weather.current.wind_speed_10m} km/h
          </p>
        </div>

        {/* Placeholder grafici */}
        <div className="grid gap-4">
          <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Grafico Temperature (Settimana 4)
          </div>
          <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Grafico Precipitazioni (Settimana 4)
          </div>
        </div>
      </div>
    </div>
  );
}
