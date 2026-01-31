import { CurrentWeather } from "@/types/weather";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherCardProps {
  current: CurrentWeather;
  locationName?: string;
}

export function WeatherCard({ current, locationName }: WeatherCardProps) {
  const { description, icon } = getWeatherInfo(current.weather_code);

  return (
    <Card>
      <CardContent className="pt-6">
        {locationName && (
          <p className="text-sm text-slate-500 mb-1">{locationName}</p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold">{current.temperature_2m}°C</p>
            <p className="text-slate-600 mt-1">{description}</p>
          </div>
          <span className="text-6xl">{icon}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
          <div>
            <p className="text-sm text-slate-500">Umidità</p>
            <p className="text-lg font-medium">
              {current.relative_humidity_2m}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Vento</p>
            <p className="text-lg font-medium">{current.wind_speed_10m} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
