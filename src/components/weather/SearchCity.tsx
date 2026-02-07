"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCities, GeocodingResult } from "@/lib/api/geocoding";

interface SearchCityProps {
  onSelect: (city: GeocodingResult) => void;
  onSave?: (city: GeocodingResult) => void;
  isSaved?: (id: number) => boolean;
}

export function SearchCity({ onSelect, onSave, isSaved }: SearchCityProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const cities = await searchCities(query);
        setResults(cities);
        setIsOpen(true);
      } catch (error) {
        console.error("Errore ricerca:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: GeocodingResult) {
    onSelect(city);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }

  function handleSave(e: React.MouseEvent, city: GeocodingResult) {
    e.stopPropagation();
    onSave?.(city);
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder="Cerca città..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full dark:bg-slate-800 dark:border-slate-600"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b dark:border-slate-700 last:border-b-0 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {city.admin1 && `${city.admin1}, `}
                  {city.country}
                </p>
              </div>
              {onSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleSave(e, city)}
                  disabled={isSaved?.(city.id)}
                  className="ml-2"
                >
                  {isSaved?.(city.id) ? "✓" : "⭐"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg shadow-lg z-50 p-4 text-center text-slate-500 dark:text-slate-400">
          Ricerca in corso...
        </div>
      )}

      {isOpen && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg shadow-lg z-50 p-4 text-center text-slate-500 dark:text-slate-400">
          Nessuna città trovata
        </div>
      )}
    </div>
  );
}
