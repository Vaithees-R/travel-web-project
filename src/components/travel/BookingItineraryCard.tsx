import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowUpRight, CheckCircle, AlertCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { TransportBadge, TransportType } from '../ui/TransportBadge';
import { cn } from '../../utils/cn';

export interface BookingItineraryItem {
  id: string;
  bookingRef: string;
  type: TransportType;
  serviceTitle: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  originCity: string;
  originDetail?: string;
  destinationCity: string;
  destinationDetail?: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  passengers: number;
  passengerNames?: string[];
  seatOrBerth?: string;
  fare: number;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentReference?: string;
  // Service-specific attributes
  cabinOrClass?: string;
  subType?: string;
  vehicleCategory?: string;
  tripType?: string;
  operator?: string;
  identifier?: string;
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
  const [copied, setCopied] = useState(false);

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (booking.bookingRef) {
      navigator.clipboard?.writeText(booking.bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusConfig = {
    upcoming: {
      label: 'Confirmed',
      icon: CheckCircle,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle,
      badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    },
    cancelled: {
      label: 'Cancelled',
      icon: AlertCircle,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
  }[booking.status];

  const paymentConfig = () => {
    if (booking.paymentStatus === 'refunded' || booking.status === 'cancelled') {
      return {
        label: 'Refunded (Simulated)',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/70',
        icon: RefreshCw,
      };
    }
    if (booking.paymentStatus === 'failed') {
      return {
        label: 'Payment Failed',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: AlertCircle,
      };
    }
    return {
      label: 'Paid',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: CheckCircle,
    };
  };

  const StatusIcon = statusConfig.icon;
  const payConfig = paymentConfig();
  const PayIcon = payConfig.icon;

  // Compute Service-Specific Sub-label
  const renderServiceSpecificBadge = () => {
    switch (booking.type) {
      case 'flight':
        return (
          <span className="text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 font-medium">
            Flight {booking.identifier || ''} {booking.cabinOrClass ? `• ${booking.cabinOrClass}` : ''}
          </span>
        );
      case 'train':
        return (
          <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-medium">
            Train {booking.identifier || ''} {booking.cabinOrClass ? `• Class ${booking.cabinOrClass}` : ''}
          </span>
        );
      case 'bus':
        return (
          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-medium">
            {booking.subType || 'Highway Express Coach'}
          </span>
        );
      case 'cab':
        return (
          <span className="text-[11px] text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-medium">
            {booking.vehicleCategory || 'Executive Sedan'} {booking.tripType ? `• ${booking.tripType}` : ''}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'group bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md',
        booking.status === 'cancelled'
          ? 'border-neutral-200/80 opacity-90'
          : 'border-neutral-200/90 hover:border-neutral-300',
        className
      )}
    >
      {/* Top Header: Transport Type, PNR Reference, Status Badges */}
      <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TransportBadge type={booking.type} size="md" variant="subtle" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {booking.serviceTitle}
            </span>
            <div className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
              <span>{booking.bookingRef}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-0.5"
                title="Copy reference"
                aria-label={`Copy reference ${booking.bookingRef}`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            {renderServiceSpecificBadge()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Booking Status Badge */}
          <div className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', statusConfig.badgeClass)}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          {/* Payment Status Badge */}
          <div className={cn('inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border', payConfig.badgeClass)}>
            <PayIcon className="w-3 h-3" />
            <span>{payConfig.label}</span>
          </div>
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
                <div className="text-xs text-neutral-500 mt-0.5 max-w-[200px] truncate">
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
                <div className="text-xs text-neutral-500 mt-0.5 max-w-[200px] truncate">
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
              <span className="text-[11px] text-neutral-400">Total fare</span>
              <span className="text-[11px] text-neutral-500 capitalize">
                {booking.paymentMethod ? `via ${booking.paymentMethod.replace('_', ' ')}` : 'Card'}
              </span>
            </div>
            <div className="text-xl font-bold text-neutral-900 font-mono">
              ₹{booking.fare.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails?.(booking.id)}
              className="w-full px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View Trip</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
