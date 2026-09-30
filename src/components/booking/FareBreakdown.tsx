import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { FareBreakdown as FareBreakdownType, TravelOption } from '../../types/booking';
import { CanonicalTransportType } from '../../types/travel';

export interface FareBreakdownProps {
  fareBreakdown: FareBreakdownType;
  service: CanonicalTransportType;
  selectedOption?: TravelOption;
  selectedClass?: string;
  className?: string;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({
  fareBreakdown,
  service,
  selectedOption,
  selectedClass,
  className = '',
}) => {
  const {
    baseFarePerPassenger,
    passengerCount,
    subtotalBaseFare,
    taxesAndTerminalFees,
    safetyOrServiceFee,
    totalFare,
  } = fareBreakdown;

  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
          Fare Summary & Transparent Breakdown
        </h3>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Guaranteed Final Fare</span>
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-neutral-600">
        {/* Base fare line */}
        <div className="flex justify-between items-center">
          <div>
            <span>Base Fare</span>
            <span className="text-neutral-400 ml-1">
              (₹{baseFarePerPassenger.toLocaleString('en-IN')} × {passengerCount}{' '}
              {passengerCount === 1 ? 'traveller' : 'travellers'})
            </span>
          </div>
          <span className="font-semibold text-neutral-900 font-mono">
            ₹{subtotalBaseFare.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Taxes & Terminal fees */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span>
              {service === 'flight'
                ? 'Aviation GST & Airport Terminal Fees'
                : service === 'train'
                ? 'IRCTC Reservation & Superfast Surcharge'
                : service === 'bus'
                ? 'Intercity Highway Toll & State Transport Taxes'
                : 'Deterministic Distance & Toll Adjustments'}
            </span>
          </div>
          <span className="font-semibold text-neutral-900 font-mono">
            ₹{taxesAndTerminalFees.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Safety / Service fee (if > 0) */}
        {safetyOrServiceFee > 0 && (
          <div className="flex justify-between items-center">
            <span>Safety Assurance & Instant Booking Dispatch</span>
            <span className="font-semibold text-neutral-900 font-mono">
              ₹{safetyOrServiceFee.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Transport-specific perks note */}
        {service === 'flight' && (
          <div className="py-2 px-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>Baggage Allowance:</span>
              <strong className="text-neutral-800">{selectedOption?.baggage || 'Cabin 7 kg, Check-in 15 kg'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Cabin Class:</span>
              <strong className="text-neutral-800">{selectedClass || 'Economy'}</strong>
            </div>
          </div>
        )}

        {service === 'train' && (
          <div className="py-2 px-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>Class Tier:</span>
              <strong className="text-neutral-800">{selectedClass || 'General Berth'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Catering & Linen:</span>
              <strong className="text-neutral-800">
                {selectedClass === '1A' || selectedClass === '2A' || selectedClass === 'EC'
                  ? 'Complimentary Onboard'
                  : 'Standard Rail Amenities'}
              </strong>
            </div>
          </div>
        )}

        {service === 'cab' && (
          <div className="py-2 px-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>Vehicle Category:</span>
              <strong className="text-neutral-800">{selectedOption?.cabCategory || 'Sedan Prime'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Highway Tolls & Parking:</span>
              <strong className="text-emerald-700">Included</strong>
            </div>
          </div>
        )}

        {/* Total line */}
        <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-neutral-900 block">Total Payable Amount</span>
            <span className="text-[10px] text-neutral-400">All applicable taxes & surcharges included</span>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-neutral-900 font-mono tracking-tight">
              ₹{totalFare.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-1.5 border-t border-neutral-100">
        <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>No hidden checkout fees or processing charges will be added at payment.</span>
      </div>
    </div>
  );
};
