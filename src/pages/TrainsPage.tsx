import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, Ticket } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { TrainJourneyTimeline } from '../components/travel/TrainJourneyTimeline';
import { ServiceSearchPanel } from '../components/travel/ServiceSearchPanel';
import { TransportBadge } from '../components/ui/TransportBadge';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { TRAIN_IMAGES } from '../assets/travelImages';

export const TrainsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'vande-bharat' | 'rajdhani' | 'shatabdi'>('all');

  const trainsFleet = [
    {
      id: '22436',
      name: 'Vande Bharat Express (Varanasi)',
      type: 'Semi-High-Speed AC Trainset',
      category: 'vande-bharat',
      originCity: 'New Delhi',
      originCode: 'NDLS',
      destinationCity: 'Varanasi Junction',
      destinationCode: 'BSB',
      departureTime: '06:00 AM',
      arrivalTime: '02:00 PM',
      duration: '08h 00m',
      runsOn: 'Mon, Tue, Wed, Fri, Sat, Sun',
      classTypes: ['EC', 'CC'],
      startingPrice: 1750,
      availableSeats: 64,
    },
    {
      id: '20607',
      name: 'Chennai - Mysuru Vande Bharat Express',
      type: 'Semi-High-Speed Express',
      category: 'vande-bharat',
      originCity: 'Chennai Central',
      originCode: 'MAS',
      destinationCity: 'Bengaluru City',
      destinationCode: 'SBC',
      departureTime: '05:50 AM',
      arrivalTime: '10:15 AM',
      duration: '04h 25m',
      runsOn: 'Daily except Wed',
      classTypes: ['EC', 'CC'],
      startingPrice: 995,
      availableSeats: 92,
    },
    {
      id: '12952',
      name: 'New Delhi Mumbai Rajdhani Express',
      type: 'Premier Overnight Superfast',
      category: 'rajdhani',
      originCity: 'New Delhi',
      originCode: 'NDLS',
      destinationCity: 'Mumbai Central',
      destinationCode: 'MMCT',
      departureTime: '04:55 PM',
      arrivalTime: '08:35 AM',
      duration: '15h 40m',
      runsOn: 'Daily',
      classTypes: ['1A', '2A', '3A'],
      startingPrice: 1850,
      availableSeats: 38,
    },
    {
      id: '12002',
      name: 'Bhopal Shatabdi Express',
      type: 'Intercity Day Express',
      category: 'shatabdi',
      originCity: 'New Delhi',
      originCode: 'NDLS',
      destinationCity: 'Rani Kamalapati (Bhopal)',
      destinationCode: 'RKMP',
      departureTime: '06:00 AM',
      arrivalTime: '02:40 PM',
      duration: '08h 40m',
      runsOn: 'Daily except Fri',
      classTypes: ['EC', 'CC'],
      startingPrice: 950,
      availableSeats: 48,
    },
    {
      id: '12260',
      name: 'Sealdah Duronto Express',
      type: 'Non-Stop Superfast AC',
      category: 'rajdhani',
      originCity: 'New Delhi',
      originCode: 'NDLS',
      destinationCity: 'Sealdah (Kolkata)',
      destinationCode: 'SDAH',
      departureTime: '08:15 PM',
      arrivalTime: '12:45 PM',
      duration: '16h 30m',
      runsOn: 'Mon, Wed, Thu',
      classTypes: ['1A', '2A', '3A', 'SL'],
      startingPrice: 1650,
      availableSeats: 26,
    },
    {
      id: '82902',
      name: 'Tejas Express (Ahmedabad)',
      type: 'Executive Luxury Chair Car',
      category: 'shatabdi',
      originCity: 'Mumbai Central',
      originCode: 'MMCT',
      destinationCity: 'Ahmedabad Junction',
      destinationCode: 'ADI',
      departureTime: '03:40 PM',
      arrivalTime: '10:05 PM',
      duration: '06h 25m',
      runsOn: 'Mon, Wed, Thu, Fri, Sat, Sun',
      classTypes: ['EC', 'CC'],
      startingPrice: 1950,
      availableSeats: 72,
    },
  ];

  const filteredTrains = activeFilter === 'all'
    ? trainsFleet
    : trainsFleet.filter((t) => t.category === activeFilter);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Railway Visual Hero */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-4">
              <TransportBadge type="train" size="md" variant="subtle" className="bg-amber-500/20 text-amber-300 border-amber-400/30" />
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Indian Railways & Semi-High-Speed Lines
              </h1>
              <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
                Book berths across Vande Bharat, Rajdhani, Shatabdi, and Express trains. 
                Complete station codes, detailed route schematics, and IRCTC quota selections.
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
                <span>✓ Official Station Codes</span>
                <span>•</span>
                <span>✓ Tatkal & General Quota</span>
                <span>•</span>
                <span>✓ Verified Berths</span>
              </div>
            </div>

            {/* Right: Rotating Railway Photography */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
                <TravelImageCarousel
                  images={TRAIN_IMAGES}
                  intervalMs={7500}
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

      {/* 2. Floating Train Search Module */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <ServiceSearchPanel
          mode="trains"
          initialFrom="New Delhi (NDLS)"
          initialTo="Varanasi Jn (BSB)"
        />
      </div>

      {/* 3. Railway Timelines Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Featured Railway Express Schedules
              </h2>
              <p className="text-xs text-stone-500">
                Interactive track schematics showing departure, platform progress, and destination arrival
              </p>
            </div>

            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                All Trains
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('vande-bharat')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'vande-bharat' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Vande Bharat
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('rajdhani')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'rajdhani' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Rajdhani & Duronto
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('shatabdi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'shatabdi' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Shatabdi & Tejas
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Train Journey Timelines Stack */}
        <div className="space-y-5">
          {filteredTrains.map((train, idx) => (
            <ScrollReveal key={train.id} delayMs={Math.min(idx * 80, 320)}>
              <TrainJourneyTimeline
                trainNumber={train.id}
                trainName={train.name}
                trainType={train.type}
                originCity={train.originCity}
                originCode={train.originCode}
                destinationCity={train.destinationCity}
                destinationCode={train.destinationCode}
                departureTime={train.departureTime}
                arrivalTime={train.arrivalTime}
                duration={train.duration}
                runsOn={train.runsOn}
                classTypes={train.classTypes}
                startingFare={train.startingPrice}
                availableSeats={train.availableSeats}
                onSelect={() => navigate(`/trains/results?from=${encodeURIComponent(train.originCity)}&to=${encodeURIComponent(train.destinationCity)}`)}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Railway Station Code & PNR Information Block */}
        <ScrollReveal delayMs={100}>
          <section className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Ticket className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-stone-900">10-Digit IRCTC PNR Sync</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your 10-digit Passenger Name Record into your VoyageHub traveler itinerary to receive live coach & berth charting updates.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-stone-900">Tatkal Booking Windows</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  AC classes open at 10:00 AM IST and Non-AC classes open at 11:00 AM IST one day prior to the train’s originating station departure.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-stone-900">Coach Classes Explained</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Executive Chair Car (EC), AC Chair Car (CC), First AC (1A), 2-Tier AC (2A), 3-Tier AC (3A), and Sleeper (SL) verified directly from Indian Railway charts.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};
