# 🌾 AgriWeather Dashboard

> Dashboard meteo professionale per agricoltori con supporto decisionale per irrigazione, trattamenti fitosanitari e monitoraggio colture.

🔗 **[Demo Live](https://agriweather-dashboard.vercel.app/)**

![AgriWeather Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## ✨ Features

### 🗺️ Mappa e Localizzazione

- Mappa interattiva con Leaflet.js
- Geolocalizzazione automatica del browser
- Ricerca città con autocomplete
- Città salvate in localStorage (max 5)

### 🌡️ Dati Meteo

- Condizioni attuali (temperatura, umidità, vento)
- Previsioni 7 giorni con grafici interattivi
- Icone meteo dinamiche basate su codici WMO

### 🚨 Alert Agricoli

- **Frost Alert** - Avviso gelate notturne (< 2°C)
- **Wind Alert** - Avviso vento forte con livelli (moderato/forte/molto forte)

### 💧 Gestione Irrigazione

- **Evapotraspirazione (ET₀)** - Indice FAO con fabbisogno idrico
- **Grafico ET settimanale** - Visualizzazione trend con livelli di riferimento
- Consigli pratici per irrigazione basati sui dati

### 🌱 Supporto Colturale

- **Gradi Giorno (GDD)** - Calcolo accumulo termico per sviluppo colture
- Selezione coltura (Mais, Grano, Pomodoro, Vite, Girasole)
- Stima giorni alla maturazione
- Barra di progresso fenologico

### 🚜 Trattamenti Fitosanitari

- **Spray Windows** - Finestre ottimali per trattamenti
- Analisi oraria delle condizioni (vento, pioggia, temperatura, umidità)
- Visualizzazione 48h con finestre consigliate

### ☀️ Monitoraggio Solare

- **Ore di sole** giornaliere e settimanali
- Grafico a barre settimanale
- Valutazione qualità irraggiamento per fotosintesi

### 🎨 UI/UX

- Design responsive (mobile-first)
- Dark/Light mode
- Loading states animati
- Interfaccia in italiano

---

## 🚀 Tech Stack

| Categoria      | Tecnologia                        |
| -------------- | --------------------------------- |
| **Framework**  | Next.js 14 (App Router)           |
| **Linguaggio** | TypeScript (strict mode)          |
| **Styling**    | Tailwind CSS + shadcn/ui          |
| **Mappe**      | Leaflet.js (react-leaflet)        |
| **Grafici**    | Recharts                          |
| **API Meteo**  | Open-Meteo (gratuita, no API key) |
| **Deploy**     | Vercel                            |

---

## 🛠️ Setup Locale

```bash
# Clona il repository
git clone https://github.com/marcocinus91/agriweather-dashboard.git
cd agriweather-dashboard

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## 📁 Struttura Progetto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── charts/             # Grafici Recharts
│   │   ├── TemperatureChart.tsx
│   │   ├── PrecipitationChart.tsx
│   │   └── EvapotranspirationChart.tsx
│   ├── layout/             # Layout components
│   │   ├── Navbar.tsx
│   │   └── SavedCities.tsx
│   ├── map/                # Mappa Leaflet
│   │   ├── Map.tsx
│   │   └── WeatherMap.tsx
│   ├── ui/                 # shadcn/ui components
│   └── weather/            # Componenti meteo
│       ├── Dashboard.tsx
│       ├── WeatherCard.tsx
│       ├── FrostAlert.tsx
│       ├── WindAlert.tsx
│       ├── EvapotranspirationCard.tsx
│       ├── GrowingDegreeDays.tsx
│       ├── SprayWindows.tsx
│       ├── SunshineCard.tsx
│       └── SearchCity.tsx
├── hooks/                  # Custom React hooks
│   ├── useGeolocation.ts
│   ├── useWeather.ts
│   ├── useSavedCities.ts
│   └── useTheme.ts
├── lib/
│   ├── api/                # API clients
│   │   ├── openMeteo.ts
│   │   └── geocoding.ts
│   ├── weatherCodes.ts     # Mapping codici WMO
│   └── utils.ts
└── types/
    └── weather.ts          # TypeScript interfaces
```

---

## 🌐 API

Il progetto utilizza le API gratuite di [Open-Meteo](https://open-meteo.com/):

- **Weather Forecast API** - Previsioni meteo fino a 16 giorni
- **Geocoding API** - Ricerca città e coordinate

Nessuna API key richiesta. Utilizzo gratuito per progetti non commerciali.

### Dati utilizzati

| Parametro                    | Descrizione           | Utilizzo               |
| ---------------------------- | --------------------- | ---------------------- |
| `temperature_2m`             | Temperatura a 2m      | WeatherCard, Grafici   |
| `weather_code`               | Codice condizioni WMO | Icone meteo            |
| `wind_speed_10m`             | Velocità vento        | Alert, Spray Windows   |
| `precipitation`              | Precipitazioni        | Grafici, Spray Windows |
| `et0_fao_evapotranspiration` | Evapotraspirazione    | Irrigazione            |
| `sunshine_duration`          | Durata sole           | SunshineCard           |

---

## 📊 Formule e Calcoli

### Gradi Giorno (GDD)

```
GDD = max(0, ((Tmax + Tmin) / 2) - Tbase)
```

Dove `Tbase` varia per coltura (es. 10°C per mais, 5°C per grano).

### Fabbisogno Idrico

Basato su ET₀ (evapotraspirazione di riferimento FAO):

- < 3 mm/giorno → Basso
- 3-5 mm/giorno → Moderato
- 5-7 mm/giorno → Alto
- > 7 mm/giorno → Molto alto

### Spray Windows

Condizioni ideali per trattamenti:

- Vento < 15 km/h
- Probabilità pioggia < 30%
- Temperatura 5-30°C
- Umidità 40-90%

---

## 🎯 Roadmap

- [x] MVP con meteo base
- [x] Mappa interattiva
- [x] Alert agricoli (frost, wind)
- [x] Evapotraspirazione e irrigazione
- [x] Gradi Giorno (GDD)
- [x] Spray Windows
- [x] Ore di sole
- [x] Dark mode
- [ ] PWA (installabile)
- [ ] Notifiche push per alert
- [ ] Multi-lingua (EN)
- [ ] Export report PDF

---

## 👨‍💻 Autore

**Marco** - Frontend Developer

- 💼 [LinkedIn](https://linkedin.com/in/marco-cinus)
- 🐙 [GitHub](https://github.com/marcocinus91)

---

## 📝 License

MIT License - vedi [LICENSE](LICENSE) per dettagli.

---

## 🙏 Crediti

- [Open-Meteo](https://open-meteo.com/) - API meteo gratuita
- [shadcn/ui](https://ui.shadcn.com/) - Componenti UI
- [Recharts](https://recharts.org/) - Libreria grafici
- [Leaflet](https://leafletjs.com/) - Libreria mappe
