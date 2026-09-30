import { Booking, SearchCriteria, TravelOption, Passenger } from '../../types/booking';

const BOOKINGS_KEY = 'voyagehub_simulated_bookings';
const ACTIVE_SESSION_KEY = 'voyagehub_active_booking_session';

// Safe in-memory store fallback for SSR / headless test environments
const memorySessionStore: Record<string, string> = {};
const memoryLocalStore: Record<string, string> = {};

function getSafeSessionStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch {}
  return {
    getItem: (key: string) => memorySessionStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memorySessionStore[key] = value;
    },
    removeItem: (key: string) => {
      delete memorySessionStore[key];
    },
  };
}

function getSafeLocalStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {}
  return {
    getItem: (key: string) => memoryLocalStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memoryLocalStore[key] = value;
    },
    removeItem: (key: string) => {
      delete memoryLocalStore[key];
    },
  };
}

export interface BookingSession {
  searchCriteria?: SearchCriteria;
  selectedOption?: TravelOption;
  passenger?: Passenger;
  additionalPassengers?: Passenger[];
  selectedClass?: string;
  step?: 'search' | 'results' | 'passengers' | 'review' | 'checkout' | 'confirmation';
}

export const BookingStorageService = {
  /**
   * Retrieve stored bookings, optionally scoped to a specific user ID
   */
  getBookings: (userId?: string): Booking[] => {
    try {
      const storage = getSafeLocalStorage();
      const data = storage.getItem(BOOKINGS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      const list: Booking[] = Array.isArray(parsed) ? parsed : [];
      if (userId) {
        return list.filter((b) => b.userId === userId);
      }
      return list;
    } catch (e) {
      console.error('Failed to read bookings from localStorage', e);
      return [];
    }
  },

  /**
   * Retrieve user-specific bookings
   */
  getUserBookings: (userId: string): Booking[] => {
    return BookingStorageService.getBookings(userId);
  },

  /**
   * Retrieve a specific booking by ID or Reference (optionally scoped to user)
   */
  getBookingById: (id: string, userId?: string): Booking | null => {
    const bookings = BookingStorageService.getBookings(userId);
    return bookings.find((b) => b.id === id || b.bookingRef === id) || null;
  },

  /**
   * Save a newly created booking to localStorage
   */
  saveBooking: (booking: Booking): Booking => {
    try {
      const storage = getSafeLocalStorage();
      const current = BookingStorageService.getBookings(); // all bookings
      // Prepend so newest appears first
      const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
      storage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      return booking;
    } catch (e) {
      console.error('Failed to save booking to localStorage', e);
      return booking;
    }
  },

  /**
   * Cancel an existing booking
   */
  cancelBooking: (id: string, userId?: string): boolean => {
    try {
      const storage = getSafeLocalStorage();
      const current = BookingStorageService.getBookings();
      const updated = current.map((b) => {
        if (b.id === id && (!userId || b.userId === userId)) {
          return { ...b, status: 'cancelled' as const };
        }
        return b;
      });
      storage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to cancel booking', e);
      return false;
    }
  },

  /**
   * Active In-Progress Booking Session (Preserves state across back/forward/refreshes)
   */
  getActiveSession: (): BookingSession | null => {
    try {
      const storage = getSafeSessionStorage();
      const data = storage.getItem(ACTIVE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveActiveSession: (session: BookingSession): void => {
    try {
      const storage = getSafeSessionStorage();
      storage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  },

  clearActiveSession: (): void => {
    try {
      const storage = getSafeSessionStorage();
      storage.removeItem(ACTIVE_SESSION_KEY);
    } catch {}
  },

  /**
   * Generator helpers for realistic simulated identifiers
   */
  generateBookingId: (): string => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `VH-2026-${randomHex}`;
  },

  generateReference: (service: string): string => {
    const randDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const randAlpha = Math.random().toString(36).substring(2, 6).toUpperCase();

    switch (service) {
      case 'flight':
        return `PNR ${randAlpha}`;
      case 'train':
        return `PNR ${String(randDigits).substring(0, 3)}-${String(randDigits).substring(3, 10)}`;
      case 'bus':
        return `VOY-BUS-${Math.floor(1000 + Math.random() * 9000)}`;
      case 'cab':
        return `VOY-CAB-${Math.floor(1000 + Math.random() * 9000)}`;
      default:
        return `REF-${randAlpha}`;
    }
  },

  generateSeatAllocation: (service: string, selectedClass?: string): string => {
    const row = Math.floor(4 + Math.random() * 26);
    const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];

    switch (service) {
      case 'flight':
        return `Seat ${row}${seatLetter} (${selectedClass || 'Economy'})`;
      case 'train':
        const coach = selectedClass === '1A' ? 'H1' : selectedClass === '2A' ? 'A2' : selectedClass === 'EC' ? 'E1' : selectedClass === 'CC' ? 'C3' : 'B4';
        const berth = Math.floor(1 + Math.random() * 64);
        return `Coach ${coach} • Berth ${berth} (${selectedClass || 'General'})`;
      case 'bus':
        const berthType = Math.random() > 0.5 ? 'Upper Sleeper' : 'Lower Sleeper';
        const berthNum = Math.floor(1 + Math.random() * 20);
        return `Berth ${berthNum} (${berthType})`;
      case 'cab':
        return 'Chauffeur Reserved (Door-to-Door)';
      default:
        return 'Confirmed';
    }
  },
};
