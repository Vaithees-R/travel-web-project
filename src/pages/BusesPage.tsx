import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Sparkles, Shield } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { BusRouteTimeline } from '../components/travel/BusRouteTimeline';
import { ServiceSearchPanel } from '../components/travel/ServiceSearchPanel';
import { TransportBadge } from '../components/ui/TransportBadge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { BUS_IMAGES } from '../assets/travelImages';

export const BusesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<'all' | 'sleeper' | 'seater' | 'electric'>('all');

  const busRoutes = [
    {
      operator: 'IntrCity SmartBus',
      busType: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      departureCity: 'Bengaluru',
      boardingPoint: 'Majestic Anand Rao Circle (Lounge)',
      departureTime: '10:30 PM',
      arrivalCity: 'Chennai',
      droppingPoint: 'Koyambedu CMBT Terminus',
      arrivalTime: '05:15 AM',
      duration: '06h 45m',
      fare: 850,
      rating: 4.8,
      availableSeats: 12,
      amenities: ['Private Curtains', 'Type-C Fast Charging', 'Blanket & Pillow', 'Route Visibility'],
    },
    {
      operator: 'KSRTC Airawat Club Class',
      busType: 'Volvo B11R Multi-Axle AC Semi-Sleeper',
      category: 'seater',
      departureCity: 'Bengaluru Airport',
      boardingPoint: 'Terminal 1 FlyBus Bay',
      departureTime: '08:30 AM',
      arrivalCity: 'Mysuru',
      droppingPoint: 'Suburban Central Bus Stand',
      arrivalTime: '12:45 PM',
      duration: '04h 15m',
      fare: 790,
      rating: 4.9,
      availableSeats: 22,
      amenities: ['Ergonomic Calf Support', 'Mineral Water', 'Highway Express', 'Luggage Tagging'],
    },
    {
      operator: 'VRL Travels',
      busType: 'Scania Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      departureCity: 'Mumbai',
      boardingPoint: 'Borivali West Gokul Hotel',
      departureTime: '07:00 PM',
      arrivalCity: 'Goa (Panaji)',
      droppingPoint: 'Panaji KTC Bus Stand',
      arrivalTime: '07:30 AM',
      duration: '12h 30m',
      fare: 1250,
      rating: 4.7,
      availableSeats: 8,
      amenities: ['Upper/Lower Berths', 'USB Charging', 'Dedicated Restroom Break', 'Emergency SOS'],
    },
    {
      operator: 'Zingbus Electric Intercity',
      busType: 'Zero-Emission Luxury Intercity Coach',
      category: 'electric',
      departureCity: 'Delhi',
      boardingPoint: 'ISBT Kashmere Gate Metro Gate 1',
      departureTime: '06:30 AM',
      arrivalCity: 'Chandigarh',
      droppingPoint: 'Sector 43 ISBT',
      arrivalTime: '11:15 AM',
      duration: '04h 45m',
      fare: 599,
      rating: 4.6,
      availableSeats: 19,
      amenities: ['Silent Cabin', 'Zero Emission', 'Free WiFi', 'Clean Lounge Access'],
    },
    {
      operator: 'SRS Travels',
      busType: 'BharatBenz AC Sleeper (2+1)',
      category: 'sleeper',
      departureCity: 'Hyderabad',
      boardingPoint: 'MGBS Central Bus Station',
      departureTime: '09:45 PM',
      arrivalCity: 'Bengaluru',
      droppingPoint: 'Majestic Anand Rao Circle',
      arrivalTime: '06:30 AM',
      duration: '08h 45m',
      fare: 950,
      rating: 4.5,
      availableSeats: 15,
      amenities: ['Individual Reading Lights', 'Blanket', 'Punctual Dispatch', 'Journey Tracking'],
    },
    {
      operator: 'Orange Tours & Travels',
      busType: 'Mercedes-Benz Multi-Axle AC Sleeper',
      category: 'sleeper',
      departureCity: 'Chennai',
      boardingPoint: 'Koyambedu Omni Bus Stand',
      departureTime: '10:15 PM',
      arrivalCity: 'Madurai',
      droppingPoint: 'Mattuthavani Integrated Bus Terminal',
      arrivalTime: '05:45 AM',
      duration: '07h 30m',
      fare: 820,
      rating: 4.7,
      availableSeats: 14,
      amenities: ['Air Suspension', 'Comfortable Mattress', 'Water Bottle', 'Driver Assistance'],
    },
  ];

  const filteredRoutes = filterCategory === 'all'
    ? busRoutes
    : busRoutes.filter((r) => r.category === filterCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Intercity Bus Hero */}
      <section className="relative bg-emerald-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-4">
              <TransportBadge type="bus" size="md" variant="subtle" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30" />
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Intercity Coaches & Luxury AC Sleepers
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-lg leading-relaxed">
                Connect thousands of Indian cities and highway corridors with verified state transport and premier private luxury bus fleets.
              </p>
              <div className="flex items-center gap-4 text-xs text-emerald-300/80 pt-1">
                <span>✓ Standardized Boarding Lounges</span>
                <span>•</span>
                <span>✓ Planned Route Tracking</span>
                <span>•</span>
                <span>✓ Verified Drivers</span>
              </div>
            </div>

            {/* Right: Rotating Bus Photography */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-800">
                <TravelImageCarousel
                  images={BUS_IMAGES}
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

      {/* 2. Floating Bus Search Module */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <ServiceSearchPanel
          mode="buses"
          initialFrom="Bengaluru (Majestic)"
          initialTo="Chennai (CMBT)"
        />
      </div>

      {/* 3. Horizontal Journey Visualizations Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Featured Intercity Highway Corridors
              </h2>
              <p className="text-xs text-neutral-500">
                Clear boarding point to dropping point horizontal journey visualizations
              </p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterCategory === 'all' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                All Coaches
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('sleeper')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterCategory === 'sleeper' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                AC Sleepers
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('seater')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterCategory === 'seater' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Semi-Sleepers
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('electric')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterCategory === 'electric' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'}`}
              >
                Electric EV
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Bus Route Timelines Stack */}
        <div className="space-y-4">
          {filteredRoutes.map((route, idx) => (
            <ScrollReveal key={`${route.operator}-${idx}`} delayMs={Math.min(idx * 80, 320)}>
              <BusRouteTimeline
                operator={route.operator}
                busType={route.busType}
                departureCity={route.departureCity}
                boardingPoint={route.boardingPoint}
                departureTime={route.departureTime}
                arrivalCity={route.arrivalCity}
                droppingPoint={route.droppingPoint}
                arrivalTime={route.arrivalTime}
                duration={route.duration}
                fare={route.fare}
                rating={route.rating}
                availableSeats={route.availableSeats}
                amenities={route.amenities}
                onSelect={() => navigate(`/buses/results?from=${encodeURIComponent(route.departureCity)}&to=${encodeURIComponent(route.arrivalCity)}`)}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Bus Cabin & Safety Information Block */}
        <ScrollReveal delayMs={100}>
          <section className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Navigation className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">Planned Journey Tracking</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Access scheduled route details and estimated travel times for your boarding point, minimizing waiting time at highways and terminals.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">AC Sleeper 2+1 Layout</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Single window berths on the left for solo travelers, and double berths on the right for couples and families with privacy curtains.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-neutral-900">Verified Highway Rest Stops</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Scheduled halts only at vetted highway food courts with sanitized restrooms and 24/7 security.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};
