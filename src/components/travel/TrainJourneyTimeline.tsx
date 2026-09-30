import React from 'react';
import { Train, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TrainJourneyTimelineProps {
  trainNumber: string;
  trainName: string;
  trainType?: string; // e.g. "Vande Bharat", "Rajdhani Superfast", "Mail Express"
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn?: string;
  classTypes: string[];
  startingFare: number;
  availableSeats?: number;
  className?: string;
  variant?: 'schematic' | 'horizontal' | 'compact';
  onSelect?: () => void;
}

export const TrainJourneyTimeline: React.FC<TrainJourneyTimelineProps> = ({
  trainNumber,
  trainName,
  trainType = 'Superfast Express',
  originCity,
  originCode,
  destinationCity,
  destinationCode,
  departureTime,
  arrivalTime,
  duration,
  runsOn = 'Daily',
  classTypes,
  startingFare,
  availableSeats = 42,
  className,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group transition-all duration-200 border rounded-2xl p-5 sm:p-6 cursor-pointer',
        'bg-white border-stone-200/90 shadow-xs hover:border-amber-500/60 hover:shadow-md',
        className
      )}
    >
      {/* Top Bar: Train ID, Name, Train Type, Runs On */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                #{trainNumber}
              </span>
              <h3 className="font-semibold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                {trainName}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{trainType}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Runs: <strong className="text-stone-700">{runsOn}</strong></span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>{availableSeats} seats open</span>
          </span>
        </div>
      </div>

      {/* Railway Journey Schematic Timeline */}
      <div className="py-6">
        <div className="relative grid grid-cols-12 items-center">
          {/* Origin Station Block */}
          <div className="col-span-3 text-left space-y-1">
            <span className="font-mono text-xs font-bold text-amber-900 tracking-wider">
              {originCode}
            </span>
            <div className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              {originCity}
            </div>
            <div className="text-sm font-semibold text-amber-700">
              {departureTime}
            </div>
          </div>

          {/* Central Track & Train Visualization */}
          <div className="col-span-6 px-2 sm:px-4">
            <div className="flex flex-col items-center">
              {/* Duration and distance info */}
              <div className="flex items-center gap-1 text-xs text-stone-500 font-medium mb-2">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{duration}</span>
              </div>

              {/* The Railway Track Line */}
              <div className="relative w-full flex items-center">
                {/* Track rails (dual parallel track effect) */}
                <div className="w-full flex flex-col gap-[3px]">
                  <div className="w-full h-[2px] bg-stone-300 group-hover:bg-amber-500/80 transition-colors" />
                  <div className="w-full h-[2px] bg-stone-300 group-hover:bg-amber-500/80 transition-colors" />
                </div>

                {/* Train Engine in transit */}
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                  <Train className="w-4 h-4" />
                </div>

                {/* Origin and Destination Station Signal Dots */}
                <div className="absolute left-0 -translate-x-1 w-3 h-3 rounded-full bg-stone-800 border-2 border-white" />
                <div className="absolute right-0 translate-x-1 w-3 h-3 rounded-full bg-stone-800 border-2 border-white" />
              </div>

              {/* Track schematic annotations */}
              <div className="w-full flex justify-between text-[10px] text-stone-400 mt-2 font-mono uppercase tracking-wider">
                <span>Platform Boarding</span>
                <span>Direct Rail Corridor</span>
                <span>Terminus Arrival</span>
              </div>
            </div>
          </div>

          {/* Destination Station Block */}
          <div className="col-span-3 text-right space-y-1">
            <span className="font-mono text-xs font-bold text-amber-900 tracking-wider">
              {destinationCode}
            </span>
            <div className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              {destinationCity}
            </div>
            <div className="text-sm font-semibold text-amber-700">
              {arrivalTime}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Classes & IRCTC Reservation Row */}
      <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-400 text-[11px] mr-1">Available Classes:</span>
          {classTypes.map((cls) => (
            <span
              key={cls}
              className="px-2.5 py-1 bg-stone-100/80 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-mono font-medium rounded-md border border-stone-200 transition-colors"
            >
              {cls}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block">IRCTC Standard Fare from</span>
            <span className="text-lg font-bold text-stone-900">
              ₹{startingFare.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
          >
            Check Berths
          </button>
        </div>
      </div>
    </div>
  );
};
