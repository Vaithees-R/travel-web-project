import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types/booking';
import { TransportBadge } from '../ui/TransportBadge';
import { Calendar, ArrowRight, MapPin, Ticket, CheckCircle, Clock, XCircle } from 'lucide-react';

export interface AccountActivityProps {
  bookings: Booking[];
}

export const AccountActivity: React.FC<AccountActivityProps> = ({ bookings }) => {
  // Sort bookings by creation date descending
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const upcomingTrips = sorted.filter((b) => b.status === 'upcoming');
  const nextUpcoming = upcomingTrips[0];
  const otherRecent = sorted.filter((b) => b.id !== nextUpcoming?.id).slice(0, 3);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>COMPLETED</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>CANCELLED</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-5 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
          <Ticket className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            No Travel Activity Yet
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Your travel history is completely empty. Explore domestic flights, Vande Bharat trains, luxury buses, or cabs to begin your journey.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/flights"
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
          >
            Search Flights
          </Link>
          <Link
            to="/trains"
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold transition-colors"
          >
            Search Trains
          </Link>
          <Link
            to="/buses"
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold transition-colors"
          >
            Search Buses
          </Link>
          <Link
            to="/cabs"
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold transition-colors"
          >
            Book Cab
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Next Upcoming Journey Card */}
      {nextUpcoming && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Next Upcoming Journey
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {nextUpcoming.bookingRef}
              </span>
            </div>
            {getStatusBadge(nextUpcoming.status)}
          </div>

          <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <TransportBadge type={nextUpcoming.service} size="sm" variant="subtle" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">
                    {nextUpcoming.travelOption.operator}{' '}
                    <span className="font-mono text-xs text-neutral-500">
                      ({nextUpcoming.travelOption.identifier})
                    </span>
                  </h4>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{nextUpcoming.searchCriteria.departureDate}</span>
                    <span>•</span>
                    <span>Seat {nextUpcoming.seatOrBerthAllocated}</span>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-800">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{nextUpcoming.travelOption.originCity} ({nextUpcoming.travelOption.originCode})</span>
                </div>
                <span className="text-neutral-300">→</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{nextUpcoming.travelOption.destinationCity} ({nextUpcoming.travelOption.destinationCode})</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-200 gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">Total Fare</span>
                <span className="text-base font-black text-neutral-900 font-mono">
                  ₹{nextUpcoming.fareBreakdown.totalFare.toLocaleString('en-IN')}
                </span>
              </div>
              <Link
                to={`/bookings/${nextUpcoming.id}`}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Recent Travel Feed */}
      {otherRecent.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">
              Recent Itineraries
            </h3>
            <Link
              to="/bookings"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {otherRecent.map((trip) => (
              <div key={trip.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TransportBadge type={trip.service} size="sm" variant="subtle" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">
                        {trip.travelOption.originCity} to {trip.travelOption.destinationCity}
                      </span>
                      {getStatusBadge(trip.status)}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                      {trip.bookingRef} • {trip.searchCriteria.departureDate}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/bookings/${trip.id}`}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors shrink-0"
                >
                  View Pass
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
