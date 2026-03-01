export interface NowcastingResponse {
  latitude: number;
  longitude: number;
  minutely_15: {
    time: string[];
    precipitation: number[];
    precipitation_probability: number[];
  };
}

export async function getNowcastingData(
  latitude: number,
  longitude: number,
): Promise<NowcastingResponse> {
  const response = await fetch(
    `/api/nowcasting?lat=${latitude}&lon=${longitude}`,
  );

  if (!response.ok) {
    throw new Error(`Errore API Nowcasting: ${response.status}`);
  }

  return response.json();
}
