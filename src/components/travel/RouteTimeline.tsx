import React from 'react';
import { Plane, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface RouteTimelineProps {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  duration?: string;
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: number;
  currency?: string;
  nonStop?: boolean;
  className?: string;
  variant?: 'card' | 'editorial' | 'compact';
  onSelect?: () => void;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  fromCity,
  fromCode,
  toCity,
  toCode,
  duration = '2h 15m',
  airline,
  flightNumber,
  departureTime,
  arrivalTime,
  fare,
  currency = '₹',
  nonStop = true,
  className,
  variant = 'editorial',
  onSelect,
}) => {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-between py-2 border-b border-neutral-100 last:border-0', className)}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900 text-xs">{fromCode}</span>
          <ArrowRight className="w-3 h-3 text-neutral-400" />
          <span className="font-semibold text-neutral-900 text-xs">{toCode}</span>
          <span className="text-[11px] text-neutral-500">({fromCity} to {toCity})</span>
        </div>
        {fare && (
          <span className="text-xs font-semibold text-neutral-900">
            {currency}{fare.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group transition-all duration-200',
        variant === 'card'
          ? 'p-5 bg-white rounded-xl border border-neutral-200/80 shadow-xs hover:border-sky-300 hover:shadow-md cursor-pointer'
          : 'p-4 sm:p-5 bg-neutral-900/40 backdrop-blur-xs border border-white/10 rounded-2xl hover:bg-neutral-900/60 hover:border-sky-500/30 text-white cursor-pointer',
        className
      )}
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          {airline && (
            <span className={cn('font-medium', variant === 'card' ? 'text-neutral-800' : 'text-neutral-200')}>
              {airline}
            </span>
          )}
          {flightNumber && (
            <span className={cn('font-mono text-[11px]', variant === 'card' ? 'text-neutral-500' : 'text-neutral-400')}>
              {flightNumber}
            </span>
          )}
        </div>
        <span
          className={cn(
            'text-[10px] px-2 py-0.5 rounded-full font-medium',
            variant === 'card'
              ? 'bg-sky-50 text-sky-700'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          )}
        >
          {nonStop ? 'Non-Stop' : '1 Stop'}
        </span>
      </div>

      {/* Visual Flight Route: Origin ───✈─── Destination */}
      <div className="grid grid-cols-12 items-center gap-2">
        {/* Origin */}
        <div className="col-span-4 text-left">
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-xl sm:text-2xl font-bold tracking-tight', variant === 'card' ? 'text-neutral-900' : 'text-white')}>
              {fromCode}
            </span>
            <span className={cn('text-xs font-medium truncate max-w-[90px] sm:max-w-none', variant === 'card' ? 'text-neutral-600' : 'text-neutral-300')}>
              {fromCity}
            </span>
          </div>
          {departureTime && (
            <p className={cn('text-xs mt-0.5 font-medium', variant === 'card' ? 'text-neutral-500' : 'text-neutral-400')}>
              {departureTime}
            </p>
          )}
        </div>

        {/* Center Flight Path Line */}
        <div className="col-span-4 flex flex-col items-center justify-center px-1">
          <span className={cn('text-[11px] font-medium tracking-tight mb-1', variant === 'card' ? 'text-neutral-500' : 'text-neutral-400')}>
            {duration}
          </span>
          <div className="relative w-full flex items-center">
            {/* The line */}
            <div
              className={cn(
                'w-full h-[2px] transition-colors',
                variant === 'card' ? 'bg-neutral-200 group-hover:bg-sky-400' : 'bg-neutral-700 group-hover:bg-sky-400'
              )}
            />
            {/* Airplane in center */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110',
                variant === 'card'
                  ? 'bg-sky-50 text-sky-600 border border-sky-200'
                  : 'bg-neutral-800 text-sky-400 border border-sky-400/40'
              )}
            >
              <Plane className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>
          <span className={cn('text-[10px] mt-1', variant === 'card' ? 'text-neutral-400' : 'text-neutral-500')}>
            Direct Aerial Corridor
          </span>
        </div>

        {/* Destination */}
        <div className="col-span-4 text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className={cn('text-xs font-medium truncate max-w-[90px] sm:max-w-none', variant === 'card' ? 'text-neutral-600' : 'text-neutral-300')}>
              {toCity}
            </span>
            <span className={cn('text-xl sm:text-2xl font-bold tracking-tight', variant === 'card' ? 'text-neutral-900' : 'text-white')}>
              {toCode}
            </span>
          </div>
          {arrivalTime && (
            <p className={cn('text-xs mt-0.5 font-medium', variant === 'card' ? 'text-neutral-500' : 'text-neutral-400')}>
              {arrivalTime}
            </p>
          )}
        </div>
      </div>

      {/* Bottom fare / action */}
      {fare !== undefined && (
        <div className={cn('mt-4 pt-3 border-t flex items-center justify-between text-xs', variant === 'card' ? 'border-neutral-100' : 'border-white/10')}>
          <span className={variant === 'card' ? 'text-neutral-500' : 'text-neutral-400'}>
            Starting standard fare
          </span>
          <div className="flex items-baseline gap-1">
            <span className={cn('text-base font-bold tracking-tight', variant === 'card' ? 'text-neutral-900' : 'text-white')}>
              {currency}{fare.toLocaleString('en-IN')}
            </span>
            <span className={cn('text-[10px]', variant === 'card' ? 'text-neutral-400' : 'text-neutral-500')}>
              / traveller
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
