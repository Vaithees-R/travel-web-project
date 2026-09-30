import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Users, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { SearchCriteria, TravelOption, FilterState, SortOption } from '../types/booking';
import { SearchService } from '../services/booking/searchService';
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
    rawService === 'flights' || rawService === 'flight' ? 'flight' :
    rawService === 'trains' || rawService === 'train' ? 'train' :
    rawService === 'buses' || rawService === 'bus' ? 'bus' : 'cab';

  // Read criteria from query params or sensible defaults
  const from = searchParams.get('from') || (service === 'flight' ? 'Delhi' : service === 'train' ? 'New Delhi' : service === 'bus' ? 'Bengaluru' : 'Mumbai Airport');
  const to = searchParams.get('to') || (service === 'flight' ? 'Mumbai' : service === 'train' ? 'Varanasi' : service === 'bus' ? 'Chennai' : 'Pune');
  const departureDate = searchParams.get('date') || 'Tomorrow, 08:30 AM';
  const passengersParam = parseInt(searchParams.get('passengers') || '1', 10);
  const passengers = isNaN(passengersParam) || passengersParam < 1 ? 1 : passengersParam;

  const criteria: SearchCriteria = {
    service,
    from,
    to,
    departureDate,
    tripType: 'oneway',
    passengers,
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [results, setResults] = useState<TravelOption[]>([]);
  const [filters, setFilters] = useState<FilterState>({ stops: 'all', departureTimeWindow: 'all' });
  const [sort, setSort] = useState<SortOption>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute available operators and price boundaries for the filters
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(15000);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    SearchService.searchOptions(criteria, filters, sort)
      .then((data) => {
        if (!isMounted) return;
        setResults(data);
        setIsLoading(false);

        // Calculate operators and price range
        const operators = Array.from(new Set(data.map((d) => d.operator)));
        setAvailableOperators(operators);

        if (data.length > 0) {
          const fares = data.map((d) => d.baseFare);
          setMinPrice(Math.min(...fares));
          setMaxPrice(Math.max(...fares));
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [service, from, to, filters, sort]);

  const handleSelectOption = (option: TravelOption, selectedClass?: string) => {
    // Save in session
    BookingStorageService.saveActiveSession({
      searchCriteria: criteria,
      selectedOption: option,
      selectedClass: selectedClass || option.selectedClass || 'Standard',
      step: 'passengers',
    });

    const routePrefix = service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs';
    navigate(`/${routePrefix}/passengers`);
  };

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
              to={`/${service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs'}`}
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
              <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{departureDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{passengers} {passengers === 1 ? 'Traveler' : 'Travelers'}</span>
                </span>
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
              to={`/${service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs'}`}
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
            {/* Sorting & Results Count Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-neutral-600">
                Found <strong className="text-neutral-900">{results.length}</strong> available {service} {results.length === 1 ? 'option' : 'options'}
              </div>
              <SortControl currentSort={sort} onSortChange={setSort} />
            </div>

            {/* Results or Loading */}
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500 mx-auto" />
                <p className="text-sm font-semibold text-neutral-700">Searching live travel schedules...</p>
                <p className="text-xs text-neutral-400">Verifying real-time seat availability & lowest transparent fares</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((option) => (
                  <ResultItemCard
                    key={option.id}
                    option={option}
                    onSelect={handleSelectOption}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="text-base font-bold text-neutral-800">No matching journeys found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  We couldn't find any {service} options matching your filter criteria. Try expanding your price limit or clearing filters.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters({ stops: 'all', departureTimeWindow: 'all' })}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
