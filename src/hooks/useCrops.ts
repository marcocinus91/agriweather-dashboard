"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface CropSetting {
  id: string;
  cropName: string;
  baseTemp: number;
  seasonStartDate: string;
  targetGDD: number;
}

export function useCrops() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const isAuthenticated = !!session?.user;

  // Fetch colture da DB
  const { data: crops = [], isLoading } = useQuery<CropSetting[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const res = await fetch("/api/crops");
      if (!res.ok) throw new Error("Errore caricamento colture");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  // Aggiungi/Aggiorna coltura
  const saveMutation = useMutation({
    mutationFn: async (crop: Omit<CropSetting, "id">) => {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crop),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      toast.success(`${variables.cropName} salvata`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Errore nel salvataggio");
    },
  });

  // Rimuovi coltura
  const removeMutation = useMutation({
    mutationFn: async (cropName: string) => {
      const res = await fetch(
        `/api/crops?name=${encodeURIComponent(cropName)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Errore rimozione coltura");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      toast.success("Coltura rimossa");
    },
    onError: () => {
      toast.error("Errore nella rimozione");
    },
  });

  return {
    crops,
    isLoading,
    isAuthenticated,
    saveCrop: saveMutation.mutate,
    removeCrop: removeMutation.mutate,
    isSaving: saveMutation.isPending,
  };
}
