import React, { useState } from 'react';
import { Ticket, Search } from 'lucide-react';
import { BookingItineraryCard, BookingItineraryItem } from '../components/travel/BookingItineraryCard';

export const BookingsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockBookings: BookingItineraryItem[] = [
    {
      id: 'book-1',
      bookingRef: 'PNR 9DF4X2',
      type: 'flight',
      serviceTitle: 'IndiGo 6E 2134 (Airbus A321neo)',
      status: 'upcoming',
      originCity: 'Delhi',
      originDetail: 'Indira Gandhi Int’l Airport (DEL T3)',
      destinationCity: 'Mumbai',
      destinationDetail: 'Chhatrapati Shivaji Maharaj (BOM T2)',
      departureDate: 'Tomorrow, 15 Oct',
      departureTime: '06:15 AM',
      arrivalDate: 'Tomorrow, 15 Oct',
      arrivalTime: '08:30 AM',
      passengers: 1,
      passengerNames: ['Rahul Sharma'],
      seatOrBerth: 'Seat 12F • Window',
      fare: 4299,
    },
    {
      id: 'book-2',
      bookingRef: 'PNR 432-8910482',
      type: 'train',
      serviceTitle: 'Vande Bharat Express (#20607)',
      status: 'upcoming',
      originCity: 'Chennai Central',
      originDetail: 'Puratchi Thalaivar Dr. MGR Central (MAS)',
      destinationCity: 'Bengaluru City',
      destinationDetail: 'KSR Bengaluru Station (SBC)',
      departureDate: 'Friday, 18 Oct',
      departureTime: '05:50 AM',
      arrivalDate: 'Friday, 18 Oct',
      arrivalTime: '10:15 AM',
      passengers: 2,
      passengerNames: ['Rahul Sharma', 'Priya Sharma'],
      seatOrBerth: 'Coach C3 • Berths 24, 25',
      fare: 1990,
    },
    {
      id: 'book-3',
      bookingRef: 'VOY-BUS-7721',
      type: 'bus',
      serviceTitle: 'IntrCity SmartBus Volvo 9600',
      status: 'completed',
      originCity: 'Bengaluru',
      originDetail: 'Majestic Anand Rao Circle Lounge',
      destinationCity: 'Chennai',
      destinationDetail: 'Koyambedu CMBT Terminus',
      departureDate: '28 Sep',
      departureTime: '10:30 PM',
      arrivalDate: '29 Sep',
      arrivalTime: '05:15 AM',
      passengers: 1,
      passengerNames: ['Rahul Sharma'],
      seatOrBerth: 'Berth U4 • Upper Sleeper',
      fare: 850,
    },
    {
      id: 'book-4',
      bookingRef: 'VOY-CAB-3819',
      type: 'cab',
      serviceTitle: 'Sedan Prime Chauffeur (Dzire)',
      status: 'cancelled',
      originCity: 'Mumbai Airport',
      originDetail: 'Terminal 2 Chauffeur Bay',
      destinationCity: 'Pune City',
      destinationDetail: 'Koregaon Park North Main Rd',
      departureDate: '12 Sep',
      departureTime: '02:00 PM',
      passengers: 2,
      seatOrBerth: 'Dedicated Chauffeur Sedan',
      fare: 2199,
    },
  ];

  // Counts for the filter tabs
  const upcomingCount = mockBookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = mockBookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = mockBookings.filter((b) => b.status === 'cancelled').length;

  const filteredBookings = mockBookings
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

        {/* Quick Summary Pill (Instead of 4 big cards) */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 bg-neutral-100/80 p-2 rounded-2xl border border-neutral-200/60 self-start sm:self-auto">
          <span>Total: <strong className="text-neutral-900 font-semibold">{mockBookings.length}</strong></span>
          <span>•</span>
          <span>Upcoming: <strong className="text-emerald-700 font-semibold">{upcomingCount}</strong></span>
          <span>•</span>
          <span>Completed: <strong className="text-neutral-700 font-semibold">{completedCount}</strong></span>
        </div>
      </div>

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
            All Journeys ({mockBookings.length})
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
          filteredBookings.map((booking) => (
            <BookingItineraryCard
              key={booking.id}
              booking={booking}
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
