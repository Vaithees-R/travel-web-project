export type CanonicalTransportType = 'flight' | 'train' | 'bus' | 'cab';
export type TransportType = CanonicalTransportType | 'flights' | 'trains' | 'buses' | 'cabs';

export interface RouteItem {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  type: 'domestic' | 'international';
  startingFare: number;
  currency: 'INR' | 'USD';
}

export interface TrainItem {
  id: string;
  name: string;
  departureTime: string;
  startingPrice: number;
  classTypes: string[];
  runsOn: string;
}

export interface PartnerItem {
  id: string;
  title: string;
  text: string;
  category: 'flights' | 'cabs' | 'buses' | 'trains';
  assetName?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'flights' | 'trains' | 'buses' | 'cabs' | 'general';
}

/**
 * Reusable Location domain definitions
 */
export interface BaseLocation {
  city: string;
  name: string;
  code: string;
}

export interface AirportLocation extends BaseLocation {
  country: string;
  isInternational: boolean;
  terminals: string[];
}

export interface StationLocation extends BaseLocation {
  zone?: string;
  division?: string;
}

export interface CityLocation {
  city: string;
  state: string;
  code?: string;
  landmarks: string[];
}

/**
 * Specific Operator definition
 */
export interface Operator {
  id: string;
  name: string;
  service: CanonicalTransportType;
  logo?: string;
  rating?: number;
}

/**
 * Detailed Fare and Availability models
 */
export interface CabinClassFare {
  className: 'Economy' | 'Premium Economy' | 'Business';
  fare: number;
  available: number;
  baggageAllowance?: string;
}

export interface TrainClassFare {
  className: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
  fare: number;
  available: number;
  status: 'Available' | 'RAC' | 'WL';
}

export interface CabCategoryRate {
  category: 'Mini' | 'Sedan Prime' | 'Outstation SUV' | 'Green EV' | 'Executive';
  modelExample: string;
  capacity: number;
  luggageBags: number;
  baseFare50km: number;
  perKmRate: number;
  hasAC: boolean;
}
