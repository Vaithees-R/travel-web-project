# VoyageHub — Resume Project Descriptions

Use these factual, impact-driven bullet points for resumes, LinkedIn project sections, and portfolio writeups.

---

## One-Line Description

A full-stack multi-modal travel platform built with React, FastAPI, and PostgreSQL, supporting unified search, filtering, simulated payments, and itinerary lifecycle management across Flights, Trains, Buses, and Cabs.

---

## Resume Bullet Points (Select 3–5)

- **Full-Stack Architecture & High-Performance API**: Engineered a decoupled multi-modal travel booking web platform utilizing React 18, TypeScript, and Vite on the frontend, interfaced with an asynchronous FastAPI backend and PostgreSQL persistence layer, delivering sub-25ms API response times.
- **Data Modeling & PostgreSQL Optimization**: Designed normalized relational database schemas with foreign-key cascades, composite B-tree indexing (`ix_bookings_user_id_created_at`), and parameterized SQLAlchemy ORM queries, eliminating SQL injection and optimizing user itinerary retrievals.
- **Robust Security & Authorization Hardening**: Implemented stateless JWT authentication with bcrypt password hashing, defense-in-depth HTTP security headers (`nosniff`, `DENY`), Pydantic v2 schema constraints, and strict server-side authorization eliminating Insecure Direct Object Reference (IDOR) vulnerabilities.
- **Faceted Multi-Modal Search Engine**: Built a client-side search and filtering engine across four transit modes (Flights, Trains, Buses, Cabs), integrating custom Indian transit station autocomplete, dynamic multi-criteria filters (price, stops, duration, class), and real-time fare computation.
- **Payment & Booking State Integrity**: Implemented an end-to-end checkout funnel with simulated multi-channel payments (Cards, UPI, Net Banking), enforcing server-side payment status validation to prevent phantom booking creations and ensure idempotency.
- **Rigorous Automated Testing & Zero-Regression QA**: Authored and maintained a 151-test automated suite (120 Vitest frontend tests + 31 Pytest backend integration tests) achieving 100% test pass rate across authentication, booking lifecycles, and security boundaries.
- **Accessible & Motion-Enhanced UI**: Developed a WCAG 2.1 AA compliant design system with Tailwind CSS and Framer Motion, featuring a custom Dynamic Island floating pill navigation with physics-inspired easing curves and full keyboard navigation.
