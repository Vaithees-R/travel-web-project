import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api, tokenStorage, ApiError } from '../../api';
import { PaymentService, TEST_PAYMENT_PRESETS } from '../../payment/paymentService';

describe('Phase 11 — Frontend Security & Authorization QA', () => {
  beforeEach(() => {
    tokenStorage.clear();
  });

  afterEach(() => {
    tokenStorage.clear();
  });

  describe('1. Unauthenticated Request Guarding', () => {
    it('api.bookings.list rejects immediately with 401 when no token is present', async () => {
      await expect(api.bookings.list()).rejects.toThrow('Authentication token required.');
    });

    it('api.bookings.get rejects immediately with 401 when no token is present', async () => {
      await expect(api.bookings.get('VH-2026-FAKE')).rejects.toThrow('Authentication token required.');
    });

    it('api.bookings.cancel rejects immediately with 401 when no token is present', async () => {
      await expect(api.bookings.cancel('VH-2026-FAKE')).rejects.toThrow('Authentication token required.');
    });

    it('api.users.getMe rejects immediately with 401 when no token is present', async () => {
      await expect(api.users.getMe()).rejects.toThrow('Authentication token required.');
    });
  });

  describe('2. Client-side Token Storage Safety', () => {
    it('sets, retrieves, and clears authentication tokens cleanly', () => {
      expect(tokenStorage.get()).toBeNull();

      tokenStorage.set('test_jwt_token_abcdef123456');
      expect(tokenStorage.get()).toBe('test_jwt_token_abcdef123456');

      tokenStorage.clear();
      expect(tokenStorage.get()).toBeNull();
    });
  });

  describe('3. Payment Validation & Failure Integrity Guards', () => {
    it('rejects invalid or malformed card numbers during validation', () => {
      const res = PaymentService.validatePaymentInput('card', {
        card: {
          cardNumber: '1234', // too short
          cardholderName: 'Traveler',
          expiryDate: '12/28',
          cvv: '123',
        },
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.cardNumber).toBeDefined();
    });

    it('rejects malformed card expiry dates', () => {
      const res = PaymentService.validatePaymentInput('card', {
        card: {
          cardNumber: '4000 0000 0000 0000',
          cardholderName: 'Traveler',
          expiryDate: '13/28', // invalid month > 12
          cvv: '123',
        },
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.expiryDate).toBeDefined();
    });

    it('rejects invalid UPI handle formats', () => {
      const res = PaymentService.validatePaymentInput('upi', {
        upi: {
          upiId: 'invalid-upi-handle-without-at',
        },
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.upiId).toBeDefined();
    });

    it('deterministically fails simulated payment when failure card preset is used', async () => {
      const res = await PaymentService.processPayment({
        amount: 3500,
        currency: 'INR',
        method: 'card',
        details: {
          card: {
            cardNumber: TEST_PAYMENT_PRESETS.cardFailure.cardNumber,
            cardholderName: TEST_PAYMENT_PRESETS.cardFailure.cardholderName,
            expiryDate: TEST_PAYMENT_PRESETS.cardFailure.expiryDate,
            cvv: TEST_PAYMENT_PRESETS.cardFailure.cvv,
          },
        },
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
      expect(res.error).toContain('declined');
    });

    it('deterministically fails simulated payment when failure UPI handle is used', async () => {
      const res = await PaymentService.processPayment({
        amount: 2500,
        currency: 'INR',
        method: 'upi',
        details: {
          upi: {
            upiId: TEST_PAYMENT_PRESETS.upiFailure,
          },
        },
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
      expect(res.error).toContain('declined');
    });
  });
});
