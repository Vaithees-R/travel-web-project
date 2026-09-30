import { AirportLocation, StationLocation, CityLocation } from '../../types/travel';

export const AIRPORTS: Record<string, AirportLocation> = {
  MAA: {
    code: 'MAA',
    city: 'Chennai',
    name: 'Chennai International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Terminal 1 (Domestic)', 'Terminal 4 (International)'],
  },
  DEL: {
    code: 'DEL',
    city: 'Delhi',
    name: 'Indira Gandhi International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Terminal 1D', 'Terminal 2', 'Terminal 3 (IGI)'],
  },
  BOM: {
    code: 'BOM',
    city: 'Mumbai',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Terminal 1 (Domestic)', 'Terminal 2 (CSMIA)'],
  },
  BLR: {
    code: 'BLR',
    city: 'Bengaluru',
    name: 'Kempegowda International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Terminal 1', 'Terminal 2 (Garden Terminal)'],
  },
  HYD: {
    code: 'HYD',
    city: 'Hyderabad',
    name: 'Rajiv Gandhi International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Main Passenger Terminal'],
  },
  GOI: {
    code: 'GOI',
    city: 'Goa',
    name: 'Dabolim International Airport',
    country: 'India',
    isInternational: true,
    terminals: ['Integrated Terminal'],
  },
  DXB: {
    code: 'DXB',
    city: 'Dubai',
    name: 'Dubai International Airport',
    country: 'United Arab Emirates',
    isInternational: true,
    terminals: ['Terminal 1', 'Terminal 3 (Emirates)'],
  },
  SIN: {
    code: 'SIN',
    city: 'Singapore',
    name: 'Singapore Changi Airport',
    country: 'Singapore',
    isInternational: true,
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4'],
  },
  LHR: {
    code: 'LHR',
    city: 'London',
    name: 'London Heathrow Airport',
    country: 'United Kingdom',
    isInternational: true,
    terminals: ['Terminal 2 (Queens)', 'Terminal 3', 'Terminal 5 (British Airways)'],
  },
  BKK: {
    code: 'BKK',
    city: 'Bangkok',
    name: 'Suvarnabhumi International Airport',
    country: 'Thailand',
    isInternational: true,
    terminals: ['Main Passenger Concourse'],
  },
};

export const RAIL_STATIONS: Record<string, StationLocation> = {
  NDLS: {
    code: 'NDLS',
    city: 'New Delhi',
    name: 'New Delhi Railway Station',
    zone: 'Northern Railway',
  },
  MMCT: {
    code: 'MMCT',
    city: 'Mumbai',
    name: 'Mumbai Central Terminus',
    zone: 'Western Railway',
  },
  SBC: {
    code: 'SBC',
    city: 'Bengaluru',
    name: 'KSR Bengaluru City Junction',
    zone: 'South Western Railway',
  },
  MAS: {
    code: 'MAS',
    city: 'Chennai',
    name: 'Puratchi Thalaivar Dr. MGR Chennai Central',
    zone: 'Southern Railway',
  },
  HYB: {
    code: 'HYB',
    city: 'Hyderabad',
    name: 'Hyderabad Deccan Nampally',
    zone: 'South Central Railway',
  },
  BSB: {
    code: 'BSB',
    city: 'Varanasi',
    name: 'Varanasi Junction (Cantonment)',
    zone: 'Northern Railway',
  },
  ADI: {
    code: 'ADI',
    city: 'Ahmedabad',
    name: 'Ahmedabad Junction (Kalupur)',
    zone: 'Western Railway',
  },
  RKMP: {
    code: 'RKMP',
    city: 'Bhopal',
    name: 'Rani Kamalapati World-Class Station',
    zone: 'West Central Railway',
  },
  SDAH: {
    code: 'SDAH',
    city: 'Kolkata',
    name: 'Sealdah Station',
    zone: 'Eastern Railway',
  },
};

export const CITIES: Record<string, CityLocation> = {
  Bengaluru: {
    city: 'Bengaluru',
    state: 'Karnataka',
    code: 'BLR',
    landmarks: ['Majestic Anand Rao Circle', 'Indiranagar', 'Kempegowda Airport', 'Electronic City'],
  },
  Chennai: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    code: 'MAA',
    landmarks: ['Koyambedu CMBT', 'Guindy Metro', 'Chennai Central', 'T. Nagar'],
  },
  Mumbai: {
    city: 'Mumbai',
    state: 'Maharashtra',
    code: 'BOM',
    landmarks: ['Borivali West', 'Dadar TT Circle', 'Airport Terminal 2', 'Bandra Kurla Complex'],
  },
  Pune: {
    city: 'Pune',
    state: 'Maharashtra',
    code: 'PNQ',
    landmarks: ['Koregaon Park', 'Hinjawadi Infotech Park', 'Swargate', 'Pune Station'],
  },
  Delhi: {
    city: 'Delhi',
    state: 'Delhi NCR',
    code: 'DEL',
    landmarks: ['ISBT Kashmere Gate', 'IGI Airport Terminal 3', 'Connaught Place', 'Dhaula Kuan'],
  },
  Chandigarh: {
    city: 'Chandigarh',
    state: 'Punjab/Haryana',
    code: 'IXC',
    landmarks: ['Sector 43 ISBT', 'Sector 17 Plaza', 'Tribune Chowk'],
  },
  Hyderabad: {
    city: 'Hyderabad',
    state: 'Telangana',
    code: 'HYD',
    landmarks: ['MGBS Central Bus Station', 'HITEC City', 'Shamshabad Airport', 'Ameerpet'],
  },
  Goa: {
    city: 'Goa',
    state: 'Goa',
    code: 'GOI',
    landmarks: ['Panaji KTC Bus Stand', 'Madgaon Junction', 'Calangute', 'Dabolim Airport'],
  },
  Mysuru: {
    city: 'Mysuru',
    state: 'Karnataka',
    code: 'MYA',
    landmarks: ['Suburban Bus Stand', 'Mysuru Palace', 'Chamundi Hill Foot'],
  },
  Agra: {
    city: 'Agra',
    state: 'Uttar Pradesh',
    code: 'AGR',
    landmarks: ['Taj East Gate', 'Agra Cantt', 'Yamuna Expressway Toll'],
  },
  Pondicherry: {
    city: 'Pondicherry',
    state: 'Puducherry UT',
    code: 'PNY',
    landmarks: ['White Town French Quarter', 'Promenade Beach', 'New Bus Stand'],
  },
  Madurai: {
    city: 'Madurai',
    state: 'Tamil Nadu',
    code: 'MDU',
    landmarks: ['Mattuthavani Integrated Bus Terminal', 'Meenakshi Amman Temple Gate'],
  },
  Varanasi: {
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    code: 'BSB',
    landmarks: ['Dashashwamedh Ghat Road', 'Cantt Railway Station', 'Lanka BHU'],
  },
};

/**
 * Normalizes user search input strings (e.g., "Delhi (DEL)" -> code "DEL", city "Delhi")
 */
export const normalizeLocationQuery = (query: string): { city: string; code?: string } => {
  const clean = query.trim();
  const codeMatch = clean.match(/\(([A-Z]{3,4})\)/i);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    const city = clean.replace(/\s*\([A-Z]{3,4}\)/i, '').trim();
    return { city, code };
  }

  // Direct code match
  const upper = clean.toUpperCase();
  if (AIRPORTS[upper]) {
    return { city: AIRPORTS[upper].city, code: upper };
  }
  if (RAIL_STATIONS[upper]) {
    return { city: RAIL_STATIONS[upper].city, code: upper };
  }

  // City lookup
  for (const [cityName, loc] of Object.entries(CITIES)) {
    if (cityName.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(cityName.toLowerCase())) {
      return { city: cityName, code: loc.code };
    }
  }

  for (const [code, airport] of Object.entries(AIRPORTS)) {
    if (airport.city.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(airport.city.toLowerCase())) {
      return { city: airport.city, code };
    }
  }

  for (const [code, station] of Object.entries(RAIL_STATIONS)) {
    if (station.city.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(station.city.toLowerCase())) {
      return { city: station.city, code };
    }
  }

  return { city: clean };
};
