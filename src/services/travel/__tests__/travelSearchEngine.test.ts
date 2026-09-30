import { describe, it, expect } from 'vitest';
import { TravelSearchService } from '../travelSearchService';
import { CabFareEngine } from '../cabFareEngine';
import { FLIGHT_INVENTORY } from '../flightInventory';
import { parseTimeToMinutes } from '../filterEngine';

describe('VoyageHub Phase 6 Travel Inventory & Search Engine Test Suite', () => {
  // 1. Flight search returns valid options for supported route
  it('1. flight search returns valid options for supported route (DEL -> BOM)', () => {
    const res = TravelSearchService.searchSync({
      service: 'flight',
      from: 'Delhi (DEL)',
      to: 'Mumbai (BOM)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(true);
    expect(res.routeSupported).toBe(true);
    expect(res.options.length).toBeGreaterThanOrEqual(2);
    expect(res.options.every((opt) => opt.originCode === 'DEL' && opt.destinationCode === 'BOM')).toBe(true);
  });

  // 2. Flight search returns no options for unsupported route
  it('2. flight search returns no options for unsupported route (DEL -> PAT)', () => {
    const res = TravelSearchService.searchSync({
      service: 'flight',
      from: 'Delhi (DEL)',
      to: 'Patna (PAT)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(true);
    expect(res.routeSupported).toBe(false);
    expect(res.options.length).toBe(0);
    expect(res.emptyReason).toBe('NO_ROUTE_INVENTORY');
    expect(res.recoverySuggestions.length).toBeGreaterThan(0);
  });

  // 3. Flight search rejects origin == destination
  it('3. flight search rejects origin == destination (DEL -> DEL)', () => {
    const res = TravelSearchService.searchSync({
      service: 'flight',
      from: 'Delhi (DEL)',
      to: 'Delhi (DEL)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(false);
    expect(res.emptyReason).toBe('VALIDATION_FAILED');
    expect(res.validationError).toContain('identical');
    expect(res.options.length).toBe(0);
  });

  // 4. Flight search sort by price ascends correctly
  it('4. flight search sort by price ascends correctly', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'price_low'
    );

    expect(res.options.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < res.options.length - 1; i++) {
      expect(res.options[i].baseFare).toBeLessThanOrEqual(res.options[i + 1].baseFare);
    }
  });

  // 5. Flight search sort by departure time orders correctly
  it('5. flight search sort by departure time orders correctly', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'departure_early'
    );

    expect(res.options.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < res.options.length - 1; i++) {
      const timeA = parseTimeToMinutes(res.options[i].departureTime);
      const timeB = parseTimeToMinutes(res.options[i + 1].departureTime);
      expect(timeA).toBeLessThanOrEqual(timeB);
    }
  });

  // 6. Flight search airline filter works
  it('6. flight search airline filter works (IndiGo Airlines)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      { operators: ['IndiGo Airlines'] }
    );

    expect(res.options.length).toBeGreaterThanOrEqual(1);
    expect(res.options.every((opt) => opt.operator === 'IndiGo Airlines')).toBe(true);
  });

  // 7. Flight search stops filter works
  it('7. flight search stops filter works (non-stop only)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      { stops: 0 }
    );

    expect(res.options.length).toBeGreaterThanOrEqual(1);
    expect(res.options.every((opt) => opt.stops === 0)).toBe(true);
  });

  // 8. Train search returns valid options for supported route
  it('8. train search returns valid options for supported route (NDLS -> BSB)', () => {
    const res = TravelSearchService.searchSync({
      service: 'train',
      from: 'New Delhi (NDLS)',
      to: 'Varanasi (BSB)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(true);
    expect(res.routeSupported).toBe(true);
    expect(res.options.length).toBeGreaterThanOrEqual(2);
    expect(res.options.every((opt) => opt.service === 'train')).toBe(true);
  });

  // 9. Train search class filter works
  it('9. train search class filter works (CC class)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'train',
        from: 'New Delhi (NDLS)',
        to: 'Varanasi (BSB)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      { trainClasses: ['CC'] }
    );

    expect(res.options.length).toBeGreaterThanOrEqual(1);
    expect(res.options.every((opt) => opt.trainClasses?.some((c) => c.className === 'CC'))).toBe(true);
  });

  // 10. Train search sort by price ascends correctly
  it('10. train search sort by price ascends correctly', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'train',
        from: 'New Delhi (NDLS)',
        to: 'Varanasi (BSB)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'price_low'
    );

    expect(res.options.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < res.options.length - 1; i++) {
      expect(res.options[i].baseFare).toBeLessThanOrEqual(res.options[i + 1].baseFare);
    }
  });

  // 11. Bus search returns valid options for supported route
  it('11. bus search returns valid options for supported route (Bengaluru -> Chennai)', () => {
    const res = TravelSearchService.searchSync({
      service: 'bus',
      from: 'Bengaluru',
      to: 'Chennai',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(true);
    expect(res.routeSupported).toBe(true);
    expect(res.options.length).toBeGreaterThanOrEqual(2);
  });

  // 12. Bus search operator filter works
  it('12. bus search operator filter works (IntrCity SmartBus)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'bus',
        from: 'Bengaluru',
        to: 'Chennai',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      { operators: ['IntrCity SmartBus'] }
    );

    expect(res.options.length).toBeGreaterThanOrEqual(1);
    expect(res.options.every((b) => b.operator === 'IntrCity SmartBus')).toBe(true);
  });

  // 13. Bus search sort by price ascends correctly
  it('13. bus search sort by price ascends correctly', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'bus',
        from: 'Bengaluru',
        to: 'Chennai',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'price_low'
    );

    expect(res.options.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < res.options.length - 1; i++) {
      expect(res.options[i].baseFare).toBeLessThanOrEqual(res.options[i + 1].baseFare);
    }
  });

  // 14. Cab search calculates deterministic fare
  it('14. cab search calculates deterministic fare (Mumbai -> Pune)', () => {
    const fare1 = CabFareEngine.calculateEstimatedFare('Sedan Prime', 150, 'oneway');
    const fare2 = CabFareEngine.calculateEstimatedFare('Sedan Prime', 150, 'oneway');

    expect(fare1.estimatedTotalFare).toBe(fare2.estimatedTotalFare);
    expect(fare1.estimatedTotalFare).toBeGreaterThan(1000);

    const res = TravelSearchService.searchSync({
      service: 'cab',
      from: 'Mumbai',
      to: 'Pune',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.isValid).toBe(true);
    expect(res.routeSupported).toBe(true);
    expect(res.options.length).toBeGreaterThanOrEqual(4);
  });

  // 15. Cab search vehicle category filter works
  it('15. cab search vehicle category filter works (Sedan Prime)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'cab',
        from: 'Mumbai',
        to: 'Pune',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      { cabCategories: ['Sedan Prime'] }
    );

    expect(res.options.length).toBe(1);
    expect(res.options[0].cabCategory).toBe('Sedan Prime');
  });

  // 16. Cab search roundtrip doubles/adjusts fare
  it('16. cab search roundtrip doubles/adjusts fare', () => {
    const oneway = CabFareEngine.calculateEstimatedFare('Sedan Prime', 150, 'oneway');
    const roundtrip = CabFareEngine.calculateEstimatedFare('Sedan Prime', 150, 'roundtrip');

    expect(roundtrip.estimatedTotalFare).toBeGreaterThan(oneway.estimatedTotalFare * 1.5);
  });

  // 17. International search rejects non-flight modes
  it('17. international search rejects non-flight modes', () => {
    const trainRes = TravelSearchService.searchSync({
      service: 'train',
      from: 'Delhi (DEL)',
      to: 'Dubai (DXB)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });
    expect(trainRes.routeSupported).toBe(false);
    expect(trainRes.recoverySuggestions.some((s) => s.toLowerCase().includes('flight'))).toBe(true);

    const busRes = TravelSearchService.searchSync({
      service: 'bus',
      from: 'Chennai',
      to: 'London',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });
    expect(busRes.routeSupported).toBe(false);

    const cabRes = TravelSearchService.searchSync({
      service: 'cab',
      from: 'Mumbai',
      to: 'Singapore',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });
    expect(cabRes.routeSupported).toBe(false);

    // Meanwhile, Flight MUST support international
    const flightRes = TravelSearchService.searchSync({
      service: 'flight',
      from: 'Chennai (MAA)',
      to: 'Dubai (DXB)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });
    expect(flightRes.routeSupported).toBe(true);
    expect(flightRes.options.length).toBeGreaterThanOrEqual(1);
  });

  // 18. Empty search results include recovery suggestions
  it('18. empty search results include recovery suggestions', () => {
    const res = TravelSearchService.searchSync({
      service: 'train',
      from: 'Kochi',
      to: 'Shimla',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(res.routeSupported).toBe(false);
    expect(res.options.length).toBe(0);
    expect(res.recoverySuggestions.length).toBeGreaterThanOrEqual(2);
    expect(res.recoverySuggestions.some((s) => s.includes('Vande Bharat') || s.includes('station codes'))).toBe(true);
  });

  // 19. Filter combination returns expected intersection
  it('19. filter combination returns expected intersection (IndiGo + Non-stop + Max Fare)', () => {
    const res = TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      {
        operators: ['IndiGo Airlines'],
        stops: 0,
        maxPrice: 6000,
      }
    );

    expect(res.options.length).toBeGreaterThanOrEqual(1);
    for (const opt of res.options) {
      expect(opt.operator).toBe('IndiGo Airlines');
      expect(opt.stops).toBe(0);
      expect(opt.baseFare).toBeLessThanOrEqual(6000);
    }
  });

  // 20. Sort does not mutate source inventory
  it('20. sort does not mutate source inventory', () => {
    const originalFirstId = FLIGHT_INVENTORY[0].id;
    const originalLength = FLIGHT_INVENTORY.length;

    TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'price_high'
    );

    TravelSearchService.searchSync(
      {
        service: 'flight',
        from: 'Delhi (DEL)',
        to: 'Mumbai (BOM)',
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      },
      undefined,
      'price_low'
    );

    expect(FLIGHT_INVENTORY[0].id).toBe(originalFirstId);
    expect(FLIGHT_INVENTORY.length).toBe(originalLength);
  });

  // 21. Async search facade returns equivalent results
  it('21. async search facade returns equivalent results', async () => {
    const syncRes = TravelSearchService.searchSync({
      service: 'flight',
      from: 'Chennai (MAA)',
      to: 'Delhi (DEL)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    const asyncRes = await TravelSearchService.search({
      service: 'flight',
      from: 'Chennai (MAA)',
      to: 'Delhi (DEL)',
      departureDate: 'Tomorrow, 08:30 AM',
      tripType: 'oneway',
      passengers: 1,
    });

    expect(syncRes.options.length).toBe(asyncRes.options.length);
    expect(syncRes.options[0].id).toBe(asyncRes.options[0].id);
  });
});
