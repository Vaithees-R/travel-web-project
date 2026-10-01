import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Ticket,
  Search,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  Plane,
  Train,
  Bus,
  Car,
  X,
  Compass,
} from 'lucide-react';
import { Booking } from '../types/booking';
import { BookingItineraryCard, BookingItineraryItem } from '../components/travel/BookingItineraryCard';
import { TransportBadge } from '../components/ui/TransportBadge';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { cn } from '../utils/cn';

type StatusFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';
type TransportFilter = 'all' | 'flight' | 'train' | 'bus' | 'cab';
type SortBy = 'date_nearest' | 'date_latest' | 'newest' | 'amount_asc' | 'amount_desc';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [transportFilter, setTransportFilter] = useState<TransportFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date_nearest');

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.bookings.list();
      setBookings(data);
    } catch (err: any) {
      console.error('Failed to load user bookings', err);
      setError(err?.message || 'Unable to retrieve your bookings. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Actual counts strictly from PostgreSQL-loaded data
  const summaryCounts = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === 'upcoming').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
    const total = bookings.length;
    return { upcoming, completed, cancelled, total };
  }, [bookings]);

  // Nearest upcoming trip for visual priority highlight
  const nextTrip = useMemo(() => {
    const upcomingList = bookings.filter((b) => b.status === 'upcoming');
    if (upcomingList.length === 0) return null;

    // Sort upcoming by closest date or fallback to creation date
    return [...upcomingList].sort((a, b) => {
      const dateA = Date.parse(a.searchCriteria?.departureDate || '') || new Date(a.createdAt).getTime();
      const dateB = Date.parse(b.searchCriteria?.departureDate || '') || new Date(b.createdAt).getTime();
      return dateA - dateB;
    })[0];
  }, [bookings]);

  // Pure, non-mutating client-side filtering and sorting
  const processedBookings = useMemo(() => {
    let result = [...bookings];

    // 1. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }

    // 2. Transport Filter
    if (transportFilter !== 'all') {
      result = result.filter((b) => b.service === transportFilter);
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const refMatch = b.bookingRef?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q);
        const originMatch =
          b.travelOption?.originCity?.toLowerCase().includes(q) ||
          b.travelOption?.originCode?.toLowerCase().includes(q) ||
          b.searchCriteria?.from?.toLowerCase().includes(q);
        const destMatch =
          b.travelOption?.destinationCity?.toLowerCase().includes(q) ||
          b.travelOption?.destinationCode?.toLowerCase().includes(q) ||
          b.searchCriteria?.to?.toLowerCase().includes(q);
        const operatorMatch =
          b.travelOption?.operator?.toLowerCase().includes(q) ||
          b.travelOption?.identifier?.toLowerCase().includes(q) ||
          b.travelOption?.subType?.toLowerCase().includes(q);
        return refMatch || originMatch || destMatch || operatorMatch;
      });
    }

    // 4. Deterministic Sorting
    result.sort((a, b) => {
      const dateA = Date.parse(a.searchCriteria?.departureDate || '') || new Date(a.createdAt).getTime();
      const dateB = Date.parse(b.searchCriteria?.departureDate || '') || new Date(b.createdAt).getTime();
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      const fareA = a.fareBreakdown?.totalFare || 0;
      const fareB = b.fareBreakdown?.totalFare || 0;

      switch (sortBy) {
        case 'date_nearest':
          // Prioritize upcoming trips, then nearest dates
          if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
          if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
          return dateA - dateB || createdB - createdA;
        case 'date_latest':
          return dateB - dateA;
        case 'newest':
          return createdB - createdA;
        case 'amount_asc':
          return fareA - fareB;
        case 'amount_desc':
          return fareB - fareA;
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, statusFilter, transportFilter, searchQuery, sortBy]);

  // Convert Booking to BookingItineraryItem
  const toItineraryItem = (b: Booking): BookingItineraryItem => {
    return {
      id: b.id,
      bookingRef: b.bookingRef,
      type: b.service,
      serviceTitle: `${b.travelOption.operator} ${b.travelOption.identifier || ''}`.trim(),
      status: b.status,
      originCity: b.travelOption.originCity || b.searchCriteria.from,
      originDetail: b.travelOption.originStationOrTerminal || `${b.travelOption.originCode || ''} Terminal`,
      destinationCity: b.travelOption.destinationCity || b.searchCriteria.to,
      destinationDetail: b.travelOption.destinationStationOrTerminal || `${b.travelOption.destinationCode || ''} Terminal`,
      departureDate: b.searchCriteria.departureDate,
      departureTime: b.travelOption.departureTime,
      arrivalDate: b.searchCriteria.departureDate,
      arrivalTime: b.travelOption.arrivalTime,
      passengers: b.passengersCount,
      passengerNames: [b.primaryPassenger.fullName],
      seatOrBerth: b.seatOrBerthAllocated,
      fare: b.fareBreakdown.totalFare,
      paymentStatus: b.paymentStatus || 'paid',
      paymentMethod: b.paymentMethod || 'card',
      paymentReference: b.paymentReference,
      cabinOrClass: b.travelOption.selectedClass,
      subType: b.travelOption.subType,
      vehicleCategory: b.travelOption.cabCategory,
      tripType: b.searchCriteria.tripType === 'oneway' ? 'One-Way' : 'Roundtrip',
      operator: b.travelOption.operator,
      identifier: b.travelOption.identifier,
    };
  };

  const handleViewDetails = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTransportFilter('all');
    setSearchQuery('');
    setSortBy('date_nearest');
  };

  // Sample Seeder for portfolio demonstration
  const handleSeedSamples = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      await api.bookings.create({
        service: 'flight',
        travelOption: {
          id: 'fl_del_bom_exp',
          service: 'flight',
          operator: 'IndiGo',
          identifier: '6E 2134',
          subType: 'Airbus A321neo',
          originCity: 'Delhi',
          originCode: 'DEL',
          originStationOrTerminal: 'Indira Gandhi Int’l Airport (T3)',
          destinationCity: 'Mumbai',
          destinationCode: 'BOM',
          destinationStationOrTerminal: 'Chhatrapati Shivaji Maharaj (T2)',
          departureTime: '06:15 AM',
          arrivalTime: '08:30 AM',
          duration: '2h 15m',
          stops: 0,
          baseFare: 4500,
          availableUnits: 12,
        },
        searchCriteria: {
          service: 'flight',
          from: 'Delhi',
          to: 'Mumbai',
          departureDate: 'Tomorrow, 06:15 AM',
          tripType: 'oneway',
          passengers: 1,
        },
        primaryPassenger: {
          id: 'pax_demo_1',
          fullName: user.fullName || 'Demo Traveler',
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          gender: 'male',
          age: 32,
          berthOrSeatPreference: 'Window Seat (12A)',
        },
        passengersCount: 1,
        seatOrBerthAllocated: 'Seat 12A • Window (Economy)',
        fareBreakdown: {
          baseFarePerPassenger: 4500,
          passengerCount: 1,
          subtotalBaseFare: 4500,
          taxesAndTerminalFees: 575,
          safetyOrServiceFee: 150,
          totalFare: 5225,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paymentReference: 'TXN-2026-CARD-SEED101',
      });

      await api.bookings.create({
        service: 'train',
        travelOption: {
          id: 'tr_mas_sbc_vb',
          service: 'train',
          operator: 'Vande Bharat Express',
          identifier: '#20607',
          subType: 'Semi-High Speed Trainset',
          originCity: 'Chennai',
          originCode: 'MAS',
          originStationOrTerminal: 'Puratchi Thalaivar Dr. MGR Central',
          destinationCity: 'Bengaluru',
          destinationCode: 'SBC',
          destinationStationOrTerminal: 'KSR Bengaluru City Junction',
          departureTime: '05:50 AM',
          arrivalTime: '10:15 AM',
          duration: '4h 25m',
          stops: 2,
          baseFare: 1100,
          availableUnits: 24,
        },
        searchCriteria: {
          service: 'train',
          from: 'Chennai',
          to: 'Bengaluru',
          departureDate: 'Next Monday, 05:50 AM',
          tripType: 'oneway',
          passengers: 1,
        },
        primaryPassenger: {
          id: 'pax_demo_2',
          fullName: user.fullName || 'Demo Traveler',
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          gender: 'male',
          age: 32,
          berthOrSeatPreference: 'Aisle Seat (Coach C3)',
        },
        passengersCount: 1,
        seatOrBerthAllocated: 'Coach C3 • Seat 24 (CC)',
        fareBreakdown: {
          baseFarePerPassenger: 1100,
          passengerCount: 1,
          subtotalBaseFare: 1100,
          taxesAndTerminalFees: 95,
          safetyOrServiceFee: 50,
          totalFare: 1245,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        paymentReference: 'TXN-2026-UPI-SEED102',
      });

      await fetchBookings();
    } catch (e) {
      console.error('Error seeding demo itineraries', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Ticket className="w-3.5 h-3.5" />
              <span>Travel Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              My Trips
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Manage your upcoming and past journeys in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchBookings}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
              title="Refresh bookings from server"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin text-emerald-600')} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Localized Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchBookings}
              className="font-semibold text-rose-700 hover:underline shrink-0"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 1. Summary Cards (Computed from actual PostgreSQL booking data) */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-neutral-200 animate-pulse p-4" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Upcoming */}
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
              className={cn(
                'p-5 rounded-2xl border text-left transition-all duration-200 bg-white shadow-2xs group hover:border-emerald-300',
                statusFilter === 'upcoming' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-neutral-200'
              )}
            >
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Upcoming
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {summaryCounts.upcoming}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block group-hover:text-emerald-700 transition-colors">
                Confirmed journeys →
              </span>
            </button>

            {/* Completed */}
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
              className={cn(
                'p-5 rounded-2xl border text-left transition-all duration-200 bg-white shadow-2xs group hover:border-neutral-400',
                statusFilter === 'completed' ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200'
              )}
            >
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Completed
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-800">
                {summaryCounts.completed}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block group-hover:text-neutral-900 transition-colors">
                Past itineraries →
              </span>
            </button>

            {/* Cancelled */}
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'cancelled' ? 'all' : 'cancelled')}
              className={cn(
                'p-5 rounded-2xl border text-left transition-all duration-200 bg-white shadow-2xs group hover:border-rose-300',
                statusFilter === 'cancelled' ? 'ring-2 ring-rose-500 border-rose-500' : 'border-neutral-200'
              )}
            >
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Cancelled
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                {summaryCounts.cancelled}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block group-hover:text-rose-700 transition-colors">
                Simulated refunds →
              </span>
            </button>

            {/* Total Trips */}
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={cn(
                'p-5 rounded-2xl border text-left transition-all duration-200 bg-white shadow-2xs group hover:border-neutral-400',
                statusFilter === 'all' ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200'
              )}
            >
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Total Trips
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {summaryCounts.total}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block group-hover:text-neutral-900 transition-colors">
                All records →
              </span>
            </button>
          </div>
        )}

        {/* 2. NEXT TRIP Highlight (Strong visual priority for upcoming travel) */}
        {!isLoading && nextTrip && statusFilter !== 'completed' && statusFilter !== 'cancelled' && !searchQuery && (
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-neutral-950">
                    NEXT TRIP
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                    <span className="font-mono">{nextTrip.bookingRef}</span>
                    <span>•</span>
                    <span className="capitalize">{nextTrip.service}</span>
                  </div>
                </div>

                {/* Route Header */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block">
                      {nextTrip.travelOption.originCity}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">
                      {nextTrip.travelOption.originCode || 'DEP'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] text-neutral-400 font-mono">{nextTrip.travelOption.duration || 'Direct'}</span>
                    <div className="w-16 sm:w-24 h-0.5 bg-neutral-600 relative my-1">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block">
                      {nextTrip.travelOption.destinationCity}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">
                      {nextTrip.travelOption.destinationCode || 'ARR'}
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>{nextTrip.searchCriteria.departureDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>{nextTrip.travelOption.departureTime}</span>
                  </div>
                  <div className="text-neutral-400">
                    {nextTrip.travelOption.operator} · {nextTrip.travelOption.identifier}
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-8">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                    Paid
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleViewDetails(nextTrip.id)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>View Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Filter Controls & Search Bar */}
        {!isLoading && bookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200 shadow-2xs">
              {/* Left: Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl overflow-x-auto text-xs font-medium scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap',
                    statusFilter === 'all'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  All ({summaryCounts.total})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('upcoming')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap',
                    statusFilter === 'upcoming'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  Upcoming ({summaryCounts.upcoming})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('completed')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap',
                    statusFilter === 'completed'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  Completed ({summaryCounts.completed})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('cancelled')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap',
                    statusFilter === 'cancelled'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  Cancelled ({summaryCounts.cancelled})
                </button>
              </div>

              {/* Middle & Right: Transport Mode Filter, Search Input & Sort dropdown */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* Transport Filter Pills */}
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setTransportFilter('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-xl transition-all',
                      transportFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-500'
                    )}
                    title="All transport modes"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportFilter('flight')}
                    className={cn(
                      'p-1.5 rounded-xl transition-all',
                      transportFilter === 'flight' ? 'bg-white text-sky-600 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                    )}
                    title="Flights"
                    aria-label="Filter flights"
                  >
                    <Plane className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportFilter('train')}
                    className={cn(
                      'p-1.5 rounded-xl transition-all',
                      transportFilter === 'train' ? 'bg-white text-amber-600 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                    )}
                    title="Trains"
                    aria-label="Filter trains"
                  >
                    <Train className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportFilter('bus')}
                    className={cn(
                      'p-1.5 rounded-xl transition-all',
                      transportFilter === 'bus' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                    )}
                    title="Buses"
                    aria-label="Filter buses"
                  >
                    <Bus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportFilter('cab')}
                    className={cn(
                      'p-1.5 rounded-xl transition-all',
                      transportFilter === 'cab' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-neutral-400 hover:text-neutral-700'
                    )}
                    title="Cabs"
                    aria-label="Filter cabs"
                  >
                    <Car className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search PNR, city, operator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-7 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="relative shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="h-9 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                  >
                    <option value="date_nearest">Travel date — nearest</option>
                    <option value="date_latest">Travel date — latest</option>
                    <option value="newest">Newest booking</option>
                    <option value="amount_asc">Amount — low to high</option>
                    <option value="amount_desc">Amount — high to low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Trips Content Area */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State 1: No Trips Ever Booked */
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-14 text-center space-y-8 shadow-xs">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                You haven&apos;t booked any trips yet.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                When you book flights, trains, buses, or cabs in VoyageHub, your verified tickets and itineraries will be organized right here.
              </p>
            </div>

            {/* Quick-Action Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
              <Link
                to="/flights"
                className="p-5 rounded-2xl border border-neutral-200 hover:border-sky-400 hover:shadow-md transition-all group text-left bg-neutral-50/50 hover:bg-sky-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <TransportBadge type="flight" size="sm" variant="subtle" />
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Explore Flights</h3>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Domestic & international corridors with seat selection.
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-sky-700">Explore Flights →</div>
              </Link>

              <Link
                to="/trains"
                className="p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 hover:shadow-md transition-all group text-left bg-neutral-50/50 hover:bg-amber-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <TransportBadge type="train" size="sm" variant="subtle" />
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Explore Trains</h3>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Vande Bharat, Rajdhani & express berths with live PNR.
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-amber-800">Explore Trains →</div>
              </Link>

              <Link
                to="/buses"
                className="p-5 rounded-2xl border border-neutral-200 hover:border-emerald-400 hover:shadow-md transition-all group text-left bg-neutral-50/50 hover:bg-emerald-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <TransportBadge type="bus" size="sm" variant="subtle" />
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Explore Buses</h3>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Volvo 9600 multi-axle luxury sleepers & express coaches.
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-emerald-700">Explore Buses →</div>
              </Link>

              <Link
                to="/cabs"
                className="p-5 rounded-2xl border border-neutral-200 hover:border-indigo-400 hover:shadow-md transition-all group text-left bg-neutral-50/50 hover:bg-indigo-50/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <TransportBadge type="cab" size="sm" variant="subtle" />
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">Explore Cabs</h3>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Airport transfers, outstation sedans, and executive chauffeurs.
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-indigo-700">Explore Cabs →</div>
              </Link>
            </div>

            {/* Demonstration Sample Seeding Action */}
            <div className="pt-4 border-t border-neutral-100 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleSeedSamples}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Populate demo sample journeys</span>
              </button>
            </div>
          </div>
        ) : processedBookings.length === 0 ? (
          /* Empty States 2, 3, 4: Contextual Filter Empty States */
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
            <Ticket className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              {searchQuery
                ? 'No trips match your search.'
                : statusFilter === 'upcoming'
                ? 'No upcoming journeys.'
                : statusFilter === 'cancelled'
                ? 'No cancelled trips.'
                : 'No trips match the selected filters.'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {searchQuery
                ? `No itineraries found matching "${searchQuery}". Try a different city, reference number, or clear search.`
                : statusFilter === 'upcoming'
                ? 'Ready to embark on a new adventure? Explore our flight, train, bus, or cab inventory.'
                : 'Change your filter selection to view your other saved journeys.'}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              {statusFilter === 'upcoming' && !searchQuery ? (
                <Link
                  to="/flights"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Plan a Trip
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Filtered Itineraries List */
          <div className="space-y-4">
            <div className="text-xs font-semibold text-neutral-500 flex items-center justify-between px-1">
              <span>Showing {processedBookings.length} {processedBookings.length === 1 ? 'journey' : 'journeys'}</span>
              {(statusFilter !== 'all' || transportFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Reset filters
                </button>
              )}
            </div>

            {processedBookings.map((b) => (
              <BookingItineraryCard
                key={b.id}
                booking={toItineraryItem(b)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
