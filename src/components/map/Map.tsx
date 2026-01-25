"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

const WeatherMap = dynamic(
  () => import("./WeatherMap").then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400">Caricamento mappa...</span>
      </div>
    ),
  },
);

interface MapProps {
  center: LatLngExpression;
  zoom?: number;
}

export function Map({ center, zoom }: MapProps) {
  return <WeatherMap center={center} zoom={zoom} />;
}
