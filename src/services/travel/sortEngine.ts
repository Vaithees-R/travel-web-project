import { TravelOption, SortOption } from '../../types/booking';
import { parseTimeToMinutes, parseDurationToMinutes } from './filterEngine';

export const SortEngine = {
  /**
   * Deterministically sort options without mutating the source array
   */
  sort: (options: TravelOption[], sortBy: SortOption = 'recommended'): TravelOption[] => {
    // Clone array to avoid mutating original inventory
    const copy = [...options];

    switch (sortBy) {
      case 'price_low':
        return copy.sort((a, b) => a.baseFare - b.baseFare || a.id.localeCompare(b.id));

      case 'price_high':
        return copy.sort((a, b) => b.baseFare - a.baseFare || a.id.localeCompare(b.id));

      case 'duration_short':
        return copy.sort((a, b) => {
          const durA = parseDurationToMinutes(a.duration);
          const durB = parseDurationToMinutes(b.duration);
          return durA - durB || a.baseFare - b.baseFare || a.id.localeCompare(b.id);
        });

      case 'departure_early':
        return copy.sort((a, b) => {
          const timeA = parseTimeToMinutes(a.departureTime);
          const timeB = parseTimeToMinutes(b.departureTime);
          return timeA - timeB || a.baseFare - b.baseFare || a.id.localeCompare(b.id);
        });

      case 'recommended':
      default:
        // Prioritize highest rating, then lower price, then identifier
        return copy.sort((a, b) => {
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          const fareDiff = a.baseFare - b.baseFare;
          if (fareDiff !== 0) return fareDiff;
          return a.id.localeCompare(b.id);
        });
    }
  },
};
