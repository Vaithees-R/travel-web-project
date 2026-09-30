import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket, Search, ArrowRight, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Booking } from '../types/booking';
import { BookingItineraryCard, BookingItineraryItem } from '../components/travel/BookingItineraryCard';
import { TransportBadge } from '../components/ui/TransportBadge';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      setError(err?.message || 'Unable to retrieve your bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Map Booking to BookingItineraryItem for the card component
  const itineraryItems: BookingItineraryItem[] = bookings.map((b) => ({
    id: b.id,
    bookingRef: b.bookingRef,
    type: b.service,
    serviceTitle: `${b.travelOption.operator} ${b.travelOption.identifier || ''}`.trim(),
    status: b.status,
    originCity: b.travelOption.originCity,
    originDetail: b.travelOption.originStationOrTerminal || `${b.travelOption.originCode} Station/Terminal`,
    destinationCity: b.travelOption.destinationCity,
    destinationDetail: b.travelOption.destinationStationOrTerminal || `${b.travelOption.destinationCode} Station/Terminal`,
    departureDate: b.searchCriteria.departureDate,
    departureTime: b.travelOption.departureTime,
    arrivalDate: b.searchCriteria.departureDate,
    arrivalTime: b.travelOption.arrivalTime,
    passengers: b.passengersCount,
    passengerNames: [b.primaryPassenger.fullName],
    seatOrBerth: b.seatOrBerthAllocated,
    fare: b.fareBreakdown.totalFare,
  }));

  // Counts for the filter tabs
  const upcomingCount = itineraryItems.filter((b) => b.status === 'upcoming').length;
  const completedCount = itineraryItems.filter((b) => b.status === 'completed').length;
  const cancelledCount = itineraryItems.filter((b) => b.status === 'cancelled').length;

  const filteredBookings = itineraryItems
    .filter((b) => (filter === 'all' ? true : b.status === filter))
    .filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.bookingRef.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.originCity.toLowerCase().includes(q) ||
        b.destinationCity.toLowerCase().includes(q)
      );
    });

  const handleViewDetails = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleSeedSamples = async () => {
    if (!user) return;
    const sample1: Booking = {
      id: 'VH-2026-9DF4X',
      userId: user.id,
      bookingRef: 'PNR 9DF4X2',
      service: 'flight',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      travelOption: {
        id: 'fl-del-bom-1',
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
        baseFare: 4299,
        availableUnits: 18,
        rating: 4.7,
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
        id: 'pax-sample-1',
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        gender: 'male',
        age: 32,
        berthOrSeatPreference: 'Window Seat',
      },
      passengersCount: 1,
      seatOrBerthAllocated: 'Seat 12F • Window (Economy)',
      fareBreakdown: {
        baseFarePerPassenger: 4299,
        passengerCount: 1,
        subtotalBaseFare: 4299,
        taxesAndTerminalFees: 480,
        safetyOrServiceFee: 149,
        totalFare: 4928,
        currency: 'INR',
      },
      isSimulated: true,
    };

    const sample2: Booking = {
      id: 'VH-2026-43289',
      userId: user.id,
      bookingRef: 'PNR 432-8910482',
      service: 'train',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      travelOption: {
        id: 'tr-mas-sbc-1',
        service: 'train',
        operator: 'Vande Bharat Express',
        identifier: '#20607',
        subType: 'Semi-High Speed Trainset',
        originCity: 'Chennai Central',
        originCode: 'MAS',
        originStationOrTerminal: 'Puratchi Thalaivar Dr. MGR Central',
        destinationCity: 'Bengaluru City',
        destinationCode: 'SBC',
        destinationStationOrTerminal: 'KSR Bengaluru Station',
        departureTime: '05:50 AM',
        arrivalTime: '10:15 AM',
        duration: '4h 25m',
        stops: 2,
        baseFare: 1450,
        availableUnits: 42,
        rating: 4.9,
      },
      searchCriteria: {
        service: 'train',
        from: 'Chennai Central',
        to: 'Bengaluru City',
        departureDate: 'Friday, 05:50 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      primaryPassenger: {
        id: 'pax-sample-2',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43211',
        gender: 'female',
        age: 29,
        berthOrSeatPreference: 'AC Chair Car',
      },
      passengersCount: 1,
      seatOrBerthAllocated: 'Coach C3 • Seat 24 (CC)',
      fareBreakdown: {
        baseFarePerPassenger: 1450,
        passengerCount: 1,
        subtotalBaseFare: 1450,
        taxesAndTerminalFees: 120,
        safetyOrServiceFee: 50,
        totalFare: 1620,
        currency: 'INR',
      },
      isSimulated: true,
    };

    try {
      setIsLoading(true);
      await api.bookings.create(sample1);
      await api.bookings.create(sample2);
      await fetchBookings();
    } catch (err: any) {
      console.error('Failed to seed sample bookings to API', err);
      setError('Could not populate demonstration itineraries.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-xs sm:text-sm text-neutral-500 font-medium">Loading your travel itineraries from PostgreSQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-rose-200 rounded-3xl text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-neutral-900">Failed to Load Bookings</h3>
        <p className="text-xs text-neutral-500">{error}</p>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Top Editorial Itinerary Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Ticket className="w-3.5 h-3.5" />
            <span>Passenger Itinerary Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            My Travel Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            Unified travel documents across air, railway, highway coaches, and chauffeur services.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 bg-neutral-100/80 p-2 rounded-2xl border border-neutral-200/60 self-start sm:self-auto">
          <span>Total: <strong className="text-neutral-900 font-semibold">{bookings.length}</strong></span>
          <span>•</span>
          <span>Upcoming: <strong className="text-emerald-700 font-semibold">{upcomingCount}</strong></span>
          <span>•</span>
          <span>Completed: <strong className="text-neutral-700 font-semibold">{completedCount}</strong></span>
        </div>
      </div>

      {/* When no bookings exist for this user, render realistic empty state */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-8 shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500">
              <Ticket className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              You haven&apos;t booked a journey yet.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              When you book flights, trains, coaches, or cabs in VoyageHub, your personal simulated e-tickets and itineraries will appear here.
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
                  Domestic & international air corridors with seat allocation.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-sky-700">Book Air Ticket →</div>
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
                  Vande Bharat, Rajdhani & express berths with live PNR tracking.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-amber-800">Book Train Berth →</div>
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
                  Volvo 9600 multi-axle luxury sleepers & highway express coaches.
                </p>
              </div>
              <div className="pt-3 text-[11px] font-semibold text-emerald-700">Book Bus Berth →</div>
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
              <div className="pt-3 text-[11px] font-semibold text-indigo-700">Book Chauffeur →</div>
            </Link>
          </div>

          {/* Sample Seeding Action */}
          <div className="pt-4 border-t border-neutral-100 max-w-sm mx-auto">
            <button
              type="button"
              onClick={handleSeedSamples}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or populate with demonstration sample itineraries</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Itinerary Filter & PNR Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Navigation Tabs */}
            <div className="flex items-center bg-neutral-100/90 p-1.5 rounded-2xl text-xs font-medium self-start">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Journeys ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('upcoming')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'upcoming'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'completed'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('cancelled')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'cancelled'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>

            {/* PNR Quick Search Input */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by PNR, booking ref, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-neutral-700 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Itinerary Entries List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((item) => (
                <BookingItineraryCard
                  key={item.id}
                  booking={item}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-200 rounded-3xl p-8 space-y-3">
                <Ticket className="w-8 h-8 text-neutral-400 mx-auto" />
                <h3 className="font-semibold text-base text-neutral-800">No matching itineraries found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  There are no journeys matching this filter or search query. Try switching filters or search terms.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Synchronized PNR Inquiry Banner */}
      <div className="p-6 bg-neutral-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold">Have an external booking reference?</h4>
          <p className="text-xs text-neutral-400">
            Import IRCTC 10-digit PNRs or airline booking codes to add them to your unified travel itinerary.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="e.g. 2489104820"
            className="h-9 px-3 text-xs bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 w-40"
          />
          <button
            type="button"
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};
