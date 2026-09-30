import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Train, Bus, Car, ArrowRight, Compass, MapPin } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { RouteTimeline } from '../components/travel/RouteTimeline';
import { TrainJourneyTimeline } from '../components/travel/TrainJourneyTimeline';
import { BusRouteTimeline } from '../components/travel/BusRouteTimeline';
import { TransportBadge } from '../components/ui/TransportBadge';
import { FLIGHT_IMAGES, TRAIN_IMAGES, BUS_IMAGES, CAB_IMAGES, SCENIC_IMAGES } from '../assets/travelImages';

export const HomePage: React.FC = () => {

  // Curated hero showcase combining scenic vistas and modern transport
  const heroShowcaseImages = [
    SCENIC_IMAGES[0], // Subcontinent landscape
    FLIGHT_IMAGES[1],  // IndiGo domestic carrier
    TRAIN_IMAGES[0],   // Vande Bharat Express
    BUS_IMAGES[0],     // Intercity luxury coach
    CAB_IMAGES[0],     // Airport chauffeur transfer
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Large Travel Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Headline & Editorial Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>Unified Multi-Modal Travel Platform</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Travel without <br className="hidden sm:inline" />
                  the friction.
                </h1>
                <p className="text-xl sm:text-2xl font-light text-neutral-300 tracking-tight">
                  Flights. Trains. Buses. Cabs.
                </p>
              </div>

              <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                One seamless travel ecosystem connecting Indian cities and international destinations. 
                Compare schedules, book official railway berths, reserve aerial corridors, and arrange guaranteed airport chauffeurs in a unified experience.
              </p>

              {/* Service Quick Switcher */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <Link
                  to="/flights"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600/90 hover:bg-sky-600 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-sky-600/20"
                >
                  <Plane className="w-4 h-4" />
                  <span>Flights</span>
                </Link>
                <Link
                  to="/trains"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700/90 hover:bg-amber-700 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-amber-700/20"
                >
                  <Train className="w-4 h-4" />
                  <span>IRCTC Trains</span>
                </Link>
                <Link
                  to="/buses"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/90 hover:bg-emerald-700 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-emerald-700/20"
                >
                  <Bus className="w-4 h-4" />
                  <span>Buses</span>
                </Link>
                <Link
                  to="/cabs"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/90 hover:bg-indigo-700 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-indigo-700/20"
                >
                  <Car className="w-4 h-4" />
                  <span>Cabs</span>
                </Link>
              </div>

              {/* Key Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-800 text-xs text-neutral-400">
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">80+ Airports</div>
                  <div>Domestic & Global</div>
                </div>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">7,000+ Stations</div>
                  <div>IRCTC Rail Network</div>
                </div>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">Point-to-Point</div>
                  <div>Chauffeur & Intercity</div>
                </div>
              </div>
            </div>

            {/* Right: Rotating Travel Image Carousel with subtle cinematic crossfade */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 group">
                <TravelImageCarousel
                  images={heroShowcaseImages}
                  intervalMs={6500}
                  aspectRatio="4/3"
                  className="w-full h-[360px] sm:h-[420px]"
                  showCaption={true}
                  showIndicators={true}
                />
                {/* Floating Micro Badge */}
                <div className="absolute top-4 left-4 z-30 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700/60 text-[11px] text-neutral-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Indian Corridors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Discovery Section — Varied, Service-Specific Layouts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* FLIGHTS FEATURE: Large Visual Feature with Aerial Corridor */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <TransportBadge type="flight" size="md" variant="subtle" />
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-2">
                Aviation Corridors & Global Gateways
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-1">
                Direct scheduled flights across metro hubs and regional air routes with live IATA schedules.
              </p>
            </div>
            <Link
              to="/flights"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors shrink-0"
            >
              <span>Explore All Flight Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Large Aviation Feature Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Route Showcase */}
            <div className="lg:col-span-7 bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="space-y-3 z-10">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Featured Trunk Route</span>
                  <span className="text-sky-400 font-mono">Air India & IndiGo</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Chennai to Delhi Aerial Expressway
                </h3>
                <p className="text-xs text-neutral-300 max-w-md">
                  High-frequency nonstop services connecting Southern and Northern economic gateways.
                </p>
              </div>

              {/* Embedded Visual Route Timeline */}
              <div className="my-6 z-10">
                <RouteTimeline
                  fromCity="Chennai"
                  fromCode="MAA"
                  toCity="Delhi"
                  toCode="DEL"
                  duration="2h 45m"
                  airline="IndiGo 6E 204"
                  departureTime="06:30 AM"
                  arrivalTime="09:15 AM"
                  fare={4899}
                  variant="editorial"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs z-10">
                <span className="text-neutral-400">Daily 14+ nonstop flights</span>
                <Link to="/flights" className="text-sky-400 hover:text-sky-300 font-medium">
                  Search MAA → DEL fares →
                </Link>
              </div>

              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Aviation Photo & Quick Corridor List */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="rounded-3xl overflow-hidden h-52 sm:h-56 relative shadow-sm">
                <img
                  src={FLIGHT_IMAGES[0].src}
                  alt="Aviation flight"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs text-white font-medium">
                    National & International Carriers
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Popular Aerial Corridors
                </h4>
                <div className="space-y-2">
                  <RouteTimeline
                    fromCity="Mumbai"
                    fromCode="BOM"
                    toCity="Goa"
                    toCode="GOI"
                    fare={2499}
                    variant="compact"
                  />
                  <RouteTimeline
                    fromCity="Delhi"
                    fromCode="DEL"
                    toCity="Mumbai"
                    toCode="BOM"
                    fare={4299}
                    variant="compact"
                  />
                  <RouteTimeline
                    fromCity="Bengaluru"
                    fromCode="BLR"
                    toCity="Dubai"
                    toCode="DXB"
                    fare={16499}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRAINS FEATURE: Editorial Railway Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <TransportBadge type="train" size="md" variant="subtle" />
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-2">
                Indian Railways & Semi-High-Speed Network
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-1">
                Experience the romance and reliability of India's railway system. Vande Bharat, Rajdhani, and Shatabdi timelines.
              </p>
            </div>
            <Link
              to="/trains"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-900 transition-colors shrink-0"
            >
              <span>View All Rail Timelines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Railway Editorial Timeline Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Real Train Journey Timeline Schematic */}
            <div className="lg:col-span-8">
              <TrainJourneyTimeline
                trainNumber="20607"
                trainName="Chennai - Mysuru Vande Bharat Express"
                trainType="Semi-High-Speed AC Chair Car"
                originCity="Chennai Central"
                originCode="MAS"
                destinationCity="Bengaluru City"
                destinationCode="SBC"
                departureTime="05:50 AM"
                arrivalTime="10:15 AM"
                duration="04h 25m"
                runsOn="Daily except Wed"
                classTypes={['EC', 'CC']}
                startingFare={995}
                availableSeats={78}
              />
            </div>

            {/* Railway Editorial Story Block */}
            <div className="lg:col-span-4 bg-stone-100 rounded-3xl p-6 sm:p-7 border border-stone-200/90 space-y-4">
              <div className="rounded-2xl overflow-hidden h-36">
                <img
                  src={TRAIN_IMAGES[0].src}
                  alt="Vande Bharat Train"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">
                The New Age of Rail Travel
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                With aerodynamic trainsets, panoramic windows, onboard dining, and 160 km/h corridors, train travel in India has entered a new era of elegance.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-200">
                <span className="font-mono text-stone-500">IRCTC Direct Berths</span>
                <Link to="/trains" className="text-amber-800 hover:text-amber-900 font-semibold">
                  Browse Stations →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BUSES FEATURE: Horizontal Route Network */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <TransportBadge type="bus" size="md" variant="subtle" />
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-2">
                Intercity Highway & Sleeper Corridors
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-1">
                Luxury multi-axle Volvos, sleeper berths, and state transport connecting thousands of Indian towns.
              </p>
            </div>
            <Link
              to="/buses"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition-colors shrink-0"
            >
              <span>Browse Bus Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Bus Image Story */}
            <div className="lg:col-span-4 rounded-3xl overflow-hidden relative shadow-sm min-h-[220px]">
              <img
                src={BUS_IMAGES[0].src}
                alt="Luxury Intercity Bus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Overnight Travel
                </span>
                <h3 className="text-lg font-bold">Wake up at your destination</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Private curtained sleeper berths with individual charging points and AC airflow.
                </p>
              </div>
            </div>

            {/* Horizontal Bus Route Timeline */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <BusRouteTimeline
                operator="IntrCity SmartBus"
                busType="Volvo 9600 Multi-Axle AC Sleeper (2+1)"
                departureCity="Bengaluru"
                boardingPoint="Majestic Anand Rao Circle"
                departureTime="10:30 PM"
                arrivalCity="Chennai"
                droppingPoint="Koyambedu Omni Bus Terminus"
                arrivalTime="05:15 AM"
                duration="06h 45m"
                fare={850}
                rating={4.8}
                availableSeats={14}
              />
            </div>
          </div>
        </section>

        {/* CABS FEATURE: Location / Chauffeur Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <TransportBadge type="cab" size="md" variant="subtle" />
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-2">
                Chauffeur & Outstation Transfers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-1">
                Door-to-door comfort for airport pickups, city rentals, and intercity road journeys.
              </p>
            </div>
            <Link
              to="/cabs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors shrink-0"
            >
              <span>Explore Chauffeur Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-950 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Search / Destination visual */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Where are you going?
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Dedicated Chauffeur on your schedule
                </h3>
                <div className="space-y-2 bg-neutral-900/80 border border-neutral-700/60 rounded-2xl p-4 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Pickup Point</span>
                      <span className="font-semibold text-white">Mumbai Airport T2 (BOM)</span>
                    </div>
                  </div>
                  <div className="pl-2 border-l border-neutral-700 ml-2 py-1 text-neutral-400 text-[11px]">
                    Direct Expressway Transit • 3h 15m
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Destination</span>
                      <span className="font-semibold text-white">Pune Koregaon Park</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to="/cabs"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Book Outstation Cab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right: Fleet visual cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden">
                    <img src={CAB_IMAGES[0].src} alt="Sedan Prime" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-semibold text-sm">Sedan Prime</div>
                  <p className="text-[11px] text-neutral-400">Dzire, Etios • Up to 4 passengers</p>
                  <div className="text-xs font-bold text-emerald-400">From ₹1,999</div>
                </div>

                <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden">
                    <img src={CAB_IMAGES[2].src} alt="Outstation SUV" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-semibold text-sm">Outstation SUV</div>
                  <p className="text-[11px] text-neutral-400">Innova, Ertiga • Up to 6 passengers</p>
                  <div className="text-xs font-bold text-emerald-400">From ₹2,899</div>
                </div>

                <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden">
                    <img src={CAB_IMAGES[4].src} alt="Green EV" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-semibold text-sm">Green EV Cab</div>
                  <p className="text-[11px] text-neutral-400">Nexon EV, ZS EV • Zero emissions</p>
                  <div className="text-xs font-bold text-emerald-400">From ₹2,199</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
