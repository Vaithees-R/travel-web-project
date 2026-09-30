import React, { useState } from 'react';
import { ArrowRight, Star, Clock, Users, Briefcase, Shield, Luggage } from 'lucide-react';
import { TravelOption } from '../../types/booking';
import { TransportBadge } from '../ui/TransportBadge';

export interface ResultItemCardProps {
  option: TravelOption;
  onSelect: (option: TravelOption, selectedClass?: string) => void;
  className?: string;
}

export const ResultItemCard: React.FC<ResultItemCardProps> = ({
  option,
  onSelect,
  className = '',
}) => {
  // If option has classes (e.g. Flight cabin or Train berths), manage selected class
  const initialClass = option.selectedClass || 
    (option.cabinClasses && option.cabinClasses[0]?.className) ||
    (option.trainClasses && option.trainClasses[0]?.className) ||
    'Standard';

  const [selectedClass, setSelectedClass] = useState<string>(initialClass);

  // Compute active fare based on selected sub-class
  let currentFare = option.baseFare;
  if (option.cabinClasses) {
    const matched = option.cabinClasses.find((c) => c.className === selectedClass);
    if (matched) currentFare = matched.fare;
  } else if (option.trainClasses) {
    const matched = option.trainClasses.find((c) => c.className === selectedClass);
    if (matched) currentFare = matched.fare;
  }

  const handleBook = () => {
    onSelect(option, selectedClass);
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* 1. FLIGHT CARD VARIANT */}
      {option.service === 'flight' && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <TransportBadge type="flight" size="sm" variant="subtle" />
              <div>
                <span className="text-sm font-bold text-neutral-900">{option.operator}</span>
                <span className="text-xs text-neutral-500 font-mono ml-2">{option.identifier}</span>
                {option.subType && (
                  <span className="text-[11px] text-neutral-400 ml-2 hidden sm:inline">
                    • {option.subType}
                  </span>
                )}
              </div>
            </div>

            {option.rating && (
              <div className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{option.rating}</span>
              </div>
            )}
          </div>

          {/* Route & Times Visual */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Times & Route (8 cols) */}
            <div className="md:col-span-8 flex items-center justify-between sm:justify-start sm:gap-8">
              {/* Origin */}
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.departureTime}
                </div>
                <div className="text-xs font-bold text-neutral-700">{option.originCode}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                  {option.originStationOrTerminal || option.originCity}
                </div>
              </div>

              {/* Flight Duration Visual */}
              <div className="flex-1 max-w-[160px] text-center px-2">
                <span className="text-[11px] font-medium text-neutral-500 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{option.duration}</span>
                </span>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-sky-200" />
                  <div className="w-2 h-2 rounded-full bg-sky-600 absolute" />
                </div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  {option.stops === 0 ? 'Non-Stop' : `${option.stops} Stop`}
                </span>
              </div>

              {/* Destination */}
              <div className="text-right sm:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.arrivalTime}
                </div>
                <div className="text-xs font-bold text-neutral-700">{option.destinationCode}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                  {option.destinationStationOrTerminal || option.destinationCity}
                </div>
              </div>
            </div>

            {/* Price & Book CTA (4 cols) */}
            <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Per Passenger
                </span>
                <div className="text-2xl font-extrabold text-neutral-900">
                  ₹{currentFare.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Taxes included</span>
              </div>

              <button
                type="button"
                onClick={handleBook}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5"
              >
                <span>Book Flight</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cabin Classes Selection Bar */}
          {option.cabinClasses && option.cabinClasses.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400 text-[11px] font-medium">Select Cabin:</span>
                {option.cabinClasses.map((c) => (
                  <button
                    key={c.className}
                    type="button"
                    onClick={() => setSelectedClass(c.className)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                      selectedClass === c.className
                        ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{c.className}</span>
                    <span className="ml-1.5 font-mono text-[11px] text-neutral-500">₹{c.fare.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <Luggage className="w-3 h-3 text-neutral-400" />
                <span>15 kg check-in • 7 kg cabin</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. TRAIN CARD VARIANT */}
      {option.service === 'train' && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <TransportBadge type="train" size="sm" variant="subtle" />
              <div>
                <span className="text-sm font-bold text-neutral-900">{option.operator}</span>
                <span className="text-xs text-amber-800 font-mono font-semibold ml-2">{option.identifier}</span>
              </div>
            </div>

            <span className="text-[11px] text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full font-medium">
              Runs Daily • On-Time Track Record: 94%
            </span>
          </div>

          {/* Timings and Stations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex items-center justify-between sm:justify-start sm:gap-8">
              {/* Origin */}
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.departureTime}
                </div>
                <div className="text-xs font-bold text-neutral-800">{option.originCode}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                  {option.originStationOrTerminal || option.originCity}
                </div>
              </div>

              {/* Train Journey Duration */}
              <div className="flex-1 max-w-[160px] text-center px-2">
                <span className="text-[11px] font-medium text-neutral-500 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{option.duration}</span>
                </span>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-amber-200" />
                  <div className="w-2 h-2 rounded-full bg-amber-700 absolute" />
                </div>
                <span className="text-[10px] text-neutral-400">Direct Route</span>
              </div>

              {/* Destination */}
              <div className="text-right sm:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.arrivalTime}
                </div>
                <div className="text-xs font-bold text-neutral-800">{option.destinationCode}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                  {option.destinationStationOrTerminal || option.destinationCity}
                </div>
              </div>
            </div>

            {/* Price & Book CTA */}
            <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Class: {selectedClass}
                </span>
                <div className="text-2xl font-extrabold text-neutral-900">
                  ₹{currentFare.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-amber-800 font-medium">IRCTC Official Berth</span>
              </div>

              <button
                type="button"
                onClick={handleBook}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-amber-700/20 flex items-center gap-1.5"
              >
                <span>Book Berth</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* IRCTC Berth Classes Tiles */}
          {option.trainClasses && option.trainClasses.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="text-[11px] text-neutral-400 font-medium">Choose Class & Check Availability:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {option.trainClasses.map((cls) => {
                  const isSelected = selectedClass === cls.className;
                  return (
                    <button
                      key={cls.className}
                      type="button"
                      onClick={() => setSelectedClass(cls.className)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-500/20'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                        <span>{cls.className}</span>
                        <span className="font-mono text-[11px]">₹{cls.fare}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cls.status === 'Available'
                              ? 'bg-emerald-500'
                              : cls.status === 'RAC'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-semibold ${
                            cls.status === 'Available'
                              ? 'text-emerald-700'
                              : cls.status === 'RAC'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {cls.status} {cls.available}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BUS CARD VARIANT */}
      {option.service === 'bus' && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <TransportBadge type="bus" size="sm" variant="subtle" />
              <div>
                <span className="text-sm font-bold text-neutral-900">{option.operator}</span>
                <span className="text-xs text-neutral-500 ml-2">{option.subType || option.busType}</span>
              </div>
            </div>

            {option.rating && (
              <div className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                <span>{option.rating}</span>
                <span className="text-[10px] text-emerald-700 font-normal">({option.availableUnits} seats left)</span>
              </div>
            )}
          </div>

          {/* Timings and Terminals */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex items-center justify-between sm:justify-start sm:gap-8">
              {/* Departure */}
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.departureTime}
                </div>
                <div className="text-xs font-bold text-neutral-800">{option.originCity}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                  {option.originStationOrTerminal}
                </div>
              </div>

              {/* Journey Duration */}
              <div className="flex-1 max-w-[160px] text-center px-2">
                <span className="text-[11px] font-medium text-neutral-500 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{option.duration}</span>
                </span>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-emerald-200" />
                  <div className="w-2 h-2 rounded-full bg-emerald-700 absolute" />
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Lounge Boarding</span>
              </div>

              {/* Arrival */}
              <div className="text-right sm:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {option.arrivalTime}
                </div>
                <div className="text-xs font-bold text-neutral-800">{option.destinationCity}</div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                  {option.destinationStationOrTerminal}
                </div>
              </div>
            </div>

            {/* Price & Book CTA */}
            <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Per Berth / Seat
                </span>
                <div className="text-2xl font-extrabold text-neutral-900">
                  ₹{currentFare.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">All highway tolls included</span>
              </div>

              <button
                type="button"
                onClick={handleBook}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
              >
                <span>Select Berth</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Amenities Strip */}
          {option.amenities && option.amenities.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-medium">Amenities:</span>
              {option.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CAB CARD VARIANT */}
      {option.service === 'cab' && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <TransportBadge type="cab" size="sm" variant="subtle" />
              <div>
                <span className="text-sm font-bold text-neutral-900">{option.cabCategory || option.operator}</span>
                <span className="text-xs text-neutral-500 ml-2">{option.subType}</span>
              </div>
            </div>

            <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full font-semibold">
              Doorstep Pickup • Sanitized Car
            </span>
          </div>

          {/* Vehicle specs and trip route */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Vehicle image + capacity specs (8 cols) */}
            <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-5">
              {option.image && (
                <img
                  src={option.image}
                  alt={option.operator}
                  className="w-full sm:w-44 h-28 object-cover rounded-2xl border border-neutral-200"
                />
              )}

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{option.capacity || '4 Passengers'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{option.luggage || '2 Large Bags'}</span>
                  </span>
                </div>

                <div className="text-xs text-neutral-500">
                  Route: <strong className="text-neutral-800">{option.originCity}</strong> → <strong className="text-neutral-800">{option.destinationCity}</strong>
                  <span className="ml-2 text-neutral-400">({option.duration})</span>
                </div>

                {option.amenities && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {option.amenities.map((item) => (
                      <span key={item} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 text-indigo-600" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Book CTA (4 cols) */}
            <div className="md:col-span-4 md:border-l md:border-neutral-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  All-Inclusive Fare
                </span>
                <div className="text-2xl font-extrabold text-neutral-900">
                  ₹{currentFare.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Tolls, parking & fuel included</span>
              </div>

              <button
                type="button"
                onClick={handleBook}
                className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-indigo-700/20 flex items-center gap-1.5"
              >
                <span>Book Chauffeur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
