import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Printer, Trash2, User, Ticket, AlertCircle } from 'lucide-react';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { Booking } from '../types/booking';
import { TransportBadge } from '../components/ui/TransportBadge';

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(() => {
    return bookingId ? BookingStorageService.getBookingById(bookingId) : null;
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleCancelConfirm = () => {
    if (!booking) return;

    const success = BookingStorageService.cancelBooking(booking.id);
    if (success) {
      const refreshed = BookingStorageService.getBookingById(booking.id);
      setBooking(refreshed);
      setShowCancelModal(false);
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4">
          <Ticket className="w-12 h-12 text-neutral-400 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Booking Record Not Found</h2>
          <p className="text-xs text-neutral-500">
            We couldn&apos;t find an itinerary corresponding to ID &quot;{bookingId}&quot; in your browser records.
          </p>
          <Link
            to="/bookings"
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = booking.status === 'cancelled';
  const isUpcoming = booking.status === 'upcoming';

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Bookings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-medium flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-400" />
              <span>Print Itinerary</span>
            </button>
          </div>
        </div>

        {/* Cancellation Success Feedback */}
        {cancelSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Booking successfully cancelled. A 100% simulated refund has been credited.</span>
          </div>
        )}

        {/* Cancellation Status Banner */}
        {isCancelled && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                This Booking Was Cancelled
              </h4>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Simulated 100% refund of ₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')} was credited to the original payment method. No further travel rights are active.
              </p>
            </div>
          </div>
        )}

        {/* Main Itinerary Header Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
          <div className="p-6 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TransportBadge type={booking.service} size="md" variant="subtle" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Itinerary Details
                </span>
                <h1 className="text-base sm:text-xl font-bold text-white">
                  {booking.travelOption.operator} ({booking.travelOption.identifier})
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Reference / PNR</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-700">
                  {booking.bookingRef}
                </span>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isCancelled
                  ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                  : isUpcoming
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {isCancelled ? 'Cancelled' : isUpcoming ? 'Confirmed • Upcoming' : 'Completed'}
              </div>
            </div>
          </div>

          {/* Route & Times */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-neutral-100 pb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Departure</span>
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {booking.travelOption.departureTime}
                </div>
                <div className="font-bold text-neutral-800 text-sm">
                  {booking.travelOption.originCity} ({booking.travelOption.originCode})
                </div>
                <div className="text-xs text-neutral-400">
                  {booking.travelOption.originStationOrTerminal}
                </div>
              </div>

              <div className="text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-neutral-100">
                <span className="text-xs font-semibold text-neutral-700">{booking.travelOption.duration}</span>
                <div className="w-full max-w-[120px] mx-auto h-[1.5px] bg-neutral-200 my-1" />
                <span className="text-[10px] text-neutral-400 block">{booking.searchCriteria.departureDate}</span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Arrival</span>
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {booking.travelOption.arrivalTime}
                </div>
                <div className="font-bold text-neutral-800 text-sm">
                  {booking.travelOption.destinationCity} ({booking.travelOption.destinationCode})
                </div>
                <div className="text-xs text-neutral-400">
                  {booking.travelOption.destinationStationOrTerminal}
                </div>
              </div>
            </div>

            {/* Passenger & Allocation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passenger Info */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Passenger Information</span>
                </h4>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Legal Name:</span>
                    <strong className="text-neutral-900">{booking.primaryPassenger.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email:</span>
                    <span className="font-mono text-neutral-800">{booking.primaryPassenger.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phone:</span>
                    <span className="font-mono text-neutral-800">{booking.primaryPassenger.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Demographics:</span>
                    <span className="text-neutral-800">{booking.primaryPassenger.age} yrs • {booking.primaryPassenger.gender?.toUpperCase()}</span>
                  </div>
                  {booking.primaryPassenger.berthOrSeatPreference && (
                    <div className="flex justify-between pt-1 border-t border-neutral-200">
                      <span className="text-neutral-500">Preference:</span>
                      <span className="text-neutral-800 font-semibold">{booking.primaryPassenger.berthOrSeatPreference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seating & Timing Meta */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Seat & Schedule Metadata</span>
                </h4>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Assigned Berth / Seat:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {booking.seatOrBerthAllocated}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Booked On:</span>
                    <span className="text-neutral-800">{new Date(booking.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Booking ID:</span>
                    <span className="font-mono text-neutral-700">{booking.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Payment & Fare Statement
              </h4>
              <div className="space-y-1.5 text-xs text-neutral-600 max-w-md">
                <div className="flex justify-between">
                  <span>Subtotal Base Fare:</span>
                  <span className="font-mono text-neutral-900">₹{booking.fareBreakdown.subtotalBaseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Terminal Fees:</span>
                  <span className="font-mono text-neutral-900">₹{booking.fareBreakdown.taxesAndTerminalFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passenger Safety & Service Fee:</span>
                  <span className="font-mono text-neutral-900">₹{booking.fareBreakdown.safetyOrServiceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900 text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono">₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Action */}
            {isUpcoming && (
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Manage Booking Status</span>
                  <span className="text-[11px] text-neutral-400">Cancel reservation with simulated full refund</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel Reservation</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">Confirm Booking Cancellation</h3>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Are you sure you want to cancel booking <strong>{booking.bookingRef}</strong> for {booking.primaryPassenger.fullName}?
              </p>
              <p className="text-xs text-neutral-500">
                Your reservation status will be updated to <em>Cancelled</em>, and a simulated 100% refund of ₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')} will be credited.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
