import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  HelpCircle,
  Compass,
  Car,
  RotateCcw,
} from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { SearchCriteria, TravelOption, FilterState, SortOption, TripType } from '../types/booking';
import { TravelSearchService, SearchResultResponse } from '../services/travel/travelSearchService';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { FilterPanel } from '../components/booking/FilterPanel';
import { SortControl } from '../components/booking/SortControl';
import { ResultItemCard } from '../components/booking/ResultItemCard';
import { TransportBadge } from '../components/ui/TransportBadge';

export const SearchResultsPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Normalize canonical service
  const service: CanonicalTransportType =
    rawService === 'flights' || rawService === 'flight'
      ? 'flight'
      : rawService === 'trains' || rawService === 'train'
      ? 'train'
      : rawService === 'buses' || rawService === 'bus'
      ? 'bus'
      : 'cab';

  // Read criteria from URL query params or sensible defaults
  const from =
    searchParams.get('from') ||
    (service === 'flight'
      ? 'Delhi (DEL)'
      : service === 'train'
      ? 'New Delhi (NDLS)'
      : service === 'bus'
      ? 'Bengaluru'
      : 'Mumbai');

  const to =
    searchParams.get('to') ||
    (service === 'flight'
      ? 'Mumbai (BOM)'
      : service === 'train'
      ? 'Varanasi (BSB)'
      : service === 'bus'
      ? 'Chennai'
      : 'Pune');

  const departureDate = searchParams.get('date') || 'Tomorrow, 08:30 AM';
  const returnDate = searchParams.get('returnDate') || undefined;
  const rawTripType = searchParams.get('tripType') || 'oneway';
  const tripType: TripType =
    rawTripType === 'roundtrip' || rawTripType === 'hourly' ? rawTripType : 'oneway';

  const passengersParam = parseInt(searchParams.get('passengers') || '1', 10);
  const passengers = isNaN(passengersParam) || passengersParam < 1 ? 1 : passengersParam;

  const criteria: SearchCriteria = {
    service,
    from,
    to,
    departureDate,
    returnDate,
    tripType,
    passengers,
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResult, setSearchResult] = useState<SearchResultResponse | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    stops: 'all',
    departureTimeWindow: 'all',
  });
  const [sort, setSort] = useState<SortOption>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    TravelSearchService.search(criteria, filters, sort)
      .then((res) => {
        if (!isMounted) return;
        setSearchResult(res);
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [service, from, to, departureDate, returnDate, tripType, passengers, filters, sort]);

  const results = searchResult?.options || [];
  const availableOperators = searchResult?.availableOperators || [];
  const minPrice = searchResult?.minPrice || 500;
  const maxPrice = searchResult?.maxPrice || 15000;

  const handleSelectOption = (option: TravelOption, selectedClass?: string) => {
    // Save in session
    BookingStorageService.saveActiveSession({
      searchCriteria: criteria,
      selectedOption: option,
      selectedClass: selectedClass || option.selectedClass || 'Standard',
      step: 'passengers',
    });

    const routePrefix =
      service === 'flight'
        ? 'flights'
        : service === 'train'
        ? 'trains'
        : service === 'bus'
        ? 'buses'
        : 'cabs';
    navigate(`/${routePrefix}/passengers`);
  };

  const handleResetFilters = () => {
    setFilters({ stops: 'all', departureTimeWindow: 'all' });
  };

  const routeServicePath =
    service === 'flight'
      ? 'flights'
      : service === 'train'
      ? 'trains'
      : service === 'bus'
      ? 'buses'
      : 'cabs';

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BookingStepIndicator currentStep="results" service={service} />
        </div>
      </div>

      {/* 2. Top Route Search Summary Bar */}
      <div className="bg-neutral-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/${routeServicePath}`}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Change Search"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <TransportBadge type={service} size="sm" variant="subtle" />
                <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                  <span>{from}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <span>{to}</span>
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{departureDate}</span>
                  {returnDate && <span>(Return: {returnDate})</span>}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {passengers} {passengers === 1 ? 'Traveler' : 'Travelers'}
                  </span>
                </span>
                {tripType && tripType !== 'oneway' && (
                  <>
                    <span>•</span>
                    <span className="capitalize bg-neutral-800 px-2 py-0.5 rounded text-[11px] text-neutral-300">
                      {tripType}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <Link
              to={`/${routeServicePath}`}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Modify Search
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Results Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Filters Sidebar (Desktop) */}
          <div className={`lg:col-span-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              service={service}
              filters={filters}
              onFilterChange={setFilters}
              availableOperators={availableOperators}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>

          {/* Right: Results Header, Sort, and Cards List (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Cab Estimated Fare Engine Notice */}
            {service === 'cab' && (
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Car className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">Deterministic Cab Fare Engine</span>
                  Cab fares are estimated based on route distance, vehicle category tier, and trip
                  type with highway toll adjustments included. Final chauffeur pickup details are
                  assigned immediately upon confirmation.
                </div>
              </div>
            )}

            {/* Sorting & Results Count Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-neutral-600">
                {searchResult?.unfilteredCount !== undefined &&
                searchResult.unfilteredCount > results.length ? (
                  <span>
                    Showing <strong className="text-neutral-900">{results.length}</strong> of{' '}
                    <strong>{searchResult.unfilteredCount}</strong> available {service} options
                  </span>
                ) : (
                  <span>
                    Found <strong className="text-neutral-900">{results.length}</strong> available{' '}
                    {service} {results.length === 1 ? 'option' : 'options'}
                  </span>
                )}
              </div>
              <SortControl currentSort={sort} onSortChange={setSort} />
            </div>

            {/* Results or Loading / Error states */}
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500 mx-auto" />
                <p className="text-sm font-semibold text-neutral-700">
                  Searching scheduled travel routes...
                </p>
                <p className="text-xs text-neutral-400">
                  Checking inventory, cabin allocations, and lowest transparent fares
                </p>
              </div>
            ) : searchResult && !searchResult.isValid ? (
              /* Validation Error Banner */
              <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-10 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Invalid Search Criteria</h3>
                  <p className="text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                    {searchResult.validationError ||
                      'Please ensure departure and destination locations are distinct.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/${routeServicePath}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <span>Change Search Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : results.length > 0 ? (
              /* Results List */
              <div className="space-y-4">
                {results.map((option) => (
                  <ResultItemCard
                    key={option.id}
                    option={option}
                    onSelect={handleSelectOption}
                  />
                ))}
              </div>
            ) : searchResult?.emptyReason === 'ALL_FILTERED_OUT' ? (
              /* All Filtered Out Recovery State */
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-800">
                  No options match your active filters
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  We found {searchResult.unfilteredCount} available {service} option(s) on this
                  route, but they are excluded by your price, stops, or operator filters.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              /* No Route Inventory State with Structured Recovery Suggestions */
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 text-center space-y-5 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-800">
                    No Direct {service.toUpperCase()} Services for this Route
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1">
                    VoyageHub currently does not have active scheduled {service} services operating
                    directly between <strong className="text-neutral-700">{from}</strong> and{' '}
                    <strong className="text-neutral-700">{to}</strong>.
                  </p>
                </div>

                {/* Suggestions List */}
                {searchResult?.recoverySuggestions && searchResult.recoverySuggestions.length > 0 && (
                  <div className="max-w-lg mx-auto bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200/80">
                    <div className="text-xs font-bold text-neutral-700 flex items-center gap-1.5 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Suggested Corridors & Recommendations:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {searchResult.recoverySuggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-neutral-400 font-bold">•</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={`/${routeServicePath}`}
                    className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    Modify Search Corridor
                  </Link>

                  {service !== 'flight' && (
                    <Link
                      to={`/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
                      className="px-5 py-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:bg-sky-100 transition-colors"
                    >
                      Check Flights Instead
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
