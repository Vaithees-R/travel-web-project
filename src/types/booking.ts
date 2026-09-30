import { CanonicalTransportType } from './travel';

export type TripType = 'oneway' | 'roundtrip' | 'hourly';

export interface SearchCriteria {
  service: CanonicalTransportType;
  from: string;
  fromCode?: string;
  to: string;
  toCode?: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  passengers: number;
  cabinClass?: 'Economy' | 'Premium Economy' | 'Business';
  trainQuota?: 'General' | 'Tatkal' | 'Ladies' | 'Senior';
  trainClass?: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC' | 'All';
  busType?: 'All' | 'Sleeper' | 'Semi-Sleeper' | 'Electric';
  pickupTime?: string;
}

export interface TravelOption {
  id: string;
  service: CanonicalTransportType;
  operator: string;
  identifier: string; // e.g. "6E 204", "#20607", "KA-01-F-9901"
  subType?: string; // e.g. "Airbus A321neo", "Vande Bharat Express", "Volvo 9600", "Maruti Dzire"
  originCity: string;
  originCode: string;
  originStationOrTerminal?: string;
  destinationCity: string;
  destinationCode: string;
  destinationStationOrTerminal?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number; // 0 = nonstop
  baseFare: number;
  availableUnits: number;
  rating?: number;
  image?: string;
  amenities?: string[];
  cabinClasses?: Array<{ className: string; fare: number; available: number }>;
  trainClasses?: Array<{ className: string; fare: number; available: number; status: 'Available' | 'RAC' | 'WL' }>;
  busType?: string; // "AC Sleeper (2+1)", "Semi-Sleeper", "Electric Coach"
  cabCategory?: string; // "Sedan Prime", "Outstation SUV", "Green EV", "Executive"
  capacity?: string; // "4 Passengers"
  luggage?: string; // "2 Bags"
  selectedClass?: string; // Currently chosen sub-class or berth class
}

export interface Passenger {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  berthOrSeatPreference?: string;
}

export interface FareBreakdown {
  baseFarePerPassenger: number;
  passengerCount: number;
  subtotalBaseFare: number;
  taxesAndTerminalFees: number;
  safetyOrServiceFee: number;
  totalFare: number;
  currency: 'INR';
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string; // e.g. "VH-2026-8F42K"
  bookingRef: string; // e.g. "PNR 9DF4X2", "PNR 432-8910482", "VOY-BUS-7721", "VOY-CAB-3819"
  service: CanonicalTransportType;
  status: BookingStatus;
  createdAt: string;
  travelOption: TravelOption;
  searchCriteria: SearchCriteria;
  primaryPassenger: Passenger;
  additionalPassengers?: Passenger[];
  passengersCount: number;
  seatOrBerthAllocated: string;
  fareBreakdown: FareBreakdown;
  isSimulated: true;
}

export type SortOption = 'recommended' | 'price_low' | 'price_high' | 'duration_short' | 'departure_early';

export interface FilterState {
  maxPrice?: number;
  stops?: number | 'all';
  operators?: string[];
  cabinClasses?: string[];
  trainClasses?: string[];
  busTypes?: string[];
  cabCategories?: string[];
  departureTimeWindow?: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
}
