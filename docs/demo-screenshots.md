# VoyageHub — Portfolio Demo & Screenshot Guide

This guide details the recommended screenshots, key visual elements, and demonstration walkthroughs to highlight VoyageHub in developer portfolios, GitHub showcases, and case studies.

---

## Recommended Portfolio Screen Captures

### 1. Hero Landing Page & Dynamic Island
- **Route**: `http://localhost:3000/`
- **Focus Elements**:
  - Center floating Dynamic Island pill in both collapsed (`~225px`) and expanded (`~747px`) states.
  - Multi-modal travel search tabs (Flights, Trains, Buses, Cabs).
  - Indian Travel Location Selectors with origin and destination station dropdowns.
  - Modern typography, responsive container styling, and subtle ambient gradients.
- **Portfolio Caption**: *"Modern multi-modal travel platform featuring an interactive Dynamic Island navigation and unified travel search across India's primary transit corridors."*

---

### 2. Multi-Modal Search Results & Filtering
- **Route**: `http://localhost:3000/flights/results`
- **Focus Elements**:
  - Interactive Filter Panel: Price sliders, departure time buckets, stops, and airline filters.
  - Sorting Bar: Quick sort by Best Value, Cheapest, Fastest, and Earliest Departure.
  - Result Itinerary Cards: Airline logos, duration bar with stop indicator, and transparent price tags.
- **Portfolio Caption**: *"Faceted search interface offering instant client-side filtering, sorting, and itinerary breakdown for complex travel routes."*

---

### 3. Indian Rail Journey & Station Timelines
- **Route**: `http://localhost:3000/trains/results`
- **Focus Elements**:
  - Train Journey Timeline: Intermediate stoppage points, station codes (e.g., NDLS, CNB, PRYJ, HWH), and arrival/departure intervals.
  - Coach Class Selection: Vande Bharat Executive Chair Car (EC), AC Chair Car (CC), 3A, 2A, and 1A fare badges.
- **Portfolio Caption**: *"IRCTC-inspired railway booking experience displaying detailed intermediate station stops, coach class availability, and instant fare recalculation."*

---

### 4. Passenger Details & Seat Selection
- **Route**: `http://localhost:3000/flights/passengers` (or `/trains/passengers`, `/buses/passengers`)
- **Focus Elements**:
  - Multi-passenger form input with client-side validation.
  - Real-time seat/berth selection badge (e.g., "Seat 12A - Window" or "Berth Lower 24").
  - Contact information inputs with phone country code formatting.
- **Portfolio Caption**: *"Validated multi-passenger booking configuration with real-time seat assignment and preference capture."*

---

### 5. Multi-Step Checkout & Fare Breakdown
- **Route**: `http://localhost:3000/checkout`
- **Focus Elements**:
  - Detailed Fare Summary breakdown (Base fare, Taxes & GST, convenience fee, total).
  - Multi-tab Payment Methods: Credit/Debit Card, UPI (VPA address), and Net Banking.
  - Security badges (256-bit encryption indicator, PCI-DSS simulated compliance badge).
- **Portfolio Caption**: *"Enterprise-grade checkout funnel with transparent fare auditing and simulated multi-channel payment processing."*

---

### 6. Booking Confirmation & Digital Boarding Pass
- **Route**: `http://localhost:3000/flights/confirmation/VH-2026-xxxxx`
- **Focus Elements**:
  - Prominent PNR Booking Reference (e.g., `PNR HBIWI`).
  - Journey summary card with departure time, terminal, seat number, and passenger manifest.
  - Download ticket action and "View in My Trips" navigation link.
- **Portfolio Caption**: *"Instant booking confirmation issuing unique digital travel references and structured journey itineraries."*

---

### 7. My Trips & Booking Management
- **Route**: `http://localhost:3000/bookings`
- **Focus Elements**:
  - Tabbed itinerary management: Upcoming, Completed, and Cancelled trips.
  - Mode-specific journey cards with live status badges.
  - One-click cancellation workflow with modal confirmation.
- **Portfolio Caption**: *"Personalized travel hub with strict user isolation, status lifecycle tracking, and authenticated cancellation workflows."*

---

### 8. Traveler Profile & Security Center
- **Route**: `http://localhost:3000/profile`
- **Focus Elements**:
  - Personal traveler details with avatar placeholder and joined date.
  - Travel Preferences: Preferred cabin class, seat preference (Window/Aisle), and meal preference.
  - Security Center: Change password form and account deletion controls.
- **Portfolio Caption**: *"Full traveler account administration center featuring customizable travel preferences and PostgreSQL-backed session controls."*

---

## Capture Tips for Portfolio Presentation

1. **Resolution**: Capture at standard 1920x1080 (1080p) or 2560x1440 (1440p) desktop resolution.
2. **Browser Window**: Use Chrome or Firefox with clean developer profile (no third-party extensions or browser toolbars).
3. **Responsive Preview**: Include at least one mobile responsive capture (390x844 or 412x915) demonstrating mobile hamburger navigation and touch-friendly booking cards.
4. **GIF / Video Demonstrations**:
   - Capture a short 5-second GIF of the **Dynamic Island** expanding on hover/proximity and collapsing back into a compact pill.
   - Capture a 15-second walkthrough of the **India Travel Location Selector** searching by station code or city name.
