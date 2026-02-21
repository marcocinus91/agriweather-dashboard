# AgriWeather Dashboard

Dashboard meteo professionale per agricoltori con supporto decisionale per irrigazione, trattamenti fitosanitari, monitoraggio colture e gestione del rischio climatico.

**[Demo Live](https://agriweather-dashboard.vercel.app/)**

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Panoramica

AgriWeather Dashboard trasforma i dati meteorologici in decisioni agronomiche operative. Non si limita a mostrare "che tempo fa", ma risponde a domande concrete: _Posso trattare oggi? Devo irrigare domani? Rischio gelate stanotte? Le mie colture stanno accumulando abbastanza calore?_

L'applicazione integra previsioni meteo ad alta risoluzione con indicatori agrometeorologici specifici, modelli di rischio fitosanitario e strumenti di pianificazione per le principali operazioni colturali.

---

## Funzionalità

### Dati Meteo e Localizzazione

| Funzionalità            | Descrizione                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Mappa Interattiva**   | Visualizzazione geografica con Leaflet.js e marker di posizione |
| **Geolocalizzazione**   | Rilevamento automatico della posizione tramite browser          |
| **Ricerca Città**       | Autocomplete con API di geocoding per qualsiasi località        |
| **Città Salvate**       | Memorizzazione fino a 5 località preferite in localStorage      |
| **Previsioni 7 Giorni** | Dati orari e giornalieri con grafici interattivi                |

### Indicatori Agrometeorologici

| Indicatore                   | Utilizzo Agronomico                                                  |
| ---------------------------- | -------------------------------------------------------------------- |
| **Evapotraspirazione (ET₀)** | Calcolo del fabbisogno irriguo basato su formula FAO Penman-Monteith |
| **Gradi Giorno (GDD)**       | Accumulo termico per previsione stadi fenologici e maturazione       |
| **Ore di Freddo**            | Monitoraggio vernalizzazione per frutticoltura (modello Utah)        |
| **Ore di Sole**              | Valutazione potenziale fotosintetico e qualità produttiva            |
| **Bagnatura Fogliare**       | Stima basata su umidità, punto di rugiada e precipitazioni           |

### Sistema di Alert

| Alert                | Soglie e Condizioni                                                    |
| -------------------- | ---------------------------------------------------------------------- |
| **Frost Alert**      | Temperature minime < 2°C con indicazione giorni a rischio              |
| **Wind Alert**       | Vento > 30 km/h (moderato), > 40 km/h (forte), > 60 km/h (molto forte) |
| **Rischio Malattie** | Peronospora, Oidio, Botrite, Ruggine basati su T, UR e bagnatura       |

### Strumenti Decisionali

| Strumento                      | Funzione                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------- |
| **Spray Windows**              | Identificazione finestre ottimali per trattamenti fitosanitari               |
| **Consigli Irrigazione**       | Raccomandazioni basate su deficit idrico e ET giornaliera                    |
| **Selezione Coltura**          | Parametri GDD personalizzati per Mais, Grano, Pomodoro, Vite, Girasole       |
| **Fabbisogno Vernalizzazione** | Progresso accumulo freddo per Melo, Pero, Pesco, Ciliegio, Albicocco, Susino |

### Interfaccia

- Design responsive ottimizzato per uso in campo (mobile-first)
- Tema chiaro/scuro con persistenza preferenze
- Grafici interattivi con Recharts
- Loading states e gestione errori

---

## Stack Tecnologico

| Categoria         | Tecnologia                           |
| ----------------- | ------------------------------------ |
| **Framework**     | Next.js 14 (App Router)              |
| **Linguaggio**    | TypeScript (strict mode)             |
| **Styling**       | Tailwind CSS                         |
| **Componenti UI** | shadcn/ui                            |
| **Mappe**         | Leaflet.js con react-leaflet         |
| **Grafici**       | Recharts                             |
| **Icone**         | Lucide React                         |
| **API Meteo**     | Open-Meteo (gratuita, senza API key) |
| **Deploy**        | Vercel                               |

---

## Installazione

```bash
# Clona il repository
git clone https://github.com/YOUR-USERNAME/agriweather-dashboard.git
cd agriweather-dashboard

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## Struttura Progetto

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── charts/                   # Visualizzazioni dati
│   │   ├── TemperatureChart.tsx
│   │   ├── PrecipitationChart.tsx
│   │   └── EvapotranspirationChart.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── SavedCities.tsx
│   ├── map/
│   │   ├── Map.tsx
│   │   └── WeatherMap.tsx
│   ├── ui/                       # shadcn/ui components
│   └── weather/                  # Componenti agrometeo
│       ├── Dashboard.tsx
│       ├── WeatherCard.tsx
│       ├── FrostAlert.tsx
│       ├── WindAlert.tsx
│       ├── EvapotranspirationCard.tsx
│       ├── GrowingDegreeDays.tsx
│       ├── SprayWindows.tsx
│       ├── SunshineCard.tsx
│       ├── DiseaseRiskCard.tsx
│       ├── ChillingHoursCard.tsx
│       └── SearchCity.tsx
├── hooks/
│   ├── useGeolocation.ts
│   ├── useWeather.ts
│   ├── useSavedCities.ts
│   └── useTheme.ts
├── lib/
│   ├── api/
│   │   ├── openMeteo.ts
│   │   └── geocoding.ts
│   ├── weatherCodes.ts
│   └── utils.ts
└── types/
    └── weather.ts
```

---

## API e Dati

Il progetto utilizza le API gratuite di [Open-Meteo](https://open-meteo.com/). Non è richiesta alcuna API key.

### Parametri Utilizzati

| Parametro                    | Descrizione             | Componente                  |
| ---------------------------- | ----------------------- | --------------------------- |
| `temperature_2m`             | Temperatura aria a 2m   | WeatherCard, Grafici, GDD   |
| `temperature_2m_max/min`     | Temperature giornaliere | Grafici, Frost Alert        |
| `weather_code`               | Codice condizioni WMO   | Icone meteo                 |
| `relative_humidity_2m`       | Umidità relativa        | Spray Windows, Disease Risk |
| `wind_speed_10m`             | Velocità vento          | Wind Alert, Spray Windows   |
| `precipitation`              | Precipitazioni          | Grafici, Spray Windows      |
| `dew_point_2m`               | Punto di rugiada        | Bagnatura fogliare          |
| `et0_fao_evapotranspiration` | Evapotraspirazione      | Irrigazione                 |
| `sunshine_duration`          | Durata soleggiamento    | Sunshine Card               |

---

## Modelli e Calcoli

### Gradi Giorno (Growing Degree Days)

```
GDD = max(0, ((Tmax + Tmin) / 2) - Tbase)
```

Temperature base per coltura:

- Mais: 10°C
- Grano: 5°C
- Pomodoro: 10°C
- Vite: 10°C
- Girasole: 8°C

### Ore di Freddo (Modello Utah Semplificato)

| Range Temperatura | Chill Units |
| ----------------- | ----------- |
| < 1.5°C           | 0           |
| 1.5 - 2.5°C       | 0.5         |
| 2.5 - 9.2°C       | 1.0         |
| 9.2 - 12.5°C      | 0.5         |
| 12.5 - 16°C       | 0           |
| 16 - 18°C         | -0.5        |
| > 18°C            | -1.0        |

### Bagnatura Fogliare

Foglia considerata bagnata quando:

- Precipitazione > 0 mm
- Umidità relativa ≥ 90%
- Temperatura - Punto di rugiada ≤ 2°C

### Rischio Malattie Fungine

| Patogeno    | Condizioni Favorevoli               |
| ----------- | ----------------------------------- |
| Peronospora | T 10-25°C, UR > 80%, bagnatura > 4h |
| Oidio       | T 20-30°C, UR 40-80%                |
| Botrite     | T 15-25°C, UR > 85%, bagnatura > 6h |
| Ruggine     | T 15-25°C, bagnatura > 6h           |

### Spray Windows

Condizioni ottimali per trattamenti:

- Vento < 15 km/h
- Probabilità pioggia < 30%
- Temperatura 5-30°C
- Umidità relativa 40-90%

---

## Roadmap

- [x] Dati meteo e previsioni 7 giorni
- [x] Mappa interattiva con geolocalizzazione
- [x] Alert agricoli (gelate, vento)
- [x] Evapotraspirazione e bilancio idrico
- [x] Gradi Giorno con selezione coltura
- [x] Finestre di trattamento (Spray Windows)
- [x] Ore di sole e irraggiamento
- [x] Rischio malattie fungine
- [x] Ore di freddo per frutticoltura
- [x] Tema scuro
- [ ] Progressive Web App (PWA)
- [ ] Notifiche push per alert critici
- [ ] Supporto multilingua
- [ ] Export report PDF
- [ ] Integrazione sensori IoT

---

## Licenza

Distribuito con licenza MIT. Vedi `LICENSE` per informazioni.

---

## Autore

**Marco** - Frontend Developer

- [LinkedIn](https://linkedin.com/in/YOUR-PROFILE)
- [GitHub](https://github.com/YOUR-USERNAME)

---

## Riferimenti

- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [FAO Evapotranspiration Guidelines](https://www.fao.org/3/x0490e/x0490e00.htm)
- [Utah Chill Unit Model](https://extension.usu.edu/fruit/research/chill-units)
- [Growing Degree Days - NOAA](https://www.weather.gov/ama/gdd)
