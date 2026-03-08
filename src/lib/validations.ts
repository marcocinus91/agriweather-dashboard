import { z } from "zod";

export const coordinatesSchema = z.object({
  lat: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
      message: "Latitudine deve essere tra -90 e 90",
    }),
  lon: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
      message: "Longitudine deve essere tra -180 e 180",
    }),
});

export const dateRangeSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data: YYYY-MM-DD"),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data: YYYY-MM-DD"),
});

export const citySchema = z.object({
  name: z.string().min(1, "Nome richiesto").max(100, "Nome troppo lungo"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  country: z.string().max(100).optional(),
});

export const cropSettingSchema = z.object({
  cropName: z.string().min(1).max(50),
  baseTemp: z.number().min(-20).max(40),
  seasonStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetGDD: z.number().min(100).max(10000),
});
