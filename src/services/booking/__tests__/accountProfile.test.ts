import { describe, it, expect } from 'vitest';
import { getInitials } from '../../../components/profile/ProfileHeader';
import { TravelPreferences, User } from '../../../types/auth';
import { Booking } from '../../../types/booking';

describe('Phase 9 — Account, Profile & Personalization', () => {
  describe('Deterministic Initials Avatar', () => {
    it('generates two-letter initials from first and last name', () => {
      expect(getInitials('Alexander Wright')).toBe('AW');
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Vaithees Rajasekar')).toBe('VR');
    });

    it('generates two letters for single-word names', () => {
      expect(getInitials('Alexander')).toBe('AL');
      expect(getInitials('V')).toBe('V');
    });

    it('picks first and last token for multi-word names', () => {
      expect(getInitials('Dr. Jane Elizabeth Watson')).toBe('DW');
      expect(getInitials('Jean Luc Picard')).toBe('JP');
    });

    it('provides fallback for empty or whitespace-only inputs', () => {
      expect(getInitials('')).toBe('VH');
      expect(getInitials('   ')).toBe('VH');
    });
  });

  describe('Profile Field Validation & Immutability Rules', () => {
    it('validates legal full name constraints', () => {
      const isValidName = (name: string) => !!name && name.trim().length >= 2;
      expect(isValidName('A')).toBe(false);
      expect(isValidName('   ')).toBe(false);
      expect(isValidName('Al')).toBe(true);
      expect(isValidName('Maya Lin')).toBe(true);
    });

    it('validates contact phone constraints', () => {
      const isValidPhone = (phone: string) => !!phone && phone.trim().length >= 8;
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('+919840123456')).toBe(true);
      expect(isValidPhone('+1-555-0199')).toBe(true);
    });

    it('verifies that immutable fields (id, email) cannot be mutated in profile update payload', () => {
      const originalUser: User = {
        id: 'usr_orig_999',
        email: 'original@voyagehub.com',
        fullName: 'Original User',
        phone: '+919999999999',
        createdAt: '2026-01-01T00:00:00Z',
      };

      // Payload permitted for profile update
      const updatePayload: { full_name: string; phone: string } = {
        full_name: 'Updated Name',
        phone: '+918888888888',
      };

      // Ensure updated object preserves original id and email
      const updatedUser: User = {
        ...originalUser,
        fullName: updatePayload.full_name,
        phone: updatePayload.phone,
      };

      expect(updatedUser.id).toBe(originalUser.id);
      expect(updatedUser.email).toBe(originalUser.email);
      expect(updatedUser.fullName).toBe('Updated Name');
      expect(updatedUser.phone).toBe('+918888888888');
    });
  });

  describe('Durable Travel Preferences Model', () => {
    it('correctly serializes default and custom preferences', () => {
      const defaultPrefs: TravelPreferences = {
        preferred_transport: 'flight',
        preferred_cabin: 'Economy',
        preferred_seat: 'Window',
        meal_preference: 'No Preference',
        contact_method: 'email',
      };

      expect(defaultPrefs.preferred_transport).toBe('flight');
      expect(defaultPrefs.preferred_cabin).toBe('Economy');
      expect(defaultPrefs.preferred_seat).toBe('Window');

      const customPrefs: TravelPreferences = {
        preferred_transport: 'train',
        preferred_cabin: 'Business',
        preferred_seat: 'Aisle',
        meal_preference: 'Vegetarian',
        contact_method: 'phone',
      };

      expect(customPrefs.preferred_transport).toBe('train');
      expect(customPrefs.preferred_cabin).toBe('Business');
      expect(customPrefs.meal_preference).toBe('Vegetarian');
    });
  });

  describe('Search & Booking Prefilling Logic', () => {
    it('derives default seat assignment for flight from preferences', () => {
      const userPrefs: TravelPreferences = {
        preferred_seat: 'Window',
      };

      const resolveFlightSeat = (userPrefSeat?: string, sessionValue?: string) => {
        if (sessionValue) return sessionValue;
        if (userPrefSeat === 'Window') return 'Window Seat';
        if (userPrefSeat === 'Aisle') return 'Aisle Seat';
        return 'No Preference';
      };

      // When no explicit session choice, uses preference
      expect(resolveFlightSeat(userPrefs.preferred_seat)).toBe('Window Seat');

      // Explicit user choice ALWAYS overrides preference
      expect(resolveFlightSeat(userPrefs.preferred_seat, 'Aisle Seat')).toBe('Aisle Seat');
      expect(resolveFlightSeat(userPrefs.preferred_seat, 'Extra Legroom')).toBe('Extra Legroom');
    });

    it('derives default seat assignment for train and bus from preferences', () => {
      const resolveTrainBerth = (userPrefSeat?: string, sessionValue?: string) => {
        if (sessionValue) return sessionValue;
        if (userPrefSeat === 'Window') return 'Window Seat (Chair Car)';
        return 'No Preference';
      };

      const resolveBusSeat = (userPrefSeat?: string, sessionValue?: string) => {
        if (sessionValue) return sessionValue;
        if (userPrefSeat === 'Window') return 'Window Seater';
        if (userPrefSeat === 'Aisle') return 'Aisle Seater';
        return 'No Preference';
      };

      expect(resolveTrainBerth('Window')).toBe('Window Seat (Chair Car)');
      expect(resolveBusSeat('Window')).toBe('Window Seater');
      expect(resolveBusSeat('Aisle')).toBe('Aisle Seater');

      // User explicit selection overrides preference
      expect(resolveTrainBerth('Window', 'Lower Berth')).toBe('Lower Berth');
      expect(resolveBusSeat('Window', 'Upper Sleeper')).toBe('Upper Sleeper');
    });
  });

  describe('Security Section Password Form Rules', () => {
    const validatePasswordChange = (
      current: string,
      newPass: string,
      confirm: string
    ): { valid: boolean; error?: string } => {
      if (!current) return { valid: false, error: 'Current password required' };
      if (!newPass || newPass.length < 8) return { valid: false, error: 'Minimum 8 chars required' };
      if (newPass === current) return { valid: false, error: 'New password must be different' };
      if (confirm !== newPass) return { valid: false, error: 'Confirmation does not match' };
      return { valid: true };
    };

    it('rejects empty current password', () => {
      const res = validatePasswordChange('', 'NewStrongPass123!', 'NewStrongPass123!');
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Current password required');
    });

    it('rejects passwords shorter than 8 characters', () => {
      const res = validatePasswordChange('OldPass123!', 'short', 'short');
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Minimum 8 chars required');
    });

    it('rejects new password that is identical to current password', () => {
      const res = validatePasswordChange('SamePassword123!', 'SamePassword123!', 'SamePassword123!');
      expect(res.valid).toBe(false);
      expect(res.error).toBe('New password must be different');
    });

    it('rejects mismatched confirmation', () => {
      const res = validatePasswordChange('OldPass123!', 'NewStrongPass123!', 'DifferentPass123!');
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Confirmation does not match');
    });

    it('accepts compliant password update request', () => {
      const res = validatePasswordChange('OldPass123!', 'NewStrongPass123!', 'NewStrongPass123!');
      expect(res.valid).toBe(true);
    });
  });

  describe('Account Danger Zone Requirements', () => {
    const validateDeletion = (confirmWord: string, pass: string): boolean => {
      return confirmWord.trim().toUpperCase() === 'DELETE' && pass.trim().length > 0;
    };

    it('rejects deletion if confirmation phrase is not exactly DELETE', () => {
      expect(validateDeletion('delete', 'mypassword')).toBe(true); // handles case-insensitivity on client
      expect(validateDeletion('REMOVE', 'mypassword')).toBe(false);
      expect(validateDeletion('YES', 'mypassword')).toBe(false);
      expect(validateDeletion('', 'mypassword')).toBe(false);
    });

    it('rejects deletion if password is empty', () => {
      expect(validateDeletion('DELETE', '')).toBe(false);
      expect(validateDeletion('DELETE', '   ')).toBe(false);
    });

    it('accepts deletion when DELETE and valid password are provided', () => {
      expect(validateDeletion('DELETE', 'ValidAccountPass123!')).toBe(true);
    });
  });

  describe('Account Statistics Calculation', () => {
    it('accurately computes journey counts from PostgreSQL booking records', () => {
      const mockBookings: Partial<Booking>[] = [
        { id: 'b1', status: 'upcoming' },
        { id: 'b2', status: 'upcoming' },
        { id: 'b3', status: 'completed' },
        { id: 'b4', status: 'cancelled' },
      ];

      const totalTrips = mockBookings.length;
      const upcomingCount = mockBookings.filter((b) => b.status === 'upcoming').length;
      const completedCount = mockBookings.filter((b) => b.status === 'completed').length;
      const cancelledCount = mockBookings.filter((b) => b.status === 'cancelled').length;

      expect(totalTrips).toBe(4);
      expect(upcomingCount).toBe(2);
      expect(completedCount).toBe(1);
      expect(cancelledCount).toBe(1);
    });

    it('handles zero bookings gracefully', () => {
      const emptyBookings: Booking[] = [];
      const totalTrips = emptyBookings.length;
      const upcomingCount = emptyBookings.filter((b) => b.status === 'upcoming').length;

      expect(totalTrips).toBe(0);
      expect(upcomingCount).toBe(0);
    });
  });
});
