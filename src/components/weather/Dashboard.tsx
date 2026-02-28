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
import { EvapotranspirationChart } from "@/components/charts/EvapotranspirationChart";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tab-custom";
import { GeocodingResult } from "@/lib/api/geocoding";
import { WindAlert } from "./WindAlert";
import { GrowingDegreeDays } from "./GrowingDegreeDays";
import { SprayWindows } from "./SprayWindows";
import { SunshineCard } from "./SunshineCard";
import { DiseaseRiskCard } from "./DiseaseRiskCard";
import { ChillingHoursCard } from "./ChillingHoursCard";
import { NowcastingCard } from "./NowcastingCard";
import {
  CalendarDays,
  CloudSun,
  Sprout,
  AlertTriangle,
  MapPin,
} from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

const TABS = [
  { id: "oggi", label: "Oggi", icon: <CloudSun className="h-4 w-4" /> },
  {
    id: "settimana",
    label: "Settimana",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  { id: "colture", label: "Colture", icon: <Sprout className="h-4 w-4" /> },
  {
    id: "rischi",
    label: "Rischi",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
];

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

  // Conta alert attivi per badge
  const activeAlerts = (() => {
    if (!weather) return 0;
    let count = 0;

    // Frost
    if (weather.daily.temperature_2m_min.some((t) => t < 2)) count++;
    // Wind
    if (weather.daily.wind_speed_10m_max.some((w) => w >= 30)) count++;

    return count;
  })();

  // Loading skeleton
  const Skeleton = ({ className = "h-40" }: { className?: string }) => (
    <div
      className={`bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}
    />
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)]">
      {/* Mappa */}
      <div className="w-full lg:w-1/2 h-[30vh] lg:h-full">
        <Map center={[latitude, longitude]} zoom={9} />
      </div>

      {/* Dati meteo */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto bg-white dark:bg-slate-900">
        {/* Header: Ricerca + Posizione */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <SearchCity
                onSelect={handleCitySelect}
                onSave={handleSaveCity}
                isSaved={isSaved}
              />
            </div>
            {selectedLocation && (
              <Button
                onClick={handleUseMyPosition}
                disabled={geoLoading}
                size="sm"
                variant="outline"
                className="flex-shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Città salvate */}
          {cities.length > 0 && (
            <SavedCities
              cities={cities}
              onSelect={handleCitySelect}
              onRemove={removeCity}
            />
          )}

          {/* Banner geolocation */}
          {isUsingFallback && !selectedLocation && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-between">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Meteo di {DEFAULT_COORDS.name}
              </p>
              <Button
                onClick={handleUseMyPosition}
                disabled={geoLoading}
                size="sm"
                variant="outline"
              >
                {geoLoading ? "..." : "Usa mia posizione"}
              </Button>
            </div>
          )}
          {geoError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              {geoError}
            </p>
          )}
        </div>

        {/* Location Name */}
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            {locationName}
          </h2>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={TABS.map((tab) => ({
            ...tab,
            label:
              tab.id === "rischi" && activeAlerts > 0
                ? `${tab.label} (${activeAlerts})`
                : tab.label,
          }))}
          defaultTab="oggi"
        >
          {(activeTab: string) => (
            <>
              {/* TAB: OGGI */}
              {activeTab === "oggi" && (
                <div className="space-y-4">
                  {/* Nowcasting */}
                  <NowcastingCard latitude={latitude} longitude={longitude} />

                  {/* Weather Card */}
                  {weatherLoading || !weather ? (
                    <Skeleton />
                  ) : (
                    <WeatherCard
                      current={weather.current}
                      locationName={locationName}
                    />
                  )}

                  {/* Spray Windows */}
                  {weatherLoading || !weather ? (
                    <Skeleton className="h-48" />
                  ) : (
                    <SprayWindows hourly={weather.hourly} />
                  )}
                </div>
              )}

              {/* TAB: SETTIMANA */}
              {activeTab === "settimana" && (
                <div className="space-y-4">
                  {weatherLoading || !weather ? (
                    <>
                      <Skeleton className="h-64" />
                      <Skeleton className="h-64" />
                      <Skeleton className="h-64" />
                      <Skeleton className="h-48" />
                    </>
                  ) : (
                    <>
                      <TemperatureChart daily={weather.daily} />
                      <PrecipitationChart daily={weather.daily} />
                      <EvapotranspirationChart daily={weather.daily} />
                      <SunshineCard daily={weather.daily} />
                    </>
                  )}
                </div>
              )}

              {/* TAB: COLTURE */}
              {activeTab === "colture" && (
                <div className="space-y-4">
                  {weatherLoading || !weather ? (
                    <>
                      <Skeleton className="h-48" />
                      <Skeleton className="h-64" />
                      <Skeleton className="h-40" />
                    </>
                  ) : (
                    <>
                      <GrowingDegreeDays daily={weather.daily} />
                      <ChillingHoursCard hourly={weather.hourly} />
                      <EvapotranspirationCard daily={weather.daily} />
                    </>
                  )}
                </div>
              )}

              {/* TAB: RISCHI */}
              {activeTab === "rischi" && (
                <div className="space-y-4">
                  {weatherLoading || !weather ? (
                    <>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton className="h-64" />
                    </>
                  ) : (
                    <>
                      <FrostAlert daily={weather.daily} />
                      <WindAlert daily={weather.daily} />
                      <DiseaseRiskCard hourly={weather.hourly} />
                    </>
                  )}

                  {/* Messaggio se nessun alert */}
                  {weather && activeAlerts === 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Nessun alert critico attivo
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Tabs>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
          Dati meteo da Open-Meteo.com
        </div>
      </div>
    </div>
  );
}
