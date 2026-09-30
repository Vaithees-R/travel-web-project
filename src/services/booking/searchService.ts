import { TravelOption, SearchCriteria, FilterState, SortOption } from '../../types/booking';
import { MOCK_FLIGHTS } from '../../data/mockFlights';
import { MOCK_TRAINS } from '../../data/mockTrains';
import { MOCK_BUSES } from '../../data/mockBuses';
import { MOCK_CABS } from '../../data/mockCabs';

/**
 * Parses time string like "06:15 AM" into minutes from midnight for sorting/filtering
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/**
 * Parses duration string like "2h 15m" or "08h 40m" into total minutes
 */
const parseDurationToMinutes = (durationStr: string): number => {
  const hoursMatch = durationStr.match(/(\d+)h/i);
  const minsMatch = durationStr.match(/(\d+)m/i);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
};

export const SearchService = {
  /**
   * Search for travel options matching criteria, simulating a realistic 400ms network lookup
   */
  searchOptions: async (
    criteria: SearchCriteria,
    filter?: FilterState,
    sortBy?: SortOption
  ): Promise<TravelOption[]> => {
    // Realistic micro-delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    let pool: TravelOption[] = [];
    switch (criteria.service) {
      case 'flight':
        pool = [...MOCK_FLIGHTS];
        break;
      case 'train':
        pool = [...MOCK_TRAINS];
        break;
      case 'bus':
        pool = [...MOCK_BUSES];
        break;
      case 'cab':
        pool = [...MOCK_CABS];
        break;
      default:
        pool = [];
    }

    const cleanOrigin = criteria.from.toLowerCase().trim();
    const cleanDest = criteria.to.toLowerCase().trim();

    // Route matching
    const matched = pool.filter((opt) => {
      const matchFrom =
        opt.originCity.toLowerCase().includes(cleanOrigin) ||
        opt.originCode.toLowerCase().includes(cleanOrigin) ||
        cleanOrigin.includes(opt.originCity.toLowerCase()) ||
        cleanOrigin.includes(opt.originCode.toLowerCase());

      const matchTo =
        opt.destinationCity.toLowerCase().includes(cleanDest) ||
        opt.destinationCode.toLowerCase().includes(cleanDest) ||
        cleanDest.includes(opt.destinationCity.toLowerCase()) ||
        cleanDest.includes(opt.destinationCode.toLowerCase());

      return matchFrom && matchTo;
    });

    let results = matched.length > 0 ? matched : pool;

    if (filter) {
      results = SearchService.filterOptions(results, filter);
    }

    if (sortBy) {
      results = SearchService.sortOptions(results, sortBy);
    }

    return results;
  },

  /**
   * Real client-side filtering on search results
   */
  filterOptions: (options: TravelOption[], filter: FilterState): TravelOption[] => {
    return options.filter((item) => {
      // 1. Max price
      if (filter.maxPrice !== undefined && item.baseFare > filter.maxPrice) {
        return false;
      }

      // 2. Stops (flights/trains)
      if (filter.stops !== undefined && filter.stops !== 'all') {
        if (item.stops !== filter.stops) return false;
      }

      // 3. Operators
      if (filter.operators && filter.operators.length > 0) {
        if (!filter.operators.includes(item.operator)) return false;
      }

      // 4. Cabin classes (Flights)
      if (filter.cabinClasses && filter.cabinClasses.length > 0 && item.cabinClasses) {
        const hasClass = item.cabinClasses.some((c) => filter.cabinClasses?.includes(c.className));
        if (!hasClass) return false;
      }

      // 5. Train classes
      if (filter.trainClasses && filter.trainClasses.length > 0 && item.trainClasses) {
        const hasClass = item.trainClasses.some((c) => filter.trainClasses?.includes(c.className));
        if (!hasClass) return false;
      }

      // 6. Bus types
      if (filter.busTypes && filter.busTypes.length > 0 && item.busType) {
        if (!filter.busTypes.includes(item.busType)) return false;
      }

      // 7. Cab categories
      if (filter.cabCategories && filter.cabCategories.length > 0 && item.cabCategory) {
        if (!filter.cabCategories.includes(item.cabCategory)) return false;
      }

      // 8. Departure time window
      if (filter.departureTimeWindow && filter.departureTimeWindow !== 'all') {
        const mins = parseTimeToMinutes(item.departureTime);
        if (filter.departureTimeWindow === 'morning' && (mins < 300 || mins >= 720)) return false;
        if (filter.departureTimeWindow === 'afternoon' && (mins < 720 || mins >= 1020)) return false;
        if (filter.departureTimeWindow === 'evening' && (mins < 1020 || mins >= 1260)) return false;
        if (filter.departureTimeWindow === 'night' && (mins >= 300 && mins < 1260)) return false;
      }

      return true;
    });
  },

  /**
   * Real client-side sorting on search results
   */
  sortOptions: (options: TravelOption[], sortBy: SortOption): TravelOption[] => {
    const sorted = [...options];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.baseFare - b.baseFare);
      case 'price_high':
        return sorted.sort((a, b) => b.baseFare - a.baseFare);
      case 'duration_short':
        return sorted.sort((a, b) => parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration));
      case 'departure_early':
        return sorted.sort((a, b) => parseTimeToMinutes(a.departureTime) - parseTimeToMinutes(b.departureTime));
      case 'recommended':
      default:
        // Prioritize higher ratings, then lowest price
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || a.baseFare - b.baseFare);
    }
  },
};
