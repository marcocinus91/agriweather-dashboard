import { getWeatherData } from "@/lib/api/openMeteo";
import { Map } from "@/components/map/Map";

const DEFAULT_LAT = 39.2238;
const DEFAULT_LNG = 9.1217;

export default async function Home() {
  const weather = await getWeatherData(DEFAULT_LAT, DEFAULT_LNG);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full">
        <Map center={[DEFAULT_LAT, DEFAULT_LNG]} zoom={9} />
      </div>

      <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Cagliari</h1>

        <div className="p-4 bg-slate-100 rounded-lg mb-4">
          <p className="text-4xl font-bold">
            {weather.current.temperature_2m}°C
          </p>
          <p className="text-slate-600">
            Umidità: {weather.current.relative_humidity_2m}%
          </p>
          <p className="text-slate-600">
            Vento: {weather.current.wind_speed_10m} km/h
          </p>
        </div>

        <div className="grid gap-4">
          <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Grafico Temperature (Settimana 4)
          </div>
          <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Grafico Precipitazioni (Settimana 4)
          </div>
        </div>
      </div>
    </div>
  );
}
