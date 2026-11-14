# SheRox — Women's Safety Web Platform

SheRox is an intelligent women's safety web application designed to provide real-time protection, automated emergency alerts, and safe route planning. Users can register trusted emergency contacts, detect acoustic distress in the browser, trigger instant SOS dispatches with live tracking, and scan vehicle license plates before travelling.

---

## Architecture Overview

```
┌─────────────────────────────────┐
│     React 19 Frontend (SPA)     │
│   (Vercel / Local Port 3000)    │
│  - Web Audio Distress Detector  │
│  - Leaflet + OpenStreetMap Map  │
│  - OCR Plate Scanner            │
└────────────────┬────────────────┘
                 │
                 │ HTTPS + Bearer JWT
                 ▼
┌─────────────────────────────────┐
│    Node.js + Express REST API   │
│   (Render / Local Port 5000)    │
│  - Helmet & CORS Protection     │
│  - Rate Limiting & Zod Validate │
│  - JWT Auth Middleware          │
└────────┬───────────────┬────────┘
         │               │
         ▼               ▼
┌────────────────┐ ┌────────────────┐
│ MongoDB Atlas  │ │    Fast2SMS    │
│  (Mongoose)    │ │   (SMS Alerts) │
│ - Users        │ └────────────────┘
│ - Contacts     │
│ - 2dsphere Geo │
└────────────────┘
```

---

## Core Features

- **Secure Authentication**: User registration and login with `bcryptjs` password hashing and stateless JSON Web Tokens (2-hour expiry).
- **Trusted Safety Circle**: Manage up to 5 verified emergency contacts with automated 10-digit phone number validation and owner isolation.
- **Instant SOS Alert System**: One-click or keyword voice-activated emergency alert broadcasting live GPS tracking and vehicle details via Fast2SMS.
- **In-Browser Acoustic Distress Detection**: Continuous Web Audio API processing calculating speech volume and scream frequency to trigger automatic SOS when distress exceeds 5 seconds.
- **Vehicle Plate Recognition**: Real-time camera feed OCR (Tesseract.js) to scan and store taxi/cab registration plates with geospatial coordinates.
- **Safe Route Navigation**: OpenStreetMap + OSRM route planner integrating geospatial risk factors and traffic safety scoring.
- **Offline SMS Mode**: Fallback SMS generation using native device URI schemes when internet connectivity is unavailable.

---

## Screenshots

| Dashboard & Safety Status | Safe Route Navigation |
|---|---|
| ![Dashboard](screenshots/Screenshot%202025-07-25%20173706.png) | ![Route Planner](screenshots/Screenshot%202025-07-25%20173802.png) |

| Voice Distress Monitoring | Vehicle Plate Scanner |
|---|---|
| ![Voice SOS](screenshots/Screenshot%202025-07-25%20173838.png) | ![Vehicle Scanner](screenshots/Screenshot%202025-07-25%20173855.png) |

| Emergency SOS Controls | Safety Circle Management |
|---|---|
| ![Emergency Trigger](screenshots/Screenshot%202025-07-25%20173914.png) | ![Safety Circle](screenshots/Screenshot%202025-07-25%20173934.png) |

---

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Leaflet & OpenStreetMap, Tesseract.js, Web Audio API
- **Backend**: Node.js, Express 4, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `zod`, `helmet`, `cors`, `express-rate-limit`
- **Database**: MongoDB (Mongoose ODM with `2dsphere` geospatial indexing)
- **Testing**: Jest, Supertest, `mongodb-memory-server`
- **Containerization & CI**: Docker, GitHub Actions CI
- **Deployment**: Render (Backend Web Service), Vercel (Frontend SPA)

---

## Project Structure

```
.
├── .github/workflows/ci.yml # Automated CI test and build workflow
├── DECISIONS.md             # Architectural and security decisions log
├── README.md                # Project documentation
├── render.yaml              # Render backend deployment spec
├── screenshots/             # Application screenshots
├── server/                  # Node.js + Express backend
│   ├── Dockerfile           # Production container configuration
│   ├── .dockerignore
│   ├── .env.example         # Template for environment variables
│   ├── package.json
│   ├── src/
│   │   ├── app.js           # Express application factory & middleware
│   │   ├── index.js         # MongoDB connection and server listener
│   │   ├── config.js        # Environment validation
│   │   ├── models/          # User, TrustedContact, VehicleScan, EmergencyAlert, SafeRouteData
│   │   ├── routes/          # auth, contacts, sos, scans, route
│   │   ├── middleware/      # auth (JWT), validate (Zod), rateLimit, errorHandler
│   │   └── services/        # smsService (Fast2SMS), safetyScore (OSRM & Geo)
│   └── tests/               # Jest & Supertest test suites
└── sherox-app/              # React frontend application
    ├── .env.example
    ├── vercel.json          # SPA routing rewrite rule
    ├── package.json
    └── src/
        ├── apiConfig.js     # Base API configuration
        ├── components/      # RoutePlanner, SafetyCircle, VoiceSOS, VehicleScanner, etc.
        ├── pages/           # Dashboard, Login, Signup, Home, About, Contact
        └── utils/           # api client, emergencyHandler
```

---

## API Reference

All protected endpoints require the HTTP header: `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Liveness health check |
| `POST` | `/api/signup` | No | Create user account with name, email, password |
| `POST` | `/api/login` | No | Authenticate user; returns JWT token and user details |
| `GET` | `/api/contacts` | Yes | List trusted emergency contacts for current user |
| `POST` | `/api/contacts` | Yes | Add trusted contact (name, 10-digit number; max 5) |
| `DELETE` | `/api/contacts/:id` | Yes | Delete contact (enforces ownership; 404 for others) |
| `GET` | `/api/trusted-contacts/count` | Yes | Retrieve total count of contacts for user |
| `POST` | `/api/contacts/send-sos` | Yes | Broadcast emergency SMS to user's contacts |
| `POST` | `/api/emergency-alert` | Yes | Record emergency alert in database and notify contacts |
| `POST` | `/api/log-scan` | Yes | Store vehicle license scan with GeoJSON coordinates |
| `POST` | `/api/route/safest` | Yes | Compute safe route score and traffic level |

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Default / Example | Purpose |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP listener port |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `production`, `test`) |
| `MONGODB_URI` | Yes (prod) | `mongodb://127.0.0.1:27017/sherox` | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes (prod) | `sherox-dev-jwt-secret-key-12345` | Secret key used for signing JWT tokens |
| `CLIENT_ORIGIN` | No | `http://localhost:3000` | Allowed frontend origin for CORS |
| `FAST2SMS_API_KEY` | No (dev/test) | `(empty)` | Fast2SMS Bulk V2 API key |

### Frontend (`sherox-app/.env`)

| Variable | Required | Default / Example | Purpose |
|---|---|---|---|
| `REACT_APP_API_URL` | No | `http://localhost:5000` | Backend API base URL |

---

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd sherox-app
cp .env.example .env
npm install
npm start
```

The frontend will run on `http://localhost:3000`.

---

## Running Automated Tests

The backend test suite uses **Jest**, **Supertest**, and **MongoMemoryServer** to run in-memory tests without needing an external MongoDB server:

```bash
cd server
npm test
```

To run frontend build checks:

```bash
cd sherox-app
npm run build
```

---

## Deployment Guide

### Backend (Render)

1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service** from `render.yaml` or manually configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Configure environment variables in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random secret>`
   - `CLIENT_ORIGIN`: `https://your-frontend.vercel.app`
   - `FAST2SMS_API_KEY`: `<Your Fast2SMS API key>`

### Frontend (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `sherox-app`.
3. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://your-backend.onrender.com`
4. Deploy.

---

## License

This project is licensed under the MIT License.
