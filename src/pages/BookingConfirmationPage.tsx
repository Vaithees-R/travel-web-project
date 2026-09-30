import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Printer, ArrowRight, Ticket, QrCode, Loader2 } from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { Booking } from '../types/booking';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';
import { api } from '../services/api';

export const BookingConfirmationPage: React.FC = () => {
  const { service: rawService, bookingId } = useParams<{ service: string; bookingId: string }>();
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const service: CanonicalTransportType = 
    rawService === 'flights' || rawService === 'flight' ? 'flight' :
    rawService === 'trains' || rawService === 'train' ? 'train' :
    rawService === 'buses' || rawService === 'bus' ? 'bus' : 'cab';

  useEffect(() => {
    let isMounted = true;
    if (!bookingId) {
      setBooking(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.bookings
      .get(bookingId)
      .then((data) => {
        if (isMounted) setBooking(data);
      })
      .catch((err) => {
        console.warn('Booking confirmation fetch error', err);
        if (isMounted) setBooking(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const handleCopyRef = () => {
    if (booking?.bookingRef) {
      navigator.clipboard?.writeText(booking.bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-medium">Generating your digital boarding pass & e-ticket...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4">
          <Ticket className="w-12 h-12 text-neutral-400 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Booking Record Not Found</h2>
          <p className="text-xs text-neutral-500">
            We couldn&apos;t locate this booking reference in the database.
          </p>
          <Link
            to="/bookings"
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BookingStepIndicator currentStep="confirmation" service={service} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Celebration Header Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Booking Successfully Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Your simulated reservation is secured. An e-ticket copy has been added to your local itinerary.
          </p>
        </div>

        {/* Boarding Pass / E-Ticket Card Preview */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="p-6 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TransportBadge type={booking.service} size="md" variant="subtle" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  VoyageHub Official E-Ticket
                </span>
                <span className="text-base font-bold text-white">
                  {booking.travelOption.operator} ({booking.travelOption.identifier})
                </span>
              </div>
            </div>

            {/* PNR / Reference Code with Copy */}
            <div className="flex items-center gap-2 bg-neutral-800/90 px-3.5 py-1.5 rounded-xl border border-neutral-700">
              <div className="text-right">
                <span className="text-[10px] uppercase text-neutral-400 block">Booking Reference</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                  {booking.bookingRef}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="Copy Reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Route & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-neutral-100 pb-6">
              {/* Origin */}
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Origin</span>
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

              {/* Journey Duration */}
              <div className="text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-neutral-100">
                <span className="text-xs font-semibold text-neutral-700">{booking.travelOption.duration}</span>
                <div className="w-full max-w-[120px] mx-auto h-[1.5px] bg-neutral-200 my-1" />
                <span className="text-[10px] text-neutral-400 block">{booking.searchCriteria.departureDate}</span>
              </div>

              {/* Destination */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Destination</span>
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

            {/* Passenger & Allocation Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-medium block">Passenger Name</span>
                <span className="font-bold text-neutral-900 text-sm">{booking.primaryPassenger.fullName}</span>
                <span className="text-[11px] text-neutral-500 block">{booking.primaryPassenger.email}</span>
                {booking.additionalPassengers && booking.additionalPassengers.length > 0 && (
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    + {booking.additionalPassengers.length} accompanying traveller(s)
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-medium block">Allocated Seat / Berth</span>
                <span className="font-mono font-bold text-neutral-900 text-sm">{booking.seatOrBerthAllocated}</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">Confirmed & Ready</span>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-medium block">Payment Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200/60 mt-0.5">
                  <Check className="w-3 h-3" />
                  <span>{booking.paymentStatus === 'paid' ? 'Paid' : 'Paid (Simulated)'}</span>
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1 capitalize font-medium">
                  Via {booking.paymentMethod?.replace('_', ' ') || 'Card'}
                </span>
                {booking.paymentReference && (
                  <span className="text-[9px] font-mono text-neutral-400 block truncate max-w-[140px]" title={booking.paymentReference}>
                    {booking.paymentReference}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-medium block">Total Fare Paid</span>
                <span className="font-mono font-bold text-neutral-900 text-base">
                  ₹{booking.fareBreakdown.totalFare.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">ID: {booking.id}</span>
              </div>
            </div>

            {/* Barcode & Simulated QR representation */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-dashed border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 rounded-xl">
                  <QrCode className="w-8 h-8 text-neutral-800" />
                </div>
                <div className="text-[11px] text-neutral-500">
                  <span className="font-mono text-neutral-700 block">VALID SIMULATED TICKET</span>
                  <span>Present digital copy at boarding terminal</span>
                </div>
              </div>

              <div className="font-mono text-[10px] text-neutral-400 tracking-widest text-center sm:text-right">
                ||||| | |||| ||| ||||||| | ||| |||||
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save E-Ticket</span>
            </button>

            <Link
              to={`/bookings/${booking.id}`}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs transition-colors"
            >
              Manage Booking
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
            >
              Book Another Trip
            </Link>

            <Link
              to="/bookings"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
            >
              <span>View in My Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
