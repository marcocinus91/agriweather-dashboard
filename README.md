# 🌾 AgriWeather Dashboard

Dashboard meteo specializzata per agricoltori con focus su dati rilevanti per l'agricoltura: frost alerts, precipitazioni, condizioni di semina.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Mappe**: Leaflet.js (react-leaflet)
- **Grafici**: Recharts
- **API Meteo**: Open-Meteo (gratuita, no API key)
- **Deploy**: Vercel

## ✨ Features

- [x] Layout responsive con Navbar
- [x] Mappa interattiva con marker
- [x] Integrazione API Open-Meteo
- [ ] Geolocalizzazione automatica
- [ ] Ricerca città
- [ ] Grafici temperature e precipitazioni (7 giorni)
- [ ] 🥶 Frost Alert (avviso gelate notturne)
- [ ] Città salvate in localStorage

## 🛠️ Setup Locale

```bash
git clone https://github.com/TUO-USERNAME/agriweather-dashboard.git
cd agriweather-dashboard
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📁 Struttura Progetto

```
src/
├── app/              # Next.js App Router
├── components/
│   ├── layout/       # Navbar, layout components
│   ├── map/          # Mappa Leaflet
│   ├── weather/      # Card meteo, alerts
│   └── charts/       # Grafici Recharts
├── hooks/            # Custom hooks
├── lib/api/          # Client API Open-Meteo
└── types/            # TypeScript types
```

## 🌐 API

Utilizza [Open-Meteo](https://open-meteo.com/) - API meteo gratuita, no API key richiesta.

## 📝 License

MIT
