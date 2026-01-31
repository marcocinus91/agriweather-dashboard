"use client";

import { useState } from "react";
import { useGeolocation, DEFAULT_COORDS } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { Map } from "@/components/map/Map";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { SearchCity } from "@/components/weather/SearchCity";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { PrecipitationChart } from "@/components/charts/PrecipitationChart";
import { Button } from "@/components/ui/button";
import { GeocodingResult } from "@/lib/api/geocoding";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export function Dashboard() {
  const {
    latitude: geoLat,
    longitude: geoLng,
    loading: geoLoading,
    error: geoError,
    isUsingFallback,
    requestPosition,
  } = useGeolocation();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const latitude = selectedLocation?.latitude ?? geoLat;
  const longitude = selectedLocation?.longitude ?? geoLng;
  const locationName =
    selectedLocation?.name ??
    (isUsingFallback ? DEFAULT_COORDS.name : "La tua posizione");

  const { data: weather, loading: weatherLoading } = useWeather(
    latitude,
    longitude,
  );

  function handleCitySelect(city: GeocodingResult) {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
    });
  }

  function handleUseMyPosition() {
    setSelectedLocation(null);
    requestPosition();
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      {/* Mappa */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full">
        <Map center={[latitude, longitude]} zoom={9} />
      </div>

      {/* Dati meteo */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
        {/* Ricerca città */}
        <div className="mb-4">
          <SearchCity onSelect={handleCitySelect} />
        </div>

        {/* Banner posizione */}
        {isUsingFallback && !selectedLocation && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              📍 Stai visualizzando il meteo di {DEFAULT_COORDS.name}
            </p>
            <Button
              onClick={handleUseMyPosition}
              disabled={geoLoading}
              size="sm"
              variant="outline"
            >
              {geoLoading ? "Rilevamento..." : "Usa la mia posizione"}
            </Button>
            {geoError && (
              <p className="text-sm text-red-600 mt-2">⚠️ {geoError}</p>
            )}
          </div>
        )}

        {/* Bottone torna alla posizione */}
        {selectedLocation && (
          <div className="mb-4">
            <Button
              onClick={handleUseMyPosition}
              disabled={geoLoading}
              size="sm"
              variant="ghost"
            >
              ← Torna alla mia posizione
            </Button>
          </div>
        )}

        {/* Weather Card */}
        <div className="mb-6">
          {weatherLoading || !weather ? (
            <div className="p-6 bg-slate-100 rounded-lg animate-pulse">
              <div className="h-12 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          ) : (
            <WeatherCard
              current={weather.current}
              locationName={locationName}
            />
          )}
        </div>

        {/* Grafici */}
        <div className="grid gap-4">
          {weatherLoading || !weather ? (
            <>
              <div className="h-64 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-64 bg-slate-100 rounded-lg animate-pulse"></div>
            </>
          ) : (
            <>
              <TemperatureChart daily={weather.daily} />
              <PrecipitationChart daily={weather.daily} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
