/**
 * User and Authentication domain models for VoyageHub
 * Structured for frontend demo session management and easily swappable with a real auth backend.
 */

export interface User {
  id: string; // e.g. "usr_172810482"
  fullName: string;
  email: string;
  phone: string;
  createdAt: string; // ISO date string
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
