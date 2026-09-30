import { TravelOption, FilterState } from '../../types/booking';

/**
 * Parses time string like "06:15 AM" or "18:45" into minutes from midnight
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr || timeStr.toLowerCase().includes('flexible')) return 0;
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
export const parseDurationToMinutes = (durationStr: string): number => {
  if (!durationStr) return 0;
  const hoursMatch = durationStr.match(/(\d+)h/i);
  const minsMatch = durationStr.match(/(\d+)m/i);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
};

export const FilterEngine = {
  /**
   * Pure functional filter evaluator for TravelOptions
   */
  filter: (options: TravelOption[], filter?: FilterState): TravelOption[] => {
    if (!filter) return options;

    return options.filter((item) => {
      // 1. Max Price Filter
      if (filter.maxPrice !== undefined && item.baseFare > filter.maxPrice) {
        return false;
      }

      // 2. Stops (Flights and Trains)
      if (filter.stops !== undefined && filter.stops !== 'all') {
        if (item.stops !== filter.stops) return false;
      }

      // 3. Operators / Airlines
      if (filter.operators && filter.operators.length > 0) {
        if (!filter.operators.includes(item.operator)) return false;
      }

      // 4. Flight Cabin Classes
      if (filter.cabinClasses && filter.cabinClasses.length > 0 && item.cabinClasses) {
        const hasClass = item.cabinClasses.some((c) => filter.cabinClasses?.includes(c.className));
        if (!hasClass) return false;
      }

      // 5. Train Classes
      if (filter.trainClasses && filter.trainClasses.length > 0 && item.trainClasses) {
        const hasClass = item.trainClasses.some((c) => filter.trainClasses?.includes(c.className));
        if (!hasClass) return false;
      }

      // 6. Train Types (Vande Bharat, Rajdhani, Shatabdi, Tejas, Duronto, Superfast)
      if (filter.trainTypes && filter.trainTypes.length > 0 && item.trainType) {
        if (!filter.trainTypes.includes(item.trainType)) return false;
      }

      // 7. Bus Types
      if (filter.busTypes && filter.busTypes.length > 0 && item.busType) {
        if (!filter.busTypes.includes(item.busType)) return false;
      }

      // 8. Cab Categories
      if (filter.cabCategories && filter.cabCategories.length > 0 && item.cabCategory) {
        if (!filter.cabCategories.includes(item.cabCategory)) return false;
      }

      // 9. Refundable Only (Flights)
      if (filter.isRefundableOnly && item.isRefundable === false) {
        return false;
      }

      // 10. Departure Time Window
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
};
