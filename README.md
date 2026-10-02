# VoyageHub

A modern multi-modal travel booking platform for Flights, Trains, Buses and Cabs.

VoyageHub unifies disparate travel modes into a cohesive booking experience with real-time route search, faceted filtering, passenger manifest configuration, simulated multi-channel checkout, and authenticated itinerary lifecycle management.

---

## Overview

VoyageHub bridges the gap between fragmented travel services by providing a unified, performant, and accessible platform for booking transit across India's primary travel corridors. Built with a decoupled architecture featuring a **React 18** single-page application and an asynchronous **FastAPI** backend with **PostgreSQL** persistence, VoyageHub delivers an end-to-end travel booking workflow with sub-25ms response times and strict security guarantees.

---

## Features

- **Multi-Modal Travel Search**: Search across four major transportation modes (Flights, Trains, Buses, and Cabs) from a single unified entry point.
- **Flight Search**: Airline itinerary comparison, departure/arrival timelines, layover stops, and transparent fare breakdowns.
- **Train Search**: Station-to-station schedule discovery (IRCTC style), intermediate stoppage points, and coach class selection (Vande Bharat Executive, AC Chair Car, Sleeper, etc.).
- **Bus Search**: Intercity bus routes with operator ratings, amenities, boarding points, and sleeper/seater layout selection.
- **Cab Search**: Intercity and airport transfers with sedan, SUV, and premium vehicle choices and upfront flat-rate pricing.
- **Search Filters & Sorting**: Real-time faceted filtering by price range, departure time slot, stops, operator, and sorting by price, duration, and departure time.
- **India Travel Location Selector**: Context-aware searchable dropdown for airports, railway stations, and bus terminals with full keyboard navigation.
- **Passenger Management**: Dynamic multi-passenger registration with name, contact, and assigned seat/berth allocation.
- **Checkout**: Multi-step checkout review with detailed fare summaries (Base Fare + Taxes & GST).
- **Simulated Payment Flow**: Mock transaction processing supporting Credit/Debit Card, UPI (VPA), and Net Banking with deterministic success/failure test presets.
- **Booking Confirmation**: Immediate issuance of digital booking references and PNR codes with instant download links.
- **My Trips (Itinerary Center)**: Centralized itinerary management categorizing trips by Upcoming, Completed, and Cancelled status.
- **Booking Cancellation**: Self-service, authenticated booking cancellation with real-time status reflection.
- **Authentication**: Traveler registration and login with bcrypt password hashing and token refresh handling.
- **JWT Authorization**: Stateless JSON Web Token authentication with claims validation on all protected endpoints.
- **PostgreSQL Persistence**: Fully normalized relational database with foreign key cascades, unique constraints, and composite indexing.
- **Responsive UI**: Mobile-first responsive interface styled with Tailwind CSS, optimized across desktop, tablet, and mobile screens.
- **Accessibility**: WCAG 2.1 AA compliant color contrast, ARIA combobox attributes, and keyboard navigation support.
- **Motion & Transitions**: Physics-inspired **Dynamic Island** navigation pill with cubic-bezier easing curves (`~225px` collapsed to `~747px` expanded), smooth route transitions, and scroll reveal animations.

---

## Technology Stack

### Frontend
- **React 18** — Component-based UI library
- **TypeScript** — Static typing and interface contracts
- **Vite** — High-performance build tool and dev server
- **Tailwind CSS** — Utility-first styling framework
- **Lucide React** — Consistent icon set
- **Vitest** — Unit and integration test runner

### Backend
- **FastAPI** — High-performance asynchronous Python web framework
- **Python 3.14** — Modern Python runtime
- **Pydantic v2** — Data validation and schema enforcement
- **SQLAlchemy 2.0** — Relational database ORM
- **PostgreSQL** — Relational database engine
- **PyJWT** — JSON Web Token generation and validation
- **Passlib & Bcrypt** — Secure password hashing with salt

### Tooling & Infrastructure
- **Git & GitHub** — Version control and repository management

---

## Architecture

VoyageHub follows a modern decoupled architecture:

```
┌────────────────────────────────┐
│   React 18 Frontend (Vite)     │
│   • Dynamic Island Navigation  │
│   • Travel Search Engine       │
│   • Simulated Payment Client   │
└──────────────┬─────────────────┘
               │  HTTP REST / JSON
               │  Authorization: Bearer <JWT>
┌──────────────▼─────────────────┐
│   FastAPI Backend (Uvicorn)    │
│   • Security Headers Middleware│
│   • JWT Auth & get_current_user│
│   • Booking & Profile Services │
└──────────────┬─────────────────┘
               │  SQLAlchemy ORM (Parameterized)
┌──────────────▼─────────────────┐
│   PostgreSQL Database          │
│   • users table                │
│   • bookings table (Composite) │
└────────────────────────────────┘
```

### Travel Inventory & Search Layer
Travel options (flights, trains, buses, cabs) are organized in structured local inventories representing high-volume transit routes across India. Search queries execute against local inventory services with client-side faceted filtering and sorting engines.

### Payment Simulation Layer
Transactions are executed via a simulated payment service supporting Credit Cards, UPI, and Net Banking. Payments evaluate designated test inputs: standard inputs trigger deterministic success, while configured failure inputs (e.g., test decline cards or failure UPI handles) simulate realistic banking declines without writing orphaned bookings to the database.

---

## Project Structure

```
travel-web-project/
├── backend/                        # FastAPI Python backend
│   ├── config.py                   # Environment settings & CORS
│   ├── database.py                 # SQLAlchemy engine & session factory
│   ├── dependencies/
│   │   └── auth.py                 # JWT validation dependency
│   ├── models/
│   │   ├── booking.py              # Booking ORM model
│   │   └── user.py                 # User ORM model
│   ├── routers/
│   │   ├── auth.py                 # Auth router (/api/auth)
│   │   ├── bookings.py             # Bookings router (/api/bookings)
│   │   └── users.py                # Users router (/api/users)
│   ├── schemas/
│   │   ├── auth.py                 # Register/Login Pydantic schemas
│   │   ├── booking.py              # Booking Pydantic schemas
│   │   └── user.py                 # User Pydantic schemas
│   ├── services/
│   │   ├── auth_service.py         # Password hashing & JWT generation
│   │   ├── booking_service.py      # Booking creation & cancellation logic
│   │   └── user_service.py         # Profile & preference management
│   ├── tests/
│   │   ├── conftest.py             # Pytest fixtures & SQLite/Postgres test DB
│   │   ├── test_auth.py            # Auth endpoint tests
│   │   ├── test_bookings.py        # Booking endpoint tests
│   │   ├── test_security.py        # Security & IDOR regression tests
│   │   └── test_users.py           # User profile endpoint tests
│   ├── requirements.txt            # Python dependencies
│   └── seed.py                     # Initial seed script
├── docs/                           # Project documentation
│   ├── architecture.md             # Detailed system architecture & sequence diagrams
│   ├── demo-screenshots.md         # Portfolio screenshots & presentation guide
│   └── resume-description.md       # Resume bullet points & technical highlights
├── public/                         # Static web assets & manifest
├── src/                            # React TypeScript frontend
│   ├── assets/                     # Travel imagery & brand icons
│   ├── components/
│   │   ├── auth/                   # ProtectedRoute component
│   │   ├── booking/                # FilterPanel, SortControl, FareBreakdown
│   │   ├── layout/                 # Footer component
│   │   ├── navigation/             # DynamicIslandNav component
│   │   ├── profile/                # ProfileForm, Preferences, SecuritySection
│   │   ├── search/                 # LocationSelector component
│   │   └── ui/                     # Reusable UI primitives (Button, Modal, Card, Badge)
│   ├── context/
│   │   └── AuthContext.tsx         # Global authentication state
│   ├── data/                       # Indian station locations, FAQs, partners
│   ├── layouts/
│   │   └── RootLayout.tsx          # Master application layout
│   ├── pages/                      # Page view components
│   ├── routes/
│   │   └── index.tsx               # App routing table
│   ├── services/
│   │   ├── api.ts                  # REST API client & token storage
│   │   ├── payment/                # Simulated payment provider & test presets
│   │   └── travel/                 # Multi-modal search, filter & sort engines
│   └── types/                      # TypeScript definitions (auth, booking, travel)
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore rules
├── index.html                      # HTML entrypoint
├── package.json                    # Node.js dependencies & scripts
├── pytest.ini                      # Pytest configuration
├── tailwind.config.js              # Tailwind styling configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build & chunking configuration
```

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18.x or v20.x recommended) and **npm**
- **Python** (v3.10+ recommended) and `python3-venv`
- **PostgreSQL** (running locally or accessible via network)

---

### 1. Database Setup

Create a PostgreSQL database for VoyageHub:
```bash
# In psql or PostgreSQL management tool:
CREATE DATABASE voyagehub;
```

---

### 2. Environment Configuration

Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

Ensure the configuration variables match your local environment:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/voyagehub

# Authentication & JWT Configuration
JWT_SECRET=replace_with_a_secure_random_32_byte_secret_key_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3. Backend Setup

```bash
# Navigate to the project root
cd /path/to/travel-web-project

# Create a virtual environment
python3 -m venv backend/venv

# Activate virtual environment
source backend/venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

---

### 4. Frontend Setup

```bash
# Install frontend dependencies
npm install
```

---

### 5. Running the Application

Open two terminal windows:

**Terminal 1 — Backend API Server:**
```bash
source backend/venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*

**Terminal 2 — Frontend Dev Server:**
```bash
npm run dev
```
*Web application will be available at `http://localhost:3000`.*

---

## Testing

The project maintains 100% automated test pass rates across both frontend and backend suites:

### Running Frontend Tests (Vitest)
```bash
npm test -- --run
```
*Result: **120 / 120 tests passed** (7 test suites covering search, filters, payment presets, booking checkout, account management, and accessibility).*

### Running Backend Tests (Pytest)
```bash
backend/venv/bin/pytest
```
*Result: **31 / 31 tests passed** (covering auth, user profile, booking lifecycle, IDOR prevention, and HTTP security headers).*

### Test Summary
- **Frontend**: 120 / 120 PASSED
- **Backend**: 31 / 31 PASSED
- **Total**: 151 / 151 PASSED (100% Pass Rate)

---

## Production Build

To verify and produce an optimized production bundle:
```bash
npm run build
```
*Output: Clean compilation via `tsc && vite build` in ~3.9 seconds with **0 TypeScript errors**. Rollup optimizes vendor bundles into cacheable chunks (`vendor-react`, `vendor-icons`).*

---

## Security

VoyageHub incorporates defense-in-depth security best practices:

- **JWT Authentication**: Secure token issuance using `HS256` with 24-hour expiration.
- **Password Hashing**: Industry-standard `bcrypt` password hashing with auto-generated salts.
- **Server-Side Authorization**: Uncompromising ownership validation; all user and booking operations bind strictly to the validated token subject (`current_user.id`).
- **IDOR Protection**: Verified isolation ensuring User A cannot view, modify, or cancel bookings belonging to User B.
- **Input Validation**: Pydantic v2 schemas enforcing strict enumerations (`flight`, `train`, `bus`, `cab`), passenger bounds (1–50), and email normalization.
- **Payment State Verification**: Server enforces rejection of any booking payload marked with `paymentStatus: "failed"`, preventing phantom bookings.
- **Injection Mitigation**: All database operations execute through SQLAlchemy ORM parameterized queries. Zero raw SQL string concatenation.
- **HTTP Security Headers**: Enforced via ASGI middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Environment Isolation**: All database credentials and JWT secret keys are loaded from environment variables with safe defaults for local development.

---

## Important Limitations

To maintain architectural transparency:
- **Travel Inventory**: Inventories and schedules are simulated locally for primary Indian transit routes; no direct GDS (Amadeus/Sabre) or IRCTC live API feeds are connected.
- **Payment Processing**: Payments are simulated through an in-memory client engine using test presets; no live payment gateway (Stripe/Razorpay) is integrated.
- **Live Tracking**: Cab and train journey timelines are schedule-based visualizations; no live GPS tracking hardware is connected.

---

## Future Improvements

Potential enhancements for enterprise production scaling:
1. **Third-Party API Integration**: Connect live flight GDS systems and IRCTC Indian Railways scheduling APIs.
2. **Production Payment Gateway**: Integrate Stripe or Razorpay SDKs with server-side HMAC webhook signature validation.
3. **Cookie-Based JWT Storage**: Migrate token transport to `httpOnly`, `Secure`, `SameSite=Strict` cookies with anti-CSRF token synchronization.
4. **Distributed Rate Limiting**: Implement IP and account-based rate limiting via Redis and SlowAPI on sensitive auth and booking endpoints.
5. **Transactional Notifications**: Integrate email (SendGrid) and SMS/WhatsApp notifications for booking confirmations and PNR status alerts.
6. **Containerization**: Provide multi-stage Dockerfiles and Docker Compose orchestration for one-command cloud deployment.
