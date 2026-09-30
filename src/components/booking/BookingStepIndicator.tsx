import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CanonicalTransportType } from '../../types/travel';

export interface BookingStepIndicatorProps {
  currentStep: 'results' | 'passengers' | 'review' | 'confirmation';
  service?: CanonicalTransportType;
  className?: string;
}

const STEPS = [
  { id: 'results', label: '1. Select Option' },
  { id: 'passengers', label: '2. Traveller Details' },
  { id: 'review', label: '3. Review & Summary' },
  { id: 'confirmation', label: '4. Confirmed' },
];

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = ({
  currentStep,
  className,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn('w-full py-3 border-b border-neutral-200/80 bg-white/60 backdrop-blur-xs', className)}>
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  isCompleted && 'bg-emerald-600 text-white',
                  isCurrent && 'bg-neutral-900 text-white ring-2 ring-emerald-500/30',
                  !isCompleted && !isCurrent && 'bg-neutral-100 text-neutral-400'
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:inline font-medium',
                  isCurrent ? 'text-neutral-900 font-semibold' : isCompleted ? 'text-neutral-700' : 'text-neutral-400'
                )}
              >
                {step.label.replace(/^\d+\.\s*/, '')}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-6 sm:w-12 h-[1px] ml-2',
                    idx < currentIndex ? 'bg-emerald-600' : 'bg-neutral-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
