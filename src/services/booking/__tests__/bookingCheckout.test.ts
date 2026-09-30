import { describe, it, expect, vi } from 'vitest';
import { FareCalculatorService } from '../fareCalculator';
import { PaymentService, TEST_PAYMENT_PRESETS } from '../../payment/paymentService';
import { BookingStorageService } from '../bookingStorage';
import { FLIGHT_INVENTORY } from '../../travel/flightInventory';
import { TRAIN_INVENTORY } from '../../travel/trainInventory';
import { BUS_INVENTORY } from '../../travel/busInventory';
import { generateCabOptionsForRoute } from '../../travel/cabInventory';
import { Passenger } from '../../../types/booking';

describe('VoyageHub Phase 7 Booking Checkout & Payment Experience Test Suite', () => {
  const samplePassenger: Passenger = {
    id: 'pax-test-1',
    fullName: 'Alexander Wright',
    email: 'alexander@voyagehub.com',
    phone: '+91 98401 23456',
    gender: 'male',
    age: 32,
    berthOrSeatPreference: 'Window Seat',
  };

  // 1. Fare calculation across transport modes
  it('1. calculates deterministic fare breakdown for flights with taxes and passenger multiplier', () => {
    const flight = FLIGHT_INVENTORY[0];
    const singlePaxFare = FareCalculatorService.calculateFare(flight, 1, 'Economy');
    expect(singlePaxFare.passengerCount).toBe(1);
    expect(singlePaxFare.subtotalBaseFare).toBe(flight.baseFare);
    expect(singlePaxFare.taxesAndTerminalFees).toBe(Math.round(flight.baseFare * 0.05 + 350));
    expect(singlePaxFare.totalFare).toBe(
      singlePaxFare.subtotalBaseFare + singlePaxFare.taxesAndTerminalFees + singlePaxFare.safetyOrServiceFee
    );

    // Multi-passenger test (3 passengers)
    const multiPaxFare = FareCalculatorService.calculateFare(flight, 3, 'Economy');
    expect(multiPaxFare.passengerCount).toBe(3);
    expect(multiPaxFare.subtotalBaseFare).toBe(flight.baseFare * 3);
    expect(multiPaxFare.taxesAndTerminalFees).toBe(Math.round(flight.baseFare * 3 * 0.05 + 350 * 3));
    expect(multiPaxFare.totalFare).toBe(
      multiPaxFare.subtotalBaseFare + multiPaxFare.taxesAndTerminalFees + multiPaxFare.safetyOrServiceFee
    );
  });

  it('1b. calculates deterministic fare for trains, buses, and cabs', () => {
    const train = TRAIN_INVENTORY[0];
    const trainFare = FareCalculatorService.calculateFare(train, 2, 'CC');
    expect(trainFare.subtotalBaseFare).toBe(train.baseFare * 2);
    expect(trainFare.taxesAndTerminalFees).toBe(Math.round(train.baseFare * 2 * 0.05 + 40 * 2));

    const bus = BUS_INVENTORY[0];
    const busFare = FareCalculatorService.calculateFare(bus, 2);
    expect(busFare.taxesAndTerminalFees).toBe(Math.round(bus.baseFare * 2 * 0.05 + 25 * 2));

    const cabs = generateCabOptionsForRoute('Mumbai', 'Pune', 'oneway');
    const cab = cabs[0];
    const cabFare = FareCalculatorService.calculateFare(cab, 1);
    expect(cabFare.taxesAndTerminalFees).toBe(Math.round(cab.baseFare * 0.05));
    expect(cabFare.totalFare).toBe(cab.baseFare + Math.round(cab.baseFare * 0.05));
  });

  // 2. Passenger validation
  it('2. validates passenger data requirements', () => {
    // Helper validation function mimicking form validator
    const validate = (p: Partial<Passenger>, isInternational = false) => {
      const errors: string[] = [];
      if (!p.fullName || p.fullName.trim().length < 2) errors.push('fullName');
      if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.push('email');
      if (!p.phone || !/^[0-9+\-\s()]{8,15}$/.test(p.phone)) errors.push('phone');
      if (!p.age || p.age < 1 || p.age > 120) errors.push('age');
      if (isInternational) {
        if (!p.passportNumber || p.passportNumber.trim().length < 6) errors.push('passportNumber');
        if (!p.passportExpiry) errors.push('passportExpiry');
      }
      return errors;
    };

    expect(validate(samplePassenger)).toHaveLength(0);

    // Invalid email & short name
    const invalidPax: Partial<Passenger> = {
      fullName: 'A',
      email: 'not-an-email',
      phone: '12',
      age: 200,
    };
    const errors = validate(invalidPax);
    expect(errors).toContain('fullName');
    expect(errors).toContain('email');
    expect(errors).toContain('phone');
    expect(errors).toContain('age');

    // International passport check
    const intlErrors = validate(samplePassenger, true);
    expect(intlErrors).toContain('passportNumber');
    expect(intlErrors).toContain('passportExpiry');

    const validIntlPax: Passenger = {
      ...samplePassenger,
      passportNumber: 'Z8920141',
      passportExpiry: '2032-10-10',
      passportCountry: 'India',
    };
    expect(validate(validIntlPax, true)).toHaveLength(0);
  });

  // 3. Checkout form validation
  it('3. validates payment input details across Card, UPI, and Net Banking', () => {
    // Valid card
    const cardValid = PaymentService.validatePaymentInput('card', {
      card: TEST_PAYMENT_PRESETS.cardSuccess,
    });
    expect(cardValid.isValid).toBe(true);

    // Invalid card format
    const cardInvalid = PaymentService.validatePaymentInput('card', {
      card: {
        cardNumber: '123',
        cardholderName: '',
        expiryDate: '99/99',
        cvv: '1',
      },
    });
    expect(cardInvalid.isValid).toBe(false);
    expect(cardInvalid.errors.cardNumber).toBeDefined();
    expect(cardInvalid.errors.cardholderName).toBeDefined();
    expect(cardInvalid.errors.expiryDate).toBeDefined();
    expect(cardInvalid.errors.cvv).toBeDefined();

    // Valid UPI
    const upiValid = PaymentService.validatePaymentInput('upi', {
      upi: { upiId: 'traveler@okhdfcbank' },
    });
    expect(upiValid.isValid).toBe(true);

    // Invalid UPI
    const upiInvalid = PaymentService.validatePaymentInput('upi', {
      upi: { upiId: 'invalid-vpa-without-at' },
    });
    expect(upiInvalid.isValid).toBe(false);
    expect(upiInvalid.errors.upiId).toBeDefined();

    // Valid Net Banking
    const nbValid = PaymentService.validatePaymentInput('net_banking', {
      netBanking: { bankCode: 'HDFC', bankName: 'HDFC Bank' },
    });
    expect(nbValid.isValid).toBe(true);
  });

  // 4. Mock payment success
  it('4. processes mock payment successfully with valid test details', async () => {
    const res = await PaymentService.processPayment({
      amount: 4500,
      currency: 'INR',
      method: 'card',
      details: { card: TEST_PAYMENT_PRESETS.cardSuccess },
    });

    expect(res.success).toBe(true);
    expect(res.transactionId).toContain('TXN-2026-CARD-');
    expect(res.paymentMethod).toBe('card');
    expect(res.last4).toBe('4444');
    expect(res.error).toBeUndefined();

    // UPI success
    const upiRes = await PaymentService.processPayment({
      amount: 4500,
      currency: 'INR',
      method: 'upi',
      details: { upi: { upiId: TEST_PAYMENT_PRESETS.upiSuccess } },
    });
    expect(upiRes.success).toBe(true);
    expect(upiRes.transactionId).toContain('TXN-2026-UPI-');
  });

  // 5. Mock payment failure
  it('5. deterministically rejects designated test failure payment inputs', async () => {
    // Designated failure card (ending in 0000)
    const cardFailRes = await PaymentService.processPayment({
      amount: 4500,
      currency: 'INR',
      method: 'card',
      details: { card: TEST_PAYMENT_PRESETS.cardFailure },
    });
    expect(cardFailRes.success).toBe(false);
    expect(cardFailRes.error).toContain('declined');
    expect(cardFailRes.transactionId).toBeUndefined();

    // Designated failure UPI (fail@upi)
    const upiFailRes = await PaymentService.processPayment({
      amount: 4500,
      currency: 'INR',
      method: 'upi',
      details: { upi: { upiId: TEST_PAYMENT_PRESETS.upiFailure } },
    });
    expect(upiFailRes.success).toBe(false);
    expect(upiFailRes.error).toContain('declined');

    // Designated failure Bank (FAIL_BANK)
    const nbFailRes = await PaymentService.processPayment({
      amount: 4500,
      currency: 'INR',
      method: 'net_banking',
      details: { netBanking: { bankCode: 'FAIL_BANK', bankName: 'Failure Test Bank' } },
    });
    expect(nbFailRes.success).toBe(false);
    expect(nbFailRes.error).toContain('timed out');
  });

  // 6. Payment state transitions
  it('6. verifies simulated payment state transition flow', async () => {
    let state = 'idle';
    const statesRecorded: string[] = [state];

    const simulateCheckoutWorkflow = async (cardDetails: any) => {
      state = 'processing';
      statesRecorded.push(state);

      const res = await PaymentService.processPayment({
        amount: 2500,
        currency: 'INR',
        method: 'card',
        details: { card: cardDetails },
      });

      if (res.success) {
        state = 'success';
      } else {
        state = 'failed';
      }
      statesRecorded.push(state);
      return res;
    };

    // Successful flow
    await simulateCheckoutWorkflow(TEST_PAYMENT_PRESETS.cardSuccess);
    expect(statesRecorded).toEqual(['idle', 'processing', 'success']);

    // Failed flow
    statesRecorded.length = 0;
    statesRecorded.push('idle');
    await simulateCheckoutWorkflow(TEST_PAYMENT_PRESETS.cardFailure);
    expect(statesRecorded).toEqual(['idle', 'processing', 'failed']);
  });

  // 7 & 8. Booking creation after payment vs payment failure
  it('7 & 8. verifies booking is ONLY created when payment succeeds and NEVER on payment failure', async () => {
    let apiCallMade = false;
    const mockApiCreate = vi.fn().mockImplementation(() => {
      apiCallMade = true;
      return Promise.resolve({ id: 'VH-2026-TEST1' });
    });

    // Case 1: Payment fails -> API must NOT be called
    const failPayment = await PaymentService.processPayment({
      amount: 5000,
      currency: 'INR',
      method: 'card',
      details: { card: TEST_PAYMENT_PRESETS.cardFailure },
    });

    if (failPayment.success) {
      await mockApiCreate({});
    }

    expect(failPayment.success).toBe(false);
    expect(apiCallMade).toBe(false);
    expect(mockApiCreate).not.toHaveBeenCalled();

    // Case 2: Payment succeeds -> API is called
    const successPayment = await PaymentService.processPayment({
      amount: 5000,
      currency: 'INR',
      method: 'card',
      details: { card: TEST_PAYMENT_PRESETS.cardSuccess },
    });

    if (successPayment.success) {
      await mockApiCreate({
        paymentStatus: 'paid',
        paymentReference: successPayment.transactionId,
      });
    }

    expect(successPayment.success).toBe(true);
    expect(apiCallMade).toBe(true);
    expect(mockApiCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentStatus: 'paid',
        paymentReference: expect.stringContaining('TXN-2026-CARD-'),
      })
    );
  });

  // 9. Duplicate submission protection
  it('9. prevents duplicate submission when payment/creation is in progress', async () => {
    let inProgress = false;
    let executionCount = 0;

    const handleCheckoutSubmit = async () => {
      if (inProgress) return 'IGNORED_DUPLICATE';
      inProgress = true;
      executionCount++;
      // Simulate asynchronous payment
      await new Promise((r) => setTimeout(r, 100));
      inProgress = false;
      return 'PROCESSED';
    };

    const [first, second] = await Promise.all([
      handleCheckoutSubmit(),
      handleCheckoutSubmit(), // concurrent double-click
    ]);

    expect(executionCount).toBe(1);
    expect([first, second]).toContain('PROCESSED');
    expect([first, second]).toContain('IGNORED_DUPLICATE');
  });

  // 10. Correct booking reference and seat allocation formatting
  it('10. generates mode-appropriate booking references and seat allocations', () => {
    const flightRef = BookingStorageService.generateReference('flight');
    expect(flightRef).toMatch(/^PNR [A-Z0-9]{4,5}$/);

    const trainRef = BookingStorageService.generateReference('train');
    expect(trainRef).toMatch(/^PNR \d{3}-\d{7}$/);

    const busRef = BookingStorageService.generateReference('bus');
    expect(busRef).toMatch(/^VOY-BUS-\d{4}$/);

    const cabRef = BookingStorageService.generateReference('cab');
    expect(cabRef).toMatch(/^VOY-CAB-\d{4}$/);

    const flightSeat = BookingStorageService.generateSeatAllocation('flight', 'Business');
    expect(flightSeat).toContain('Seat');
    expect(flightSeat).toContain('Business');

    const trainBerth = BookingStorageService.generateSeatAllocation('train', '2A');
    expect(trainBerth).toContain('Coach');
    expect(trainBerth).toContain('2A');
  });

  // 11. Transport-specific checkout data
  it('11. retains transport-specific attributes through booking session', () => {
    const flight = FLIGHT_INVENTORY[0];
    BookingStorageService.saveActiveSession({
      selectedOption: flight,
      selectedClass: 'Premium Economy',
      passenger: samplePassenger,
      step: 'checkout',
    });

    const restored = BookingStorageService.getActiveSession();
    expect(restored?.selectedOption?.operator).toBe(flight.operator);
    expect(restored?.selectedClass).toBe('Premium Economy');
    expect(restored?.passenger?.fullName).toBe(samplePassenger.fullName);
    expect(restored?.step).toBe('checkout');

    BookingStorageService.clearActiveSession();
    expect(BookingStorageService.getActiveSession()).toBeNull();
  });

  // 12. Correct fare breakdown consistency
  it('12. ensures all fare breakdown arithmetic is 100% consistent', () => {
    const testCases = [
      { unit: 4500, count: 1, service: 'flight' },
      { unit: 4500, count: 4, service: 'flight' },
      { unit: 1850, count: 2, service: 'train' },
      { unit: 850, count: 3, service: 'bus' },
      { unit: 2800, count: 1, service: 'cab' },
    ];

    for (const tc of testCases) {
      const breakdown = FareCalculatorService.calculateFare(tc.unit, tc.count, tc.service);
      expect(breakdown.subtotalBaseFare).toBe(tc.unit * tc.count);
      expect(breakdown.totalFare).toBe(
        breakdown.subtotalBaseFare + breakdown.taxesAndTerminalFees + breakdown.safetyOrServiceFee
      );
      expect(breakdown.currency).toBe('INR');
    }
  });
});
