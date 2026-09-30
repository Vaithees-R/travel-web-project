from backend.routers.auth import router as auth_router
from backend.routers.users import router as users_router
from backend.routers.bookings import router as bookings_router

__all__ = ["auth_router", "users_router", "bookings_router"]
