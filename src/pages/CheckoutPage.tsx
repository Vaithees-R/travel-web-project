import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { FareCalculatorService } from '../services/booking/fareCalculator';
import {
  PaymentService,
  SUPPORTED_BANKS,
  TEST_PAYMENT_PRESETS,
} from '../services/payment/paymentService';
import { PaymentMethod, PaymentStatus } from '../services/payment/types';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';
import { FareBreakdown } from '../components/booking/FareBreakdown';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const service: CanonicalTransportType =
    rawService === 'flights' || rawService === 'flight'
      ? 'flight'
      : rawService === 'trains' || rawService === 'train'
      ? 'train'
      : rawService === 'buses' || rawService === 'bus'
      ? 'bus'
      : 'cab';

  const session = BookingStorageService.getActiveSession();
  const selectedOption = session?.selectedOption;
  const searchCriteria = session?.searchCriteria;
  const passenger = session?.passenger;
  const additionalPassengers = session?.additionalPassengers || [];
  const selectedClass = session?.selectedClass || selectedOption?.selectedClass || 'Standard';

  const routePrefix =
    service === 'flight'
      ? 'flights'
      : service === 'train'
      ? 'trains'
      : service === 'bus'
      ? 'buses'
      : 'cabs';

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState(TEST_PAYMENT_PRESETS.cardSuccess.cardNumber);
  const [cardholderName, setCardholderName] = useState(
    passenger?.fullName || TEST_PAYMENT_PRESETS.cardSuccess.cardholderName
  );
  const [expiryDate, setExpiryDate] = useState(TEST_PAYMENT_PRESETS.cardSuccess.expiryDate);
  const [cvv, setCvv] = useState(TEST_PAYMENT_PRESETS.cardSuccess.cvv);

  // UPI Form State
  const [upiId, setUpiId] = useState(TEST_PAYMENT_PRESETS.upiSuccess);

  // Net Banking Form State
  const [bankCode, setBankCode] = useState('HDFC');

  // Inline Validation Errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Duplicate submission protection guard
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If session is incomplete, redirect gracefully
  if (!selectedOption || !passenger) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Incomplete Booking Details</h2>
          <p className="text-xs text-neutral-500">
            It looks like some required booking details are missing. Please begin your search again.
          </p>
          <Link
            to={`/${routePrefix}`}
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Start Search
          </Link>
        </div>
      </div>
    );
  }

  // Calculate fare breakdown
  let activeBaseFare = selectedOption.baseFare;
  if (selectedOption.cabinClasses) {
    const matched = selectedOption.cabinClasses.find((c) => c.className === selectedClass);
    if (matched) activeBaseFare = matched.fare;
  } else if (selectedOption.trainClasses) {
    const matched = selectedOption.trainClasses.find((c) => c.className === selectedClass);
    if (matched) activeBaseFare = matched.fare;
  }

  const passengersCount = searchCriteria?.passengers || 1 + additionalPassengers.length;
  const fareBreakdown = FareCalculatorService.calculateFare(activeBaseFare, passengersCount, service);

  // Format Card Number with space grouping
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (validationErrors.cardNumber) {
      setValidationErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  // Format Expiry with MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiryDate(raw);
    if (validationErrors.expiryDate) {
      setValidationErrors((prev) => ({ ...prev, expiryDate: '' }));
    }
  };

  // Helper preset fillers
  const applyPreset = (type: 'cardSuccess' | 'cardFailure' | 'upiSuccess' | 'upiFailure') => {
    setPaymentError(null);
    if (type === 'cardSuccess') {
      setPaymentMethod('card');
      setCardNumber(TEST_PAYMENT_PRESETS.cardSuccess.cardNumber);
      setCardholderName(TEST_PAYMENT_PRESETS.cardSuccess.cardholderName);
      setExpiryDate(TEST_PAYMENT_PRESETS.cardSuccess.expiryDate);
      setCvv(TEST_PAYMENT_PRESETS.cardSuccess.cvv);
    } else if (type === 'cardFailure') {
      setPaymentMethod('card');
      setCardNumber(TEST_PAYMENT_PRESETS.cardFailure.cardNumber);
      setCardholderName(TEST_PAYMENT_PRESETS.cardFailure.cardholderName);
      setExpiryDate(TEST_PAYMENT_PRESETS.cardFailure.expiryDate);
      setCvv(TEST_PAYMENT_PRESETS.cardFailure.cvv);
    } else if (type === 'upiSuccess') {
      setPaymentMethod('upi');
      setUpiId(TEST_PAYMENT_PRESETS.upiSuccess);
    } else if (type === 'upiFailure') {
      setPaymentMethod('upi');
      setUpiId(TEST_PAYMENT_PRESETS.upiFailure);
    }
  };

  const handleProcessPaymentAndBook = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Enforce Authentication Guard
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // 2. Prevent Duplicate Double-Submissions
    if (isSubmitting || paymentStatus === 'processing') {
      return;
    }

    setPaymentError(null);

    // 3. Client Validation
    const validation = PaymentService.validatePaymentInput(paymentMethod, {
      card:
        paymentMethod === 'card'
          ? {
              cardNumber,
              cardholderName,
              expiryDate,
              cvv,
            }
          : undefined,
      upi: paymentMethod === 'upi' ? { upiId } : undefined,
      netBanking:
        paymentMethod === 'net_banking'
          ? {
              bankCode,
              bankName: SUPPORTED_BANKS.find((b) => b.code === bankCode)?.name || bankCode,
            }
          : undefined,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // 4. Start Payment Simulation
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setProcessingStep('Authorizing with simulated payment network...');

    try {
      // Step feedback simulation
      setTimeout(() => {
        setProcessingStep('Verifying 3D-Secure sandbox tokens...');
      }, 400);

      const paymentResult = await PaymentService.processPayment({
        amount: fareBreakdown.totalFare,
        currency: 'INR',
        method: paymentMethod,
        details: {
          card: paymentMethod === 'card' ? { cardNumber, cardholderName, expiryDate, cvv } : undefined,
          upi: paymentMethod === 'upi' ? { upiId } : undefined,
          netBanking:
            paymentMethod === 'net_banking'
              ? {
                  bankCode,
                  bankName: SUPPORTED_BANKS.find((b) => b.code === bankCode)?.name || bankCode,
                }
              : undefined,
        },
        customerEmail: passenger.email,
        customerPhone: passenger.phone,
      });

      // 5. Check Payment Gateway Result
      if (!paymentResult.success) {
        // PAYMENT FAILED: DO NOT CREATE ANY BOOKING IN POSTGRESQL!
        setPaymentStatus('failed');
        setPaymentError(
          paymentResult.error ||
            'Payment declined by simulated issuing bank. Please verify test details.'
        );
        setIsSubmitting(false);
        return;
      }

      // PAYMENT SUCCEEDED: Proceed to PostgreSQL Booking Persistence
      setPaymentStatus('success');
      setProcessingStep('Payment approved! Generating confirmed boarding pass & itinerary...');

      const bookingId = BookingStorageService.generateBookingId();
      const bookingRef = BookingStorageService.generateReference(service);
      const seatAllocation = BookingStorageService.generateSeatAllocation(service, selectedClass);

      const bookingPayload = {
        id: bookingId,
        bookingRef,
        service,
        travelOption: selectedOption,
        searchCriteria: searchCriteria || {
          service,
          from: selectedOption.originCity,
          to: selectedOption.destinationCity,
          departureDate: 'Tomorrow, 08:30 AM',
          tripType: 'oneway' as const,
          passengers: passengersCount,
        },
        primaryPassenger: passenger,
        additionalPassengers: additionalPassengers.length > 0 ? additionalPassengers : undefined,
        passengersCount,
        seatOrBerthAllocated: seatAllocation,
        fareBreakdown,
        paymentMethod,
        paymentStatus: 'paid' as const,
        paymentReference: paymentResult.transactionId,
      };

      const createdBooking = await api.bookings.create(bookingPayload);

      // Clear in-progress session after successful persistence
      BookingStorageService.clearActiveSession();

      // Navigate to confirmation page
      navigate(`/${routePrefix}/confirmation/${createdBooking.id}`);
    } catch (err: any) {
      console.error('Checkout / Persistence failure', err);
      setPaymentStatus('failed');
      setPaymentError(
        err?.message || 'Transaction could not be completed. Your card has not been charged.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BookingStepIndicator currentStep="checkout" service={service} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/${routePrefix}/review`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journey Review</span>
          </button>
        </div>

        {/* Top Sandbox Notice */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Sandbox Test Mode
              </span>
              <span className="text-xs text-neutral-400">• Step 4 of 5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Secure Checkout & Mock Payment
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl">
              This checkout environment uses a deterministic test payment gateway simulator. No real
              funds or banking credentials are used or stored.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('cardSuccess')}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-[11px] font-semibold transition-colors border border-neutral-700 cursor-pointer"
            >
              Test Success Card
            </button>
            <button
              type="button"
              onClick={() => applyPreset('cardFailure')}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-[11px] font-semibold transition-colors border border-rose-800/60 cursor-pointer"
            >
              Test Failure Card
            </button>
            <button
              type="button"
              onClick={() => applyPreset('upiSuccess')}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-[11px] font-semibold transition-colors border border-neutral-700 cursor-pointer"
            >
              Test Success UPI
            </button>
          </div>
        </div>

        {/* Main Checkout 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Trip & Fare Summary (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quick Trip Summary Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <TransportBadge type={service} size="sm" variant="subtle" />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {selectedOption.operator}
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {selectedOption.identifier} • {selectedClass}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg">
                  {searchCriteria?.departureDate || 'Selected Date'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">From</span>
                  <div className="font-bold text-neutral-900 text-sm">
                    {selectedOption.originCity} ({selectedOption.originCode})
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedOption.departureTime}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">To</span>
                  <div className="font-bold text-neutral-900 text-sm">
                    {selectedOption.destinationCity} ({selectedOption.destinationCode})
                  </div>
                  <div className="text-[11px] text-neutral-500">{selectedOption.arrivalTime}</div>
                </div>
              </div>

              {/* Primary passenger line */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <span>
                  Primary Traveller: <strong className="text-neutral-900">{passenger.fullName}</strong>
                </span>
                <span className="text-[11px] text-neutral-400">
                  {passengersCount} {passengersCount === 1 ? 'traveller' : 'travellers'}
                </span>
              </div>
            </div>

            {/* Fare Breakdown */}
            <FareBreakdown
              fareBreakdown={fareBreakdown}
              service={service}
              selectedOption={selectedOption}
              selectedClass={selectedClass}
            />
          </div>

          {/* Right Column: Payment Form & Checkout Action (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 sm:p-7 space-y-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neutral-700" />
                  <span>Select Payment Method</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select your simulated transaction method to authorize your ticket issuance.
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setPaymentError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setPaymentError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('net_banking');
                    setPaymentError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'net_banking'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Payment Error Banner if failed */}
              {paymentError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Payment Not Completed</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-700">{paymentError}</p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('cardSuccess')}
                      className="px-3 py-1 bg-white border border-rose-300 text-rose-800 rounded-lg text-[10px] font-semibold hover:bg-rose-100 transition-colors"
                    >
                      Fill Valid Test Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentError(null)}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-semibold hover:bg-rose-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Method Forms */}
              <form onSubmit={handleProcessPaymentAndBook} className="space-y-4">
                {/* 1. CARD FORM */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3.5">
                    {/* Cardholder Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700 uppercase">
                        Cardholder Legal Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => {
                          setCardholderName(e.target.value);
                          if (validationErrors.cardholderName) {
                            setValidationErrors((prev) => ({ ...prev, cardholderName: '' }));
                          }
                        }}
                        placeholder="e.g. Alexander Wright"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                          validationErrors.cardholderName
                            ? 'border-red-300 ring-1 ring-red-400'
                            : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                        }`}
                      />
                      {validationErrors.cardholderName && (
                        <p className="text-[10px] text-red-600">
                          {validationErrors.cardholderName}
                        </p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700 uppercase flex justify-between">
                        <span>Card Number</span>
                        <span className="text-[10px] text-neutral-400 font-normal">
                          Test card ending in 0000 tests failure
                        </span>
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4111 2222 3333 4444"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 font-mono focus:bg-white focus:outline-none transition-all ${
                          validationErrors.cardNumber
                            ? 'border-red-300 ring-1 ring-red-400'
                            : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                        }`}
                      />
                      {validationErrors.cardNumber && (
                        <p className="text-[10px] text-red-600">{validationErrors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 font-mono focus:bg-white focus:outline-none transition-all ${
                            validationErrors.expiryDate
                              ? 'border-red-300 ring-1 ring-red-400'
                              : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                          }`}
                        />
                        {validationErrors.expiryDate && (
                          <p className="text-[10px] text-red-600">
                            {validationErrors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase flex justify-between">
                          <span>Security Code (CVV)</span>
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => {
                            setCvv(e.target.value.replace(/\D/g, ''));
                            if (validationErrors.cvv) {
                              setValidationErrors((prev) => ({ ...prev, cvv: '' }));
                            }
                          }}
                          placeholder="•••"
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 font-mono focus:bg-white focus:outline-none transition-all ${
                            validationErrors.cvv
                              ? 'border-red-300 ring-1 ring-red-400'
                              : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                          }`}
                        />
                        {validationErrors.cvv && (
                          <p className="text-[10px] text-red-600">{validationErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. UPI FORM */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700 uppercase flex justify-between">
                        <span>Virtual Payment Address (UPI ID)</span>
                        <span className="text-[10px] text-neutral-400 font-normal">
                          fail@upi tests failure
                        </span>
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          if (validationErrors.upiId) {
                            setValidationErrors((prev) => ({ ...prev, upiId: '' }));
                          }
                        }}
                        placeholder="traveler@upi or yourname@okhdfcbank"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 font-mono focus:bg-white focus:outline-none transition-all ${
                          validationErrors.upiId
                            ? 'border-red-300 ring-1 ring-red-400'
                            : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                        }`}
                      />
                      {validationErrors.upiId && (
                        <p className="text-[10px] text-red-600">{validationErrors.upiId}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] text-neutral-500 pt-1">
                      <span className="px-2 py-1 bg-neutral-100 rounded-lg">Google Pay</span>
                      <span className="px-2 py-1 bg-neutral-100 rounded-lg">PhonePe</span>
                      <span className="px-2 py-1 bg-neutral-100 rounded-lg">Paytm</span>
                      <span className="px-2 py-1 bg-neutral-100 rounded-lg">BHIM</span>
                    </div>
                  </div>
                )}

                {/* 3. NET BANKING FORM */}
                {paymentMethod === 'net_banking' && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700 uppercase">
                        Select Bank Institution
                      </label>
                      <select
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      >
                        {SUPPORTED_BANKS.map((bank) => (
                          <option key={bank.code} value={bank.code}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <p className="text-[11px] text-neutral-500">
                      You will be authenticated via our simulated banking portal to confirm debit
                      clearance.
                    </p>
                  </div>
                )}

                {/* Security and Privacy statement */}
                <div className="p-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 flex items-start gap-2 border border-neutral-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Zero Storage Guarantee: Payment authorization credentials and CVVs are strictly
                    ephemeral in memory and never stored in any database.
                  </span>
                </div>

                {/* Primary CTA Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || paymentStatus === 'processing'}
                    aria-busy={paymentStatus === 'processing'}
                    className={`w-full py-4 min-h-[48px] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md focus-ring cursor-pointer ${
                      isSubmitting || paymentStatus === 'processing'
                        ? 'bg-neutral-400 cursor-wait'
                        : 'bg-neutral-900 hover:bg-neutral-800 hover:shadow-lg'
                    }`}
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" aria-hidden="true" />
                        <span>Pay ₹{fareBreakdown.totalFare.toLocaleString('en-IN')} & Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Modal Overlay */}
      {paymentStatus === 'processing' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="processing-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
              <Loader2 className="w-7 h-7 animate-spin text-neutral-800" aria-hidden="true" />
            </div>
            <div>
              <h3 id="processing-title" className="text-base font-bold text-neutral-900">
                Contacting Payment Gateway...
              </h3>
              <p role="status" aria-live="polite" className="text-xs text-neutral-500 mt-1 min-h-[18px]">
                {processingStep}
              </p>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden" aria-hidden="true">
              <div className="bg-emerald-600 h-full w-2/3 animate-pulse rounded-full" />
            </div>
            <p className="text-[10px] text-neutral-400">
              Please do not close or refresh this browser window.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
