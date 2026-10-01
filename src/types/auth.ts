/**
 * User and Authentication domain models for VoyageHub
 */

export interface TravelPreferences {
  preferred_cabin?: 'Economy' | 'Premium Economy' | 'Business';
  preferred_transport?: 'flight' | 'train' | 'bus' | 'cab';
  preferred_seat?: 'Window' | 'Aisle' | 'Any';
  meal_preference?: 'Vegetarian' | 'Non-vegetarian' | 'No Preference';
  contact_method?: 'email' | 'phone';
}

export interface User {
  id: string; // e.g. "usr_172810482"
  fullName: string;
  email: string;
  phone: string;
  createdAt: string; // ISO date string
  preferences?: TravelPreferences;
}

export interface DemoStoredUser extends User {
  password: string; // Stored solely for client-side demo credentials verification
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
