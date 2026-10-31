# 🚑 Smart Ambulance Finder & Emergency Response System (SmartPulse AI)

> **Frontend Architecture & Implementation**  
> Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**, **React Router v6**, **React Hook Form + Zod**, **Leaflet**, and **Recharts**.

---

## 🌟 Overview

The **Smart Ambulance Finder & Emergency Response System Using Machine Learning** (**SmartPulse AI**) is an intelligent emergency response web platform. It addresses critical bottlenecks in metropolitan emergency dispatch through:

1. **Sub-Second Geo-Lock & 1-Touch SOS**: Instant patient GPS detection with simulated reverse geocoding within 8-meter accuracy.
2. **Multi-Criteria Machine Learning Dispatch Optimization**: Simulates XGBoost regression and Dijkstra/A* graph routing considering proximity, road congestion indices, paramedic equipment fit (ALS/BLS/NICU), and vehicle readiness to slash response times by up to **4.8 minutes**.
3. **Green Corridor Real-Time Tracking**: Turn-by-turn navigation with dynamic traffic delay penalties and live GPS telemetry interpolation.
4. **Pre-Arrival Hospital ER Bed Sync**: Real-time synchronization of ICU ventilator beds, trauma bays, and pediatric NICU capacity so patients have pre-allocated ER teams waiting upon ambulance arrival.

---

## 🎨 Design System & Theme

- **Deep Navy Blue**: `#0F172A`, `#0B132B` (Command center authority, clarity, contrast)
- **Healthcare Blue**: `#2563EB`, `#1D4ED8` (Trust, clinical accuracy, navigation routes)
- **Emergency Red**: `#DC2626`, `#EF4444` (Instant SOS actions, critical cardiac/trauma alerts)
- **Light Grey**: `#F8FAFC`, `#F1F5F9` (Clean, modern card surfaces and dashboard layout)
- **Emerald Green**: `#10B981` (Online indicators, green corridors, bed availability)
- **Typography**: Inter & Plus Jakarta Sans with clear hierarchy and accessibility standards.

---

## 🚀 Key Modules & Pages

### 1. Public Landing Page (`/`)
- Professional healthcare navigation bar with 24/7 hotline badge (`108 / 911`).
- High-impact Hero section with glowing **Emergency SOS** trigger.
- Quick **Demo Persona Switcher** (Patient, Driver, Hospital, Admin).
- Machine learning pipeline breakdown (Detection -> ML Dispatch -> Green Corridor -> ER Pre-allocation).
- Medical fleet capabilities (Advanced Life Support, Basic Life Support, Neonatal Mobile NICU, Inter-Hospital Transfer).
- Emergency first-aid guidance protocols (Chest Pain, Stroke FAST protocol, Trauma bleeding).

### 2. Authentication System (`/login`, `/register`, `/forgot-password`)
- Role-based tabs (Patient, Driver, Hospital, Admin).
- **1-Click Demo Login credentials** pre-filled for effortless evaluation.
- Multi-role registration interfaces with role-specific validation:
  - **Patient**: Blood group, known allergies, chronic conditions, emergency contacts.
  - **Driver**: Paramedic license number, driving experience years, vehicle assignment.
  - **Hospital**: Hospital license ID, trauma center level (1-4), emergency hotline, total fleet size.
- 3-step password recovery workflow with simulated 6-digit OTP verification (`948216`).

### 3. Patient Dashboard (`/dashboard/patient`)
- Urgent SOS hero strip with single-touch dispatch.
- Browser GPS detection card with accuracy badge and manual refresh.
- Detailed Emergency Request Modal with real-time symptom triage assessment (Critical / High / Moderate).
- Nearby ambulance radar with ML estimated arrival times (e.g., 3-6 mins).
- Active emergency status tracker with live progress bar.
- Medical ID card (Blood group, allergies, conditions, emergency contacts).
- Emergency booking history (`/dashboard/patient/history`) and Medical Profile editor (`/dashboard/patient/profile`).

### 4. Ambulance Driver Dashboard (`/dashboard/driver`)
- Online / Offline shift toggle button with instant telemetry broadcast.
- Vehicle telemetry gauges: Fuel level (88%), Oxygen pressure (96%), Defibrillator & Ventilator status.
- Incoming emergency dispatch alert with 30-second countdown timer and accept/reject actions.
- Multi-step trip progression controls:
  `En Route to Patient` ➔ `Arrived at Scene` ➔ `Transporting Patient` ➔ `Arrived at Hospital` ➔ `Complete`.
- Turn-by-Turn Navigation Interface (`/dashboard/driver/navigate`) with next maneuver guidance, green corridor status, and patient vital signs.
- Trip history (`/dashboard/driver/trips`) and Driver Profile (`/dashboard/driver/profile`).

### 5. Hospital ER Desk Dashboard (`/dashboard/hospital`)
- Hospital emergency department status banner (Level 1 Trauma Center, Open).
- Real-time **Emergency Bed Sync** with interactive `+` / `-` counters for:
  - ICU Ventilator Beds
  - Trauma / Emergency Bays
  - Pediatric NICU Beds
  - General Inpatient Beds
- Incoming Emergency Admissions board with pre-arrival vitals telemetry and trauma bay reservation.
- Affiliated ambulance fleet management (`/dashboard/hospital/fleet`).
- Paramedic staff roster (`/dashboard/hospital/drivers`).
- Hospital admissions & triage analytics (`/dashboard/hospital/analytics`) with Recharts.

### 6. Admin Command Center (`/dashboard/admin`)
- Metropolitan KPI cards: Active emergencies, Fleet on duty, Avg dispatch time, ML accuracy.
- City-wide interactive Leaflet Fleet Map (`/dashboard/admin/map`) showing all ambulances, hospitals, and emergency hotspots.
- Live priority emergency monitoring feed.
- Citizen and staff user management table (`/dashboard/admin/users`) with role filtering and verification toggles.
- Institutional Hospital verification queue (`/dashboard/admin/hospitals`).
- Paramedic driver license verification queue (`/dashboard/admin/drivers`).
- Machine Learning Analytics dashboard (`/dashboard/admin/analytics`) with predicted vs. actual response times and feature importance weights.
- Security & dispatch audit trail (`/dashboard/admin/logs`) with JSON export.

### 7. Live Tracking Page (`/track` or `/track/:bookingId`)
- Fullscreen Leaflet map with custom animated markers for Patient (pulse), Ambulance (siren), and Hospital.
- Dynamic route polyline.
- Real-time ML ETA countdown and congestion factor.
- Route milestone timeline from SOS to hospital admission.
- Direct paramedic call button and shareable tracking URL.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Bundler / Tooling** | Vite 6.0 |
| **Styling** | Tailwind CSS + Custom Healthcare Color Tokens |
| **State Management** | Zustand (persistent state with LocalStorage fallback) |
| **Routing** | React Router v6 |
| **Forms & Validation** | React Hook Form + Zod |
| **Maps** | Leaflet + Custom DivIcons + Polyline Route Interpolation |
| **Data Visualization** | Recharts (Area, Bar, Pie charts) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios (configured with mock delay interceptor and JWT authorization header) |

---

## 📁 Project Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx             # Responsive header with 1-click role switcher
    │   │   ├── Footer.tsx             # Healthcare emergency hotline & disclaimers
    │   │   ├── Sidebar.tsx            # Role-specific collapsible navigation
    │   │   ├── Header.tsx             # Digital clock, role badge & notifications
    │   │   ├── EmergencySOSButton.tsx # High-impact pulsing red SOS button
    │   │   ├── StatCard.tsx           # Reusable metric card with sparkline trends
    │   │   ├── MLBadge.tsx            # AI prediction & confidence score pill
    │   │   ├── SimulationBanner.tsx   # Top banner indicating simulated telemetry
    │   │   └── NotificationToast.tsx  # Global floating alert toaster
    │   └── map/
    │       ├── LiveTrackingMap.tsx    # Leaflet map with live vehicle movement
    │       └── FleetOverviewMap.tsx   # City-wide multi-vehicle & hospital map
    ├── layouts/
    │   ├── PublicLayout.tsx           # Layout for Landing, Auth & Public Tracking
    │   └── DashboardLayout.tsx        # Shared sidebar layout for dashboards
    ├── pages/
    │   ├── LandingPage.tsx            # Complete healthcare landing portal
    │   ├── auth/
    │   │   ├── LoginPage.tsx          # Multi-role login with demo prefill
    │   │   ├── RegisterPage.tsx       # Dynamic multi-role registration
    │   │   └── ForgotPasswordPage.tsx # 3-step OTP password reset
    │   └── tracking/
    │       └── LiveTrackingPage.tsx   # Dedicated telemetry tracking view
    ├── dashboards/
    │   ├── patient/
    │   │   ├── PatientDashboard.tsx   # SOS, nearby ambulances & quick health
    │   │   ├── EmergencyRequestModal.tsx # Symptom triage & unit selection
    │   │   ├── BookingHistory.tsx     # Past dispatches & report downloads
    │   │   └── PatientProfile.tsx     # Medical ID & emergency contacts
    │   ├── driver/
    │   │   ├── DriverDashboard.tsx    # Online toggle, pre-flight check & requests
    │   │   ├── DriverNavigation.tsx   # Turn-by-turn guidance HUD
    │   │   ├── TripHistory.tsx        # Completed runs & response times
    │   │   └── DriverProfile.tsx      # License & vehicle specifications
    │   ├── hospital/
    │   │   ├── HospitalDashboard.tsx  # Bed availability counters & intake board
    │   │   ├── FleetManagement.tsx    # Hospital ambulance fleet controls
    │   │   ├── DriverManagement.tsx   # Paramedic staff roster
    │   │   ├── BedAvailability.tsx    # Dedicated bed manager & surge mode
    │   │   └── HospitalAnalytics.tsx  # Recharts emergency admission curves
    │   └── admin/
    │       ├── AdminDashboard.tsx     # Metropolitan command & fleet map
    │       ├── UserManagement.tsx     # User table with search & verify toggles
    │       ├── HospitalVerification.tsx # Institution approval queue
    │       ├── DriverVerification.tsx   # Paramedic license review queue
    │       ├── AdminAnalytics.tsx     # Recharts ML performance charts
    │       └── AuditLogs.tsx          # Security & dispatch audit trail
    ├── services/
    │   ├── apiClient.ts               # Central Axios client with JWT & delay
    │   ├── authService.ts             # Auth APIs & mock user sessions
    │   ├── emergencyService.ts        # SOS, booking & status update services
    │   ├── ambulanceService.ts        # Fleet & proximity calculations
    │   ├── hospitalService.ts         # Bed management & admission APIs
    │   └── mlPredictionService.ts     # ML dispatch scoring & symptom triage
    ├── hooks/
    │   ├── useGeolocation.ts          # Browser GPS with accuracy & fallback
    │   └── useLiveSimulation.ts       # Real-time ambulance movement simulation
    ├── store/
    │   ├── useAuthStore.ts            # User auth, roles & instant persona switch
    │   ├── useEmergencyStore.ts       # Active request, nearby units & tracking
    │   └── useNotificationStore.ts    # Global notifications & emergency alerts
    ├── types/
    │   └── index.ts                   # Central TypeScript interfaces & enums
    ├── data/
    │   └── mockData.ts                # Realistic ambulances, hospitals & logs
    ├── App.tsx                        # React Router routing configuration
    ├── main.tsx                       # React DOM entry point
    └── index.css                      # Tailwind & custom animation styles
```

---

## 💻 Installation & Startup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm** or **yarn**

### 1. Navigate to the project directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The application will start on:
```
http://localhost:3000
```

### 4. Build for production
```bash
npm run build
```
Creates an optimized, code-split production bundle inside `frontend/dist/`.

### 5. Preview production build
```bash
npm run preview
```

---

## 🧪 Demo Credentials & Instant Testing

Every role can be tested instantly without creating a new account:

| Role | Email | Password | Quick Switch Feature |
|---|---|---|---|
| **Patient** | `patient@demo.com` | `password123` | Click **"Patient View"** in Navbar or Sidebar |
| **Ambulance Driver** | `driver@demo.com` | `password123` | Click **"Driver View"** in Navbar or Sidebar |
| **Hospital ER Desk** | `hospital@demo.com` | `password123` | Click **"Hospital ER"** in Navbar or Sidebar |
| **Command Admin** | `admin@demo.com` | `password123` | Click **"Admin Command"** in Navbar or Sidebar |

---

## 🔮 Future Backend & Machine Learning Integration

The frontend architecture is explicitly structured to connect to a production backend:

- **Centralized API Client (`src/services/apiClient.ts`)**: Reads `VITE_API_BASE_URL`. Simply set:
  ```env
  VITE_API_BASE_URL=https://api.yourdomain.com/v1
  ```
- **FastAPI Ready**: All request and response structures in `src/types/index.ts` map 1:1 to Pydantic schemas.
- **PostGIS & Redis Telemetry**: Coordinates, spatial bounding boxes, and route coordinates follow GeoJSON and coordinate tuples `[lat, lng]` ready for PostGIS spatial queries (`ST_DWithin`, `ST_MakePoint`).
- **ML Services**: The `mlPredictionService.ts` interfaces with ETA regression models, automated symptom NLP triage, and traffic congestion scoring.

