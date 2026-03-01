"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSeasonalGDDData,
  getChillingSeasonData,
  getLastYearComparison,
  HistoricalResponse,
} from "@/lib/api/historical";

export function useSeasonalGDD(
  latitude: number,
  longitude: number,
  seasonStartDate: string,
  enabled: boolean = true,
) {
  return useQuery<HistoricalResponse, Error>({
    queryKey: ["seasonal-gdd", latitude, longitude, seasonStartDate],
    queryFn: () => getSeasonalGDDData(latitude, longitude, seasonStartDate),
    enabled: enabled && !!latitude && !!longitude && !!seasonStartDate,
    staleTime: 60 * 60 * 1000, // 1 ora
    gcTime: 24 * 60 * 60 * 1000, // 24 ore
  });
}

export function useChillingSeason(
  latitude: number,
  longitude: number,
  enabled: boolean = true,
) {
  return useQuery<HistoricalResponse, Error>({
    queryKey: ["chilling-season", latitude, longitude],
    queryFn: () => getChillingSeasonData(latitude, longitude),
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 60 * 60 * 1000, // 1 ora
    gcTime: 24 * 60 * 60 * 1000, // 24 ore
  });
}

export function useLastYearComparison(
  latitude: number,
  longitude: number,
  daysBack: number = 30,
  enabled: boolean = true,
) {
  return useQuery<HistoricalResponse, Error>({
    queryKey: ["last-year-comparison", latitude, longitude, daysBack],
    queryFn: () => getLastYearComparison(latitude, longitude, daysBack),
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 60 * 60 * 1000, // 1 ora
    gcTime: 24 * 60 * 60 * 1000, // 24 ore
  });
}
