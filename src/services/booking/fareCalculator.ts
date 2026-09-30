import { TravelOption, FareBreakdown } from '../../types/booking';

/**
 * Deterministic client-side fare breakdown calculation
 * Clearly separates business logic from React UI components.
 */
export const calculateFareBreakdown = (
  optionOrBaseFare: TravelOption | number,
  passengerCount: number,
  selectedClassOrService?: string
): FareBreakdown => {
  const count = Math.max(1, passengerCount);

  let unitFare = 0;
  let serviceType = 'flight';

  if (typeof optionOrBaseFare === 'number') {
    unitFare = optionOrBaseFare;
    serviceType = selectedClassOrService || 'flight';
  } else {
    unitFare = optionOrBaseFare.baseFare;
    serviceType = optionOrBaseFare.service;

    if (selectedClassOrService) {
      if (optionOrBaseFare.service === 'flight' && optionOrBaseFare.cabinClasses) {
        const cls = optionOrBaseFare.cabinClasses.find((c) => c.className === selectedClassOrService);
        if (cls) unitFare = cls.fare;
      } else if (optionOrBaseFare.service === 'train' && optionOrBaseFare.trainClasses) {
        const cls = optionOrBaseFare.trainClasses.find((c) => c.className === selectedClassOrService);
        if (cls) unitFare = cls.fare;
      }
    }
  }

  const subtotalBaseFare = unitFare * count;

  // Domain-specific simulated taxes and airport/terminal fees
  let taxesAndTerminalFees = 0;
  if (serviceType === 'flight') {
    // 5% GST + fixed passenger service fee
    taxesAndTerminalFees = Math.round(subtotalBaseFare * 0.05 + 350 * count);
  } else if (serviceType === 'train') {
    // IRCTC reservation fee + superfast surcharge + GST
    taxesAndTerminalFees = Math.round(subtotalBaseFare * 0.05 + 40 * count);
  } else if (serviceType === 'bus') {
    // 5% GST + state toll surcharge
    taxesAndTerminalFees = Math.round(subtotalBaseFare * 0.05 + 25 * count);
  } else if (serviceType === 'cab') {
    // All-inclusive: 5% commercial transport tax
    taxesAndTerminalFees = Math.round(subtotalBaseFare * 0.05);
  }

  const safetyOrServiceFee = 0;
  const totalFare = subtotalBaseFare + taxesAndTerminalFees + safetyOrServiceFee;

  return {
    baseFarePerPassenger: unitFare,
    passengerCount: count,
    subtotalBaseFare,
    taxesAndTerminalFees,
    safetyOrServiceFee,
    totalFare,
    currency: 'INR',
  };
};

export const FareCalculatorService = {
  calculateFare: calculateFareBreakdown,
  calculateFareBreakdown,
};
