import React from 'react';
import { Calendar, Clock, Users, Download, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import { TransportBadge, TransportType } from '../ui/TransportBadge';
import { cn } from '../../utils/cn';

export interface BookingItineraryItem {
  id: string;
  bookingRef: string; // e.g. "VOY-8910" or "PNR 2489104820"
  type: TransportType;
  serviceTitle: string; // e.g. "IndiGo 6E 2134", "Vande Bharat Express #20607"
  status: 'upcoming' | 'completed' | 'cancelled';
  originCity: string;
  originDetail?: string; // Terminal 3, Majestic, etc.
  destinationCity: string;
  destinationDetail?: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  passengers: number;
  passengerNames?: string[];
  seatOrBerth?: string; // e.g. "Seat 12F", "Coach C3, 24", "Berth U4"
  fare: number;
  paymentStatus?: string;
  paymentMethod?: string;
}

export interface BookingItineraryCardProps {
  booking: BookingItineraryItem;
  className?: string;
  onViewDetails?: (id: string) => void;
}

export const BookingItineraryCard: React.FC<BookingItineraryCardProps> = ({
  booking,
  className,
  onViewDetails,
}) => {
  const statusConfig = {
    upcoming: {
      label: 'Confirmed • Upcoming',
      icon: CheckCircle,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    completed: {
      label: 'Journey Completed',
      icon: CheckCircle,
      badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    },
    cancelled: {
      label: 'Booking Cancelled',
      icon: AlertCircle,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
  }[booking.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={cn(
        'group bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md',
        booking.status === 'cancelled'
          ? 'border-neutral-200/80 opacity-80'
          : 'border-neutral-200/90 hover:border-neutral-300',
        className
      )}
    >
      {/* Top Header: Transport Type, PNR Reference, Status */}
      <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TransportBadge type={booking.type} size="md" variant="subtle" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-neutral-900">
              {booking.serviceTitle}
            </span>
            <span className="font-mono text-[11px] text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
              {booking.bookingRef}
            </span>
          </div>
        </div>

        <div className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border', statusConfig.badgeClass)}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Main Itinerary Content */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Route Details */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            {/* Origin */}
            <div>
              <div className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                {booking.originCity}
              </div>
              {booking.originDetail && (
                <div className="text-xs text-neutral-500 mt-0.5">
                  {booking.originDetail}
                </div>
              )}
            </div>

            {/* Connecting visual arrow */}
            <div className="flex-1 flex flex-col items-center px-2 max-w-[120px]">
              <span className="text-[10px] text-neutral-400 font-mono">one-way</span>
              <div className="w-full h-[1.5px] bg-neutral-300 relative my-1">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neutral-600" />
              </div>
            </div>

            {/* Destination */}
            <div>
              <div className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                {booking.destinationCity}
              </div>
              {booking.destinationDetail && (
                <div className="text-xs text-neutral-500 mt-0.5">
                  {booking.destinationDetail}
                </div>
              )}
            </div>
          </div>

          {/* Schedule & Seating Meta */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.departureDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.departureTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>{booking.passengers} {booking.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
            </div>
            {booking.seatOrBerth && (
              <div className="font-mono text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                {booking.seatOrBerth}
              </div>
            )}
          </div>
        </div>

        {/* Fare & Quick Actions */}
        <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] text-neutral-400">Total fare paid</span>
              {booking.paymentStatus && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus}
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-neutral-900 font-mono">
              ₹{booking.fare.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-neutral-500 capitalize">
              {booking.paymentMethod ? `via ${booking.paymentMethod.replace('_', ' ')}` : 'Instant Confirmation'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails?.(booking.id)}
              className="flex-1 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span>View Itinerary</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-xl transition-colors"
              title="Download E-Ticket PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
