import React, { useState, useRef, useEffect, useId } from 'react';
import { MapPin, Search, Check, AlertCircle, X, Plane, Train, Bus, Car } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  TravelLocation,
  TravelMode,
  searchTravelLocations,
  getLocationDisplayInfo,
  findLocationByValue,
} from '../../data/indianLocations';

export interface LocationSelectorProps {
  id?: string;
  label: string;
  value: string;
  onChange: (formattedValue: string, location?: TravelLocation) => void;
  mode: TravelMode;
  disabledValue?: string; // Opposite selection to prevent same location
  placeholder?: string;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  id: explicitId,
  label,
  value,
  onChange,
  mode,
  disabledValue,
  placeholder = 'Select city or station',
  className,
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const listboxId = `${id}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [sameLocationError, setSameLocationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Selected location details
  const selectedLocation = findLocationByValue(value);
  const selectedDisplay = selectedLocation
    ? getLocationDisplayInfo(selectedLocation, mode)
    : null;

  // Disabled opposite location
  const oppositeLocation = disabledValue ? findLocationByValue(disabledValue) : null;

  // Filtered locations
  const filteredLocations = searchTravelLocations(searchQuery, mode);

  // Group locations into Tier 1, Tier 2, and International
  const tier1Locations = filteredLocations.filter((l) => l.tier === 1 && !l.isInternational);
  const tier2Locations = filteredLocations.filter((l) => l.tier === 2 && !l.isInternational);
  const internationalLocations = filteredLocations.filter((l) => l.isInternational);

  // Flat list for keyboard indexing
  const flatOptions = [...tier1Locations, ...tier2Locations, ...internationalLocations];

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSameLocationError(null);
      // Find initial highlighted index matching currently selected item
      if (selectedLocation) {
        const idx = flatOptions.findIndex((l) => l.id === selectedLocation.id);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      } else {
        setHighlightedIndex(0);
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && optionsListRef.current) {
      const activeEl = optionsListRef.current.querySelector(
        `[data-option-index="${highlightedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle location selection
  const handleSelect = (loc: TravelLocation) => {
    // Prevent selecting identical location as the opposite field
    if (oppositeLocation && (oppositeLocation.id === loc.id || oppositeLocation.city.toLowerCase() === loc.city.toLowerCase())) {
      setSameLocationError('Origin and destination cannot be identical. Choose a different destination.');
      return;
    }

    const info = getLocationDisplayInfo(loc, mode);
    onChange(info.formattedValue, loc);
    setIsOpen(false);
    setSameLocationError(null);
    triggerRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % Math.max(1, flatOptions.length));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? Math.max(0, flatOptions.length - 1) : prev - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (flatOptions[highlightedIndex]) {
          handleSelect(flatOptions[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'flights':
        return <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />;
      case 'trains':
        return <Train className="w-3.5 h-3.5 text-amber-700 shrink-0" />;
      case 'buses':
        return <Bus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'cabs':
        return <Car className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full text-left', className)}>
      <label
        htmlFor={id}
        className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-0.5 cursor-pointer"
      >
        {label}
      </label>

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`${label}: ${value || placeholder}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full flex items-center justify-between gap-1.5 py-1 text-left bg-transparent rounded-lg transition-colors focus-ring cursor-pointer group',
          isOpen && 'ring-2 ring-neutral-900 ring-offset-1'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 shrink-0 transition-colors" />
          <div className="truncate">
            {selectedDisplay ? (
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                  {selectedDisplay.primary}
                </span>
                {selectedDisplay.code && (
                  <span className="text-[11px] font-mono font-semibold text-neutral-500 shrink-0">
                    ({selectedDisplay.code})
                  </span>
                )}
              </div>
            ) : value ? (
              <span className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                {value}
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-medium text-neutral-400 truncate">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        {selectedDisplay?.code && (
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/80 shrink-0">
            {selectedDisplay.code}
          </span>
        )}
      </button>

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Select ${label}`}
          className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-96 top-full mt-2 z-50 bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden animate-dropdown-enter"
          style={{ minWidth: '320px' }}
        >
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50/70">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                  if (sameLocationError) setSameLocationError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'flights'
                    ? 'Search city, airport or code (e.g. DEL, MAA, BLR)...'
                    : mode === 'trains'
                    ? 'Search city, station or code (e.g. NDLS, MAS, SBC)...'
                    : 'Search city or state (e.g. Chennai, Bengaluru)...'
                }
                className="w-full pl-9 pr-8 py-2 text-xs font-medium text-neutral-900 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Same Location Validation Alert */}
            {sameLocationError && (
              <div
                role="alert"
                className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] font-semibold text-amber-800 animate-fadeIn"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{sameLocationError}</span>
              </div>
            )}
          </div>

          {/* Grouped Options Listbox */}
          <div
            ref={optionsListRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-label={`Available destinations for ${mode}`}
            className="max-h-72 overflow-y-auto p-1.5 space-y-3 focus:outline-none"
          >
            {flatOptions.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <p className="text-xs font-semibold text-neutral-700">No destinations found</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Try searching by city name, state, or standard transport code.
                </p>
              </div>
            ) : (
              <>
                {/* 1. Tier 1 / Major Hubs */}
                {tier1Locations.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Major Travel Hubs (Tier 1)</span>
                      <span className="text-[9px] font-mono text-neutral-400">Trunk Routes</span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {tier1Locations.map((loc) => {
                        const optionIndex = flatOptions.findIndex((o) => o.id === loc.id);
                        return renderOption(loc, optionIndex);
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Tier 2 / Regional Destinations */}
                {tier2Locations.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Regional Destinations (Tier 2)</span>
                      <span className="text-[9px] font-mono text-neutral-400">Intercity</span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {tier2Locations.map((loc) => {
                        const optionIndex = flatOptions.findIndex((o) => o.id === loc.id);
                        return renderOption(loc, optionIndex);
                      })}
                    </div>
                  </div>
                )}

                {/* 3. International Gateways (Flights Only) */}
                {internationalLocations.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center justify-between">
                      <span>International Gateways</span>
                      <span className="text-[9px] font-mono text-sky-600">Cross-Border</span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {internationalLocations.map((loc) => {
                        const optionIndex = flatOptions.findIndex((o) => o.id === loc.id);
                        return renderOption(loc, optionIndex);
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Helper Footer */}
          <div className="p-2 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-[10px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1">
              {getModeIcon()}
              <span>Curated Indian Transport Network</span>
            </span>
            <span className="font-mono">Use ↑↓ keys + Enter</span>
          </div>
        </div>
      )}
    </div>
  );

  function renderOption(loc: TravelLocation, optionIndex: number) {
    const info = getLocationDisplayInfo(loc, mode);
    const isSelected = selectedLocation?.id === loc.id;
    const isHighlighted = optionIndex === highlightedIndex;
    const isOpposite = oppositeLocation?.id === loc.id || oppositeLocation?.city.toLowerCase() === loc.city.toLowerCase();

    return (
      <div
        key={loc.id}
        id={`${id}-opt-${loc.id}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isOpposite}
        data-option-index={optionIndex}
        onClick={() => handleSelect(loc)}
        onMouseEnter={() => setHighlightedIndex(optionIndex)}
        className={cn(
          'w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer select-none',
          isHighlighted && 'bg-neutral-100',
          isSelected && 'bg-neutral-900 text-white hover:bg-neutral-800',
          isOpposite && 'opacity-40 cursor-not-allowed hover:bg-red-50/50'
        )}
      >
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-bold truncate',
                isSelected ? 'text-white' : 'text-neutral-900'
              )}
            >
              {info.primary}
            </span>
            {info.code && (
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold',
                  isSelected
                    ? 'bg-neutral-800 text-emerald-400'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                )}
              >
                {info.code}
              </span>
            )}
            {isOpposite && (
              <span className="text-[10px] font-medium text-amber-600 italic">
                (Current origin)
              </span>
            )}
          </div>
          <p
            className={cn(
              'text-[11px] truncate mt-0.5',
              isSelected ? 'text-neutral-300' : 'text-neutral-500'
            )}
          >
            {info.secondary}
          </p>
        </div>

        {isSelected ? (
          <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
        ) : info.badge ? (
          <span
            className={cn(
              'text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold shrink-0 hidden sm:inline-block',
              isSelected
                ? 'bg-neutral-800 text-neutral-200'
                : 'bg-neutral-100 text-neutral-500'
            )}
          >
            {info.badge}
          </span>
        ) : null}
      </div>
    );
  }
};
