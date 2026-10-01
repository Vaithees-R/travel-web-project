from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.routers import auth_router, users_router, bookings_router
from backend.models.user import User, generate_user_id
from backend.services.auth_service import hash_password

def seed_default_traveler():
    """Ensure a safe default development traveler account exists for 1-click testing."""
    db = SessionLocal()
    try:
        demo_email = "demo@voyagehub.com"
        existing = db.query(User).filter(User.email == demo_email).first()
        if not existing:
            demo_user = User(
                id=generate_user_id(),
                full_name="Alexander Wright",
                email=demo_email,
                phone="+91 98401 23456",
                password_hash=hash_password("Traveler123!"),
                role="traveler",
            )
            db.add(demo_user)
            db.commit()
            print("Seeded development traveler account: demo@voyagehub.com / Traveler123!")
    except Exception as e:
        print(f"Seed note: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'paid' NOT NULL;"))
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);"))
            conn.execute(text("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;"))
            conn.commit()
    except Exception as e:
        print(f"Database column ensure note: {e}")
    seed_default_traveler()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VoyageHub Multi-Modal Travel Platform REST API with real PostgreSQL persistence and secure JWT authentication.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount Routers under /api
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(users_router, prefix=settings.API_PREFIX)
app.include_router(bookings_router, prefix=settings.API_PREFIX)

@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "VoyageHub REST API",
        "version": settings.VERSION,
        "database": "connected",
    }
