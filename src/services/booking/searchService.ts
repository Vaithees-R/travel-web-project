import { TravelOption, SearchCriteria, FilterState, SortOption } from '../../types/booking';
import { TravelSearchService } from '../travel/travelSearchService';
import { FilterEngine, parseTimeToMinutes, parseDurationToMinutes } from '../travel/filterEngine';
import { SortEngine } from '../travel/sortEngine';

export { parseTimeToMinutes, parseDurationToMinutes };

export const SearchService = {
  /**
   * Search for travel options matching criteria using the structured TravelSearchService
   */
  searchOptions: async (
    criteria: SearchCriteria,
    filter?: FilterState,
    sortBy?: SortOption
  ): Promise<TravelOption[]> => {
    const response = await TravelSearchService.search(criteria, filter, sortBy);
    return response.options;
  },

  /**
   * Filter evaluator delegated to pure FilterEngine
   */
  filterOptions: (options: TravelOption[], filter: FilterState): TravelOption[] => {
    return FilterEngine.filter(options, filter);
  },

  /**
   * Deterministic sorting delegated to pure SortEngine
   */
  sortOptions: (options: TravelOption[], sortBy: SortOption): TravelOption[] => {
    return SortEngine.sort(options, sortBy);
  },
};
