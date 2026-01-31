interface WeatherInfo {
  description: string;
  icon: string;
}

// Codici WMO standard usati da Open-Meteo
const weatherCodes: Record<number, WeatherInfo> = {
  0: { description: "Sereno", icon: "☀️" },
  1: { description: "Prevalentemente sereno", icon: "🌤️" },
  2: { description: "Parzialmente nuvoloso", icon: "⛅" },
  3: { description: "Nuvoloso", icon: "☁️" },
  45: { description: "Nebbia", icon: "🌫️" },
  48: { description: "Nebbia con brina", icon: "🌫️" },
  51: { description: "Pioggerella leggera", icon: "🌧️" },
  53: { description: "Pioggerella moderata", icon: "🌧️" },
  55: { description: "Pioggerella intensa", icon: "🌧️" },
  61: { description: "Pioggia leggera", icon: "🌧️" },
  63: { description: "Pioggia moderata", icon: "🌧️" },
  65: { description: "Pioggia intensa", icon: "🌧️" },
  71: { description: "Neve leggera", icon: "🌨️" },
  73: { description: "Neve moderata", icon: "🌨️" },
  75: { description: "Neve intensa", icon: "❄️" },
  77: { description: "Granuli di neve", icon: "🌨️" },
  80: { description: "Rovesci leggeri", icon: "🌦️" },
  81: { description: "Rovesci moderati", icon: "🌦️" },
  82: { description: "Rovesci violenti", icon: "⛈️" },
  85: { description: "Rovesci di neve leggeri", icon: "🌨️" },
  86: { description: "Rovesci di neve intensi", icon: "❄️" },
  95: { description: "Temporale", icon: "⛈️" },
  96: { description: "Temporale con grandine leggera", icon: "⛈️" },
  99: { description: "Temporale con grandine forte", icon: "⛈️" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodes[code] || { description: "Sconosciuto", icon: "❓" };
}
