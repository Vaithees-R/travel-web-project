/**
 * Curated Indian & International Travel Destinations
 * Centralized dataset supporting Flights, Trains, Buses, and Cabs
 */

export interface TravelLocation {
  id: string;
  city: string;
  state: string;
  country: string;
  tier: 1 | 2;
  airportCode?: string;
  airportName?: string;
  railwayCode?: string;
  railwayStation?: string;
  busTerminal?: string;
  landmarks?: string[];
  aliases: string[];
  isInternational?: boolean;
}

export const INDIAN_LOCATIONS: TravelLocation[] = [
  // ==========================================
  // TIER 1 — MAJOR NATIONAL TRAVEL HUBS
  // ==========================================
  {
    id: 'del',
    city: 'Delhi',
    state: 'Delhi NCR',
    country: 'India',
    tier: 1,
    airportCode: 'DEL',
    airportName: 'Indira Gandhi International Airport',
    railwayCode: 'NDLS',
    railwayStation: 'New Delhi Railway Station',
    busTerminal: 'ISBT Kashmere Gate',
    landmarks: ['Connaught Place', 'Aerocity', 'Kashmere Gate', 'Dhaula Kuan'],
    aliases: ['New Delhi', 'DEL', 'NDLS', 'NCR', 'IGI', 'Dilli'],
  },
  {
    id: 'bom',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    tier: 1,
    airportCode: 'BOM',
    airportName: 'Chhatrapati Shivaji Maharaj International Airport',
    railwayCode: 'MMCT',
    railwayStation: 'Mumbai Central Terminus',
    busTerminal: 'Borivali / Dadar TT Circle',
    landmarks: ['Bandra Kurla Complex', 'Borivali West', 'Dadar', 'Terminal 2'],
    aliases: ['Bombay', 'BOM', 'CSMT', 'MMCT'],
  },
  {
    id: 'blr',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    tier: 1,
    airportCode: 'BLR',
    airportName: 'Kempegowda International Airport',
    railwayCode: 'SBC',
    railwayStation: 'KSR Bengaluru City Junction',
    busTerminal: 'Majestic Kempegowda Bus Station',
    landmarks: ['Indiranagar', 'Electronic City', 'Majestic', 'Whitefield', 'Koramangala'],
    aliases: ['Bangalore', 'BLR', 'SBC', 'Majestic', 'Bengaluru City'],
  },
  {
    id: 'maa',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    tier: 1,
    airportCode: 'MAA',
    airportName: 'Chennai International Airport',
    railwayCode: 'MAS',
    railwayStation: 'Puratchi Thalaivar Dr. MGR Chennai Central',
    busTerminal: 'Koyambedu CMBT / Kilambakkam',
    landmarks: ['Guindy', 'T. Nagar', 'Chennai Central', 'OMR IT Corridor'],
    aliases: ['Madras', 'MAA', 'MAS', 'CMBT'],
  },
  {
    id: 'hyd',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    tier: 1,
    airportCode: 'HYD',
    airportName: 'Rajiv Gandhi International Airport',
    railwayCode: 'HYB',
    railwayStation: 'Hyderabad Deccan Nampally',
    busTerminal: 'MGBS Central Bus Station',
    landmarks: ['HITEC City', 'Secunderabad', 'Gachibowli', 'Ameerpet'],
    aliases: ['Secunderabad', 'HYD', 'HYB', 'Cyberabad', 'Shamshabad'],
  },
  {
    id: 'ccu',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    tier: 1,
    airportCode: 'CCU',
    airportName: 'Netaji Subhash Chandra Bose International Airport',
    railwayCode: 'SDAH',
    railwayStation: 'Sealdah Station / Howrah Junction',
    busTerminal: 'Esplanade Bus Terminus',
    landmarks: ['Park Street', 'Salt Lake Sector V', 'Howrah', 'Esplanade'],
    aliases: ['Calcutta', 'CCU', 'SDAH', 'HWH', 'Howrah'],
  },
  {
    id: 'pnq',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    tier: 1,
    airportCode: 'PNQ',
    airportName: 'Pune International Airport',
    railwayCode: 'PUNE',
    railwayStation: 'Pune Junction',
    busTerminal: 'Swargate / Shivaji Nagar',
    landmarks: ['Hinjawadi Infotech Park', 'Koregaon Park', 'Viman Nagar', 'Swargate'],
    aliases: ['Poona', 'PNQ', 'PUNE'],
  },
  {
    id: 'amd',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    tier: 1,
    airportCode: 'AMD',
    airportName: 'Sardar Vallabhbhai Patel International Airport',
    railwayCode: 'ADI',
    railwayStation: 'Ahmedabad Junction (Kalupur)',
    busTerminal: 'Geeta Mandir Central Bus Stand',
    landmarks: ['SG Highway', 'Kalupur', 'Satellite', 'Ashram Road'],
    aliases: ['Amdavad', 'AMD', 'ADI', 'Kalupur'],
  },

  // ==========================================
  // TIER 2 — MAJOR REGIONAL DESTINATIONS
  // ==========================================
  {
    id: 'jai',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    tier: 2,
    airportCode: 'JAI',
    airportName: 'Jaipur International Airport',
    railwayCode: 'JP',
    railwayStation: 'Jaipur Junction',
    busTerminal: 'Sindhi Camp ISBT',
    landmarks: ['C-Scheme', 'MI Road', 'Malviya Nagar', 'Sindhi Camp'],
    aliases: ['Pink City', 'JAI', 'JP'],
  },
  {
    id: 'lko',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'LKO',
    airportName: 'Chaudhary Charan Singh International Airport',
    railwayCode: 'LKO',
    railwayStation: 'Lucknow Charbagh NR',
    busTerminal: 'Alambagh ISBT',
    landmarks: ['Hazratganj', 'Gomti Nagar', 'Charbagh', 'Alambagh'],
    aliases: ['LKO', 'Charbagh'],
  },
  {
    id: 'ixc',
    city: 'Chandigarh',
    state: 'Punjab / Haryana',
    country: 'India',
    tier: 2,
    airportCode: 'IXC',
    airportName: 'Shaheed Bhagat Singh International Airport',
    railwayCode: 'CDG',
    railwayStation: 'Chandigarh Junction',
    busTerminal: 'Sector 43 ISBT',
    landmarks: ['Sector 17 Plaza', 'Tribune Chowk', 'Sector 43', 'IT Park'],
    aliases: ['IXC', 'CDG', 'Mohali', 'Panchkula'],
  },
  {
    id: 'cok',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    tier: 2,
    airportCode: 'COK',
    airportName: 'Cochin International Airport',
    railwayCode: 'ERS',
    railwayStation: 'Ernakulam Junction (South)',
    busTerminal: 'Vyttila Mobility Hub',
    landmarks: ['Vyttila', 'Marine Drive', 'Kakkanad Infopark', 'Fort Kochi'],
    aliases: ['Cochin', 'Ernakulam', 'COK', 'ERS'],
  },
  {
    id: 'cjb',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    tier: 2,
    airportCode: 'CJB',
    airportName: 'Coimbatore International Airport',
    railwayCode: 'CBE',
    railwayStation: 'Coimbatore Main Junction',
    busTerminal: 'Gandhipuram Central Bus Stand',
    landmarks: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Avinashi Road'],
    aliases: ['Kovai', 'CJB', 'CBE'],
  },
  {
    id: 'mdu',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    tier: 2,
    airportCode: 'IXM',
    airportName: 'Madurai Airport',
    railwayCode: 'MDU',
    railwayStation: 'Madurai Junction',
    busTerminal: 'Mattuthavani Integrated Bus Terminal (MIBT)',
    landmarks: ['Meenakshi Amman Temple', 'Mattuthavani', 'KK Nagar', 'Arapalayam'],
    aliases: ['Temple City', 'IXM', 'MDU', 'Mattuthavani'],
  },
  {
    id: 'trz',
    city: 'Trichy',
    state: 'Tamil Nadu',
    country: 'India',
    tier: 2,
    airportCode: 'TRZ',
    airportName: 'Tiruchirappalli International Airport',
    railwayCode: 'TPJ',
    railwayStation: 'Tiruchirappalli Junction',
    busTerminal: 'Central Bus Stand',
    landmarks: ['Thillai Nagar', 'Central Bus Stand', 'Chatram Bus Stand', 'Srirangam'],
    aliases: ['Tiruchirappalli', 'TRZ', 'TPJ', 'Tiruchi'],
  },
  {
    id: 'vtz',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'VTZ',
    airportName: 'Visakhapatnam International Airport',
    railwayCode: 'VSKP',
    railwayStation: 'Visakhapatnam Junction',
    busTerminal: 'Dwaraka Bus Station (RTC Complex)',
    landmarks: ['Beach Road', 'Gajuwaka', 'Siripuram', 'NAD Junction'],
    aliases: ['Vizag', 'VTZ', 'VSKP', 'Waltair'],
  },
  {
    id: 'bbi',
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    tier: 2,
    airportCode: 'BBI',
    airportName: 'Biju Patnaik International Airport',
    railwayCode: 'BBS',
    railwayStation: 'Bhubaneswar Railway Station',
    busTerminal: 'Baramunda ISBT',
    landmarks: ['Patia', 'Jaydev Vihar', 'Master Canteen', 'Khandagiri'],
    aliases: ['BBI', 'BBS'],
  },
  {
    id: 'idr',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'IDR',
    airportName: 'Devi Ahilyabai Holkar Airport',
    railwayCode: 'INDB',
    railwayStation: 'Indore Junction',
    busTerminal: 'Sarwate Bus Stand / Navlakha',
    landmarks: ['Vijay Nagar', 'Palasia', 'Sarwate', 'Bhawarkua'],
    aliases: ['IDR', 'INDB'],
  },
  {
    id: 'nag',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    tier: 2,
    airportCode: 'NAG',
    airportName: 'Dr. Babasaheb Ambedkar International Airport',
    railwayCode: 'NGP',
    railwayStation: 'Nagpur Junction',
    busTerminal: 'Ganeshpeth Bus Station',
    landmarks: ['Sitabuldi', 'Dharampeth', 'Wardha Road', 'Manish Nagar'],
    aliases: ['Orange City', 'NAG', 'NGP'],
  },
  {
    id: 'stv',
    city: 'Surat',
    state: 'Gujarat',
    country: 'India',
    tier: 2,
    airportCode: 'STV',
    airportName: 'Surat International Airport',
    railwayCode: 'ST',
    railwayStation: 'Surat Railway Station',
    busTerminal: 'Surat Central Bus Station',
    landmarks: ['Adajan', 'Ring Road', 'Vesu', 'Varachha'],
    aliases: ['Diamond City', 'STV', 'ST'],
  },
  {
    id: 'bdq',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    tier: 2,
    airportCode: 'BDQ',
    airportName: 'Vadodara Airport',
    railwayCode: 'BRC',
    railwayStation: 'Vadodara Junction',
    busTerminal: 'Central Bus Terminal',
    landmarks: ['Alkapuri', 'Sayajigunj', 'Fatehgunj', 'Manjalpur'],
    aliases: ['Baroda', 'BDQ', 'BRC'],
  },
  {
    id: 'myq',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'India',
    tier: 2,
    airportCode: 'MYQ',
    airportName: 'Mysore Airport (Mandakalli)',
    railwayCode: 'MYS',
    railwayStation: 'Mysuru Junction',
    busTerminal: 'Suburban Bus Stand',
    landmarks: ['Mysore Palace', 'Gokulam', 'Jayalakshmipuram', 'Suburban Stand'],
    aliases: ['Mysore', 'MYQ', 'MYS', 'MYA'],
  },
  {
    id: 'ixe',
    city: 'Mangaluru',
    state: 'Karnataka',
    country: 'India',
    tier: 2,
    airportCode: 'IXE',
    airportName: 'Mangaluru International Airport',
    railwayCode: 'MAQ',
    railwayStation: 'Mangaluru Central',
    busTerminal: 'KSRTC Bus Stand Bejai',
    landmarks: ['Hampankatta', 'Kadri', 'Bejai', 'Surathkal'],
    aliases: ['Mangalore', 'IXE', 'MAQ', 'MAJN'],
  },
  {
    id: 'trv',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    country: 'India',
    tier: 2,
    airportCode: 'TRV',
    airportName: 'Thiruvananthapuram International Airport',
    railwayCode: 'TVC',
    railwayStation: 'Thiruvananthapuram Central',
    busTerminal: 'KSRTC Bus Stand Thampanoor',
    landmarks: ['Thampanoor', 'Technopark', 'Kowdiar', 'East Fort'],
    aliases: ['Trivandrum', 'TRV', 'TVC'],
  },
  {
    id: 'vga',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'VGA',
    airportName: 'Vijayawada International Airport',
    railwayCode: 'BZA',
    railwayStation: 'Vijayawada Junction',
    busTerminal: 'Pandit Nehru Bus Station (PNBS)',
    landmarks: ['Benz Circle', 'Governorpet', 'MG Road', 'BZA Station'],
    aliases: ['Bezawada', 'VGA', 'BZA'],
  },
  {
    id: 'ixr',
    city: 'Ranchi',
    state: 'Jharkhand',
    country: 'India',
    tier: 2,
    airportCode: 'IXR',
    airportName: 'Birsa Munda Airport',
    railwayCode: 'RNC',
    railwayStation: 'Ranchi Junction',
    busTerminal: 'Birsa Bus Stand (Khadgarha)',
    landmarks: ['Main Road', 'Harmu', 'Lalpur', 'Doranda'],
    aliases: ['IXR', 'RNC'],
  },
  {
    id: 'pat',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    tier: 2,
    airportCode: 'PAT',
    airportName: 'Jay Prakash Narayan Airport',
    railwayCode: 'PNBE',
    railwayStation: 'Patna Junction',
    busTerminal: 'Bankipur Bus Stand / Bairiya ISBT',
    landmarks: ['Boring Road', 'Bailey Road', 'Dak Bungalow', 'Kankarbagh'],
    aliases: ['PAT', 'PNBE', 'Pataliputra'],
  },
  {
    id: 'gau',
    city: 'Guwahati',
    state: 'Assam',
    country: 'India',
    tier: 2,
    airportCode: 'GAU',
    airportName: 'Lokpriya Gopinath Bordoloi International Airport',
    railwayCode: 'GHY',
    railwayStation: 'Guwahati Railway Station',
    busTerminal: 'ISBT Betkuchi',
    landmarks: ['Paltan Bazaar', 'GS Road', 'Dispur', 'Pan Bazaar'],
    aliases: ['GAU', 'GHY', 'Gauhati'],
  },
  {
    id: 'ded',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    tier: 2,
    airportCode: 'DED',
    airportName: 'Jolly Grant Airport',
    railwayCode: 'DDN',
    railwayStation: 'Dehradun Railway Station',
    busTerminal: 'ISBT Dehradun',
    landmarks: ['Rajpur Road', 'Clock Tower', 'Paltan Bazaar', 'ISBT'],
    aliases: ['DED', 'DDN', 'Doon'],
  },
  {
    id: 'vns',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'VNS',
    airportName: 'Lal Bahadur Shastri International Airport',
    railwayCode: 'BSB',
    railwayStation: 'Varanasi Junction (Cantonment)',
    busTerminal: 'Cantt Bus Stand',
    landmarks: ['Dashashwamedh Ghat Road', 'Cantt Railway Station', 'Lanka BHU', 'Godowlia'],
    aliases: ['Banaras', 'Kashi', 'VNS', 'BSB'],
  },
  {
    id: 'atq',
    city: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    tier: 2,
    airportCode: 'ATQ',
    airportName: 'Sri Guru Ram Dass Jee International Airport',
    railwayCode: 'ASR',
    railwayStation: 'Amritsar Junction',
    busTerminal: 'Amritsar Bus Stand',
    landmarks: ['Golden Temple Area', 'Ranjit Avenue', 'Lawrence Road', 'Mall Road'],
    aliases: ['Golden Temple City', 'ATQ', 'ASR'],
  },
  {
    id: 'isk',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    tier: 2,
    airportCode: 'ISK',
    airportName: 'Nashik Airport (Ozar)',
    railwayCode: 'NK',
    railwayStation: 'Nashik Road Railway Station',
    busTerminal: 'Central Bus Stand (CBS)',
    landmarks: ['College Road', 'Gangapur Road', 'CBS', 'Nashik Road'],
    aliases: ['Nasik', 'ISK', 'NK'],
  },
  {
    id: 'bho',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'BHO',
    airportName: 'Raja Bhoj Airport',
    railwayCode: 'RKMP',
    railwayStation: 'Rani Kamalapati Railway Station',
    busTerminal: 'Nadra Bus Stand / ISBT Bhopal',
    landmarks: ['MP Nagar', 'Arera Colony', 'Rani Kamalapati', 'New Market'],
    aliases: ['City of Lakes', 'BHO', 'RKMP', 'BPL'],
  },
  {
    id: 'goi',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    tier: 2,
    airportCode: 'GOI',
    airportName: 'Dabolim International Airport / Mopa',
    railwayCode: 'MAO',
    railwayStation: 'Madgaon Junction',
    busTerminal: 'Panaji KTC Bus Stand',
    landmarks: ['Panaji KTC', 'Calangute', 'Candolim', 'Madgaon', 'Dabolim'],
    aliases: ['GOI', 'MAO', 'Panaji', 'Vasco', 'Margao'],
  },
  {
    id: 'agr',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    tier: 2,
    airportCode: 'AGR',
    airportName: 'Agra Airport (Kheria)',
    railwayCode: 'AGC',
    railwayStation: 'Agra Cantt',
    busTerminal: 'Idgah Bus Stand',
    landmarks: ['Taj East Gate', 'Agra Cantt', 'Fatehabad Road', 'Sanjay Place'],
    aliases: ['AGR', 'AGC', 'Taj Mahal'],
  },
  {
    id: 'pny',
    city: 'Pondicherry',
    state: 'Puducherry UT',
    country: 'India',
    tier: 2,
    airportCode: 'PNY',
    airportName: 'Puducherry Airport',
    railwayCode: 'PDY',
    railwayStation: 'Puducherry Railway Station',
    busTerminal: 'New Bus Stand',
    landmarks: ['White Town French Quarter', 'Promenade Beach', 'Auroville Junction'],
    aliases: ['Puducherry', 'PNY', 'PDY', 'Pondi'],
  },

  // ==========================================
  // INTERNATIONAL AIRLINE GATEWAYS (FLIGHTS)
  // ==========================================
  {
    id: 'dxb',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    tier: 1,
    airportCode: 'DXB',
    airportName: 'Dubai International Airport',
    landmarks: ['Downtown Dubai', 'Marina', 'Deira', 'Terminal 3'],
    aliases: ['DXB', 'UAE', 'Emirates'],
    isInternational: true,
  },
  {
    id: 'sin',
    city: 'Singapore',
    state: 'Singapore',
    country: 'Singapore',
    tier: 1,
    airportCode: 'SIN',
    airportName: 'Singapore Changi Airport',
    landmarks: ['Changi Jewel', 'Marina Bay', 'Orchard Road'],
    aliases: ['SIN', 'Changi'],
    isInternational: true,
  },
  {
    id: 'lhr',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    tier: 1,
    airportCode: 'LHR',
    airportName: 'London Heathrow Airport',
    landmarks: ['Heathrow Terminal 5', 'Central London', 'Paddington'],
    aliases: ['LHR', 'Heathrow', 'UK'],
    isInternational: true,
  },
  {
    id: 'bkk',
    city: 'Bangkok',
    state: 'Bangkok',
    country: 'Thailand',
    tier: 1,
    airportCode: 'BKK',
    airportName: 'Suvarnabhumi International Airport',
    landmarks: ['Sukhumvit', 'Siam', 'Silom', 'Suvarnabhumi'],
    aliases: ['BKK', 'Suvarnabhumi', 'Siam'],
    isInternational: true,
  },
];

export type TravelMode = 'flights' | 'trains' | 'buses' | 'cabs';

export interface LocationDisplayInfo {
  primary: string;
  secondary: string;
  code?: string;
  badge?: string;
  formattedValue: string;
}

/**
 * Formats location display details tailored to the transport mode
 */
export function getLocationDisplayInfo(
  location: TravelLocation,
  mode: TravelMode
): LocationDisplayInfo {
  switch (mode) {
    case 'flights': {
      const code = location.airportCode || '';
      return {
        primary: location.city,
        secondary: location.airportName
          ? `${code} — ${location.airportName}`
          : `${code} — ${location.city} Airport`,
        code,
        badge: location.isInternational ? 'International' : 'Domestic Hub',
        formattedValue: code ? `${location.city} (${code})` : location.city,
      };
    }

    case 'trains': {
      const code = location.railwayCode || '';
      const station = location.railwayStation || `${location.city} Junction`;
      return {
        primary: location.city,
        secondary: code ? `${code} — ${station}` : station,
        code,
        badge: location.tier === 1 ? 'Major Junction' : 'Station',
        formattedValue: code ? `${location.city} (${code})` : location.city,
      };
    }

    case 'buses': {
      const terminal = location.busTerminal || `${location.city} Central Bus Stand`;
      return {
        primary: location.city,
        secondary: `${location.state} • ${terminal}`,
        badge: location.tier === 1 ? 'Primary Hub' : 'Intercity',
        formattedValue: location.city,
      };
    }

    case 'cabs': {
      const landmarksList = location.landmarks && location.landmarks.length > 0
        ? location.landmarks.slice(0, 2).join(', ')
        : location.state;
      return {
        primary: location.city,
        secondary: `${location.state} (${landmarksList})`,
        badge: 'City / Outstation',
        formattedValue: location.city,
      };
    }
  }
}

/**
 * Filter locations for a mode based on query matching city, state, codes, or aliases
 */
export function searchTravelLocations(
  query: string,
  mode: TravelMode
): TravelLocation[] {
  let list = INDIAN_LOCATIONS;

  // Filter out international destinations for train, bus, and cab modes
  if (mode !== 'flights') {
    list = list.filter((l) => !l.isInternational);
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return list;
  }

  return list.filter((loc) => {
    // City match
    if (loc.city.toLowerCase().includes(cleanQuery)) return true;

    // State match
    if (loc.state.toLowerCase().includes(cleanQuery)) return true;

    // Country match
    if (loc.country.toLowerCase().includes(cleanQuery)) return true;

    // Airport code match for flights
    if (mode === 'flights' && loc.airportCode && loc.airportCode.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // Railway code match for trains
    if (mode === 'trains' && loc.railwayCode && loc.railwayCode.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // Aliases match
    return loc.aliases.some((alias) => alias.toLowerCase().includes(cleanQuery));
  });
}

/**
 * Finds location from a string value (e.g. "Delhi (DEL)" -> Delhi object)
 */
export function findLocationByValue(value: string): TravelLocation | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();

  // Check code in parentheses, e.g. "Delhi (DEL)"
  const codeMatch = clean.match(/\(([a-z0-9]{2,5})\)/i);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    const foundByCode = INDIAN_LOCATIONS.find(
      (l) => l.airportCode === code || l.railwayCode === code
    );
    if (foundByCode) return foundByCode;
  }

  // Exact city match
  const foundByCity = INDIAN_LOCATIONS.find(
    (l) => l.city.toLowerCase() === clean
  );
  if (foundByCity) return foundByCity;

  // Partial or alias match
  return INDIAN_LOCATIONS.find((l) => {
    if (clean.includes(l.city.toLowerCase())) return true;
    if (l.aliases.some((a) => a.toLowerCase() === clean || clean.includes(a.toLowerCase()))) {
      return true;
    }
    return false;
  });
}
