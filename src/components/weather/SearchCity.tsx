"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { searchCities, GeocodingResult } from "@/lib/api/geocoding";

interface SearchCityProps {
  onSelect: (city: GeocodingResult) => void;
}

export function SearchCity({ onSelect }: SearchCityProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ricerca con debounce
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

  // Chiudi dropdown cliccando fuori
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

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder="Cerca città..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />

      {/* Dropdown risultati */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-3 text-left hover:bg-slate-100 border-b last:border-b-0"
            >
              <p className="font-medium">{city.name}</p>
              <p className="text-sm text-slate-500">
                {city.admin1 && `${city.admin1}, `}
                {city.country}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4 text-center text-slate-500">
          Ricerca in corso...
        </div>
      )}

      {/* Nessun risultato */}
      {isOpen && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4 text-center text-slate-500">
          Nessuna città trovata
        </div>
      )}
    </div>
  );
}
