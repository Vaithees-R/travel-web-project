import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { TransportBadge } from '../ui/TransportBadge';

export interface AccountStatsProps {
  totalTrips: number;
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
}

export const AccountStats: React.FC<AccountStatsProps> = ({
  totalTrips,
  upcomingCount,
  completedCount,
  cancelledCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Bookings</span>
            <Ticket className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-neutral-900 font-mono">{totalTrips}</div>
          <span className="text-[10px] text-neutral-500 block">All recorded journeys</span>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Upcoming</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">{upcomingCount}</div>
          <span className="text-[10px] text-neutral-500 block">Confirmed itineraries</span>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-neutral-800 font-mono">{completedCount}</div>
          <span className="text-[10px] text-neutral-500 block">Past travel records</span>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cancelled</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">{cancelledCount}</div>
          <span className="text-[10px] text-neutral-500 block">Simulated refunds</span>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Explore & Book Travel
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Instant access to unified travel corridors.
            </p>
          </div>
          <Link
            to="/bookings"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Link
            to="/flights"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-sky-400 hover:bg-sky-50/30 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <TransportBadge type="flight" size="sm" variant="subtle" className="mb-2" />
              <div className="font-bold text-xs text-neutral-900 group-hover:text-sky-700">Book Flights</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Domestic & Int&apos;l</div>
            </div>
            <span className="text-[11px] font-semibold text-sky-700 mt-3 block">Explore →</span>
          </Link>

          <Link
            to="/trains"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <TransportBadge type="train" size="sm" variant="subtle" className="mb-2" />
              <div className="font-bold text-xs text-neutral-900 group-hover:text-amber-800">Book Trains</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Vande Bharat & Express</div>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 mt-3 block">Explore →</span>
          </Link>

          <Link
            to="/buses"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <TransportBadge type="bus" size="sm" variant="subtle" className="mb-2" />
              <div className="font-bold text-xs text-neutral-900 group-hover:text-emerald-800">Book Buses</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Volvo AC Sleepers</div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-3 block">Explore →</span>
          </Link>

          <Link
            to="/cabs"
            className="p-4 rounded-2xl border border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <TransportBadge type="cab" size="sm" variant="subtle" className="mb-2" />
              <div className="font-bold text-xs text-neutral-900 group-hover:text-indigo-800">Book Cabs</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Outstation & Transfers</div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 mt-3 block">Explore →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
