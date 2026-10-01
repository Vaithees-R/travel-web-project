import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Luggage, ShieldCheck, MapPin } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { RouteTimeline } from '../components/travel/RouteTimeline';
import { ServiceSearchPanel } from '../components/travel/ServiceSearchPanel';
import { TransportBadge } from '../components/ui/TransportBadge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { FLIGHT_IMAGES } from '../assets/travelImages';

export const FlightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'domestic' | 'international'>('all');

  const domesticCorridors = [
    { from: 'Chennai', fromCode: 'MAA', to: 'Delhi', toCode: 'DEL', duration: '2h 45m', airline: 'IndiGo', flightNumber: '6E 204', fare: 4899, departureTime: '06:15 AM', arrivalTime: '09:00 AM' },
    { from: 'Mumbai', fromCode: 'BOM', to: 'Goa', toCode: 'GOI', duration: '1h 15m', airline: 'Air India', flightNumber: 'AI 663', fare: 2499, departureTime: '11:20 AM', arrivalTime: '12:35 PM' },
    { from: 'Bengaluru', fromCode: 'BLR', to: 'Delhi', toCode: 'DEL', duration: '2h 40m', airline: 'Akasa Air', flightNumber: 'QP 1342', fare: 4399, departureTime: '07:45 AM', arrivalTime: '10:25 AM' },
    { from: 'Mumbai', fromCode: 'BOM', to: 'Hyderabad', toCode: 'HYD', duration: '1h 30m', airline: 'IndiGo', flightNumber: '6E 521', fare: 3199, departureTime: '02:10 PM', arrivalTime: '03:40 PM' },
    { from: 'Delhi', fromCode: 'DEL', to: 'Mumbai', toCode: 'BOM', duration: '2h 15m', airline: 'Air India', flightNumber: 'AI 805', fare: 4299, departureTime: '05:00 PM', arrivalTime: '07:15 PM' },
    { from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM', duration: '2h 00m', airline: 'SpiceJet', flightNumber: 'SG 302', fare: 3699, departureTime: '08:30 PM', arrivalTime: '10:30 PM' },
  ];

  const internationalCorridors = [
    { from: 'Delhi', fromCode: 'DEL', to: 'Dubai', toCode: 'DXB', duration: '3h 45m', airline: 'Emirates', flightNumber: 'EK 511', fare: 16499, departureTime: '10:35 AM', arrivalTime: '01:20 PM' },
    { from: 'Mumbai', fromCode: 'BOM', to: 'Singapore', toCode: 'SIN', duration: '5h 20m', airline: 'Singapore Airlines', flightNumber: 'SQ 421', fare: 18999, departureTime: '11:45 PM', arrivalTime: '07:35 AM' },
    { from: 'Delhi', fromCode: 'DEL', to: 'London Heathrow', toCode: 'LHR', duration: '9h 10m', airline: 'British Airways', flightNumber: 'BA 142', fare: 38500, departureTime: '03:15 AM', arrivalTime: '07:55 AM' },
    { from: 'Bengaluru', fromCode: 'BLR', to: 'Bangkok', toCode: 'BKK', duration: '4h 15m', airline: 'Thai Airways', flightNumber: 'TG 326', fare: 14200, departureTime: '01:00 AM', arrivalTime: '06:15 AM' },
  ];

  const displayedDomestic = filterType === 'international' ? [] : domesticCorridors;
  const displayedInternational = filterType === 'domestic' ? [] : internationalCorridors;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Aviation Hero with Image Showcase */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Headline info */}
            <div className="lg:col-span-6 space-y-4">
              <TransportBadge type="flight" size="md" variant="subtle" className="bg-sky-500/20 text-sky-300 border-sky-400/30" />
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Scheduled Flights & Aerial Corridors
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed">
                Connect seamlessly between Indian metro gateways and international hubs. 
                Curated schedules, standardized IATA codes, and multi-carrier options.
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                <span>✓ Verified IATA Mappings</span>
                <span>•</span>
                <span>✓ Standard Airline Classifications</span>
                <span>•</span>
                <span>✓ Web Check-In Support</span>
              </div>
            </div>

            {/* Rotating aviation imagery */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
                <TravelImageCarousel
                  images={FLIGHT_IMAGES}
                  intervalMs={7000}
                  aspectRatio="16/9"
                  showOverlay={true}
                  showCaption={true}
                  showIndicators={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Prominent Travel Search Module */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <ServiceSearchPanel
          mode="flights"
          initialFrom="Delhi (DEL)"
          initialTo="Mumbai (BOM)"
        />
      </div>

      {/* 3. Flight Corridors Discovery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Featured Air Travel Corridors
              </h2>
              <p className="text-xs text-neutral-500">
                Curated route schedules with calculated distance and estimated flight durations
              </p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                All Routes
              </button>
              <button
                type="button"
                onClick={() => setFilterType('domestic')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'domestic' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Domestic Corridors
              </button>
              <button
                type="button"
                onClick={() => setFilterType('international')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'international' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                International Corridors
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Domestic Corridors Grid */}
        {displayedDomestic.length > 0 && (
          <ScrollReveal delayMs={100}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
                  Key Domestic Trunk Corridors (India)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedDomestic.map((corridor, idx) => (
                  <ScrollReveal key={`${corridor.fromCode}-${corridor.toCode}`} delayMs={Math.min(idx * 90, 270)}>
                    <RouteTimeline
                      fromCity={corridor.from}
                      fromCode={corridor.fromCode}
                      toCity={corridor.to}
                      toCode={corridor.toCode}
                      duration={corridor.duration}
                      airline={corridor.airline}
                      flightNumber={corridor.flightNumber}
                      departureTime={corridor.departureTime}
                      arrivalTime={corridor.arrivalTime}
                      fare={corridor.fare}
                      variant="card"
                      onSelect={() => navigate(`/flights/results?from=${encodeURIComponent(corridor.from)}&to=${encodeURIComponent(corridor.to)}`)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* International Corridors Grid */}
        {displayedInternational.length > 0 && (
          <ScrollReveal delayMs={100}>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
                  International Direct Routes from Indian Gateways
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedInternational.map((corridor, idx) => (
                  <ScrollReveal key={`${corridor.fromCode}-${corridor.toCode}`} delayMs={Math.min(idx * 90, 270)}>
                    <RouteTimeline
                      fromCity={corridor.from}
                      fromCode={corridor.fromCode}
                      toCity={corridor.to}
                      toCode={corridor.toCode}
                      duration={corridor.duration}
                      airline={corridor.airline}
                      flightNumber={corridor.flightNumber}
                      departureTime={corridor.departureTime}
                      arrivalTime={corridor.arrivalTime}
                      fare={corridor.fare}
                      variant="card"
                      onSelect={() => navigate(`/flights/results?from=${encodeURIComponent(corridor.from)}&to=${encodeURIComponent(corridor.to)}`)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Aviation Passenger Information Section */}
        <ScrollReveal delayMs={100}>
          <section className="bg-sky-50/70 border border-sky-200/80 rounded-3xl p-6 sm:p-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Luggage className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">Baggage Guidelines</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Standard domestic economy includes 15 kg check-in baggage and 7 kg hand baggage across IndiGo, Air India, and Akasa Air.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">Standardized IATA Codes</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Official airport identifiers mapped directly to Indira Gandhi (DEL), Chhatrapati Shivaji Maharaj (BOM), and Kempegowda (BLR).
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">Seamless Terminal Transfers</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Instant connections to airport cabs and metro stations directly linked with our multi-modal itinerary tracker.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};
