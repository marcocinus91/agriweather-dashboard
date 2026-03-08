# AgriWeather Dashboard

Dashboard meteo professionale per agricoltori con supporto decisionale per irrigazione, trattamenti fitosanitari, monitoraggio colture e gestione del rischio climatico.

**[Demo Live](https://agriweather-dashboard.vercel.app/)**

![Status](https://img.shields.io/badge/Status-Production-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Test](https://img.shields.io/badge/Tests-49%20passed-success) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Panoramica

AgriWeather Dashboard trasforma i dati meteorologici in decisioni agronomiche operative. Non si limita a mostrare "che tempo fa", ma risponde a domande concrete: _Posso trattare oggi? Pioverà nelle prossime 2 ore? Le mie colture stanno accumulando abbastanza calore?_

L'applicazione integra previsioni meteo ad alta risoluzione con indicatori agrometeorologici specifici, modelli di rischio fitosanitario e strumenti di pianificazione per le principali operazioni colturali.

---

## Funzionalità

### Autenticazione e Persistenza

| Funzionalità               | Descrizione                                             |
| -------------------------- | ------------------------------------------------------- |
| **Google OAuth**           | Autenticazione sicura con account Google                |
| **Città Salvate**          | Sincronizzazione tra dispositivi (max 5 località)       |
| **Colture Personalizzate** | Configurazione custom di Tbase, GDD target, data inizio |
| **Preferenze**             | Impostazioni salvate nel database PostgreSQL            |
| **Fallback Locale**        | localStorage per utenti non autenticati                 |

### Navigazione a Tab

L'interfaccia è organizzata in 4 sezioni per accesso rapido:

| Tab           | Contenuto                                                                  |
| ------------- | -------------------------------------------------------------------------- |
| **Oggi**      | Nowcasting, meteo attuale, finestre di trattamento                         |
| **Settimana** | Grafici temperature, precipitazioni, ET, ore di sole                       |
| **Colture**   | Gradi Giorno stagionali, ore di freddo, evapotraspirazione, colture custom |
| **Rischi**    | Alert gelate, vento, malattie fungine con badge contatore                  |

### Nowcasting e Previsioni

| Funzionalità                  | Descrizione                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| **Nowcasting Precipitazioni** | Previsione pioggia a 15 minuti per le prossime 2 ore               |
| **Alert Pioggia Imminente**   | Notifica visuale quando precipitazioni previste entro 30-60 minuti |
| **Previsioni 7 Giorni**       | Dati orari e giornalieri con grafici interattivi                   |
| **Auto-refresh**              | Nowcasting aggiornato automaticamente ogni 5 minuti                |

### Dati Storici Stagionali

| Funzionalità          | Descrizione                                                  |
| --------------------- | ------------------------------------------------------------ |
| **GDD Stagionali**    | Gradi Giorno accumulati dall'inizio della stagione colturale |
| **Ore di Freddo**     | Accumulo dal 1° ottobre per vernalizzazione frutticoltura    |
| **Confronto Storico** | Dati reali da Open-Meteo Archive API                         |
| **Stima Maturazione** | Calcolo automatico giorni rimanenti basato su media GDD      |

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

### User Experience

| Funzionalità            | Descrizione                                      |
| ----------------------- | ------------------------------------------------ |
| **Onboarding Tour**     | Introduzione guidata in 6 step per nuovi utenti  |
| **Hint Contestuali**    | Suggerimenti nei tab con possibilità di chiusura |
| **Toast Notifications** | Feedback visivo su azioni (salvataggio, errori)  |
| **Conferma Azioni**     | Modal di conferma per azioni distruttive         |
| **Dark Mode**           | Tema scuro automatico                            |

---

## Architettura

### Stack Tecnologico

| Categoria          | Tecnologia                    |
| ------------------ | ----------------------------- |
| **Framework**      | Next.js 14 (App Router)       |
| **Linguaggio**     | TypeScript (strict mode)      |
| **Styling**        | Tailwind CSS                  |
| **Componenti UI**  | shadcn/ui                     |
| **Mappe**          | Leaflet.js (react-leaflet)    |
| **Grafici**        | Recharts                      |
| **Icone**          | Lucide React                  |
| **Data Fetching**  | TanStack React Query          |
| **Autenticazione** | NextAuth.js v5 (Google OAuth) |
| **Database**       | Prisma + Neon PostgreSQL      |
| **Validazione**    | Zod                           |
| **Notifiche**      | Sonner                        |
| **Testing**        | Vitest                        |
| **API Meteo**      | Open-Meteo                    |
| **Deploy**         | Vercel                        |

### Backend API

| Endpoint           | Descrizione           | Cache  | Validazione |
| ------------------ | --------------------- | ------ | ----------- |
| `/api/weather`     | Previsioni meteo      | 10 min | Zod         |
| `/api/nowcasting`  | Precipitazioni 15 min | 5 min  | Zod         |
| `/api/historical`  | Dati storici          | 1 ora  | Zod         |
| `/api/cities`      | CRUD città utente     | -      | Zod         |
| `/api/preferences` | Preferenze utente     | -      | -           |
| `/api/crops`       | CRUD colture custom   | -      | Zod         |
| `/api/auth/*`      | NextAuth handlers     | -      | -           |

### Ottimizzazioni Performance

| Tecnica              | Beneficio                                       |
| -------------------- | ----------------------------------------------- |
| **Lazy Loading**     | Componenti caricati on-demand per tab           |
| **React Query**      | Cache automatica, retry, stale-while-revalidate |
| **API Caching**      | Riduce chiamate a Open-Meteo                    |
| **Error Boundaries** | Crash isolati per componente                    |
| **Code Splitting**   | Bundle iniziale ridotto                         |

### Database Schema

```prisma
User
├── Account[]        # OAuth providers
├── Session[]        # Sessioni attive
├── SavedCity[]      # Città preferite (max 5)
├── CropSetting[]    # Colture personalizzate
└── UserPreferences  # Preferenze app
```

### Testing

```bash
npm test        # Watch mode
npm run test:run # Single run
```

**49 test unitari** coprono i modelli agronomici critici:

- Calcolo Gradi Giorno (GDD)
- Ore di freddo e Chill Units (modello Utah)
- Rischio malattie fungine
- Stima bagnatura fogliare

---

## Installazione

### Requisiti

- Node.js 18+
- npm o yarn
- Account Google Cloud (per OAuth)
- Database PostgreSQL (Neon consigliato)

### Setup Locale

```bash
# Clona il repository
git clone https://github.com/YOUR-USERNAME/agriweather-dashboard.git
cd agriweather-dashboard

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env

# Genera il client Prisma e sincronizza il database
npx prisma generate
npx prisma db push

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

### Variabili d'Ambiente

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
AUTH_SECRET="genera-con-npx-auth-secret"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Configurazione Google OAuth

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un progetto o selezionane uno esistente
3. APIs & Services → Credentials → Create Credentials → OAuth client ID
4. Aggiungi Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`

---

## Struttura Progetto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handlers
│   │   ├── weather/              # Meteo con cache + validazione
│   │   ├── nowcasting/           # Nowcasting con cache
│   │   ├── historical/           # Dati storici con cache
│   │   ├── cities/               # CRUD città utente
│   │   ├── preferences/          # Preferenze utente
│   │   └── crops/                # CRUD colture custom
│   ├── login/                    # Pagina login Google
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                     # LoginBanner
│   ├── charts/                   # Grafici Recharts
│   ├── error/                    # Error Boundaries
│   ├── layout/                   # Navbar, SavedCities
│   ├── map/                      # Mappa Leaflet
│   ├── onboarding/               # Tour e hints
│   ├── providers/                # React Query, Session
│   ├── ui/                       # shadcn/ui, ConfirmDialog, Tabs
│   └── weather/                  # Componenti agrometeo
├── hooks/                        # Custom hooks (useWeather, useCrops, etc.)
├── lib/
│   ├── agro/                     # Modelli agronomici (testati)
│   ├── api/                      # Client API
│   ├── auth.ts                   # Configurazione NextAuth
│   ├── db.ts                     # Client Prisma
│   └── validations.ts            # Schema Zod
├── test/                         # Test unitari
└── types/                        # TypeScript interfaces

prisma/
└── schema.prisma                 # Schema database PostgreSQL
```

---

## Deploy

### Vercel (Raccomandato)

1. Importa il repository su Vercel
2. Aggiungi Storage → Neon Serverless Postgres
3. Configura le Environment Variables:
   - `DATABASE_URL` (auto da Neon)
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
4. Deploy automatico ad ogni push

### Build Command

```bash
prisma generate && prisma db push && next build
```

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

---

## Roadmap

### ✅ Completato

- [x] Previsioni 7 giorni con grafici
- [x] Nowcasting precipitazioni
- [x] Mappa interattiva
- [x] Alert (gelate, vento, malattie)
- [x] Indicatori agrometeo (ET₀, GDD, Chilling Hours)
- [x] Dati storici stagionali (Open-Meteo Archive)
- [x] Spray Windows
- [x] UI a tab con badge alert
- [x] Lazy loading componenti
- [x] React Query caching
- [x] Backend API con cache e validazione Zod
- [x] Autenticazione Google OAuth
- [x] Database PostgreSQL (Neon + Prisma)
- [x] CRUD città preferite
- [x] CRUD colture personalizzate
- [x] Onboarding tour
- [x] Toast notifications
- [x] Conferma azioni distruttive
- [x] Error boundaries
- [x] Test unitari (49)
- [x] Dark mode

### 🔜 Prossimi Step

- [ ] Test E2E con Playwright
- [ ] PWA con notifiche push
- [ ] Export report PDF
- [ ] Multi-lingua (i18n)
- [ ] Integrazione sensori IoT
- [ ] Logging/monitoring (Sentry)

---

## Licenza

MIT License - vedi `LICENSE`

---

## Autore

**Marco** - Frontend Developer

---

## Riferimenti

- [Open-Meteo API](https://open-meteo.com/en/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Prisma](https://www.prisma.io/)
- [Neon Serverless Postgres](https://neon.tech/)
- [FAO Evapotranspiration](https://www.fao.org/3/x0490e/x0490e00.htm)
- [Utah Chill Unit Model](https://extension.usu.edu/fruit/research/chill-units)
- [Growing Degree Days - NOAA](https://www.weather.gov/ama/gdd)
