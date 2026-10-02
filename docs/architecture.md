# VoyageHub Architecture Documentation

This document outlines the system architecture, component design, data flow, security model, and database schema for **VoyageHub**, a multi-modal travel booking platform for Flights, Trains, Buses, and Cabs.

---

## 1. High-Level System Architecture

VoyageHub employs a decoupled, client-server architecture consisting of a single-page application (SPA) frontend, an asynchronous REST API backend, and a relational PostgreSQL database.

```mermaid
flowchart TD
    subgraph Client ["Frontend Layer (Browser)"]
        UI["React 18 + Vite SPA"]
        Router["React Router v6"]
        AuthContext["Auth Context + Token Storage"]
        SearchEngine["Travel Search & Filter Engine"]
        PaymentMock["Simulated Payment Service"]
    end

    subgraph Edge ["Network & Security Boundary"]
        SecHeaders["Security Headers Middleware"]
        CORS["CORS Policy Enforcement"]
    end

    subgraph Backend ["Backend Layer (FastAPI)"]
        API["FastAPI REST API (ASGI)"]
        AuthRouter["/api/auth (Register, Login)"]
        UsersRouter["/api/users (Profile, Preferences)"]
        BookingsRouter["/api/bookings (Create, List, Cancel)"]
        AuthDep["get_current_user (JWT Validation)"]
    end

    subgraph Persistence ["Persistence Layer"]
        ORM["SQLAlchemy 2.0 ORM"]
        Postgres[("PostgreSQL Database")]
    end

    UI --> Router
    Router --> AuthContext
    UI --> SearchEngine
    UI --> PaymentMock
    UI -->|"HTTP / REST (JSON + Bearer Token)"| SecHeaders
    SecHeaders --> CORS
    CORS --> API
    API --> AuthRouter
    API --> UsersRouter
    API --> BookingsRouter
    UsersRouter --> AuthDep
    BookingsRouter --> AuthDep
    AuthRouter --> ORM
    UsersRouter --> ORM
    BookingsRouter --> ORM
    ORM --> Postgres
```

---

## 2. Frontend Architecture

The frontend is built with React 18, TypeScript, and Vite, styled with Tailwind CSS, and augmented with Lucide React icons and Framer Motion for micro-interactions.

### Key Architectural Components

1. **Routing & Layout (`src/routes/index.tsx`, `src/layouts/RootLayout.tsx`)**:
   - Centralized declarative routes with nested layouts.
   - Dedicated landing pages for `/flights`, `/trains`, `/buses`, and `/cabs`.
   - Unified multi-step booking funnel: `/:service/results` -> `/:service/passengers` -> `/:service/review` -> `/:service/checkout` -> `/:service/confirmation/:bookingId`.
   - Protected route guards (`ProtectedRoute.tsx`) intercepting unauthenticated access to `/bookings` (My Trips), `/bookings/:bookingId`, and `/profile`.

2. **Navigation & Dynamic Island (`src/components/navigation/DynamicIslandNav.tsx`)**:
   - Floating pill navigation pinned to the top viewport center.
   - Default collapsed footprint (~225px) expanding to full navigation width (~747px) upon user interaction.
   - Smooth cubic-bezier timing curve (`cubic-bezier(0.16, 1, 0.3, 1)`): ~650ms expansion, ~600ms collapse, with a 380ms pointer-leave safety buffer.
   - Preserves route navigation state, active tab highlighting, and authentication status.

3. **Authentication Context (`src/context/AuthContext.tsx`)**:
   - Global React context providing `user`, `isAuthenticated`, `login`, `register`, and `logout`.
   - Synchronized with `tokenStorage` in `src/services/api.ts`.
   - Implements resilient token storage with browser `localStorage` and an in-memory fallback for restricted/private browsing modes.

4. **Travel Search & Filtering (`src/services/travel/`)**:
   - Multi-modal local inventory covering key Indian transit routes (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, etc.).
   - Fast multi-criteria filter engine (`filterEngine.ts`): price range, duration, stops, departure time slots, operators/airlines, and vehicle classes.
   - Sorting engine (`sortEngine.ts`): price (low/high), duration, departure time, rating.

5. **Location Selector (`src/components/search/LocationSelector.tsx`)**:
   - Context-aware searchable travel selector for airports, railway stations, bus terminals, and city hubs.
   - Full keyboard accessibility (Arrow keys, Enter, Escape) and ARIA attributes (`role="combobox"`, `aria-expanded`).

---

## 3. Backend Architecture

The backend is built with FastAPI, running under Uvicorn as an asynchronous ASGI application.

### Key Architectural Components

1. **Security Headers Middleware (`backend/main.py`)**:
   - Injects defense-in-depth security response headers on all requests:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `X-XSS-Protection: 1; mode=block`
     - `Referrer-Policy: strict-origin-when-cross-origin`

2. **Authentication & Token Handling (`backend/dependencies/auth.py`, `backend/services/auth_service.py`)**:
   - Passwords securely hashed with `bcrypt`.
   - Signed JSON Web Tokens (JWT) using `HS256` containing `sub` (user_id), `email`, and expiration claims.
   - FastAPI `Depends(get_current_user)` extracts and verifies token from the `Authorization: Bearer <token>` header.

3. **Domain Routers (`backend/routers/`)**:
   - `auth.py`: Registration, login, credential verification, JWT issuance.
   - `users.py`: Personal profile retrieval (`/me`), preference updates (`/me/preferences`), password change, account deletion.
   - `bookings.py`: Booking creation (`POST /bookings`), user bookings listing (`GET /bookings`), booking details (`GET /bookings/{id}`), booking cancellation (`PATCH /bookings/{id}/cancel`).

4. **Pydantic Validation Layer (`backend/schemas/`)**:
   - Strict typing using Pydantic v2.
   - `BookingCreate` enforces transport mode `Literal["flight", "train", "bus", "cab"]`, payment method `Literal["card", "upi", "net_banking"]`, payment status `Literal["paid", "pending", "failed"]`, and passenger limits (`1` to `50`).
   - Normalizes email inputs to lowercase and trims whitespace on passenger names.

---

## 4. Authentication & Authorization Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Traveler as Traveler
    participant Client as React Client (SPA)
    participant AuthRouter as FastAPI /api/auth
    participant UsersRouter as FastAPI /api/users
    participant DB as PostgreSQL

    Note over Traveler,Client: Registration / Login
    Traveler->>Client: Enters email and password
    Client->>AuthRouter: POST /api/auth/login { email, password }
    AuthRouter->>DB: Query user by normalized email
    DB-->>AuthRouter: Return user record with password_hash
    AuthRouter->>AuthRouter: bcrypt.verify(password, password_hash)
    AuthRouter->>AuthRouter: Generate JWT (HS256, sub=user_id, exp=24h)
    AuthRouter-->>Client: HTTP 200 { access_token, user }
    Client->>Client: Store token in tokenStorage (localStorage + memory)

    Note over Traveler,Client: Authenticated Requests
    Traveler->>Client: Navigates to Profile / My Trips
    Client->>UsersRouter: GET /api/users/me (Header: Authorization: Bearer <token>)
    UsersRouter->>UsersRouter: Decode & validate JWT claims
    UsersRouter->>DB: Query user by token sub (user_id)
    DB-->>UsersRouter: User profile record
    UsersRouter-->>Client: HTTP 200 { id, email, full_name, preferences }
```

---

## 5. Travel Booking & Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Traveler as Traveler
    participant UI as Travel UI / Checkout
    participant PayMock as Simulated Payment Service
    participant API as FastAPI /api/bookings
    participant DB as PostgreSQL

    Traveler->>UI: Selects itinerary & enters passenger details
    Traveler->>UI: Chooses payment method (Card / UPI / Net Banking)
    Traveler->>UI: Clicks "Complete Booking & Pay"
    UI->>PayMock: Process simulated transaction (Method, Details, Amount)
    
    alt Payment Succeeds
        PayMock-->>UI: Return transactionRef, status="paid"
        UI->>API: POST /api/bookings { service, travelOption, primaryPassenger, fareBreakdown, paymentStatus="paid" }
        Note over API: Extracts user_id strictly from JWT claims
        API->>API: Server-side validation: paymentStatus == "paid"
        API->>DB: INSERT into bookings (user_id, booking_ref, status="upcoming", ...)
        DB-->>API: Persisted booking record
        API-->>UI: HTTP 201 Created { id: "VH-2026-...", status: "upcoming", bookingRef: "PNR ..." }
        UI->>Traveler: Displays Confirmation Page with Booking Reference
    else Payment Fails (Designated test failure preset)
        PayMock-->>UI: Return error, status="failed"
        UI->>Traveler: Displays explicit payment failure alert (Zero booking created)
    end
```

---

## 6. Database Schema & Data Integrity

The persistence tier runs on PostgreSQL managed by SQLAlchemy ORM.

```mermaid
erDiagram
    users ||--o{ bookings : "owns"
    
    users {
        varchar id PK "usr_xxxxxxxxxxxx"
        varchar email UK "Unique, lowercased"
        varchar full_name "Legal traveler name"
        varchar phone "Contact phone number"
        varchar password_hash "Bcrypt hashed password"
        varchar role "traveler"
        jsonb preferences "Personal travel preferences"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Account update timestamp"
    }

    bookings {
        varchar id PK "VH-2026-xxxxx"
        varchar user_id FK "References users.id ON DELETE CASCADE"
        varchar booking_ref "PNR or booking reference"
        varchar service "flight, train, bus, cab"
        varchar status "upcoming, completed, cancelled"
        varchar origin "Departure city/station/code"
        varchar destination "Arrival city/station/code"
        varchar departure_time "Departure time string"
        varchar arrival_time "Arrival time string"
        varchar travel_date "Scheduled travel date"
        integer passengers_count "Number of travelers (1-50)"
        numeric total_amount "Total cost charged"
        varchar payment_status "paid, pending, failed"
        varchar payment_method "card, upi, net_banking"
        varchar payment_reference "Transaction identifier"
        jsonb booking_details "Full snapshot of option, fare & passengers"
        timestamp created_at "Booking creation timestamp"
        timestamp updated_at "Booking update timestamp"
    }
```

### Database Optimization & Indexing
- `users`: Unique index on `email`, primary key on `id`.
- `bookings`:
  - Primary key on `id`.
  - Index on `user_id` (foreign key).
  - Index on `service`.
  - Composite index `ix_bookings_user_id_created_at` on `(user_id, created_at DESC)` for efficient retrieval of user trip history.

---

## 7. Multi-User Isolation & Security Boundaries

1. **Insecure Direct Object Reference (IDOR) Elimination**:
   - `GET /api/bookings/{id}`, `PATCH /api/bookings/{id}/cancel`, and `DELETE /api/bookings/{id}` strictly evaluate:
     ```sql
     SELECT * FROM bookings WHERE id = :booking_id AND user_id = :current_user_id
     ```
   - Attempting to access, cancel, or delete another user's booking record returns `HTTP 404 Not Found`.

2. **SQL Injection Prevention**:
   - 100% of database interactions utilize SQLAlchemy ORM parameterized queries. Zero raw dynamic string interpolation is performed.

3. **Cross-Site Scripting (XSS) Prevention**:
   - React's JSX automatically escapes all dynamic content. Zero instances of `dangerouslySetInnerHTML` exist in the frontend.

4. **Cross-Site Request Forgery (CSRF) Mitigation**:
   - Authentication tokens are transmitted exclusively via the standard `Authorization: Bearer <token>` header, not ambient browser cookies. Browsers do not automatically attach custom Authorization headers across origins, mitigating browser CSRF vectors.

5. **Server-Side Payment Integrity**:
   - The backend validates all payloads before committing to PostgreSQL. Any attempt to forge a confirmed booking with `paymentStatus: "failed"` is rejected with `HTTP 400 Bad Request`.
