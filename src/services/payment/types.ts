export type PaymentMethod = 'card' | 'upi' | 'net_banking';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string; // MM/YY
  cvv: string; // 3-4 digits (ephemeral only for validation, never stored)
}

export interface UpiDetails {
  upiId: string; // e.g. traveler@upi
}

export interface NetBankingDetails {
  bankCode: string;
  bankName: string;
}

export interface PaymentDetails {
  card?: CardDetails;
  upi?: UpiDetails;
  netBanking?: NetBankingDetails;
}

export interface PaymentRequest {
  amount: number;
  currency: 'INR';
  method: PaymentMethod;
  details: PaymentDetails;
  bookingRef?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  paymentMethod: PaymentMethod;
  timestamp: string;
  last4?: string;
}

export interface PaymentProvider {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}
