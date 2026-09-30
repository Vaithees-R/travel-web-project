import {
  PaymentMethod,
  PaymentDetails,
  PaymentRequest,
  PaymentResult,
  PaymentProvider,
} from './types';
import { MockPaymentProvider } from './mockPaymentProvider';

export interface SupportedBank {
  code: string;
  name: string;
  isPopular?: boolean;
}

export const SUPPORTED_BANKS: SupportedBank[] = [
  { code: 'HDFC', name: 'HDFC Bank', isPopular: true },
  { code: 'ICICI', name: 'ICICI Bank', isPopular: true },
  { code: 'SBI', name: 'State Bank of India (SBI)', isPopular: true },
  { code: 'AXIS', name: 'Axis Bank', isPopular: true },
  { code: 'KOTAK', name: 'Kotak Mahindra Bank', isPopular: true },
  { code: 'PNB', name: 'Punjab National Bank' },
  { code: 'BOB', name: 'Bank of Baroda' },
  { code: 'INDUSIND', name: 'IndusInd Bank' },
  { code: 'YES', name: 'Yes Bank' },
  { code: 'FAIL_BANK', name: '[Test Only] Simulates Bank Network Timeout' },
];

export const TEST_PAYMENT_PRESETS = {
  cardSuccess: {
    cardNumber: '4111 2222 3333 4444',
    cardholderName: 'Alexander Wright',
    expiryDate: '12/28',
    cvv: '123',
  },
  cardFailure: {
    cardNumber: '4000 0000 0000 0000',
    cardholderName: 'Declined User',
    expiryDate: '12/28',
    cvv: '000',
  },
  upiSuccess: 'traveler@upi',
  upiFailure: 'fail@upi',
};

class PaymentServiceClass {
  private provider: PaymentProvider;

  constructor(provider: PaymentProvider = new MockPaymentProvider()) {
    this.provider = provider;
  }

  /**
   * Allows swapping provider without changing the rest of the application
   */
  setProvider(provider: PaymentProvider) {
    this.provider = provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Form validation for payment details prior to submission
   */
  validatePaymentInput(
    method: PaymentMethod,
    details: PaymentDetails
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (method === 'card') {
      const card = details.card;
      if (!card) {
        errors.card = 'Card details are required.';
        return { isValid: false, errors };
      }

      if (!card.cardholderName || card.cardholderName.trim().length < 2) {
        errors.cardholderName = 'Please enter name as printed on card.';
      }

      const cleanNum = card.cardNumber.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cleanNum)) {
        errors.cardNumber = 'Please enter a valid 16-digit card number.';
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiryDate.trim())) {
        errors.expiryDate = 'Use MM/YY format (e.g., 08/28).';
      }

      if (!/^\d{3,4}$/.test(card.cvv.trim())) {
        errors.cvv = 'Enter 3 or 4 digit CVV.';
      }
    } else if (method === 'upi') {
      const upi = details.upi;
      if (!upi || !upi.upiId.trim()) {
        errors.upiId = 'UPI VPA address is required.';
      } else if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi.upiId.trim())) {
        errors.upiId = 'Enter a valid UPI ID (e.g., name@okhdfcbank or user@upi).';
      }
    } else if (method === 'net_banking') {
      const nb = details.netBanking;
      if (!nb || !nb.bankCode) {
        errors.bankCode = 'Please select your banking institution.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Process payment through current provider
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return await this.provider.processPayment(request);
  }
}

export const PaymentService = new PaymentServiceClass();
