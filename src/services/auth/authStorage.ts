import { User, DemoStoredUser, LoginCredentials, RegisterCredentials, AuthSession } from '../../types/auth';

/**
 * CLIENT-SIDE DEMO AUTHENTICATION STORAGE SERVICE
 *
 * NOTE & PRODUCT HONESTY:
 * This service implements browser-local authentication for demonstration and portfolio testing.
 * Credentials and sessions are stored in browser localStorage.
 * This is NOT a production-grade cryptographic security system and does NOT claim server-side verification.
 * It is structured in isolation so it can be swapped with a real API client (e.g., Supabase / Firebase / REST API)
 * without modifying any UI components or pages.
 */

const USERS_STORAGE_KEY = 'voyagehub_demo_users';
const SESSION_STORAGE_KEY = 'voyagehub_demo_session';

export const AuthStorageService = {
  /**
   * Retrieves all registered demo users from localStorage
   */
  getStoredUsers: (): DemoStoredUser[] => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to read users from localStorage', e);
      return [];
    }
  },

  /**
   * Finds a demo user by email (case-insensitive)
   */
  findUserByEmail: (email: string): DemoStoredUser | null => {
    const cleanEmail = email.trim().toLowerCase();
    const users = AuthStorageService.getStoredUsers();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  /**
   * Registers a new demo user
   */
  createUser: (credentials: RegisterCredentials): { success: boolean; user?: User; error?: string } => {
    const cleanEmail = credentials.email.trim().toLowerCase();

    // Check if user already exists
    if (AuthStorageService.findUserByEmail(cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newUser: DemoStoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: credentials.fullName.trim(),
      email: cleanEmail,
      phone: credentials.phone.trim(),
      password: credentials.password, // Demo verification only
      createdAt: new Date().toISOString(),
    };

    try {
      const users = AuthStorageService.getStoredUsers();
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Return clean user object without password
      const cleanUser: User = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      };

      return { success: true, user: cleanUser };
    } catch (e) {
      console.error('Failed to save user', e);
      return { success: false, error: 'Failed to create user account. Please try again.' };
    }
  },

  /**
   * Verifies user credentials
   * Note: Does not reveal whether the email exists for privacy/security best practices
   */
  verifyCredentials: (credentials: LoginCredentials): { success: boolean; user?: User; error?: string } => {
    const cleanEmail = credentials.email.trim().toLowerCase();
    const foundUser = AuthStorageService.findUserByEmail(cleanEmail);

    if (!foundUser || foundUser.password !== credentials.password) {
      return {
        success: false,
        error: 'Email or password is incorrect.',
      };
    }

    const cleanUser: User = {
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
      phone: foundUser.phone,
      createdAt: foundUser.createdAt,
    };

    return { success: true, user: cleanUser };
  },

  /**
   * Active demo session management
   */
  getActiveSession: (): AuthSession | null => {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      const session = JSON.parse(data) as AuthSession;

      // Verify expiration (7 days demo session)
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        AuthStorageService.clearActiveSession();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  /**
   * Creates and stores active session for user
   */
  saveActiveSession: (user: User): AuthSession => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const session: AuthSession = {
      user,
      token: `demo_jwt_${Math.random().toString(36).substring(2, 12)}`,
      expiresAt,
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to store active session', e);
    }

    return session;
  },

  /**
   * Clears active session (Logout)
   * Note: Bookings and user records remain intact in localStorage
   */
  clearActiveSession: (): void => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove session', e);
    }
  },

  /**
   * Populates demo test users if localStorage has no users registered yet
   * This allows instant evaluation with `demo@voyagehub.com` / `Traveler123!`
   */
  seedDemoUsersIfEmpty: (): void => {
    try {
      const users = AuthStorageService.getStoredUsers();
      if (users.length === 0) {
        const demoUser: DemoStoredUser = {
          id: 'usr_demo_101',
          fullName: 'Rahul Sharma',
          email: 'demo@voyagehub.com',
          phone: '+91 98765 43210',
          password: 'Traveler123!',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([demoUser]));
      }
    } catch (e) {
      console.error('Failed to seed demo user', e);
    }
  },
};

// Automatically ensure default demo user exists for reviewers
AuthStorageService.seedDemoUsersIfEmpty();
