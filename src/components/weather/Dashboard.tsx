"use client";

import { useState, lazy, Suspense } from "react";
import { useGeolocation, DEFAULT_COORDS } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useSavedCities, SavedCity } from "@/hooks/useSavedCities";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { SearchCity } from "@/components/weather/SearchCity";
import { SavedCities } from "@/components/layout/SavedCities";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tab-custom";
import { GeocodingResult } from "@/lib/api/geocoding";
import {
  CalendarDays,
  CloudSun,
  Sprout,
  AlertTriangle,
  MapPin,
  Loader2,
} from "lucide-react";
import { CardErrorBoundary } from "@/components/error/CardErrorBoundary";

// Lazy load componenti pesanti
const Map = lazy(() =>
  import("@/components/map/Map").then((mod) => ({ default: mod.Map })),
);
const NowcastingCard = lazy(() =>
  import("./NowcastingCard").then((mod) => ({ default: mod.NowcastingCard })),
);
const SprayWindows = lazy(() =>
  import("./SprayWindows").then((mod) => ({ default: mod.SprayWindows })),
);
const TemperatureChart = lazy(() =>
  import("@/components/charts/TemperatureChart").then((mod) => ({
    default: mod.TemperatureChart,
  })),
);
const PrecipitationChart = lazy(() =>
  import("@/components/charts/PrecipitationChart").then((mod) => ({
    default: mod.PrecipitationChart,
  })),
);
const EvapotranspirationChart = lazy(() =>
  import("@/components/charts/EvapotranspirationChart").then((mod) => ({
    default: mod.EvapotranspirationChart,
  })),
);
const SunshineCard = lazy(() =>
  import("./SunshineCard").then((mod) => ({ default: mod.SunshineCard })),
);
const GrowingDegreeDays = lazy(() =>
  import("./GrowingDegreeDays").then((mod) => ({
    default: mod.GrowingDegreeDays,
  })),
);
const ChillingHoursCard = lazy(() =>
  import("./ChillingHoursCard").then((mod) => ({
    default: mod.ChillingHoursCard,
  })),
);
const EvapotranspirationCard = lazy(() =>
  import("./EvapotranspirationCard").then((mod) => ({
    default: mod.EvapotranspirationCard,
  })),
);
const FrostAlert = lazy(() =>
  import("./FrostAlert").then((mod) => ({ default: mod.FrostAlert })),
);
const WindAlert = lazy(() =>
  import("./WindAlert").then((mod) => ({ default: mod.WindAlert })),
);
const DiseaseRiskCard = lazy(() =>
  import("./DiseaseRiskCard").then((mod) => ({
    default: mod.DiseaseRiskCard,
  })),
);

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

// Loading skeleton component
function Skeleton({ className = "h-40" }: { className?: string }) {
  return (
    <div
      className={`bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}
    />
  );
}

// Loading spinner component
function LoadingSpinner({ className = "h-40" }: { className?: string }) {
  return (
    <div
      className={`bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center ${className}`}
    >
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
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

  // Conta alert attivi per badge
  const activeAlerts = (() => {
    if (!weather) return 0;
    let count = 0;
    if (weather.daily.temperature_2m_min.some((t) => t < 2)) count++;
    if (weather.daily.wind_speed_10m_max.some((w) => w >= 30)) count++;
    return count;
  })();

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)]">
      {/* Mappa */}
      <div className="w-full lg:w-1/2 h-[30vh] lg:h-full">
        <Suspense
          fallback={
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          }
        >
          <Map center={[latitude, longitude]} zoom={9} />
        </Suspense>
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
                className="shrink-0"
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
          {(activeTab) => (
            <>
              {/* TAB: OGGI */}
              {activeTab === "oggi" && (
                <div className="space-y-4">
                  <CardErrorBoundary cardName="Nowcasting">
                    <Suspense fallback={<LoadingSpinner className="h-48" />}>
                      <NowcastingCard
                        latitude={latitude}
                        longitude={longitude}
                      />
                    </Suspense>
                  </CardErrorBoundary>

                  {weatherLoading || !weather ? (
                    <Skeleton />
                  ) : (
                    <CardErrorBoundary cardName="Meteo attuale">
                      <WeatherCard
                        current={weather.current}
                        locationName={locationName}
                      />
                    </CardErrorBoundary>
                  )}

                  <CardErrorBoundary cardName="Finestre trattamento">
                    <Suspense fallback={<LoadingSpinner className="h-48" />}>
                      {weather && <SprayWindows hourly={weather.hourly} />}
                    </Suspense>
                  </CardErrorBoundary>
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
                    <Suspense fallback={<LoadingSpinner className="h-64" />}>
                      <CardErrorBoundary cardName="Grafico temperature">
                        <TemperatureChart daily={weather.daily} />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Grafico precipitazioni">
                        <PrecipitationChart daily={weather.daily} />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Grafico evapotraspirazione">
                        <EvapotranspirationChart daily={weather.daily} />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Ore di sole">
                        <SunshineCard daily={weather.daily} />
                      </CardErrorBoundary>
                    </Suspense>
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
                    <Suspense fallback={<LoadingSpinner className="h-48" />}>
                      <CardErrorBoundary cardName="Gradi Giorno">
                        <GrowingDegreeDays
                          daily={weather.daily}
                          latitude={latitude}
                          longitude={longitude}
                        />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Ore di freddo">
                        <ChillingHoursCard
                          latitude={latitude}
                          longitude={longitude}
                        />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Evapotraspirazione">
                        <EvapotranspirationCard daily={weather.daily} />
                      </CardErrorBoundary>
                    </Suspense>
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
                    <Suspense fallback={<LoadingSpinner />}>
                      <CardErrorBoundary cardName="Alert gelate">
                        <FrostAlert daily={weather.daily} />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Alert vento">
                        <WindAlert daily={weather.daily} />
                      </CardErrorBoundary>
                      <CardErrorBoundary cardName="Rischio malattie">
                        <DiseaseRiskCard hourly={weather.hourly} />
                      </CardErrorBoundary>
                    </Suspense>
                  )}

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
