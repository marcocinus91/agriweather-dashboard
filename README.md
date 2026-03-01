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

### Autenticazione e Persistenza

| Funzionalità        | Descrizione                                             |
| ------------------- | ------------------------------------------------------- |
| **Login**           | Autenticazione con email o Google OAuth                 |
| **Città Salvate**   | Sincronizzazione tra dispositivi per utenti autenticati |
| **Preferenze**      | Impostazioni colture e località salvate nel database    |
| **Fallback Locale** | localStorage per utenti non autenticati                 |

### Navigazione a Tab

L'interfaccia è organizzata in 4 sezioni per accesso rapido:

| Tab           | Contenuto                                                  |
| ------------- | ---------------------------------------------------------- |
| **Oggi**      | Nowcasting, meteo attuale, finestre di trattamento         |
| **Settimana** | Grafici temperature, precipitazioni, ET, ore di sole       |
| **Colture**   | Gradi Giorno stagionali, ore di freddo, evapotraspirazione |
| **Rischi**    | Alert gelate, vento, malattie fungine                      |

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

### Onboarding

| Funzionalità         | Descrizione                                         |
| -------------------- | --------------------------------------------------- |
| **Tour Guidato**     | Introduzione alle funzionalità per nuovi utenti     |
| **Hint Contestuali** | Suggerimenti nei tab con possibilità di chiusura    |
| **Persistenza**      | Preferenze salvate, non riappare dopo completamento |

---

## Architettura

### Stack Tecnologico

| Categoria          | Tecnologia                                |
| ------------------ | ----------------------------------------- |
| **Framework**      | Next.js 14 (App Router)                   |
| **Linguaggio**     | TypeScript (strict mode)                  |
| **Styling**        | Tailwind CSS                              |
| **Componenti UI**  | shadcn/ui                                 |
| **Mappe**          | Leaflet.js (react-leaflet)                |
| **Grafici**        | Recharts                                  |
| **Icone**          | Lucide React                              |
| **Data Fetching**  | TanStack React Query                      |
| **Autenticazione** | NextAuth.js v5                            |
| **Database**       | Prisma + SQLite (dev) / PostgreSQL (prod) |
| **Testing**        | Vitest                                    |
| **API Meteo**      | Open-Meteo                                |
| **Deploy**         | Vercel                                    |

### Backend API

| Endpoint           | Descrizione           | Cache  |
| ------------------ | --------------------- | ------ |
| `/api/weather`     | Previsioni meteo      | 10 min |
| `/api/nowcasting`  | Precipitazioni 15 min | 5 min  |
| `/api/historical`  | Dati storici          | 1 ora  |
| `/api/cities`      | Città salvate utente  | -      |
| `/api/preferences` | Preferenze utente     | -      |
| `/api/crops`       | Impostazioni colture  | -      |

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
├── SavedCity[]      # Città preferite (max 5)
├── CropSetting[]    # Impostazioni colture personalizzate
└── UserPreferences  # Preferenze app (tema, località default, ecc.)
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

### Setup

```bash
# Clona il repository
git clone https://github.com/YOUR-USERNAME/agriweather-dashboard.git
cd agriweather-dashboard

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env

# Inizializza il database
npx prisma db push

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

### Variabili d'Ambiente

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key"

# Google OAuth (opzionale)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

---

## Struttura Progetto

```
src/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth handlers
│   │   ├── weather/              # Meteo con cache
│   │   ├── nowcasting/           # Nowcasting con cache
│   │   ├── historical/           # Dati storici con cache
│   │   ├── cities/               # CRUD città utente
│   │   ├── preferences/          # Preferenze utente
│   │   └── crops/                # Impostazioni colture
│   ├── login/                    # Pagina login
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/                   # Grafici Recharts
│   ├── error/                    # Error Boundaries
│   ├── layout/                   # Navbar, SavedCities
│   ├── map/                      # Mappa Leaflet
│   ├── onboarding/               # Tour e hints
│   ├── providers/                # React Query, Session
│   ├── ui/                       # shadcn/ui + Tabs
│   └── weather/                  # Componenti agrometeo
├── hooks/                        # Custom hooks
├── lib/
│   ├── agro/                     # Modelli agronomici (testati)
│   ├── api/                      # Client API
│   ├── auth.ts                   # Configurazione NextAuth
│   └── db.ts                     # Client Prisma
├── test/                         # Test unitari
└── types/                        # TypeScript interfaces

prisma/
└── schema.prisma                 # Schema database
```

---

## Deploy

### Vercel (Raccomandato)

1. Importa il repository su Vercel
2. Configura le variabili d'ambiente
3. Per produzione, usa PostgreSQL (Vercel Postgres, Supabase, ecc.)

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### Database Produzione

Per migrare da SQLite a PostgreSQL:

1. Aggiorna `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Esegui la migrazione:

```bash
npx prisma migrate dev
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

### Completato

- [x] Previsioni 7 giorni con grafici
- [x] Nowcasting precipitazioni
- [x] Mappa interattiva
- [x] Alert (gelate, vento, malattie)
- [x] Indicatori agrometeo (ET₀, GDD, Chilling Hours)
- [x] Dati storici stagionali
- [x] Spray Windows
- [x] UI a tab
- [x] Lazy loading
- [x] React Query caching
- [x] Backend API con cache
- [x] Autenticazione (NextAuth)
- [x] Database (Prisma)
- [x] Onboarding tour
- [x] Error boundaries
- [x] Test unitari (49)
- [x] Dark mode

### Prossimi Step

- [ ] PWA con notifiche push
- [ ] Profili colturali personalizzabili
- [ ] Export report PDF
- [ ] Multi-lingua
- [ ] Integrazione sensori IoT

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
- [NextAuth.js](https://authjs.dev/)
- [Prisma](https://www.prisma.io/)
- [FAO Evapotranspiration](https://www.fao.org/3/x0490e/x0490e00.htm)
- [Utah Chill Unit Model](https://extension.usu.edu/fruit/research/chill-units)
- [Growing Degree Days - NOAA](https://www.weather.gov/ama/gdd)
