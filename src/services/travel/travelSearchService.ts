import { SearchCriteria, FilterState, SortOption, TravelOption } from '../../types/booking';
import { FLIGHT_INVENTORY } from './flightInventory';
import { TRAIN_INVENTORY } from './trainInventory';
import { BUS_INVENTORY } from './busInventory';
import { generateCabOptionsForRoute } from './cabInventory';
import { FilterEngine } from './filterEngine';
import { SortEngine } from './sortEngine';
import { normalizeLocationQuery, AIRPORTS } from './locations';

export interface SearchResultResponse {
  options: TravelOption[];
  totalCount: number;
  unfilteredCount: number;
  criteria: SearchCriteria;
  isValid: boolean;
  validationError?: string;
  routeSupported: boolean;
  emptyReason?: 'NO_ROUTE_INVENTORY' | 'ALL_FILTERED_OUT' | 'VALIDATION_FAILED';
  recoverySuggestions: string[];
  availableOperators: string[];
  minPrice: number;
  maxPrice: number;
}

export const TravelSearchService = {
  /**
   * Validates user-supplied search criteria
   */
  validateCriteria: (criteria: SearchCriteria): { isValid: boolean; error?: string } => {
    if (!criteria.from || !criteria.from.trim()) {
      return { isValid: false, error: 'Departure location is required.' };
    }
    if (!criteria.to || !criteria.to.trim()) {
      return { isValid: false, error: 'Destination location is required.' };
    }

    const normFrom = normalizeLocationQuery(criteria.from);
    const normTo = normalizeLocationQuery(criteria.to);

    const fromKey = (normFrom.code || normFrom.city).toLowerCase();
    const toKey = (normTo.code || normTo.city).toLowerCase();

    if (fromKey === toKey) {
      return {
        isValid: false,
        error: 'Origin and destination cannot be identical. Please choose distinct travel points.',
      };
    }

    if (criteria.passengers !== undefined && criteria.passengers < 1) {
      return { isValid: false, error: 'At least 1 passenger must be selected.' };
    }

    if (!criteria.departureDate || !criteria.departureDate.trim()) {
      return { isValid: false, error: 'Departure travel date is required.' };
    }

    return { isValid: true };
  },

  /**
   * Helper to check if a location is an international airport
   */
  isInternationalLocation: (query: string): boolean => {
    const norm = normalizeLocationQuery(query);
    if (norm.code && AIRPORTS[norm.code]) {
      return !!AIRPORTS[norm.code].isInternational && AIRPORTS[norm.code].country !== 'India';
    }
    const internationalCities = ['dubai', 'singapore', 'london', 'bangkok'];
    return internationalCities.includes(norm.city.toLowerCase());
  },

  /**
   * Finds matching raw travel options based on service and route
   */
  queryInventoryByRoute: (criteria: SearchCriteria): { options: TravelOption[]; routeSupported: boolean } => {
    const normFrom = normalizeLocationQuery(criteria.from);
    const normTo = normalizeLocationQuery(criteria.to);

    const cleanOriginCity = normFrom.city.toLowerCase();
    const cleanOriginCode = (normFrom.code || '').toLowerCase();
    const cleanDestCity = normTo.city.toLowerCase();
    const cleanDestCode = (normTo.code || '').toLowerCase();

    const isFromIntl = TravelSearchService.isInternationalLocation(criteria.from);
    const isToIntl = TravelSearchService.isInternationalLocation(criteria.to);
    const isIntlRoute = isFromIntl || isToIntl;

    // Flights are the ONLY mode that can operate international routes
    if (isIntlRoute && criteria.service !== 'flight') {
      return { options: [], routeSupported: false };
    }

    let matched: TravelOption[] = [];

    switch (criteria.service) {
      case 'flight': {
        matched = FLIGHT_INVENTORY.filter((flight) => {
          const matchOrigin =
            (cleanOriginCode && flight.originCode.toLowerCase() === cleanOriginCode) ||
            flight.originCity.toLowerCase() === cleanOriginCity ||
            flight.originCity.toLowerCase().includes(cleanOriginCity) ||
            cleanOriginCity.includes(flight.originCity.toLowerCase());

          const matchDest =
            (cleanDestCode && flight.destinationCode.toLowerCase() === cleanDestCode) ||
            flight.destinationCity.toLowerCase() === cleanDestCity ||
            flight.destinationCity.toLowerCase().includes(cleanDestCity) ||
            cleanDestCity.includes(flight.destinationCity.toLowerCase());

          return matchOrigin && matchDest;
        });
        break;
      }

      case 'train': {
        matched = TRAIN_INVENTORY.filter((train) => {
          const matchOrigin =
            (cleanOriginCode && train.originCode.toLowerCase() === cleanOriginCode) ||
            train.originCity.toLowerCase() === cleanOriginCity ||
            train.originCity.toLowerCase().includes(cleanOriginCity) ||
            cleanOriginCity.includes(train.originCity.toLowerCase());

          const matchDest =
            (cleanDestCode && train.destinationCode.toLowerCase() === cleanDestCode) ||
            train.destinationCity.toLowerCase() === cleanDestCity ||
            train.destinationCity.toLowerCase().includes(cleanDestCity) ||
            cleanDestCity.includes(train.destinationCity.toLowerCase());

          return matchOrigin && matchDest;
        });
        break;
      }

      case 'bus': {
        matched = BUS_INVENTORY.filter((bus) => {
          const matchOrigin =
            (cleanOriginCode && bus.originCode.toLowerCase() === cleanOriginCode) ||
            bus.originCity.toLowerCase() === cleanOriginCity ||
            bus.originCity.toLowerCase().includes(cleanOriginCity) ||
            cleanOriginCity.includes(bus.originCity.toLowerCase()) ||
            bus.boardingPoint.toLowerCase().includes(cleanOriginCity);

          const matchDest =
            (cleanDestCode && bus.destinationCode.toLowerCase() === cleanDestCode) ||
            bus.destinationCity.toLowerCase() === cleanDestCity ||
            bus.destinationCity.toLowerCase().includes(cleanDestCity) ||
            cleanDestCity.includes(bus.destinationCity.toLowerCase()) ||
            bus.droppingPoint.toLowerCase().includes(cleanDestCity);

          return matchOrigin && matchDest;
        });
        break;
      }

      case 'cab': {
        // Cabs operate on-demand for any domestic origin-destination corridor
        matched = generateCabOptionsForRoute(
          normFrom.city,
          normTo.city,
          criteria.tripType || 'oneway'
        );
        break;
      }
    }

    return {
      options: matched,
      routeSupported: matched.length > 0,
    };
  },

  /**
   * Generates helpful recovery suggestions when no direct results are available
   */
  getRecoverySuggestions: (criteria: SearchCriteria, isIntlAttempt: boolean): string[] => {
    if (isIntlAttempt && criteria.service !== 'flight') {
      return [
        'International corridors are exclusively served by our Flight network.',
        `Switch to Flights to travel between ${criteria.from} and ${criteria.to}.`,
        'For domestic rail, bus, and cab bookings, choose origin and destination cities in India.',
      ];
    }

    switch (criteria.service) {
      case 'flight':
        return [
          'Popular domestic flight corridors: Delhi (DEL) ↔ Mumbai (BOM), Chennai (MAA) ↔ Delhi (DEL), Bengaluru (BLR) ↔ Delhi (DEL).',
          'Supported international routes: Chennai (MAA) ↔ Dubai (DXB), Delhi (DEL) ↔ Singapore (SIN), Mumbai (BOM) ↔ London (LHR).',
          'Check the 3-letter IATA airport codes or try alternate dates.',
        ];
      case 'train':
        return [
          'High-speed Vande Bharat & Rajdhani routes: New Delhi (NDLS) ↔ Varanasi (BSB), Chennai Central (MAS) ↔ Bengaluru (SBC), New Delhi (NDLS) ↔ Mumbai Central (MMCT).',
          'Check that official IRCTC station codes (e.g., NDLS, MMCT, SBC, MAS) or city names are spelled correctly.',
          'Consider searching connecting hubs like New Delhi or Mumbai Central.',
        ];
      case 'bus':
        return [
          'Popular intercity bus express corridors: Bengaluru ↔ Chennai, Mumbai ↔ Goa, Delhi ↔ Chandigarh, Hyderabad ↔ Bengaluru.',
          'Try boarding from major city terminal points like Majestic (BLR), Koyambedu CMBT (MAA), or Borivali (BOM).',
        ];
      case 'cab':
        return [
          'Cabs are available for all domestic point-to-point intercity routes across India.',
          'Ensure both pickup and drop-off locations are within India.',
        ];
      default:
        return ['Try searching between major transport hubs or adjust your travel dates.'];
    }
  },

  /**
   * Synchronous core search execution (ideal for unit testing and immediate calculation)
   */
  searchSync: (
    criteria: SearchCriteria,
    filter?: FilterState,
    sortBy: SortOption = 'recommended'
  ): SearchResultResponse => {
    // 1. Validation
    const validation = TravelSearchService.validateCriteria(criteria);
    if (!validation.isValid) {
      return {
        options: [],
        totalCount: 0,
        unfilteredCount: 0,
        criteria,
        isValid: false,
        validationError: validation.error,
        routeSupported: false,
        emptyReason: 'VALIDATION_FAILED',
        recoverySuggestions: [
          validation.error || 'Please correct the search criteria.',
          'Ensure departure and arrival points are distinct.',
        ],
        availableOperators: [],
        minPrice: 0,
        maxPrice: 0,
      };
    }

    const isFromIntl = TravelSearchService.isInternationalLocation(criteria.from);
    const isToIntl = TravelSearchService.isInternationalLocation(criteria.to);
    const isIntlAttempt = isFromIntl || isToIntl;

    // 2. Query Route Inventory
    const { options: rawOptions, routeSupported } = TravelSearchService.queryInventoryByRoute(criteria);

    if (!routeSupported || rawOptions.length === 0) {
      return {
        options: [],
        totalCount: 0,
        unfilteredCount: 0,
        criteria,
        isValid: true,
        routeSupported: false,
        emptyReason: 'NO_ROUTE_INVENTORY',
        recoverySuggestions: TravelSearchService.getRecoverySuggestions(criteria, isIntlAttempt),
        availableOperators: [],
        minPrice: 0,
        maxPrice: 0,
      };
    }

    // 3. Extract Metadata from route inventory (before filtering)
    const availableOperators = Array.from(new Set(rawOptions.map((opt) => opt.operator)));
    const allFares = rawOptions.map((opt) => opt.baseFare);
    const minPrice = Math.min(...allFares);
    const maxPrice = Math.max(...allFares);

    // 4. Apply pure filters
    const filteredOptions = FilterEngine.filter(rawOptions, filter);

    if (filteredOptions.length === 0) {
      return {
        options: [],
        totalCount: 0,
        unfilteredCount: rawOptions.length,
        criteria,
        isValid: true,
        routeSupported: true,
        emptyReason: 'ALL_FILTERED_OUT',
        recoverySuggestions: [
          'All matching services were filtered out by your current filter criteria.',
          'Try clearing the operator, stops, or class filters.',
          `Try raising the maximum price limit (currently up to ₹${maxPrice.toLocaleString('en-IN')}).`,
        ],
        availableOperators,
        minPrice,
        maxPrice,
      };
    }

    // 5. Apply deterministic sorting
    const sortedOptions = SortEngine.sort(filteredOptions, sortBy);

    return {
      options: sortedOptions,
      totalCount: sortedOptions.length,
      unfilteredCount: rawOptions.length,
      criteria,
      isValid: true,
      routeSupported: true,
      recoverySuggestions: [],
      availableOperators,
      minPrice,
      maxPrice,
    };
  },

  /**
   * Asynchronous search facade simulating realistic 300ms network lookup
   */
  search: async (
    criteria: SearchCriteria,
    filter?: FilterState,
    sortBy: SortOption = 'recommended'
  ): Promise<SearchResultResponse> => {
    // Realistic micro-delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return TravelSearchService.searchSync(criteria, filter, sortBy);
  },
};
