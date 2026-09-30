// Centralized asset map for all existing project images
// Preserves all existing images under src/assets/images

// Flights
import flight11kf from './images/flights/11kf.webp';
import flight12ai from './images/flights/12ai.webp';
import flight13uae from './images/flights/13uae.webp';
import flight15sp from './images/flights/15sp.webp';
import flight16china from './images/flights/16chaina.webp';
import flight17eu from './images/flights/17eu.webp';
import flight18ind from './images/flights/18ind.webp';
import flight19az from './images/flights/19az.webp';

// Trains
import train1 from './images/trains/train1.jpeg';
import train2 from './images/trains/train2.jpeg';
import train3 from './images/trains/train3.jpeg';
import train4 from './images/trains/train4.jpeg';
import train5 from './images/trains/train5.jpeg';
import train6 from './images/trains/train6.jpeg';

// Buses
import bus1 from './images/buses/bus1.jpeg';
import bus2 from './images/buses/bus2.jpeg';
import bus3 from './images/buses/bus3.jpeg';
import bus4 from './images/buses/bus4.webp';
import bus5 from './images/buses/bus5.jpg';
import bus6 from './images/buses/bus6.webp';
import bus7 from './images/buses/bus7.webp';
import bus8 from './images/buses/bus8.jpeg';

// Cabs
import cab1 from './images/cabs/cab1.jpeg';
import cab2 from './images/cabs/cab2.jpeg';
import cab3 from './images/cabs/cab3.jpeg';
import cab4 from './images/cabs/cab4.jpeg';
import cab5 from './images/cabs/cab5.jpeg';
import cab6 from './images/cabs/cab6.jpeg';
import cab7 from './images/cabs/cab7.jpeg';
import cab8 from './images/cabs/cab8.jpeg';

// Legacy & Scenic
import legacyBullet from './images/legacy/bullet.webp';
import legacyBharath from './images/legacy/bharath.webp';
import legacyBritish from './images/legacy/british.webp';
import legacyElect from './images/legacy/elect.webp';
import legacyUae from './images/legacy/uae.webp';
import legacyUsa from './images/legacy/usa.webp';

// Brand
import brandLogo from './images/brand/logo.png';

export interface TravelImageItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export const FLIGHT_IMAGES: TravelImageItem[] = [
  { src: flight12ai, alt: 'Air India long-haul flagship flight', title: 'National Carrier Routes', subtitle: 'Non-stop connectivity across India and overseas' },
  { src: flight18ind, alt: 'IndiGo scheduled domestic carrier', title: 'High-Frequency Domestic', subtitle: 'Connecting over 80+ cities with precision timing' },
  { src: flight13uae, alt: 'International luxury flight connection', title: 'Global Gateway', subtitle: 'Direct links to major international business hubs' },
  { src: flight17eu, alt: 'European intercontinental airline route', title: 'Transcontinental Corridors', subtitle: 'Connecting India to Europe and the Americas' },
  { src: flight15sp, alt: 'Domestic regional flight', title: 'Regional Tier-2 Connectivity', subtitle: 'Rapid links to emerging commercial centres' },
  { src: flight16china, alt: 'East Asian international carrier', title: 'Asia-Pacific Network', subtitle: 'Seamless Eastbound commercial routes' },
  { src: flight11kf, alt: 'Premium airline travel experience', title: 'Executive Cabin Experience', subtitle: 'Thoughtful amenities for long-distance travel' },
  { src: flight19az, alt: 'Cross-continental aircraft', title: 'Bespoke Travel Itineraries', subtitle: 'Engineered flight schedules' }
];

export const TRAIN_IMAGES: TravelImageItem[] = [
  { src: train1, alt: 'Vande Bharat Express semi-high-speed train', title: 'Vande Bharat Network', subtitle: 'Rapid intercity journeys at 160 km/h with scenic vistas' },
  { src: train2, alt: 'Indian Railways premier electric locomotive', title: 'Rajdhani & Shatabdi Express', subtitle: 'Overnight premier connectivity between metropolitan capitals' },
  { src: train3, alt: 'Modern railway station platform and train', title: 'Station Infrastructure', subtitle: 'Over 7,000 passenger stations mapped across the rail grid' },
  { src: train4, alt: 'Express train traversing scenic railway bridge', title: 'Cross-Country Corridors', subtitle: 'Expansive scenic journeys through the heart of India' },
  { src: train5, alt: 'Indian Railways passenger coach line', title: 'Superfast & Mail Express', subtitle: 'Affordable, dependable long-distance travel for millions' },
  { src: train6, alt: 'High-speed railway track and modern trainset', title: 'Modernized Rolling Stock', subtitle: 'AC sleeper and chair-car comfort with IRCTC confirmation' },
  { src: legacyBullet, alt: 'High speed rail technology', title: 'Future Rail Systems', subtitle: 'Next-generation electrified rail corridors' },
  { src: legacyElect, alt: 'Electrified railway line', title: 'Green Rail Electrification', subtitle: 'Sustainable zero-direct-emission mass transit' }
];

export const BUS_IMAGES: TravelImageItem[] = [
  { src: bus1, alt: 'Luxury multi-axle AC sleeper coach', title: 'Intercity Luxury Sleeper', subtitle: 'Ergonomic berths for overnight highways' },
  { src: bus2, alt: 'Modern Volvo intercity coach on highway', title: 'Express Highway Corridors', subtitle: 'Non-stop connections between major tech & commercial hubs' },
  { src: bus3, alt: 'Premium tourist coach bus', title: 'State & Private Fleets', subtitle: 'Synchronized departures from central city terminals' },
  { src: bus4, alt: 'Electric intercity coach', title: 'Green Fleet Intercity', subtitle: 'Smooth, quiet zero-emission road transport' },
  { src: bus5, alt: 'Comfortable passenger coach bus', title: 'Regional Highway Routes', subtitle: 'Reaching deep into town hubs where trains have limited access' },
  { src: bus6, alt: 'Night travel AC sleeper bus', title: 'Overnight City Links', subtitle: 'Board in the evening, wake up at your destination' },
  { src: bus7, alt: 'Modern long-distance coach', title: 'Multi-Axle Air Suspension', subtitle: 'Smoother journeys on India’s national expressways' },
  { src: bus8, alt: 'Interstate passenger coach', title: 'Verified Highway Operators', subtitle: 'Punctual boarding lounges and live GPS tracking' }
];

export const CAB_IMAGES: TravelImageItem[] = [
  { src: cab1, alt: 'Premium sedan airport chauffeur cab', title: 'Airport Chauffeur Transfer', subtitle: 'Guaranteed on-time pickups with flight delay tracking' },
  { src: cab2, alt: 'Comfortable city sedan cab', title: 'City Hourly Rentals', subtitle: 'Keep a car and driver on standby for multi-stop meetings' },
  { src: cab3, alt: 'Outstation SUV for highway road trip', title: 'Outstation Long Distance', subtitle: 'Spacious SUVs with verified drivers for highway tours' },
  { src: cab4, alt: 'Chauffeur driven executive car', title: 'One-Way Intercity Trips', subtitle: 'Pay only for one-way drops between neighboring cities' },
  { src: cab5, alt: 'Clean airport taxi cab', title: 'Terminal Door-to-Door', subtitle: 'Direct curbside meet and seamless luggage handling' },
  { src: cab6, alt: 'Urban cab fleet', title: 'Transparent Meter & Rates', subtitle: 'All-inclusive toll and fuel calculations without surprises' },
  { src: cab7, alt: 'Executive travel cab', title: 'Business Class Cab', subtitle: 'Quiet cabins, phone charging, and professional drivers' },
  { src: cab8, alt: 'Premium outstation vehicle', title: 'Hills & Leisure Journeys', subtitle: 'Experienced drivers trained for mountain passes and expressways' }
];

export const SCENIC_IMAGES: TravelImageItem[] = [
  { src: legacyBharath, alt: 'Scenic Indian landscape and historic architectural route', title: 'Discover the Subcontinent', subtitle: 'Historic routes and architectural heritage' },
  { src: legacyUae, alt: 'Dubai skyline and modern metropolis travel', title: 'Global Emirates Corridors', subtitle: 'Seamless Middle Eastern transit hubs' },
  { src: legacyBritish, alt: 'European landmark and travel experience', title: 'European Travel Gateways', subtitle: 'From London to continental rail journeys' },
  { src: legacyUsa, alt: 'North American skyline travel destination', title: 'Transatlantic Horizons', subtitle: 'Long-haul flights connecting continents' }
];

export { brandLogo };
