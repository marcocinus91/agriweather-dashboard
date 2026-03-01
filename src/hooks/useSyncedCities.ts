"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSavedCities } from "./useSavedCities";

export interface SyncedCity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface DbCity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
}

export function useSyncedCities() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const localCities = useSavedCities();

  const isAuthenticated = !!session?.user;

  // Fetch città da DB
  const { data: dbCities = [], isLoading } = useQuery<DbCity[]>({
    queryKey: ["saved-cities"],
    queryFn: async () => {
      const res = await fetch("/api/cities");
      if (!res.ok) throw new Error("Errore caricamento città");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  // Aggiungi città (DB)
  const addMutation = useMutation({
    mutationFn: async (city: {
      name: string;
      latitude: number;
      longitude: number;
      country?: string;
    }) => {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-cities"] });
    },
  });

  // Rimuovi città (DB)
  const removeMutation = useMutation({
    mutationFn: async (cityId: string) => {
      const res = await fetch(`/api/cities?id=${cityId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore rimozione città");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-cities"] });
    },
  });

  // Città unificate
  const cities: SyncedCity[] = isAuthenticated
    ? dbCities.map((c) => ({
        id: c.id,
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        country: c.country || "",
      }))
    : localCities.cities.map((c) => ({
        id: String(c.id),
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        country: c.country,
      }));

  // Aggiungi città
  const addCity = (city: {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }) => {
    if (isAuthenticated) {
      addMutation.mutate({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country,
      });
    } else {
      localCities.addCity({
        id: city.id || Date.now(),
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        country: city.country || "",
      });
    }
  };

  // Rimuovi città
  const removeCity = (id: string) => {
    if (isAuthenticated) {
      removeMutation.mutate(id);
    } else {
      localCities.removeCity(Number(id));
    }
  };

  // Controlla se salvata
  const isSaved = (id: number) => {
    return cities.some((c) => c.id === String(id));
  };

  return {
    cities,
    addCity,
    removeCity,
    isSaved,
    isLoading: isAuthenticated ? isLoading : false,
    isAuthenticated,
  };
}
