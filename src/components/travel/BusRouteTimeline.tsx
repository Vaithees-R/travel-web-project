import React from 'react';
import { Bus, MapPin, Clock, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BusRouteTimelineProps {
  operator: string;
  busType: string; // e.g. "Volvo Multi-Axle AC Sleeper (2+1)"
  departureCity: string;
  boardingPoint: string;
  departureTime: string;
  arrivalCity: string;
  droppingPoint: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  rating?: number;
  availableSeats?: number;
  amenities?: string[];
  className?: string;
  onSelect?: () => void;
}

export const BusRouteTimeline: React.FC<BusRouteTimelineProps> = ({
  operator,
  busType,
  departureCity,
  boardingPoint,
  departureTime,
  arrivalCity,
  droppingPoint,
  arrivalTime,
  duration,
  fare,
  rating = 4.7,
  availableSeats = 18,
  amenities = ['Route Tracking', 'Charging Port', 'Reading Lamp', 'Water Bottle'],
  className,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group transition-all duration-200 border rounded-2xl p-5 sm:p-6 bg-white border-neutral-200/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md cursor-pointer',
        className
      )}
    >
      {/* Header: Operator Name, Bus Type, Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-neutral-900 group-hover:text-emerald-800 transition-colors">
                {operator}
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-full">
                ★ {rating}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{busType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">
            Seats remaining: <strong className="text-neutral-800">{availableSeats}</strong>
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="hidden sm:inline text-emerald-700 font-medium">Instant Boarding Pass</span>
        </div>
      </div>

      {/* Horizontal Intercity Journey Timeline */}
      <div className="py-5">
        <div className="grid grid-cols-12 items-center gap-2">
          {/* Departure & Boarding point */}
          <div className="col-span-4 text-left space-y-1">
            <div className="text-sm sm:text-base font-bold text-neutral-900">
              {departureTime}
            </div>
            <div className="font-medium text-xs text-neutral-800">
              {departureCity}
            </div>
            <div className="flex items-start gap-1 text-[11px] text-neutral-500">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
              <span className="truncate">{boardingPoint}</span>
            </div>
          </div>

          {/* Central Route Corridor Line */}
          <div className="col-span-4 px-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium mb-1.5">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span>{duration}</span>
              </div>

              {/* Highway Corridor Line */}
              <div className="relative w-full flex items-center">
                <div className="w-full h-[2px] bg-neutral-200 group-hover:bg-emerald-400 transition-colors dashed border-t border-dashed border-emerald-500" />
                <div className="absolute left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Bus className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className="text-[10px] text-neutral-400 mt-1 font-mono uppercase tracking-wider">
                Expressway Corridor
              </span>
            </div>
          </div>

          {/* Arrival & Dropping point */}
          <div className="col-span-4 text-right space-y-1">
            <div className="text-sm sm:text-base font-bold text-neutral-900">
              {arrivalTime}
            </div>
            <div className="font-medium text-xs text-neutral-800">
              {arrivalCity}
            </div>
            <div className="flex items-start justify-end gap-1 text-[11px] text-neutral-500">
              <span className="truncate">{droppingPoint}</span>
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities & Booking Row */}
      <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {amenities.map((item) => (
            <span
              key={item}
              className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200/80 text-neutral-600 flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block">Seat fare starts from</span>
            <span className="text-base sm:text-lg font-bold text-neutral-900">
              ₹{fare.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
          >
            Select Berth
          </button>
        </div>
      </div>
    </div>
  );
};
