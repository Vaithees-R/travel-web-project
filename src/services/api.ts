import { Booking, BookingStatus } from '../types/booking';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

const TOKEN_STORAGE_KEY = 'voyagehub_jwt_token';

/**
 * Isolated Token Management
 * Note: Storing JWT in browser localStorage is chosen for this full-stack demonstration.
 * In production environments requiring high security, httpOnly secure cookies are recommended
 * to mitigate XSS risks.
 */
export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.error('Failed to store authentication token', e);
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {}
  },
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = tokenStorage.get();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (options.requiresAuth) {
    throw new ApiError('Authentication token required.', 401);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 Unauthorized handling
    if (response.status === 401) {
      if (token && options.requiresAuth) {
        tokenStorage.clear();
      }
      let errorDetail = 'Invalid email or password.';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errorDetail;
      } catch {}
      throw new ApiError(errorDetail, 401);
    }

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      let data: any = null;
      try {
        data = await response.json();
        if (data && data.detail) {
          if (Array.isArray(data.detail)) {
            // Pydantic validation error list
            message = data.detail.map((d: any) => d.msg || `${d.loc?.join('.')}: invalid`).join(', ');
          } else {
            message = data.detail;
          }
        }
      } catch {}
      throw new ApiError(message, response.status, data);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or offline error
    throw new ApiError(err?.message || 'Network connection failed. Please ensure the backend is running.', 0);
  }
}

// Adapters to normalize backend response to frontend domain types
function adaptBooking(data: any): Booking {
  return {
    id: data.id,
    userId: data.userId || data.user_id,
    bookingRef: data.bookingRef || data.booking_reference,
    service: (data.service || data.transport_type) as any,
    status: (data.status || 'upcoming') as BookingStatus,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    travelOption: data.travelOption || data.selected_option,
    searchCriteria: data.searchCriteria || data.search_criteria,
    primaryPassenger: data.primaryPassenger || data.primary_passenger,
    additionalPassengers: data.additionalPassengers || data.additional_passengers || [],
    passengersCount: data.passengersCount || data.passenger_count || 1,
    seatOrBerthAllocated: data.seatOrBerthAllocated || data.seat_allocation || 'Confirmed',
    fareBreakdown: data.fareBreakdown || data.fare_breakdown,
    paymentStatus: data.paymentStatus || data.payment_status || 'paid',
    paymentMethod: data.paymentMethod || data.payment_method || 'card',
    paymentReference: data.paymentReference || data.payment_reference,
    isSimulated: true,
  };
}

export const api = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<{ access_token: string; user: User }> => {
      const res = await request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      tokenStorage.set(res.access_token);
      return res;
    },

    register: async (credentials: RegisterCredentials): Promise<{ access_token: string; user: User }> => {
      const res = await request<{ access_token: string; token_type: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      tokenStorage.set(res.access_token);
      return res;
    },

    me: async (): Promise<User> => {
      return await request<User>('/auth/me', {
        method: 'GET',
        requiresAuth: true,
      });
    },

    logout: async (): Promise<void> => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } catch {
        // Stateless token discard proceeds even if server unreachable
      } finally {
        tokenStorage.clear();
      }
    },
  },

  users: {
    getMe: async (): Promise<User> => {
      return await request<User>('/users/me', {
        method: 'GET',
        requiresAuth: true,
      });
    },

    updateMe: async (data: { full_name?: string; phone?: string }): Promise<User> => {
      return await request<User>('/users/me', {
        method: 'PATCH',
        requiresAuth: true,
        body: JSON.stringify(data),
      });
    },
  },

  bookings: {
    list: async (): Promise<Booking[]> => {
      const rawList = await request<any[]>('/bookings', {
        method: 'GET',
        requiresAuth: true,
      });
      return rawList.map(adaptBooking);
    },

    create: async (bookingData: Partial<Booking> & { service: string; travelOption: any; primaryPassenger: any; fareBreakdown: any }): Promise<Booking> => {
      const raw = await request<any>('/bookings', {
        method: 'POST',
        requiresAuth: true,
        body: JSON.stringify({
          service: bookingData.service,
          travelOption: bookingData.travelOption,
          searchCriteria: bookingData.searchCriteria,
          primaryPassenger: bookingData.primaryPassenger,
          additionalPassengers: bookingData.additionalPassengers,
          passengersCount: bookingData.passengersCount || 1,
          seatOrBerthAllocated: bookingData.seatOrBerthAllocated,
          fareBreakdown: bookingData.fareBreakdown,
          bookingRef: bookingData.bookingRef,
          bookingId: bookingData.id,
          paymentMethod: bookingData.paymentMethod || 'card',
          paymentStatus: bookingData.paymentStatus || 'paid',
          paymentReference: bookingData.paymentReference,
        }),
      });
      return adaptBooking(raw);
    },

    get: async (bookingId: string): Promise<Booking> => {
      const raw = await request<any>(`/bookings/${bookingId}`, {
        method: 'GET',
        requiresAuth: true,
      });
      return adaptBooking(raw);
    },

    cancel: async (bookingId: string): Promise<Booking> => {
      const raw = await request<any>(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        requiresAuth: true,
      });
      return adaptBooking(raw);
    },
  },
};
