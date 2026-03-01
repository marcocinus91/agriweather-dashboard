"use client";

import { X, MapPin } from "lucide-react";

interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface SavedCitiesProps {
  cities: City[];
  onSelect: (city: City) => void;
  onRemove: (id: string) => void;
}

export function SavedCities({ cities, onSelect, onRemove }: SavedCitiesProps) {
  if (cities.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {cities.map((city) => (
        <div
          key={city.id}
          className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm"
        >
          <button
            onClick={() => onSelect(city)}
            className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <MapPin className="h-3 w-3" />
            {city.name}
          </button>
          <button
            onClick={() => onRemove(city.id)}
            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
            aria-label={`Rimuovi ${city.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
