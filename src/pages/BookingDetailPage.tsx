import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Printer,
  Trash2,
  User,
  Ticket,
  AlertCircle,
  Copy,
  Check,
  Plane,
  Train,
  Bus,
  Car,
  CreditCard,
  QrCode,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { Booking } from '../types/booking';
import { TransportBadge } from '../components/ui/TransportBadge';
import { FareBreakdown } from '../components/booking/FareBreakdown';
import { api } from '../services/api';
import { cn } from '../utils/cn';

function maskPassport(passport?: string): string {
  if (!passport) return '';
  const trimmed = passport.trim();
  if (trimmed.length <= 4) return trimmed;
  const visible = trimmed.slice(-4);
  const masked = '•'.repeat(Math.max(4, trimmed.length - 4));
  return `${masked}${visible}`;
}

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Copy state
  const [copiedRef, setCopiedRef] = useState(false);

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!bookingId) {
      setBooking(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await api.bookings.get(bookingId);
      setBooking(data);
    } catch (err: any) {
      console.warn('Booking not found or unauthorized', err);
      setBooking(null);
      setLoadError(err?.message || 'Unable to retrieve this trip. The booking may not exist or belongs to another user.');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleCopyRef = () => {
    if (booking?.bookingRef) {
      navigator.clipboard?.writeText(booking.bookingRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCancelConfirm = async () => {
    if (!booking) return;

    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await api.bookings.cancel(booking.id);
      setBooking(updated);
      setShowCancelModal(false);
      setCancelSuccess(true);
    } catch (err: any) {
      console.error('Failed to cancel booking via API', err);
      setCancelError(err?.message || 'Unable to cancel booking at this time. Please verify network connectivity.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Localized Skeleton Loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/60 pb-20 pt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-6 w-36 bg-neutral-200 rounded-md animate-pulse" />
          <div className="h-44 bg-white rounded-3xl border border-neutral-200 animate-pulse" />
          <div className="h-64 bg-white rounded-3xl border border-neutral-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-white rounded-3xl border border-neutral-200 animate-pulse" />
            <div className="h-48 bg-white rounded-3xl border border-neutral-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (!booking || loadError) {
    return (
      <div className="min-h-screen bg-neutral-50/60 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Ticket className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            Trip Not Found or Unauthorized
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {loadError || `We couldn't locate an itinerary corresponding to "${bookingId}". It may belong to another traveler or was not found in PostgreSQL.`}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={fetchBooking}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/bookings"
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Back to My Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = booking.status === 'cancelled';
  const isUpcoming = booking.status === 'upcoming';
  const isCompleted = booking.status === 'completed';

  // Transport-specific itinerary icons
  const getTransportIcon = () => {
    switch (booking.service) {
      case 'flight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'train':
        return <Train className="w-4 h-4 text-amber-600" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-emerald-600" />;
      case 'cab':
        return <Car className="w-4 h-4 text-indigo-600" />;
      default:
        return <Ticket className="w-4 h-4 text-neutral-600" />;
    }
  };

  // Payment method icon
  const getPaymentMethodIcon = () => {
    switch (booking.paymentMethod) {
      case 'upi':
        return <QrCode className="w-4 h-4 text-emerald-600" />;
      case 'net_banking':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
    }
  };

  const allPassengers = [
    { ...booking.primaryPassenger, isPrimary: true },
    ...(booking.additionalPassengers || []).map((p) => ({ ...p, isPrimary: false })),
  ];

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Trips</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-400" />
              <span>Print Itinerary</span>
            </button>
          </div>
        </div>

        {/* Cancellation Success Feedback */}
        {cancelSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold shadow-2xs animate-in fade-in duration-200">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Cancellation recorded. A 100% simulated refund has been credited to your payment method.</span>
          </div>
        )}

        {/* Cancellation Alert Banner */}
        {isCancelled && !cancelSuccess && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-rose-900">
                This Booking Was Cancelled
              </h4>
              <p className="text-rose-700">
                Simulated 100% refund of ₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')} was credited to your original payment method. No further travel rights are active.
              </p>
            </div>
          </div>
        )}

        {/* 1. BOOKING HEADER */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-neutral-950 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TransportBadge type={booking.service} size="md" variant="subtle" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                  {isCancelled ? 'BOOKING CANCELLED' : isCompleted ? 'JOURNEY COMPLETED' : 'BOOKING CONFIRMED'}
                </span>
                <h1 className="text-lg sm:text-2xl font-black text-white">
                  {booking.travelOption.operator} ({booking.travelOption.identifier})
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Copyable Booking Reference */}
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Booking Reference</span>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-800">
                  <span>{booking.bookingRef}</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="text-neutral-400 hover:text-white transition-colors p-0.5"
                    title="Copy booking reference"
                    aria-label={`Copy booking reference ${booking.bookingRef}`}
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5',
                  isCancelled
                    ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                    : isUpcoming
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                )}
              >
                {isCancelled ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Cancelled</span>
                  </>
                ) : isUpcoming ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. ITINERARY VISUALIZATION */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-neutral-100 pb-6">
              {/* Departure */}
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Departure Point
                </span>
                <div className="text-xl sm:text-2xl font-black text-neutral-900">
                  {booking.travelOption.departureTime}
                </div>
                <div className="font-bold text-neutral-800 text-sm mt-0.5">
                  {booking.travelOption.originCity} ({booking.travelOption.originCode || 'DEP'})
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {booking.travelOption.originStationOrTerminal || `${booking.travelOption.originCity} Station/Terminal`}
                </div>
              </div>

              {/* Connector Journey Line */}
              <div className="text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-neutral-100 px-4">
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full mb-1">
                  {getTransportIcon()}
                  <span>{booking.travelOption.duration || 'Direct'}</span>
                </div>
                <div className="w-full max-w-[140px] mx-auto h-[1.5px] bg-neutral-300 relative my-1">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neutral-900" />
                </div>
                <span className="text-[11px] text-neutral-400 block font-medium">
                  {booking.searchCriteria.departureDate}
                </span>
              </div>

              {/* Arrival */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Arrival Point
                </span>
                <div className="text-xl sm:text-2xl font-black text-neutral-900">
                  {booking.travelOption.arrivalTime}
                </div>
                <div className="font-bold text-neutral-800 text-sm mt-0.5">
                  {booking.travelOption.destinationCity} ({booking.travelOption.destinationCode || 'ARR'})
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {booking.travelOption.destinationStationOrTerminal || `${booking.travelOption.destinationCity} Station/Terminal`}
                </div>
              </div>
            </div>

            {/* 3. PASSENGER SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Passenger Details ({allPassengers.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPassengers.map((pax, idx) => (
                  <div key={pax.id || idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <strong className="text-neutral-900 font-bold text-sm">{pax.fullName}</strong>
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase px-2 py-0.5 bg-white rounded border border-neutral-200">
                        {pax.isPrimary ? 'Primary Passenger' : 'Co-Traveller'}
                      </span>
                    </div>

                    <div className="space-y-1 text-neutral-600">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Demographics:</span>
                        <span>{pax.age ? `${pax.age} yrs` : 'Adult'} • {pax.gender?.toUpperCase() || 'Adult'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Contact:</span>
                        <span className="font-mono">{pax.email || pax.phone || 'Recorded'}</span>
                      </div>
                      {pax.berthOrSeatPreference && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Seat / Berth Preference:</span>
                          <span className="font-semibold text-neutral-800">{pax.berthOrSeatPreference}</span>
                        </div>
                      )}
                      {pax.passportNumber && (
                        <div className="flex justify-between pt-1 border-t border-neutral-200/60 text-emerald-800">
                          <span className="text-neutral-500">Passport Number:</span>
                          <span className="font-mono font-semibold">{maskPassport(pax.passportNumber)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SEATING & BOOKING METADATA */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>Travel Allocation & Reservation Metadata</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Assigned Berth / Seat</span>
                  <strong className="font-mono text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 block mt-1">
                    {booking.seatOrBerthAllocated || 'Confirmed on Boarding'}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Booked On</span>
                  <span className="text-neutral-800 font-medium block mt-1">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Internal Booking Identifier</span>
                  <span className="font-mono text-neutral-700 block mt-1 truncate">
                    {booking.id}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. FARE BREAKDOWN (Reusing Phase 7 FareBreakdown Component) */}
            <div className="space-y-2">
              <FareBreakdown
                fareBreakdown={booking.fareBreakdown}
                service={booking.service}
                selectedOption={booking.travelOption}
                selectedClass={booking.travelOption.selectedClass}
              />
            </div>

            {/* 6. PAYMENT SECTION */}
            <div className="p-5 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70">
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon()}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Payment Statement
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                      isCancelled || booking.paymentStatus === 'refunded'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    )}
                  >
                    {isCancelled || booking.paymentStatus === 'refunded' ? 'Refunded (Simulated)' : 'Paid'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Payment Method</span>
                  <span className="font-semibold text-neutral-800 capitalize mt-0.5 block">
                    {booking.paymentMethod?.replace('_', ' ') || 'Credit/Debit Card'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Transaction Reference</span>
                  <span className="font-mono font-semibold text-neutral-900 mt-0.5 block truncate">
                    {booking.paymentReference || 'TXN-2026-PAY-SIM'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Total Paid</span>
                  <span className="font-mono font-black text-neutral-900 text-sm mt-0.5 block">
                    ₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
                <strong>Simulated Environment Notice:</strong> Payments and refunds in VoyageHub are safely processed in demo sandbox mode. No real credit card or bank account was debited.
              </div>
            </div>

            {/* 7. CANCELLATION & POST-BOOKING ACTIONS */}
            <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 block">Manage Trip Status</h4>
                <p className="text-[11px] text-neutral-500">
                  {isUpcoming
                    ? 'Eligible for 100% simulated refund upon cancellation prior to departure.'
                    : isCancelled
                    ? 'This trip is cancelled and cannot be reactivated.'
                    : 'Completed journeys are archived in your itinerary.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isUpcoming && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel Trip</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  Back to My Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CANCELLATION CONFIRMATION MODAL */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  Cancel this trip?
                </h3>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Are you sure you want to cancel booking <strong>{booking.bookingRef}</strong> for {booking.primaryPassenger.fullName}?
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                <strong>Simulated Refund Notice:</strong> A 100% simulated refund of{' '}
                <strong>₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')}</strong> will be credited to your{' '}
                {booking.paymentMethod?.replace('_', ' ') || 'card'}. This is a demonstration sandbox; no real money is processed.
              </div>

              {cancelError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  {cancelError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isCancelling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
