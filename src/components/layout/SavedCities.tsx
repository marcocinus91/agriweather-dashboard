"use client";

import { SavedCity } from "@/hooks/useSavedCities";
import { Button } from "@/components/ui/button";

interface SavedCitiesProps {
  cities: SavedCity[];
  onSelect: (city: SavedCity) => void;
  onRemove: (id: number) => void;
}

export function SavedCities({ cities, onSelect, onRemove }: SavedCitiesProps) {
  if (cities.length === 0) {
    return <p className="text-sm text-slate-400">Nessuna città salvata</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {cities.map((city) => (
        <div
          key={city.id}
          className="flex items-center gap-1 bg-slate-100 rounded-full pl-3 pr-1 py-1"
        >
          <button
            onClick={() => onSelect(city)}
            className="text-sm hover:text-blue-600"
          >
            {city.name}
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-slate-200"
            onClick={() => onRemove(city.id)}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}
