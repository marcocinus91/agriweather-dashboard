"use client";

import { useState } from "react";
import { useGeolocation, DEFAULT_COORDS } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useSavedCities, SavedCity } from "@/hooks/useSavedCities";
import { Map } from "@/components/map/Map";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { SearchCity } from "@/components/weather/SearchCity";
import { FrostAlert } from "@/components/weather/FrostAlert";
import { SavedCities } from "@/components/layout/SavedCities";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { PrecipitationChart } from "@/components/charts/PrecipitationChart";
import { EvapotranspirationCard } from "@/components/weather/EvapotranspirationCard";
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

  const { cities, addCity, removeCity, isSaved } = useSavedCities();
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

  function handleCitySelect(city: GeocodingResult | SavedCity) {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
    });
  }

  function handleSaveCity(city: GeocodingResult) {
    addCity({
      id: city.id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
    });
  }

  function handleUseMyPosition() {
    setSelectedLocation(null);
    requestPosition();
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)]">
      {/* Mappa */}
      <div className="w-full lg:w-1/2 h-[40vh] lg:h-full">
        <Map center={[latitude, longitude]} zoom={9} />
      </div>

      {/* Dati meteo */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto bg-white dark:bg-slate-900">
        {/* Ricerca città */}
        <div className="mb-3">
          <SearchCity
            onSelect={handleCitySelect}
            onSave={handleSaveCity}
            isSaved={isSaved}
          />
        </div>

        {/* Città salvate */}
        {cities.length > 0 && (
          <div className="mb-4">
            <SavedCities
              cities={cities}
              onSelect={handleCitySelect}
              onRemove={removeCity}
            />
          </div>
        )}

        {/* Banner posizione */}
        {isUsingFallback && !selectedLocation && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              📍 Meteo di {DEFAULT_COORDS.name}
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
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                ⚠️ {geoError}
              </p>
            )}
          </div>
        )}

        {/* Bottone torna alla posizione */}
        {selectedLocation && (
          <div className="mb-3">
            <Button
              onClick={handleUseMyPosition}
              disabled={geoLoading}
              size="sm"
              variant="ghost"
              className="text-sm h-8 px-2"
            >
              ← Mia posizione
            </Button>
          </div>
        )}

        {/* Frost Alert */}
        {weather && (
          <div className="mb-4">
            <FrostAlert daily={weather.daily} />
          </div>
        )}

        {/* Weather Card */}
        <div className="mb-4">
          {weatherLoading || !weather ? (
            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            </div>
          ) : (
            <WeatherCard
              current={weather.current}
              locationName={locationName}
            />
          )}
        </div>

        {/* Evapotraspirazione */}
        <div className="mb-4">
          {weatherLoading || !weather ? (
            <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          ) : (
            <EvapotranspirationCard daily={weather.daily} />
          )}
        </div>

        {/* Grafici */}
        <div className="grid gap-4">
          {weatherLoading || !weather ? (
            <>
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            </>
          ) : (
            <>
              <TemperatureChart daily={weather.daily} />
              <PrecipitationChart daily={weather.daily} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
          Dati meteo da Open-Meteo.com
        </div>
      </div>
    </div>
  );
}
