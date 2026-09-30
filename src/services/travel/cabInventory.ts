import { CabOption, TripType } from '../../types/booking';
import { CAB_IMAGES } from '../../assets/travelImages';
import { CabFareEngine, CAB_CATEGORY_CONFIGS } from './cabFareEngine';

export const generateCabOptionsForRoute = (
  originCity: string,
  destinationCity: string,
  tripType: TripType = 'oneway'
): CabOption[] => {
  const { distanceKm, durationText } = CabFareEngine.getDistanceEstimate(originCity, destinationCity);

  const categories = ['Mini', 'Sedan Prime', 'Outstation SUV', 'Green EV', 'Executive'] as const;

  const imageMap: Record<string, string | undefined> = {
    Mini: CAB_IMAGES[5]?.src || CAB_IMAGES[0]?.src,
    'Sedan Prime': CAB_IMAGES[0]?.src,
    'Outstation SUV': CAB_IMAGES[2]?.src,
    'Green EV': CAB_IMAGES[4]?.src,
    Executive: CAB_IMAGES[6]?.src,
  };

  return categories.map((catKey) => {
    const config = CAB_CATEGORY_CONFIGS[catKey];
    const fareCalc = CabFareEngine.calculateEstimatedFare(catKey, distanceKm, tripType);

    return {
      id: `cab-${originCity.toLowerCase().slice(0, 3)}-${destinationCity.toLowerCase().slice(0, 3)}-${catKey.toLowerCase().replace(/\s+/g, '-')}`,
      service: 'cab',
      operator: config.name,
      identifier: `${catKey.toUpperCase().replace(/\s+/g, '-')}`,
      subType: config.models,
      originCity,
      originCode: originCity.slice(0, 3).toUpperCase(),
      originStationOrTerminal: `${originCity} Direct Curbside Pickup`,
      destinationCity,
      destinationCode: destinationCity.slice(0, 3).toUpperCase(),
      destinationStationOrTerminal: `${destinationCity} Doorstep Drop`,
      departureTime: 'Flexible (On-demand)',
      arrivalTime: `${durationText} after departure`,
      duration: durationText,
      stops: 0,
      baseFare: fareCalc.estimatedTotalFare,
      availableUnits: catKey === 'Executive' ? 3 : 12,
      rating: config.rating,
      image: imageMap[catKey],
      cabCategory: config.category,
      capacity: config.capacity,
      luggage: config.luggage,
      amenities: config.amenities,
      estimatedDistanceKm: distanceKm,
      ratePerKm: config.perKmRate,
      tripType,
    };
  });
};
