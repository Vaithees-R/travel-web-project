"""
VoyageHub Development Database Initialization & Seeding Script
Usage:
    PYTHONPATH=. backend/venv/bin/python backend/seed.py
"""

from backend.database import engine, Base, SessionLocal
from backend.models.user import User, generate_user_id
from backend.services.auth_service import hash_password

def init_and_seed():
    print("Creating PostgreSQL tables for VoyageHub...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

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
            print("Successfully seeded demo user:")
            print(f"  Email:    {demo_email}")
            print(f"  Password: Traveler123!")
            print(f"  Name:     Alexander Wright")
        else:
            print("Demo user already exists in database.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed()
