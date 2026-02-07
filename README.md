# 🌾 AgriWeather Dashboard

> Dashboard meteo specializzata per agricoltori con focus su dati rilevanti per l'agricoltura: frost alerts, precipitazioni, condizioni di semina.

🔗 **[Demo Live](https://agriweather-dashboard.vercel.app/)**

![AgriWeather Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- 🗺️ **Mappa interattiva** con dati meteo in tempo reale
- 🔍 **Ricerca città** con autocomplete
- 📍 **Geolocalizzazione** automatica del browser
- 🌡️ **Grafico temperature** min/max 7 giorni
- 💧 **Grafico precipitazioni** 7 giorni
- 🥶 **Frost Alert** - avviso gelate notturne per proteggere le colture
- ⭐ **Città salvate** in localStorage

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Mappe**: Leaflet.js (react-leaflet)
- **Grafici**: Recharts
- **API Meteo**: Open-Meteo (gratuita, no API key)
- **Deploy**: Vercel

## 🛠️ Setup Locale

```bash
git clone https://github.com/marcocinus91/agriweather-dashboard.git
cd agriweather-dashboard
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📁 Struttura Progetto

```
src/
├── app/                 # Next.js App Router
├── components/
│   ├── charts/          # Grafici Recharts
│   ├── layout/          # Navbar, SavedCities
│   ├── map/             # Mappa Leaflet
│   ├── ui/              # Componenti shadcn
│   └── weather/         # WeatherCard, FrostAlert, SearchCity
├── hooks/               # Custom hooks (useGeolocation, useWeather, useSavedCities)
├── lib/
│   └── api/             # Client API Open-Meteo e Geocoding
└── types/               # TypeScript types
```

## 🌐 API

Utilizza [Open-Meteo](https://open-meteo.com/) - API meteo gratuita, no API key richiesta.

## 👨‍💻 Autore

**Marco** - Frontend Developer  
[LinkedIn](https://linkedin.com/in/marco-cinus)

## 📝 License

MIT
