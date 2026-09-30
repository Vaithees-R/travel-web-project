import { TripType } from '../../types/booking';

export interface RouteDistanceEstimate {
  distanceKm: number;
  durationText: string;
}

export const KNOWN_CORRIDOR_DISTANCES: Record<string, RouteDistanceEstimate> = {
  'mumbai-pune': { distanceKm: 152, durationText: '3h 15m (152 km)' },
  'pune-mumbai': { distanceKm: 152, durationText: '3h 15m (152 km)' },
  'delhi-agra': { distanceKm: 210, durationText: '3h 30m (210 km)' },
  'agra-delhi': { distanceKm: 210, durationText: '3h 30m (210 km)' },
  'bengaluru-mysuru': { distanceKm: 145, durationText: '2h 45m (145 km)' },
  'mysuru-bengaluru': { distanceKm: 145, durationText: '2h 45m (145 km)' },
  'chennai-pondicherry': { distanceKm: 160, durationText: '3h 00m (160 km)' },
  'pondicherry-chennai': { distanceKm: 160, durationText: '3h 00m (160 km)' },
  'delhi-chandigarh': { distanceKm: 245, durationText: '4h 45m (245 km)' },
  'chandigarh-delhi': { distanceKm: 245, durationText: '4h 45m (245 km)' },
  'bengaluru-chennai': { distanceKm: 345, durationText: '6h 15m (345 km)' },
  'chennai-bengaluru': { distanceKm: 345, durationText: '6h 15m (345 km)' },
};

export interface CabVehicleRateConfig {
  category: string;
  name: string;
  models: string;
  baseFare50km: number;
  perKmRate: number;
  capacity: string;
  luggage: string;
  hasAC: boolean;
  rating: number;
  amenities: string[];
}

export const CAB_CATEGORY_CONFIGS: Record<string, CabVehicleRateConfig> = {
  Mini: {
    category: 'Mini',
    name: 'Mini Economy Cab',
    models: 'Maruti WagonR / Tata Tiago',
    baseFare50km: 1199,
    perKmRate: 11,
    capacity: '4 Passengers',
    luggage: '1 Small Bag',
    hasAC: true,
    rating: 4.6,
    amenities: ['Air Conditioned', 'City & Outstation', 'Toll Passes Supported'],
  },
  'Sedan Prime': {
    category: 'Sedan Prime',
    name: 'Sedan Prime Chauffeur',
    models: 'Maruti Dzire / Toyota Etios',
    baseFare50km: 1499,
    perKmRate: 14,
    capacity: '4 Passengers',
    luggage: '2 Large Bags',
    hasAC: true,
    rating: 4.8,
    amenities: ['Air Conditioned', 'Toll Taxes Included', 'Flight Delay Tracking', 'Uniformed Chauffeur'],
  },
  'Outstation SUV': {
    category: 'Outstation SUV',
    name: 'Outstation Highway SUV',
    models: 'Toyota Innova Crysta / Ertiga',
    baseFare50km: 2199,
    perKmRate: 19,
    capacity: '6-7 Passengers',
    luggage: '4 Large Bags',
    hasAC: true,
    rating: 4.9,
    amenities: ['Spacious Legroom', 'Rear AC Vents', 'Carrier Available', 'Hill Station Certified Driver'],
  },
  'Green EV': {
    category: 'Green EV',
    name: 'Green Fleet Electric EV',
    models: 'Tata Nexon EV / MG ZS EV',
    baseFare50km: 1599,
    perKmRate: 13,
    capacity: '4 Passengers',
    luggage: '2 Medium Bags',
    hasAC: true,
    rating: 4.7,
    amenities: ['Zero Carbon Emission', 'Whisper-Quiet Cabin', 'Regenerative Braking', 'Modern Cockpit'],
  },
  Executive: {
    category: 'Executive',
    name: 'Executive Chauffeur Luxury',
    models: 'Toyota Camry Hybrid / Mercedes E-Class',
    baseFare50km: 3499,
    perKmRate: 30,
    capacity: '4 Passengers',
    luggage: '3 Large Bags',
    hasAC: true,
    rating: 5.0,
    amenities: ['Plush Leather Seats', 'Bottled Mineral Water', 'Business Class Privacy', 'Suit Hanger Hook'],
  },
};

export interface CabFareCalculation {
  category: string;
  distanceKm: number;
  tripType: TripType;
  baseFare: number;
  perKmRate: number;
  kmCharge: number;
  tripTypeMultiplier: number;
  taxesAndTolls: number;
  estimatedTotalFare: number;
  label: 'Estimated fare';
}

export const CabFareEngine = {
  /**
   * Resolve realistic estimated distance between two cities or fallback to reasonable default
   */
  getDistanceEstimate: (originCity: string, destinationCity: string): RouteDistanceEstimate => {
    const key = `${originCity.toLowerCase().trim()}-${destinationCity.toLowerCase().trim()}`;
    if (KNOWN_CORRIDOR_DISTANCES[key]) {
      return KNOWN_CORRIDOR_DISTANCES[key];
    }
    // Deterministic synthetic distance for arbitrary cities
    const hash = Math.abs(
      (originCity + destinationCity)
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    );
    const dist = 120 + (hash % 180);
    const hours = Math.floor(dist / 50);
    const mins = Math.round(((dist % 50) / 50) * 60);
    return {
      distanceKm: dist,
      durationText: `${hours}h ${mins < 10 ? '0' : ''}${mins}m (${dist} km)`,
    };
  },

  /**
   * Deterministic Cab Fare Calculation
   * Formula:
   *   baseFare50km + max(0, distanceKm - 50) * perKmRate * tripTypeAdjustment + 5% commercial taxes
   */
  calculateEstimatedFare: (
    categoryName: string,
    distanceKm: number,
    tripType: TripType = 'oneway'
  ): CabFareCalculation => {
    const config = CAB_CATEGORY_CONFIGS[categoryName] || CAB_CATEGORY_CONFIGS['Sedan Prime'];
    const extraKm = Math.max(0, distanceKm - 50);

    let tripTypeMultiplier = 1.0;
    if (tripType === 'roundtrip') {
      tripTypeMultiplier = 1.85; // 2x route with discount on return deadhead
    } else if (tripType === 'hourly') {
      tripTypeMultiplier = 1.25; // Local package with waiting duration
    }

    const kmCharge = Math.round(extraKm * config.perKmRate * tripTypeMultiplier);
    const subtotal = Math.round(config.baseFare50km * (tripType === 'roundtrip' ? 1.5 : 1.0) + kmCharge);
    const taxesAndTolls = Math.round(subtotal * 0.05);
    const estimatedTotalFare = subtotal + taxesAndTolls;

    return {
      category: config.category,
      distanceKm,
      tripType,
      baseFare: subtotal,
      perKmRate: config.perKmRate,
      kmCharge,
      tripTypeMultiplier,
      taxesAndTolls,
      estimatedTotalFare,
      label: 'Estimated fare',
    };
  },
};
