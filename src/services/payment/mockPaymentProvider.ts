import { PaymentProvider, PaymentRequest, PaymentResult } from './types';

/**
 * Deterministic Mock Payment Gateway Simulator
 *
 * Designed to simulate standard transaction lifecycles without connecting
 * to external live banking networks or payment processors.
 *
 * Deterministic Test Rules:
 * - Card: Cards ending in "0000" or CVV "000" fail deterministically.
 * - UPI: VPAs starting with "fail" or equal to "declined@upi" fail deterministically.
 * - Net Banking: Bank code "FAIL_BANK" fails deterministically.
 * - All other valid inputs succeed and return authentic transaction identifiers.
 */
export class MockPaymentProvider implements PaymentProvider {
  name = 'VoyageHub Simulated Gateway';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Realistic gateway processing latency (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const timestamp = new Date().toISOString();
    const randAlpha = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. CARD PROCESSING
    if (request.method === 'card') {
      const card = request.details.card;
      if (!card) {
        return {
          success: false,
          error: 'Card payment details are missing.',
          paymentMethod: 'card',
          timestamp,
        };
      }

      const cleanNum = card.cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4) || '4242';

      // Deterministic failure triggers
      if (cleanNum.endsWith('0000') || card.cvv === '000') {
        return {
          success: false,
          error: 'Card declined: Insufficient funds or invalid test card number.',
          paymentMethod: 'card',
          timestamp,
          last4,
        };
      }

      return {
        success: true,
        transactionId: `TXN-2026-CARD-${randAlpha}`,
        paymentMethod: 'card',
        timestamp,
        last4,
      };
    }

    // 2. UPI PROCESSING
    if (request.method === 'upi') {
      const upi = request.details.upi;
      if (!upi || !upi.upiId.trim()) {
        return {
          success: false,
          error: 'UPI VPA address is required.',
          paymentMethod: 'upi',
          timestamp,
        };
      }

      const cleanVpa = upi.upiId.toLowerCase().trim();

      // Deterministic failure triggers
      if (cleanVpa.startsWith('fail') || cleanVpa === 'declined@upi') {
        return {
          success: false,
          error: 'UPI request declined or timed out by mobile payment app.',
          paymentMethod: 'upi',
          timestamp,
        };
      }

      return {
        success: true,
        transactionId: `TXN-2026-UPI-${randAlpha}`,
        paymentMethod: 'upi',
        timestamp,
      };
    }

    // 3. NET BANKING PROCESSING
    if (request.method === 'net_banking') {
      const nb = request.details.netBanking;
      if (!nb || !nb.bankCode) {
        return {
          success: false,
          error: 'Please select a valid participating bank.',
          paymentMethod: 'net_banking',
          timestamp,
        };
      }

      // Deterministic failure trigger
      if (nb.bankCode === 'FAIL_BANK') {
        return {
          success: false,
          error: 'Bank server communication timed out. Transaction declined.',
          paymentMethod: 'net_banking',
          timestamp,
        };
      }

      return {
        success: true,
        transactionId: `TXN-2026-NB-${randAlpha}`,
        paymentMethod: 'net_banking',
        timestamp,
      };
    }

    return {
      success: false,
      error: 'Unsupported payment method selected.',
      paymentMethod: request.method,
      timestamp,
    };
  }
}
