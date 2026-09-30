import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/booking';

export interface SortControlProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

export const SortControl: React.FC<SortControlProps> = ({
  currentSort,
  onSortChange,
  className = '',
}) => {
  const options: Array<{ id: SortOption; label: string }> = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'duration_short', label: 'Duration: Shortest' },
    { id: 'departure_early', label: 'Departure: Earliest' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
        <span className="hidden sm:inline">Sort by:</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSortChange(option.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              currentSort === option.id
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
