import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/booking';
import { CanonicalTransportType } from '../../types/travel';

export interface FilterPanelProps {
  service: CanonicalTransportType;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableOperators: string[];
  minPrice: number;
  maxPrice: number;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  service,
  filters,
  onFilterChange,
  availableOperators,
  minPrice,
  maxPrice,
  className = '',
}) => {
  const currentMaxPrice = filters.maxPrice ?? maxPrice;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      maxPrice: Number(e.target.value),
    });
  };

  const handleOperatorToggle = (operator: string) => {
    const current = filters.operators || [];
    const updated = current.includes(operator)
      ? current.filter((o) => o !== operator)
      : [...current, operator];
    onFilterChange({ ...filters, operators: updated });
  };

  const handleStopsChange = (stops: number | 'all') => {
    onFilterChange({ ...filters, stops });
  };

  const handleClassToggle = (classNameValue: string) => {
    const current = filters.cabinClasses || filters.trainClasses || [];
    const updated = current.includes(classNameValue)
      ? current.filter((c) => c !== classNameValue)
      : [...current, classNameValue];

    if (service === 'flight') {
      onFilterChange({ ...filters, cabinClasses: updated });
    } else {
      onFilterChange({ ...filters, trainClasses: updated });
    }
  };

  const handleBusTypeToggle = (type: string) => {
    const current = filters.busTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFilterChange({ ...filters, busTypes: updated });
  };

  const handleCabCategoryToggle = (cat: string) => {
    const current = filters.cabCategories || [];
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onFilterChange({ ...filters, cabCategories: updated });
  };

  const handleTimeWindowSelect = (window: FilterState['departureTimeWindow']) => {
    onFilterChange({ ...filters, departureTimeWindow: window });
  };

  const handleReset = () => {
    onFilterChange({
      maxPrice: undefined,
      stops: 'all',
      operators: [],
      cabinClasses: [],
      trainClasses: [],
      busTypes: [],
      cabCategories: [],
      departureTimeWindow: 'all',
    });
  };

  const hasActiveFilters = Boolean(
    (filters.maxPrice && filters.maxPrice < maxPrice) ||
    (filters.stops && filters.stops !== 'all') ||
    (filters.operators && filters.operators.length > 0) ||
    (filters.cabinClasses && filters.cabinClasses.length > 0) ||
    (filters.trainClasses && filters.trainClasses.length > 0) ||
    (filters.busTypes && filters.busTypes.length > 0) ||
    (filters.cabCategories && filters.cabCategories.length > 0) ||
    (filters.departureTimeWindow && filters.departureTimeWindow !== 'all')
  );

  return (
    <aside className={`bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Max Price Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
          <span>Max Price</span>
          <span className="font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
            ₹{currentMaxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={50}
          value={currentMaxPrice}
          onChange={handlePriceChange}
          className="w-full accent-neutral-900 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
          <span>₹{minPrice.toLocaleString('en-IN')}</span>
          <span>₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 2. Departure Time Window */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-800 block">Departure Window</label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Anytime' },
            { id: 'morning', label: 'Morning (6A-12P)' },
            { id: 'afternoon', label: 'Afternoon (12P-6P)' },
            { id: 'evening', label: 'Evening (6P-12A)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTimeWindowSelect(item.id as FilterState['departureTimeWindow'])}
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-medium transition-colors ${
                (filters.departureTimeWindow || 'all') === item.id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Flight Stops */}
      {service === 'flight' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">Stops</label>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 0, label: 'Non-Stop' },
              { id: 1, label: '1 Stop' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleStopsChange(option.id as number | 'all')}
                className={`flex-1 py-1.5 text-xs rounded-xl border font-medium transition-colors ${
                  (filters.stops ?? 'all') === option.id
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Travel Class / Cabin / Categories */}
      {service === 'flight' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">Cabin Class</label>
          <div className="space-y-1.5">
            {['Economy', 'Business'].map((cls) => {
              const checked = (filters.cabinClasses || []).includes(cls);
              return (
                <label key={cls} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleClassToggle(cls)}
                    className="rounded border-neutral-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>{cls}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {service === 'train' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">Berth / Travel Class</label>
          <div className="grid grid-cols-2 gap-1.5">
            {['1A', '2A', '3A', 'CC', 'EC', 'SL'].map((cls) => {
              const checked = (filters.trainClasses || []).includes(cls);
              return (
                <label key={cls} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleClassToggle(cls)}
                    className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>{cls}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {service === 'bus' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">Coach Format</label>
          <div className="space-y-1.5">
            {['Sleeper', 'Semi-Sleeper', 'Electric Coach'].map((type) => {
              const checked = (filters.busTypes || []).includes(type);
              return (
                <label key={type} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBusTypeToggle(type)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {service === 'cab' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">Vehicle Category</label>
          <div className="space-y-1.5">
            {['Sedan Prime', 'Outstation SUV', 'Green EV', 'Executive Chauffeur'].map((cat) => {
              const checked = (filters.cabCategories || []).includes(cat);
              return (
                <label key={cat} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCabCategoryToggle(cat)}
                    className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{cat}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Operators */}
      {availableOperators.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 block">
            {service === 'flight' ? 'Airlines' : service === 'train' ? 'Train Services' : service === 'bus' ? 'Operators' : 'Fleet Providers'}
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableOperators.map((operator) => {
              const checked = (filters.operators || []).includes(operator);
              return (
                <label key={operator} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleOperatorToggle(operator)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="truncate">{operator}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
