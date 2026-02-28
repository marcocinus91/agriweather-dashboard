"use client";

import { useQuery } from "@tanstack/react-query";
import { getNowcastingData, NowcastingResponse } from "@/lib/api/nowcasting";

export function useNowcasting(latitude: number, longitude: number) {
  const query = useQuery<NowcastingResponse, Error>({
    queryKey: ["nowcasting", latitude, longitude],
    queryFn: () => getNowcastingData(latitude, longitude),
    enabled: !!latitude && !!longitude,
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 15 * 60 * 1000, // 15 minuti
    refetchInterval: 5 * 60 * 1000, // Auto-refetch ogni 5 minuti
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
