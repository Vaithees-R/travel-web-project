import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowDown, Users, Briefcase, Zap, Shield, CheckCircle2, PhoneCall } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { TransportBadge } from '../components/ui/TransportBadge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { CAB_IMAGES } from '../assets/travelImages';

export const CabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'hourly'>('oneway');
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');
  const [pickup, setPickup] = useState('Mumbai International Airport (BOM T2)');
  const [destination, setDestination] = useState('Pune (Koregaon Park / Hinjawadi)');

  const vehicleTiers = [
    {
      id: 'sedan',
      name: 'Sedan Prime',
      models: 'Maruti Suzuki Dzire, Toyota Etios',
      capacity: '4 Passengers',
      luggage: '2 Large Bags',
      image: CAB_IMAGES[0].src,
      features: ['Air Conditioned', 'USB Phone Charger', 'Top-Rated Chauffeur', 'Flight Delay Tracking'],
      priceOneway: 2199,
      priceRoundtrip: 3899,
      priceHourly: 1299,
      badge: 'Most Popular',
    },
    {
      id: 'suv',
      name: 'Outstation SUV',
      models: 'Toyota Innova Crysta, Maruti Ertiga',
      capacity: '6-7 Passengers',
      luggage: '4 Large Bags',
      image: CAB_IMAGES[2].src,
      features: ['Spacious Legroom', 'Rear AC Vents', 'Hill Station Certified', 'Large Boot Space'],
      priceOneway: 3299,
      priceRoundtrip: 5799,
      priceHourly: 1899,
      badge: 'Family & Groups',
    },
    {
      id: 'ev',
      name: 'Green Fleet Electric EV',
      models: 'Tata Nexon EV, MG ZS EV',
      capacity: '4 Passengers',
      luggage: '2 Medium Bags',
      image: CAB_IMAGES[4].src,
      features: ['Zero Tailpipe Emission', 'Whisper-Quiet Ride', 'Regenerative Braking', 'Modern Cockpit'],
      priceOneway: 2399,
      priceRoundtrip: 4199,
      priceHourly: 1399,
      badge: 'Eco Choice',
    },
    {
      id: 'executive',
      name: 'Executive Chauffeur',
      models: 'Toyota Camry Hybrid, Mercedes E-Class',
      capacity: '4 Passengers',
      luggage: '3 Large Bags',
      image: CAB_IMAGES[6].src,
      features: ['Plush Leather Seats', 'Uniformed Chauffeur', 'Bottled Mineral Water', 'Business Class Privacy'],
      priceOneway: 5499,
      priceRoundtrip: 9899,
      priceHourly: 3499,
      badge: 'VIP Travel',
    },
  ];

  const popularRoutes = [
    { from: 'Mumbai Airport (BOM)', to: 'Pune City', distance: '152 km', duration: '3h 15m', startingPrice: 2199 },
    { from: 'Delhi IGI Airport (DEL)', to: 'Agra (Taj Corridor)', distance: '210 km', duration: '3h 30m', startingPrice: 2899 },
    { from: 'Bengaluru Airport (BLR)', to: 'Mysuru Palace', distance: '185 km', duration: '2h 45m', startingPrice: 2750 },
    { from: 'Chennai Central (MAS)', to: 'Pondicherry (White Town)', distance: '160 km', duration: '3h 00m', startingPrice: 2499 },
  ];

  const activeVehicleData = vehicleTiers.find((v) => v.id === selectedVehicle) || vehicleTiers[0];
  const activeFare = tripType === 'oneway' 
    ? activeVehicleData.priceOneway 
    : tripType === 'roundtrip' 
    ? activeVehicleData.priceRoundtrip 
    : activeVehicleData.priceHourly;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Visually Strong Location / Search Experience */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Interactive Where Are You Going Search Panel */}
            <div className="lg:col-span-6 space-y-6">
              <TransportBadge type="cab" size="md" variant="subtle" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30" />
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Where are you going?
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Chauffeur & Outstation Travel
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Transparent point-to-point pricing without surprise toll or meter surcharges. 
                  Dedicated vehicles for airport transfers, intercity outstation routes, and hourly disposals.
                </p>
              </div>

              {/* Interactive Booking Module */}
              <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                {/* Trip Type Tabs */}
                <div className="flex items-center bg-neutral-800/80 p-1 rounded-2xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setTripType('oneway')}
                    className={`flex-1 py-2 rounded-xl transition-all ${tripType === 'oneway' ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('roundtrip')}
                    className={`flex-1 py-2 rounded-xl transition-all ${tripType === 'roundtrip' ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                  >
                    Round Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('hourly')}
                    className={`flex-1 py-2 rounded-xl transition-all ${tripType === 'hourly' ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                  >
                    City Hourly
                  </button>
                </div>

                {/* Location Inputs with Visual Connector */}
                <div className="space-y-3 relative">
                  {/* Pickup */}
                  <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Pickup Location</span>
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold focus:outline-none"
                      placeholder="Enter pickup airport or address"
                    />
                  </div>

                  {/* Visual Drop arrow */}
                  <div className="flex justify-center -my-1">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="p-3 bg-neutral-800/60 rounded-2xl border border-neutral-700/60 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Destination / Drop</span>
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold focus:outline-none"
                      placeholder="Enter city or destination"
                    />
                  </div>
                </div>

                {/* Calculated Quote & Action */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">
                      Estimated All-Inclusive Fare
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      ₹{activeFare.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-400">Tolls, fuel & driver included</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/cabs/results?from=${encodeURIComponent(pickup)}&to=${encodeURIComponent(destination)}&tripType=${tripType}&vehicle=${selectedVehicle}`)}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30"
                  >
                    Confirm Chauffeur
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Rotating Cab Fleet Photography */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
                <TravelImageCarousel
                  images={CAB_IMAGES}
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

      {/* 2. Distinct Vehicle Tiers Showcase with Real Cab Imagery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Select Your Vehicle Tier
            </h2>
            <p className="text-xs text-neutral-500">
              Compare sedans, spacious outstation SUVs, electric vehicles, and executive luxury cars
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicleTiers.map((tier, idx) => {
            const isSelected = selectedVehicle === tier.id;
            return (
              <ScrollReveal key={tier.id} delayMs={idx * 90}>
                <div
                  onClick={() => setSelectedVehicle(tier.id)}
                  className={`group cursor-pointer rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between h-full ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Photo container */}
                    <div className="h-36 rounded-2xl overflow-hidden bg-neutral-100 relative">
                      <img
                        src={tier.image}
                        alt={tier.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900/80 text-white backdrop-blur-xs">
                        {tier.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-neutral-900">{tier.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{tier.models}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-600 pt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{tier.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{tier.luggage}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 space-y-1">
                      {tier.features.slice(0, 3).map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Starting from</span>
                      <span className="text-base font-bold text-neutral-900">
                        ₹{tier.priceOneway.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Outstation & Airport Corridors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Popular Outstation & Airport Transfers
            </h2>
            <p className="text-xs text-neutral-500">
              Fixed transparent pricing on heavy commercial and airport highway corridors
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, i) => (
            <ScrollReveal key={i} delayMs={Math.min(i * 80, 240)}>
              <div
                onClick={() => navigate(`/cabs/results?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`)}
                className="p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-xs hover:border-indigo-400 cursor-pointer transition-colors flex flex-col justify-between space-y-3 h-full"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-neutral-900">
                    {route.from}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span>↓</span>
                    <span>{route.distance} • {route.duration}</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-900">
                    {route.to}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">One-way from</span>
                  <span className="font-bold text-neutral-900">₹{route.startingPrice}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Chauffeur Guarantees Banner */}
        <ScrollReveal delayMs={100}>
          <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-white">Zero Hidden Charges</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Toll taxes, state road taxes, fuel, driver night allowances, and parking fees are calculated upfront before you book.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-white">Live Flight Delay Tracking</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For airport pickups, enter your flight number. Your chauffeur adjusts pickup time automatically with zero waiting penalty.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-white">Verified Professional Drivers</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every driver is background-checked and evaluated for defensive highway driving and professional customer courtesy.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};
