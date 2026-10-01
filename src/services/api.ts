import { Booking, BookingStatus } from '../types/booking';
import { User, LoginCredentials, RegisterCredentials, TravelPreferences } from '../types/auth';

const TOKEN_STORAGE_KEY = 'voyagehub_jwt_token';

/**
 * Isolated Token Management
 * Note: Storing JWT in browser localStorage is chosen for this full-stack demonstration.
 * In production environments requiring high security, httpOnly secure cookies are recommended
 * to mitigate XSS risks.
 */
let inMemoryToken: string | null = null;

export const tokenStorage = {
  get: (): string | null => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
      }
      return inMemoryToken;
    } catch {
      return inMemoryToken;
    }
  },
  set: (token: string): void => {
    inMemoryToken = token;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    } catch (e) {
      console.error('Failed to store authentication token', e);
    }
  },
  clear: (): void => {
    inMemoryToken = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
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
    // Network or server unreachable error (e.g. backend down or CORS failure)
    console.warn('API request network error:', err);
    throw new ApiError(
      'Unable to connect to VoyageHub right now. Please make sure the VoyageHub service is running and try again.',
      0
    );
  }
}

// Adapters to normalize backend response to frontend domain types
function adaptUser(data: any): User {
  return {
    id: data.id,
    fullName: data.fullName || data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    preferences: data.preferences || {
      preferred_cabin: 'Economy',
      preferred_transport: 'flight',
      preferred_seat: 'Window',
      meal_preference: 'No Preference',
      contact_method: 'email',
    },
  };
}

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
      const res = await request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      tokenStorage.set(res.access_token);
      return {
        ...res,
        user: adaptUser(res.user),
      };
    },

    register: async (credentials: RegisterCredentials): Promise<{ access_token: string; user: User }> => {
      const payload = {
        full_name: credentials.fullName,
        fullName: credentials.fullName,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
      };
      const res = await request<{ access_token: string; token_type: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      tokenStorage.set(res.access_token);
      return {
        ...res,
        user: adaptUser(res.user),
      };
    },

    me: async (): Promise<User> => {
      const raw = await request<any>('/auth/me', {
        method: 'GET',
        requiresAuth: true,
      });
      return adaptUser(raw);
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
      const raw = await request<any>('/users/me', {
        method: 'GET',
        requiresAuth: true,
      });
      return adaptUser(raw);
    },

    updateMe: async (data: { full_name?: string; phone?: string; preferences?: Partial<TravelPreferences> }): Promise<User> => {
      const raw = await request<any>('/users/me', {
        method: 'PATCH',
        requiresAuth: true,
        body: JSON.stringify(data),
      });
      return adaptUser(raw);
    },

    getPreferences: async (): Promise<TravelPreferences> => {
      return await request<TravelPreferences>('/users/me/preferences', {
        method: 'GET',
        requiresAuth: true,
      });
    },

    savePreferences: async (prefs: Partial<TravelPreferences>): Promise<TravelPreferences> => {
      return await request<TravelPreferences>('/users/me/preferences', {
        method: 'PATCH',
        requiresAuth: true,
        body: JSON.stringify(prefs),
      });
    },

    changePassword: async (data: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }): Promise<{ status: string; message: string }> => {
      return await request<{ status: string; message: string }>('/users/me/change-password', {
        method: 'POST',
        requiresAuth: true,
        body: JSON.stringify(data),
      });
    },

    deleteAccount: async (data: {
      confirmation: string;
      password: string;
    }): Promise<{ status: string; message: string }> => {
      return await request<{ status: string; message: string }>('/users/me', {
        method: 'DELETE',
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
