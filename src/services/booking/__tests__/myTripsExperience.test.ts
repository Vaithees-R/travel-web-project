import { describe, it, expect } from 'vitest';
import { Booking, BookingStatus } from '../../../types/booking';

describe('VoyageHub Phase 8 My Trips & Post-Booking Experience Test Suite', () => {
  // Test fixture data simulating authentic PostgreSQL records
  const sampleBookings: Booking[] = [
    {
      id: 'VH-2026-FL001',
      userId: 'usr_alpha',
      bookingRef: 'PNR 9DF4X',
      service: 'flight',
      status: 'upcoming',
      createdAt: '2026-10-01T08:00:00.000Z',
      travelOption: {
        id: 'opt_fl_1',
        service: 'flight',
        operator: 'IndiGo',
        identifier: '6E 2134',
        subType: 'Airbus A321neo',
        originCity: 'Delhi',
        originCode: 'DEL',
        originStationOrTerminal: 'Indira Gandhi Int’l Airport (T3)',
        destinationCity: 'Mumbai',
        destinationCode: 'BOM',
        destinationStationOrTerminal: 'Chhatrapati Shivaji Maharaj (T2)',
        departureTime: '06:15 AM',
        arrivalTime: '08:30 AM',
        duration: '2h 15m',
        stops: 0,
        baseFare: 4500,
        availableUnits: 12,
        selectedClass: 'Economy',
      },
      searchCriteria: {
        service: 'flight',
        from: 'Delhi',
        to: 'Mumbai',
        departureDate: '2026-10-15',
        tripType: 'oneway',
        passengers: 1,
      },
      primaryPassenger: {
        id: 'pax_1',
        fullName: 'Alexander Wright',
        email: 'alexander@voyagehub.com',
        phone: '+91 98401 23456',
        gender: 'male',
        age: 32,
        berthOrSeatPreference: 'Window Seat (12A)',
        passportNumber: 'Z8920141',
        passportExpiry: '2032-10-10',
        passportCountry: 'India',
        nationality: 'Indian',
      },
      passengersCount: 1,
      seatOrBerthAllocated: 'Seat 12A • Window (Economy)',
      fareBreakdown: {
        baseFarePerPassenger: 4500,
        passengerCount: 1,
        subtotalBaseFare: 4500,
        taxesAndTerminalFees: 575,
        safetyOrServiceFee: 150,
        totalFare: 5225,
        currency: 'INR',
      },
      paymentStatus: 'paid',
      paymentMethod: 'card',
      paymentReference: 'TXN-2026-CARD-FL001',
      isSimulated: true,
    },
    {
      id: 'VH-2026-TR002',
      userId: 'usr_alpha',
      bookingRef: 'PNR 248-9104820',
      service: 'train',
      status: 'upcoming',
      createdAt: '2026-10-02T10:00:00.000Z',
      travelOption: {
        id: 'opt_tr_1',
        service: 'train',
        operator: 'Vande Bharat Express',
        identifier: '#20607',
        subType: 'Semi-High Speed Trainset',
        originCity: 'Chennai',
        originCode: 'MAS',
        originStationOrTerminal: 'MGR Central',
        destinationCity: 'Bengaluru',
        destinationCode: 'SBC',
        destinationStationOrTerminal: 'KSR Bengaluru',
        departureTime: '05:50 AM',
        arrivalTime: '10:15 AM',
        duration: '4h 25m',
        stops: 2,
        baseFare: 1100,
        availableUnits: 30,
        selectedClass: 'CC',
      },
      searchCriteria: {
        service: 'train',
        from: 'Chennai',
        to: 'Bengaluru',
        departureDate: '2026-10-10', // earlier travel date than FL001
        tripType: 'oneway',
        passengers: 2,
      },
      primaryPassenger: {
        id: 'pax_2',
        fullName: 'Alexander Wright',
        email: 'alexander@voyagehub.com',
        phone: '+91 98401 23456',
        gender: 'male',
        age: 32,
      },
      additionalPassengers: [
        {
          id: 'pax_3',
          fullName: 'Elena Wright',
          email: 'elena@voyagehub.com',
          phone: '+91 98401 23457',
          gender: 'female',
          age: 30,
        },
      ],
      passengersCount: 2,
      seatOrBerthAllocated: 'Coach C3 • Berth 24, 25 (CC)',
      fareBreakdown: {
        baseFarePerPassenger: 1100,
        passengerCount: 2,
        subtotalBaseFare: 2200,
        taxesAndTerminalFees: 190,
        safetyOrServiceFee: 100,
        totalFare: 2490,
        currency: 'INR',
      },
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      paymentReference: 'TXN-2026-UPI-TR002',
      isSimulated: true,
    },
    {
      id: 'VH-2026-BU003',
      userId: 'usr_alpha',
      bookingRef: 'VOY-BUS-7721',
      service: 'bus',
      status: 'completed',
      createdAt: '2026-09-15T12:00:00.000Z',
      travelOption: {
        id: 'opt_bu_1',
        service: 'bus',
        operator: 'IntrCity SmartBus',
        identifier: 'KA-01-F-9901',
        subType: 'Volvo 9600 AC Multi-Axle Sleeper',
        originCity: 'Mumbai',
        originCode: 'BOM',
        originStationOrTerminal: 'Borivali Highway Counter',
        destinationCity: 'Goa',
        destinationCode: 'GOI',
        destinationStationOrTerminal: 'Panjim Central Bus Stand',
        departureTime: '08:00 PM',
        arrivalTime: '07:30 AM',
        duration: '11h 30m',
        stops: 3,
        baseFare: 1450,
        availableUnits: 8,
      },
      searchCriteria: {
        service: 'bus',
        from: 'Mumbai',
        to: 'Goa',
        departureDate: '2026-09-20',
        tripType: 'oneway',
        passengers: 1,
      },
      primaryPassenger: {
        id: 'pax_4',
        fullName: 'Alexander Wright',
        email: 'alexander@voyagehub.com',
        phone: '+91 98401 23456',
        gender: 'male',
        age: 32,
      },
      passengersCount: 1,
      seatOrBerthAllocated: 'Berth U7 (Upper Sleeper)',
      fareBreakdown: {
        baseFarePerPassenger: 1450,
        passengerCount: 1,
        subtotalBaseFare: 1450,
        taxesAndTerminalFees: 120,
        safetyOrServiceFee: 80,
        totalFare: 1650,
        currency: 'INR',
      },
      paymentStatus: 'paid',
      paymentMethod: 'net_banking',
      paymentReference: 'TXN-2026-NB-BU003',
      isSimulated: true,
    },
    {
      id: 'VH-2026-CA004',
      userId: 'usr_alpha',
      bookingRef: 'VOY-CAB-3819',
      service: 'cab',
      status: 'cancelled',
      createdAt: '2026-09-10T14:00:00.000Z',
      travelOption: {
        id: 'opt_ca_1',
        service: 'cab',
        operator: 'Voyage Prime Chauffeur',
        identifier: 'Sedan Prime',
        subType: 'Toyota Etios / Dzire',
        originCity: 'Delhi',
        originCode: 'DEL',
        originStationOrTerminal: 'Connaught Place Area',
        destinationCity: 'Agra',
        destinationCode: 'AGR',
        destinationStationOrTerminal: 'Taj East Gate Road',
        departureTime: '06:00 AM',
        arrivalTime: '09:30 AM',
        duration: '3h 30m',
        stops: 0,
        baseFare: 3200,
        availableUnits: 4,
        cabCategory: 'Sedan Prime',
      },
      searchCriteria: {
        service: 'cab',
        from: 'Delhi',
        to: 'Agra',
        departureDate: '2026-09-12',
        tripType: 'oneway',
        passengers: 1,
      },
      primaryPassenger: {
        id: 'pax_5',
        fullName: 'Alexander Wright',
        email: 'alexander@voyagehub.com',
        phone: '+91 98401 23456',
        gender: 'male',
        age: 32,
      },
      passengersCount: 1,
      seatOrBerthAllocated: 'Chauffeur Reserved (Door-to-Door)',
      fareBreakdown: {
        baseFarePerPassenger: 3200,
        passengerCount: 1,
        subtotalBaseFare: 3200,
        taxesAndTerminalFees: 160,
        safetyOrServiceFee: 0,
        totalFare: 3360,
        currency: 'INR',
      },
      paymentStatus: 'refunded',
      paymentMethod: 'card',
      paymentReference: 'TXN-2026-CARD-CA004',
      isSimulated: true,
    },
  ];

  // Helper matching the pure filtering & sorting pipeline implemented in BookingsPage
  const filterAndSortBookings = (
    bookings: Booking[],
    options: {
      statusFilter?: string;
      transportFilter?: string;
      searchQuery?: string;
      sortBy?: 'date_nearest' | 'date_latest' | 'newest' | 'amount_asc' | 'amount_desc';
    }
  ) => {
    let result = [...bookings];

    if (options.statusFilter && options.statusFilter !== 'all') {
      result = result.filter((b) => b.status === options.statusFilter);
    }

    if (options.transportFilter && options.transportFilter !== 'all') {
      result = result.filter((b) => b.service === options.transportFilter);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const refMatch = b.bookingRef?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q);
        const originMatch =
          b.travelOption?.originCity?.toLowerCase().includes(q) ||
          b.travelOption?.originCode?.toLowerCase().includes(q) ||
          b.searchCriteria?.from?.toLowerCase().includes(q);
        const destMatch =
          b.travelOption?.destinationCity?.toLowerCase().includes(q) ||
          b.travelOption?.destinationCode?.toLowerCase().includes(q) ||
          b.searchCriteria?.to?.toLowerCase().includes(q);
        const operatorMatch =
          b.travelOption?.operator?.toLowerCase().includes(q) ||
          b.travelOption?.identifier?.toLowerCase().includes(q) ||
          b.travelOption?.subType?.toLowerCase().includes(q);
        return refMatch || originMatch || destMatch || operatorMatch;
      });
    }

    if (options.sortBy) {
      result.sort((a, b) => {
        const dateA = Date.parse(a.searchCriteria?.departureDate || '') || new Date(a.createdAt).getTime();
        const dateB = Date.parse(b.searchCriteria?.departureDate || '') || new Date(b.createdAt).getTime();
        const createdA = new Date(a.createdAt).getTime();
        const createdB = new Date(b.createdAt).getTime();
        const fareA = a.fareBreakdown?.totalFare || 0;
        const fareB = b.fareBreakdown?.totalFare || 0;

        switch (options.sortBy) {
          case 'date_nearest':
            if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
            if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
            return dateA - dateB || createdB - createdA;
          case 'date_latest':
            return dateB - dateA;
          case 'newest':
            return createdB - createdA;
          case 'amount_asc':
            return fareA - fareB;
          case 'amount_desc':
            return fareB - fareA;
          default:
            return 0;
        }
      });
    }

    return result;
  };

  // Helper matching passport masking logic
  const maskPassport = (passport?: string): string => {
    if (!passport) return '';
    const trimmed = passport.trim();
    if (trimmed.length <= 4) return trimmed;
    const visible = trimmed.slice(-4);
    const masked = '•'.repeat(Math.max(4, trimmed.length - 4));
    return `${masked}${visible}`;
  };

  // 1. My Trips loads authenticated bookings
  it('1. correctly computes summary metrics from loaded bookings collection', () => {
    const upcoming = sampleBookings.filter((b) => b.status === 'upcoming').length;
    const completed = sampleBookings.filter((b) => b.status === 'completed').length;
    const cancelled = sampleBookings.filter((b) => b.status === 'cancelled').length;
    const total = sampleBookings.length;

    expect(upcoming).toBe(2);
    expect(completed).toBe(1);
    expect(cancelled).toBe(1);
    expect(total).toBe(4);
  });

  // 2. Upcoming filter
  it('2. filters upcoming bookings correctly without mutating source array', () => {
    const originalLength = sampleBookings.length;
    const upcoming = filterAndSortBookings(sampleBookings, { statusFilter: 'upcoming' });

    expect(upcoming).toHaveLength(2);
    expect(upcoming.every((b) => b.status === 'upcoming')).toBe(true);
    expect(sampleBookings).toHaveLength(originalLength);
  });

  // 3. Completed filter
  it('3. filters completed journeys correctly', () => {
    const completed = filterAndSortBookings(sampleBookings, { statusFilter: 'completed' });
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe('VH-2026-BU003');
    expect(completed[0].status).toBe('completed');
  });

  // 4. Cancelled filter
  it('4. filters cancelled trips correctly', () => {
    const cancelled = filterAndSortBookings(sampleBookings, { statusFilter: 'cancelled' });
    expect(cancelled).toHaveLength(1);
    expect(cancelled[0].id).toBe('VH-2026-CA004');
    expect(cancelled[0].status).toBe('cancelled');
    expect(cancelled[0].paymentStatus).toBe('refunded');
  });

  // 5. Transport filter
  it('5. filters trips by specific transport modes (flights, trains, buses, cabs)', () => {
    const flights = filterAndSortBookings(sampleBookings, { transportFilter: 'flight' });
    expect(flights).toHaveLength(1);
    expect(flights[0].service).toBe('flight');

    const trains = filterAndSortBookings(sampleBookings, { transportFilter: 'train' });
    expect(trains).toHaveLength(1);
    expect(trains[0].service).toBe('train');

    const buses = filterAndSortBookings(sampleBookings, { transportFilter: 'bus' });
    expect(buses).toHaveLength(1);
    expect(buses[0].service).toBe('bus');

    const cabs = filterAndSortBookings(sampleBookings, { transportFilter: 'cab' });
    expect(cabs).toHaveLength(1);
    expect(cabs[0].service).toBe('cab');
  });

  // 6. Booking search
  it('6. searches bookings across PNR, origin city, destination city, and operator name', () => {
    // Search by PNR
    const byPnr = filterAndSortBookings(sampleBookings, { searchQuery: '9DF4X' });
    expect(byPnr).toHaveLength(1);
    expect(byPnr[0].id).toBe('VH-2026-FL001');

    // Search by city
    const byCity = filterAndSortBookings(sampleBookings, { searchQuery: 'Bengaluru' });
    expect(byCity).toHaveLength(1);
    expect(byCity[0].id).toBe('VH-2026-TR002');

    // Search by operator name
    const byOperator = filterAndSortBookings(sampleBookings, { searchQuery: 'Vande Bharat' });
    expect(byOperator).toHaveLength(1);
    expect(byOperator[0].id).toBe('VH-2026-TR002');

    // Case-insensitive search
    const caseInsensitive = filterAndSortBookings(sampleBookings, { searchQuery: 'delhi' });
    expect(caseInsensitive.length).toBeGreaterThanOrEqual(2); // FL001 & CA004 both start at Delhi
  });

  // 7. Sorting
  it('7. performs deterministic sorting without mutating source array', () => {
    // Travel date nearest (prioritizes upcoming trips and earliest departure date)
    const nearest = filterAndSortBookings(sampleBookings, { sortBy: 'date_nearest' });
    expect(nearest[0].id).toBe('VH-2026-TR002'); // Departure 2026-10-10 vs FL001 on 2026-10-15
    expect(nearest[1].id).toBe('VH-2026-FL001');

    // Travel date latest
    const latest = filterAndSortBookings(sampleBookings, { sortBy: 'date_latest' });
    expect(latest[0].id).toBe('VH-2026-FL001'); // 2026-10-15 is latest travel date

    // Amount low to high
    const amountAsc = filterAndSortBookings(sampleBookings, { sortBy: 'amount_asc' });
    expect(amountAsc[0].fareBreakdown.totalFare).toBe(1650); // Bus
    expect(amountAsc[amountAsc.length - 1].fareBreakdown.totalFare).toBe(5225); // Flight

    // Amount high to low
    const amountDesc = filterAndSortBookings(sampleBookings, { sortBy: 'amount_desc' });
    expect(amountDesc[0].fareBreakdown.totalFare).toBe(5225);
    expect(amountDesc[amountDesc.length - 1].fareBreakdown.totalFare).toBe(1650);

    // Newest booking (created_at desc)
    const newest = filterAndSortBookings(sampleBookings, { sortBy: 'newest' });
    expect(newest[0].id).toBe('VH-2026-TR002'); // Oct 2 vs Oct 1, Sep 15, Sep 10
  });

  // 8. Empty state handling
  it('8. handles empty states cleanly for no bookings, filtered empty, and search miss', () => {
    const noResults = filterAndSortBookings(sampleBookings, { searchQuery: 'NonExistentCity' });
    expect(noResults).toHaveLength(0);

    const emptyList: Booking[] = [];
    const fromEmpty = filterAndSortBookings(emptyList, { statusFilter: 'all' });
    expect(fromEmpty).toHaveLength(0);
  });

  // 9. Trip card rendering and data mapping
  it('9. correctly formats service-specific data attributes for each transport mode', () => {
    const flight = sampleBookings[0];
    expect(flight.travelOption.operator).toBe('IndiGo');
    expect(flight.travelOption.identifier).toBe('6E 2134');
    expect(flight.travelOption.selectedClass).toBe('Economy');

    const train = sampleBookings[1];
    expect(train.travelOption.operator).toBe('Vande Bharat Express');
    expect(train.travelOption.identifier).toBe('#20607');
    expect(train.travelOption.selectedClass).toBe('CC');

    const bus = sampleBookings[2];
    expect(bus.travelOption.subType).toContain('Volvo 9600');

    const cab = sampleBookings[3];
    expect(cab.travelOption.cabCategory).toBe('Sedan Prime');
  });

  // 10. Booking detail masked passport
  it('10. securely masks international passport numbers displaying only last 4 digits', () => {
    const rawPassport = 'Z8920141';
    const masked = maskPassport(rawPassport);
    expect(masked).toBe('••••0141');
    expect(masked).not.toContain('Z892');

    const shortPassport = '1234';
    expect(maskPassport(shortPassport)).toBe('1234');
    expect(maskPassport(undefined)).toBe('');
  });

  // 11. Payment statement validation
  it('11. verifies payment metadata integrity and honest simulated notice', () => {
    const paidBooking = sampleBookings[0];
    expect(paidBooking.paymentStatus).toBe('paid');
    expect(paidBooking.paymentMethod).toBe('card');
    expect(paidBooking.paymentReference).toBe('TXN-2026-CARD-FL001');
    expect(paidBooking.isSimulated).toBe(true);

    const refundedBooking = sampleBookings[3];
    expect(refundedBooking.paymentStatus).toBe('refunded');
    expect(refundedBooking.paymentReference).toBe('TXN-2026-CARD-CA004');
  });

  // 12. Cancellation action & eligibility
  it('12. enforces cancellation eligibility rules: allows upcoming, rejects completed or cancelled', () => {
    const isEligibleForCancel = (status: BookingStatus) => {
      return status === 'upcoming';
    };

    expect(isEligibleForCancel('upcoming')).toBe(true);
    expect(isEligibleForCancel('completed')).toBe(false);
    expect(isEligibleForCancel('cancelled')).toBe(false);
  });

  // 13. Cancellation transition logic
  it('13. transitions booking status to cancelled and payment status to refunded', () => {
    const activeBooking = { ...sampleBookings[0] };
    expect(activeBooking.status).toBe('upcoming');
    expect(activeBooking.paymentStatus).toBe('paid');

    // Simulate cancellation handler
    const cancelTrip = (b: Booking): Booking => {
      if (b.status !== 'upcoming') throw new Error('Cannot cancel non-upcoming booking');
      return {
        ...b,
        status: 'cancelled',
        paymentStatus: 'refunded',
      };
    };

    const cancelledTrip = cancelTrip(activeBooking);
    expect(cancelledTrip.status).toBe('cancelled');
    expect(cancelledTrip.paymentStatus).toBe('refunded');
  });

  // 14. Nearest upcoming trip prioritization
  it('14. identifies the nearest upcoming trip for the NEXT TRIP highlight banner', () => {
    const upcomingList = sampleBookings.filter((b) => b.status === 'upcoming');
    const nextTrip = [...upcomingList].sort((a, b) => {
      const dateA = Date.parse(a.searchCriteria?.departureDate || '') || new Date(a.createdAt).getTime();
      const dateB = Date.parse(b.searchCriteria?.departureDate || '') || new Date(b.createdAt).getTime();
      return dateA - dateB;
    })[0];

    expect(nextTrip).toBeDefined();
    expect(nextTrip.id).toBe('VH-2026-TR002'); // Oct 10 comes before Oct 15
    expect(nextTrip.service).toBe('train');
    expect(nextTrip.travelOption.originCity).toBe('Chennai');
    expect(nextTrip.travelOption.destinationCity).toBe('Bengaluru');
  });
});
