# AgriWeather Dashboard

Dashboard meteo professionale per agricoltori con supporto decisionale per irrigazione, trattamenti fitosanitari, monitoraggio colture e gestione del rischio climatico.

**[Demo Live](https://agriweather-dashboard.vercel.app/)**

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Test](https://img.shields.io/badge/Tests-49%20passed-success) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Panoramica

AgriWeather Dashboard trasforma i dati meteorologici in decisioni agronomiche operative. Non si limita a mostrare "che tempo fa", ma risponde a domande concrete: _Posso trattare oggi? Pioverà nelle prossime 2 ore? Le mie colture stanno accumulando abbastanza calore?_

L'applicazione integra previsioni meteo ad alta risoluzione con indicatori agrometeorologici specifici, modelli di rischio fitosanitario e strumenti di pianificazione per le principali operazioni colturali.

---

## Funzionalità

### Navigazione a Tab

L'interfaccia è organizzata in 4 sezioni per accesso rapido alle informazioni:

| Tab           | Contenuto                                            |
| ------------- | ---------------------------------------------------- |
| **Oggi**      | Nowcasting, meteo attuale, finestre di trattamento   |
| **Settimana** | Grafici temperature, precipitazioni, ET, ore di sole |
| **Colture**   | Gradi Giorno, ore di freddo, evapotraspirazione      |
| **Rischi**    | Alert gelate, vento, malattie fungine                |

### Nowcasting e Previsioni

| Funzionalità                  | Descrizione                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| **Nowcasting Precipitazioni** | Previsione pioggia a 15 minuti per le prossime 2 ore               |
| **Alert Pioggia Imminente**   | Notifica visuale quando precipitazioni previste entro 30-60 minuti |
| **Previsioni 7 Giorni**       | Dati orari e giornalieri con grafici interattivi                   |
| **Auto-refresh**              | Nowcasting aggiornato automaticamente ogni 5 minuti                |

### Localizzazione e Mappa

| Funzionalità          | Descrizione                               |
| --------------------- | ----------------------------------------- |
| **Mappa Interattiva** | Visualizzazione geografica con Leaflet.js |
| **Geolocalizzazione** | Rilevamento automatico posizione          |
| **Ricerca Città**     | Autocomplete per qualsiasi località       |
| **Città Salvate**     | Fino a 5 località preferite               |

### Indicatori Agrometeorologici

| Indicatore                   | Utilizzo Agronomico                              |
| ---------------------------- | ------------------------------------------------ |
| **Evapotraspirazione (ET₀)** | Fabbisogno irriguo (formula FAO Penman-Monteith) |
| **Gradi Giorno (GDD)**       | Accumulo termico per stadi fenologici            |
| **Ore di Freddo**            | Vernalizzazione frutticoltura (modello Utah)     |
| **Ore di Sole**              | Potenziale fotosintetico                         |
| **Bagnatura Fogliare**       | Stima rischio malattie                           |

### Sistema di Alert

| Alert                 | Soglie                               |
| --------------------- | ------------------------------------ |
| **Pioggia Imminente** | < 30 / 60 / 120 minuti               |
| **Frost Alert**       | Temperature < 2°C                    |
| **Wind Alert**        | Vento > 30 / 40 / 60 km/h            |
| **Rischio Malattie**  | Peronospora, Oidio, Botrite, Ruggine |

### Strumenti Decisionali

| Strumento                | Funzione                                                     |
| ------------------------ | ------------------------------------------------------------ |
| **Spray Windows**        | Finestre ottimali per trattamenti                            |
| **Consigli Irrigazione** | Raccomandazioni basate su ET                                 |
| **Selezione Coltura**    | GDD per Mais, Grano, Pomodoro, Vite, Girasole                |
| **Vernalizzazione**      | Progresso per Melo, Pero, Pesco, Ciliegio, Albicocco, Susino |

---

## Architettura

### Stack Tecnologico

| Categoria         | Tecnologia                 |
| ----------------- | -------------------------- |
| **Framework**     | Next.js 14 (App Router)    |
| **Linguaggio**    | TypeScript (strict mode)   |
| **Styling**       | Tailwind CSS               |
| **Componenti UI** | shadcn/ui                  |
| **Mappe**         | Leaflet.js (react-leaflet) |
| **Grafici**       | Recharts                   |
| **Icone**         | Lucide React               |
| **Data Fetching** | TanStack React Query       |
| **Testing**       | Vitest                     |
| **API Meteo**     | Open-Meteo                 |
| **Deploy**        | Vercel                     |

### Ottimizzazioni Performance

| Tecnica              | Beneficio                                       |
| -------------------- | ----------------------------------------------- |
| **Lazy Loading**     | Componenti caricati on-demand per tab           |
| **React Query**      | Cache automatica, retry, stale-while-revalidate |
| **Error Boundaries** | Crash isolati per componente                    |
| **Code Splitting**   | Bundle iniziale ridotto                         |

### Testing

```bash
npm test        # Watch mode
npm run test:run # Single run
```

**49 test unitari** coprono i modelli agronomici critici:

- Calcolo Gradi Giorno (GDD)
- Ore di freddo e Chill Units (modello Utah)
- Rischio malattie fungine (Peronospora, Oidio, Botrite, Ruggine)
- Stima bagnatura fogliare

---

## Installazione

```bash
git clone https://github.com/YOUR-USERNAME/agriweather-dashboard.git
cd agriweather-dashboard
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## Struttura Progetto

```
src/
├── app/                          # Next.js App Router
├── components/
│   ├── charts/                   # Grafici Recharts
│   ├── error/                    # Error Boundaries
│   ├── layout/                   # Navbar, SavedCities
│   ├── map/                      # Mappa Leaflet
│   ├── providers/                # React Query Provider
│   ├── ui/                       # shadcn/ui + Tabs
│   └── weather/                  # Componenti agrometeo
├── hooks/                        # Custom hooks
├── lib/
│   ├── agro/                     # Modelli agronomici (testati)
│   │   ├── gdd.ts
│   │   ├── chilling.ts
│   │   └── disease.ts
│   └── api/                      # Client API
├── test/                         # Test unitari
└── types/                        # TypeScript interfaces
```

---

## API e Dati

API gratuite di [Open-Meteo](https://open-meteo.com/), nessuna API key richiesta.

### Endpoint

| Endpoint       | Descrizione         | Refresh            |
| -------------- | ------------------- | ------------------ |
| **Forecast**   | Previsioni 7 giorni | Cache 10 min       |
| **Nowcasting** | Previsioni 15 min   | Auto-refresh 5 min |
| **Geocoding**  | Ricerca località    | On-demand          |

### Parametri

| Parametro                    | Componente                         |
| ---------------------------- | ---------------------------------- |
| `temperature_2m`             | WeatherCard, GDD, Grafici          |
| `precipitation`              | Nowcasting, Grafici, Spray Windows |
| `wind_speed_10m`             | Wind Alert, Spray Windows          |
| `relative_humidity_2m`       | Disease Risk, Spray Windows        |
| `dew_point_2m`               | Bagnatura fogliare                 |
| `et0_fao_evapotranspiration` | Irrigazione                        |
| `sunshine_duration`          | Ore di sole                        |

---

## Modelli Agronomici

### Gradi Giorno (GDD)

```
GDD = max(0, ((Tmax + Tmin) / 2) - Tbase)
```

| Coltura  | Tbase | GDD Maturazione |
| -------- | ----- | --------------- |
| Mais     | 10°C  | 2700            |
| Grano    | 5°C   | 1500            |
| Pomodoro | 10°C  | 1400            |
| Vite     | 10°C  | 1800            |
| Girasole | 8°C   | 1600            |

### Ore di Freddo (Modello Utah)

| Temperatura  | Chill Units |
| ------------ | ----------- |
| < 1.5°C      | 0           |
| 1.5 - 2.5°C  | 0.5         |
| 2.5 - 9.2°C  | 1.0         |
| 9.2 - 12.5°C | 0.5         |
| 12.5 - 16°C  | 0           |
| 16 - 18°C    | -0.5        |
| > 18°C       | -1.0        |

### Rischio Malattie

| Patogeno    | Condizioni Critiche                  |
| ----------- | ------------------------------------ |
| Peronospora | T 10-25°C, UR > 80%, bagnatura > 6h  |
| Oidio       | T 20-30°C, UR 40-80%, bagnatura > 4h |
| Botrite     | T 15-25°C, UR > 85%, bagnatura > 8h  |
| Ruggine     | T 15-25°C, bagnatura > 8h            |

### Spray Windows

Condizioni ottimali:

- Vento < 15 km/h
- Probabilità pioggia < 30%
- Temperatura 5-30°C
- Umidità 40-90%

---

## Roadmap

### Completato

- [x] Previsioni 7 giorni con grafici
- [x] Nowcasting precipitazioni
- [x] Mappa interattiva
- [x] Alert (gelate, vento, malattie)
- [x] Indicatori agrometeo (ET₀, GDD, Chilling Hours)
- [x] Spray Windows
- [x] UI a tab
- [x] Lazy loading
- [x] React Query caching
- [x] Error boundaries
- [x] Test unitari (49)
- [x] Dark mode

### Prossimi Step

- [ ] PWA con notifiche push
- [ ] Storico meteo stagionale
- [ ] Profili colturali personalizzabili
- [ ] Export report PDF
- [ ] Multi-lingua

---

## Licenza

MIT License - vedi `LICENSE`

---

## Autore

**Marco** - Frontend Developer

- [LinkedIn](https://linkedin.com/in/YOUR-PROFILE)
- [GitHub](https://github.com/YOUR-USERNAME)

---

## Riferimenti

- [Open-Meteo API](https://open-meteo.com/en/docs)
- [FAO Evapotranspiration](https://www.fao.org/3/x0490e/x0490e00.htm)
- [Utah Chill Unit Model](https://extension.usu.edu/fruit/research/chill-units)
- [Growing Degree Days - NOAA](https://www.weather.gov/ama/gdd)
