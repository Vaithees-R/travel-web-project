import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Calendar,
  Users,
  MapPin,
  Search,
  Train,
  Bus,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { normalizeLocationQuery } from '../../services/travel/locations';
import { useAuth } from '../../hooks/useAuth';

export type SearchMode = 'flights' | 'trains' | 'buses' | 'cabs';

export interface ServiceSearchPanelProps {
  mode: SearchMode;
  initialFrom?: string;
  initialTo?: string;
  className?: string;
  onSearch?: (params: Record<string, string>) => void;
}

export const ServiceSearchPanel: React.FC<ServiceSearchPanelProps> = ({
  mode,
  initialFrom,
  initialTo,
  className,
  onSearch,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Flight specifics
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [cabinClass, setCabinClass] = useState(
    user?.preferences?.preferred_cabin || 'Economy'
  );

  // Cab specifics
  const [cabTripType, setCabTripType] = useState<'oneway' | 'roundtrip' | 'hourly'>('oneway');

  // Shared state
  const [from, setFrom] = useState(
    initialFrom ||
      (mode === 'flights'
        ? 'Delhi (DEL)'
        : mode === 'trains'
        ? 'New Delhi (NDLS)'
        : mode === 'buses'
        ? 'Bengaluru'
        : 'Mumbai')
  );
  const [to, setTo] = useState(
    initialTo ||
      (mode === 'flights'
        ? 'Mumbai (BOM)'
        : mode === 'trains'
        ? 'Varanasi (BSB)'
        : mode === 'buses'
        ? 'Chennai'
        : 'Pune')
  );
  const [travelDate, setTravelDate] = useState('Tomorrow, 08:30 AM');
  const [returnDate, setReturnDate] = useState('Next Week, 06:00 PM');
  const [travelers, setTravelers] = useState('1 Traveler');
  const [trainQuota, setTrainQuota] = useState('General');
  const [validationError, setValidationError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?.preferences?.preferred_cabin) {
      setCabinClass(user.preferences.preferred_cabin);
    }
  }, [user?.preferences?.preferred_cabin]);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setValidationError(null);
  };

  const validateInputs = (): boolean => {
    if (!from.trim()) {
      setValidationError('Please enter a departure location.');
      return false;
    }
    if (!to.trim()) {
      setValidationError('Please enter a destination location.');
      return false;
    }

    const normFrom = normalizeLocationQuery(from);
    const normTo = normalizeLocationQuery(to);

    const fromKey = (normFrom.code || normFrom.city).toLowerCase();
    const toKey = (normTo.code || normTo.city).toLowerCase();

    if (fromKey === toKey) {
      setValidationError('Origin and destination cannot be identical. Please choose distinct locations.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const effectiveTripType = mode === 'cabs' ? cabTripType : tripType;

    if (onSearch) {
      onSearch({
        mode,
        from,
        to,
        travelDate,
        returnDate: tripType === 'roundtrip' ? returnDate : '',
        tripType: effectiveTripType,
      });
    } else {
      const params = new URLSearchParams();
      params.set('from', from);
      params.set('to', to);
      params.set('date', travelDate);
      if (tripType === 'roundtrip' && mode === 'flights') {
        params.set('returnDate', returnDate);
      }
      params.set('passengers', travelers.match(/\d+/)?.[0] || '1');
      if (mode === 'flights') params.set('class', cabinClass);
      if (mode === 'cabs') params.set('tripType', cabTripType);
      if (mode === 'trains') params.set('quota', trainQuota);
      navigate(`/${mode}/results?${params.toString()}`);
    }
  };

  // Preset location suggestions for datalists
  const flightSuggestions = [
    'Delhi (DEL)',
    'Mumbai (BOM)',
    'Bengaluru (BLR)',
    'Chennai (MAA)',
    'Hyderabad (HYD)',
    'Goa (GOI)',
    'Dubai (DXB)',
    'Singapore (SIN)',
    'London (LHR)',
    'Bangkok (BKK)',
  ];

  const trainSuggestions = [
    'New Delhi (NDLS)',
    'Mumbai Central (MMCT)',
    'Varanasi (BSB)',
    'Chennai (MAS)',
    'Bengaluru (SBC)',
    'Bhopal (RKMP)',
    'Kolkata (SDAH)',
    'Ahmedabad (ADI)',
    'Hyderabad (HYB)',
  ];

  const busSuggestions = [
    'Bengaluru',
    'Chennai',
    'Mumbai',
    'Goa',
    'Delhi',
    'Chandigarh',
    'Hyderabad',
    'Madurai',
    'Mysuru',
  ];

  const cabSuggestions = [
    'Mumbai',
    'Pune',
    'Bengaluru',
    'Mysuru',
    'Delhi',
    'Agra',
    'Chennai',
    'Pondicherry',
  ];

  const suggestions =
    mode === 'flights'
      ? flightSuggestions
      : mode === 'trains'
      ? trainSuggestions
      : mode === 'buses'
      ? busSuggestions
      : cabSuggestions;

  return (
    <div
      className={cn(
        'relative bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/90 shadow-lg p-5 sm:p-7 text-neutral-900',
        className
      )}
    >
      {/* Hidden Datalist for Autocomplete Suggestions */}
      <datalist id={`location-suggestions-${mode}`}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          {mode === 'flights' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-all',
                    tripType === 'oneway'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('roundtrip')}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-all',
                    tripType === 'roundtrip'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  )}
                >
                  Round Trip
                </button>
              </div>

              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="text-xs bg-neutral-100 px-3 py-1.5 rounded-xl border-none font-medium text-neutral-700 focus:ring-1 focus:ring-sky-500"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
              </select>
            </div>
          )}

          {mode === 'trains' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-amber-700" />
                <span>IRCTC Official Berths</span>
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
                {['General', 'Tatkal', 'Ladies', 'Senior'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setTrainQuota(q)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg transition-all text-[11px]',
                      trainQuota === q
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'buses' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Intercity Highway Network</span>
              </span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                Sleeper & Seater AC Coaches
              </span>
            </div>
          )}

          {mode === 'cabs' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-indigo-50/70 p-1 rounded-xl text-xs font-medium border border-indigo-100">
                <button
                  type="button"
                  onClick={() => setCabTripType('oneway')}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-all',
                    cabTripType === 'oneway'
                      ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                      : 'text-indigo-600 hover:text-indigo-950'
                  )}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setCabTripType('roundtrip')}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-all',
                    cabTripType === 'roundtrip'
                      ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                      : 'text-indigo-600 hover:text-indigo-950'
                  )}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setCabTripType('hourly')}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-all',
                    cabTripType === 'hourly'
                      ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                      : 'text-indigo-600 hover:text-indigo-950'
                  )}
                >
                  City Hourly
                </button>
              </div>
            </div>
          )}

          <div className="text-xs text-neutral-400 font-medium ml-auto flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Direct Instant Confirmation</span>
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}


        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin & Destination with Swap */}
          <div className="md:col-span-6 relative grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            {/* From */}
            <div className="p-2.5 sm:p-3">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
                {mode === 'cabs' ? 'Pickup Location' : mode === 'trains' ? 'From Station' : 'From'}
              </label>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  list={`location-suggestions-${mode}`}
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-transparent focus:outline-none"
                  placeholder="Enter origin"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-neutral-300 shadow-xs text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 flex items-center justify-center transition-transform hover:rotate-180 focus-ring cursor-pointer"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>


            {/* To */}
            <div className="p-2.5 sm:p-3 sm:border-l sm:border-neutral-200">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
                {mode === 'cabs' ? 'Drop Location' : mode === 'trains' ? 'To Station' : 'To'}
              </label>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  list={`location-suggestions-${mode}`}
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-transparent focus:outline-none"
                  placeholder="Enter destination"
                />
              </div>
            </div>
          </div>

          {/* Date Picker (Departure & optional Return) */}
          <div
            className={cn(
              tripType === 'roundtrip' && mode === 'flights' ? 'md:col-span-3' : 'md:col-span-3',
              'p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80'
            )}
          >
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
              {mode === 'cabs'
                ? 'Pickup Date & Time'
                : tripType === 'roundtrip'
                ? 'Departure Date'
                : 'Travel Date'}
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Passenger / Class / Search CTA */}
          <div className="md:col-span-3 flex items-center gap-2">
            <div className="flex-1 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
                Travelers
              </label>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              aria-label={`Search ${mode}`}
              className={cn(
                'h-[58px] px-5 rounded-2xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer focus-ring',
                mode === 'flights' && 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20',
                mode === 'trains' && 'bg-amber-700 hover:bg-amber-800 shadow-amber-700/20',
                mode === 'buses' && 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20',
                mode === 'cabs' && 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-700/20'
              )}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>

          </div>
        </div>

        {/* Optional Roundtrip Return Date Row for Flights */}
        {mode === 'flights' && tripType === 'roundtrip' && (
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
            <div className="max-w-xs flex-1 p-2.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5">
                Return Date & Time
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div className="text-xs text-neutral-500">
              Round trip search will reserve connecting return inventory.
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
