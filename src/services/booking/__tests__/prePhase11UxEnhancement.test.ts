import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import {
  INDIAN_LOCATIONS,
  searchTravelLocations,
  getLocationDisplayInfo,
  findLocationByValue,
} from '../../../data/indianLocations';
import { LocationSelector } from '../../../components/search/LocationSelector';
import { DynamicIslandNav } from '../../../components/navigation/DynamicIslandNav';
import { ScrollReveal } from '../../../components/common/ScrollReveal';
import { RootLayout } from '../../../layouts/RootLayout';
import { Footer, MinimalFooter, EditorialFooter } from '../../../components/layout/Footer';
import { AuthProvider } from '../../../context/AuthContext';
import { TravelSearchService } from '../../travel/travelSearchService';

describe('Pre-Phase 11 — UX Enhancement Pass Test Suite', () => {
  describe('1. Curated Indian Location Dataset & Search', () => {
    it('contains all required Tier 1 national travel hubs', () => {
      const tier1Cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];
      tier1Cities.forEach((city) => {
        const found = INDIAN_LOCATIONS.find((l) => l.city.toLowerCase() === city.toLowerCase() && l.tier === 1);
        expect(found, `Tier 1 hub ${city} must be in dataset`).toBeDefined();
        expect(found?.airportCode, `${city} must have airportCode`).toBeDefined();
        expect(found?.railwayCode, `${city} must have railwayCode`).toBeDefined();
      });
    });

    it('contains major Tier 2 / regional destinations', () => {
      const tier2Cities = [
        'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Coimbatore',
        'Madurai', 'Trichy', 'Visakhapatnam', 'Bhubaneswar', 'Indore',
        'Nagpur', 'Surat', 'Vadodara', 'Mysuru', 'Mangaluru',
        'Thiruvananthapuram', 'Vijayawada', 'Ranchi', 'Patna', 'Guwahati',
        'Dehradun', 'Varanasi', 'Amritsar', 'Nashik', 'Bhopal',
        'Goa', 'Agra', 'Pondicherry',
      ];

      tier2Cities.forEach((city) => {
        const found = INDIAN_LOCATIONS.find((l) => l.city.toLowerCase() === city.toLowerCase());
        expect(found, `Regional destination ${city} must be in dataset`).toBeDefined();
        expect(found?.tier).toBe(2);
      });
    });

    it('preserves international flight gateways for flights and excludes them for trains/buses/cabs', () => {
      const flightResults = searchTravelLocations('Dubai', 'flights');
      expect(flightResults.length).toBeGreaterThan(0);
      expect(flightResults[0].isInternational).toBe(true);

      const trainResults = searchTravelLocations('Dubai', 'trains');
      expect(trainResults.length).toBe(0);

      const busResults = searchTravelLocations('Dubai', 'buses');
      expect(busResults.length).toBe(0);

      const cabResults = searchTravelLocations('Dubai', 'cabs');
      expect(cabResults.length).toBe(0);
    });

    it('supports case-insensitive search matching cities, states, and codes', () => {
      const matchLower = searchTravelLocations('chen', 'flights');
      expect(matchLower.some((l) => l.city === 'Chennai')).toBe(true);

      const matchUpper = searchTravelLocations('CHEN', 'flights');
      expect(matchUpper.some((l) => l.city === 'Chennai')).toBe(true);

      const matchCode = searchTravelLocations('DEL', 'flights');
      expect(matchCode.some((l) => l.city === 'Delhi')).toBe(true);

      const matchState = searchTravelLocations('kerala', 'flights');
      expect(matchState.some((l) => l.city === 'Kochi')).toBe(true);
    });

    it('resolves common search aliases accurately', () => {
      // Madras -> Chennai
      const madrasResults = searchTravelLocations('madras', 'flights');
      expect(madrasResults[0]?.city).toBe('Chennai');

      // BLR -> Bengaluru
      const blrResults = searchTravelLocations('blr', 'flights');
      expect(blrResults[0]?.city).toBe('Bengaluru');

      // BOM -> Mumbai
      const bomResults = searchTravelLocations('bom', 'flights');
      expect(bomResults[0]?.city).toBe('Mumbai');

      // Pink City -> Jaipur
      const pinkCityResults = searchTravelLocations('pink city', 'flights');
      expect(pinkCityResults[0]?.city).toBe('Jaipur');

      // Cochin -> Kochi
      const cochinResults = searchTravelLocations('cochin', 'flights');
      expect(cochinResults[0]?.city).toBe('Kochi');
    });

    it('provides mode-specific display details without leaking wrong transport codes', () => {
      const chennai = INDIAN_LOCATIONS.find((l) => l.city === 'Chennai')!;

      // Flights: shows airport code MAA, no railway codes
      const flightInfo = getLocationDisplayInfo(chennai, 'flights');
      expect(flightInfo.code).toBe('MAA');
      expect(flightInfo.secondary).toContain('MAA');
      expect(flightInfo.secondary).not.toContain('MAS');

      // Trains: shows railway code MAS, no airport codes
      const trainInfo = getLocationDisplayInfo(chennai, 'trains');
      expect(trainInfo.code).toBe('MAS');
      expect(trainInfo.secondary).toContain('MAS');
      expect(trainInfo.secondary).not.toContain('MAA');

      // Buses: shows bus terminal (CMBT) and state
      const busInfo = getLocationDisplayInfo(chennai, 'buses');
      expect(busInfo.secondary).toContain('CMBT');
      expect(busInfo.secondary).toContain('Tamil Nadu');

      // Cabs: shows landmarks
      const cabInfo = getLocationDisplayInfo(chennai, 'cabs');
      expect(cabInfo.secondary).toContain('Tamil Nadu');
    });

    it('finds location by formatted string value', () => {
      const fromFlightStr = findLocationByValue('Delhi (DEL)');
      expect(fromFlightStr?.city).toBe('Delhi');

      const fromTrainStr = findLocationByValue('Chennai (MAS)');
      expect(fromTrainStr?.city).toBe('Chennai');

      const fromPlainCity = findLocationByValue('Bengaluru');
      expect(fromPlainCity?.city).toBe('Bengaluru');
    });
  });

  describe('2. LocationSelector Component Accessibility & Behavior', () => {
    it('renders accessible combobox with correct attributes and value', () => {
      const html = renderToStaticMarkup(
        React.createElement(LocationSelector, {
          id: 'test-from',
          label: 'From',
          value: 'Chennai (MAA)',
          onChange: () => {},
          mode: 'flights',
        })
      );

      expect(html).toContain('role="combobox"');
      expect(html).toContain('aria-haspopup="listbox"');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('id="test-from"');
      expect(html).toContain('Chennai');
      expect(html).toContain('(MAA)');
    });

    it('renders placeholder when value is empty', () => {
      const html = renderToStaticMarkup(
        React.createElement(LocationSelector, {
          id: 'test-to',
          label: 'To',
          value: '',
          onChange: () => {},
          mode: 'trains',
          placeholder: 'Select destination station',
        })
      );

      expect(html).toContain('Select destination station');
    });
  });

  describe('3. Footer Restructuring — Editorial vs Minimal', () => {
    it('MinimalFooter renders sleek site footer with quick links and copyright', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(MinimalFooter, null)
        )
      );

      expect(html).toContain('data-testid="minimal-footer"');
      expect(html).toContain('Voyage');
      expect(html).toContain('Hub');
      expect(html).toContain('Flights');
      expect(html).toContain('Trains');
      expect(html).toContain('Buses');
      expect(html).toContain('Cabs');
      expect(html).toContain('About');
      expect(html).toContain('© 2026 VoyageHub. All rights reserved.');
      // Should NOT contain the large philosophy section
      expect(html).not.toContain('Unified Multi-Modal');
    });

    it('EditorialFooter renders rich black storytelling section for /about', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(EditorialFooter, null)
        )
      );

      expect(html).toContain('data-testid="editorial-footer"');
      expect(html).toContain('Unified Multi-Modal');
      expect(html).toContain('Service Storytelling');
      expect(html).toContain('Independent Prototype');
      expect(html).toContain('Transit Hubs');
    });

    it('Footer component conditionally displays EditorialFooter on /about', () => {
      const aboutHtml = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/about'] },
          React.createElement(Footer, null)
        )
      );

      expect(aboutHtml).toContain('data-testid="editorial-footer"');
      expect(aboutHtml).not.toContain('data-testid="minimal-footer"');
    });

    it('Footer component displays MinimalFooter on service pages (/flights, /trains, /buses, /cabs)', () => {
      const serviceRoutes = ['/flights', '/trains', '/buses', '/cabs'];

      serviceRoutes.forEach((route) => {
        const html = renderToStaticMarkup(
          React.createElement(
            MemoryRouter,
            { initialEntries: [route] },
            React.createElement(Footer, null)
          )
        );

        expect(html).toContain('data-testid="minimal-footer"');
        expect(html).not.toContain('data-testid="editorial-footer"');
        expect(html).not.toContain('Unified Multi-Modal');
      });
    });
  });

  describe('4. DynamicIslandNav Navigation & Interaction Polish', () => {
    it('renders accessible navigation header and all 4 travel modes', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/flights'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(DynamicIslandNav, null)
          )
        )
      );

      expect(html).toContain('role="navigation"');
      expect(html).toContain('aria-label="Primary Travel Navigation"');
      expect(html).toContain('Flights');
      expect(html).toContain('Trains');
      expect(html).toContain('Buses');
      expect(html).toContain('Cabs');
      expect(html).toContain('About');
      expect(html).toContain('Login');
      expect(html).toContain('Sign Up');
    });

    it('starts collapsed by default as a compact pill (aria-expanded="false")', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(DynamicIslandNav, null)
          )
        )
      );

      // Collapsed by default
      expect(html).toContain('aria-expanded="false"');
      // Compact brand identity always present
      expect(html).toContain('Voyage');
      expect(html).toContain('Hub');
    });

    it('displays active page indicator pill in compact collapsed state on service routes', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/flights'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(DynamicIslandNav, null)
          )
        )
      );

      // Active label displayed in compact pill
      expect(html).toContain('Flights');
      expect(html).toContain('animate-pulse');
    });

    it('visually highlights current active route in navigation links', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/trains'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(DynamicIslandNav, null)
          )
        )
      );

      // Trains route active
      expect(html).toContain('href="/trains"');
      expect(html).toContain('Trains');
    });

    it('applies calm physical unfolding curve, outer max-width constraints, and staggered delay attributes', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/flights'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(DynamicIslandNav, null)
          )
        )
      );

      // Outer nav duration 600ms, max-width transition, and calm balanced easing
      expect(html).toContain('duration-[600ms]');
      expect(html).toContain('ease-[cubic-bezier(0.35,0.25,0.25,1)]');
      expect(html).toContain('overflow-hidden');
      expect(html).toContain('max-w-[225px]');
      expect(html).toContain('transition-[max-width,padding,background-color,border-color,box-shadow]');
      // Collapsed desktop nav container quick exit
      expect(html).toContain('duration-[200ms]');
    });
  });

  describe('5. Page Transitions & ScrollReveal Accessibility', () => {
    it('RootLayout wraps page outlet in animate-page-enter route transition container', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/flights'] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(RootLayout, null)
          )
        )
      );

      expect(html).toContain('animate-page-enter');
      expect(html).toContain('id="main-content"');
    });

    it('ScrollReveal renders child content properly with accessibility attributes and 650ms calm duration', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          ScrollReveal,
          { delayMs: 100, className: 'test-reveal-box' },
          React.createElement('span', null, 'Revealed Content')
        )
      );

      expect(html).toContain('Revealed Content');
      expect(html).toContain('test-reveal-box');
      expect(html).toContain('transition-all');
      // Default duration 650ms and 100ms delay in static style
      expect(html).toContain('transition-duration:650ms');
      expect(html).toContain('transition-delay:100ms');
    });
  });

  describe('6. Search Engine Compatibility with Location Selector Outputs', () => {
    it('executes valid flight search with curated location selector formatted values (MAA -> DEL)', () => {
      const chennai = INDIAN_LOCATIONS.find((l) => l.city === 'Chennai')!;
      const delhi = INDIAN_LOCATIONS.find((l) => l.city === 'Delhi')!;

      const fromVal = getLocationDisplayInfo(chennai, 'flights').formattedValue; // "Chennai (MAA)"
      const toVal = getLocationDisplayInfo(delhi, 'flights').formattedValue; // "Delhi (DEL)"

      const res = TravelSearchService.searchSync({
        service: 'flight',
        from: fromVal,
        to: toVal,
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      });

      expect(res.isValid).toBe(true);
      expect(res.routeSupported).toBe(true);
      expect(res.options.length).toBeGreaterThanOrEqual(1);
      expect(res.options[0].originCode).toBe('MAA');
      expect(res.options[0].destinationCode).toBe('DEL');
    });

    it('executes valid train search with curated railway station formatted values (NDLS -> BSB)', () => {
      const delhi = INDIAN_LOCATIONS.find((l) => l.city === 'Delhi')!;
      const varanasi = INDIAN_LOCATIONS.find((l) => l.city === 'Varanasi')!;

      const fromVal = getLocationDisplayInfo(delhi, 'trains').formattedValue; // "Delhi (NDLS)"
      const toVal = getLocationDisplayInfo(varanasi, 'trains').formattedValue; // "Varanasi (BSB)"

      const res = TravelSearchService.searchSync({
        service: 'train',
        from: fromVal,
        to: toVal,
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      });

      expect(res.isValid).toBe(true);
      expect(res.routeSupported).toBe(true);
      expect(res.options.length).toBeGreaterThanOrEqual(1);
    });

    it('executes valid bus search with curated city formatted values (Bengaluru -> Chennai)', () => {
      const blr = INDIAN_LOCATIONS.find((l) => l.city === 'Bengaluru')!;
      const maa = INDIAN_LOCATIONS.find((l) => l.city === 'Chennai')!;

      const fromVal = getLocationDisplayInfo(blr, 'buses').formattedValue; // "Bengaluru"
      const toVal = getLocationDisplayInfo(maa, 'buses').formattedValue; // "Chennai"

      const res = TravelSearchService.searchSync({
        service: 'bus',
        from: fromVal,
        to: toVal,
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      });

      expect(res.isValid).toBe(true);
      expect(res.routeSupported).toBe(true);
      expect(res.options.length).toBeGreaterThanOrEqual(1);
    });

    it('executes valid cab search with curated city formatted values (Mumbai -> Pune)', () => {
      const bom = INDIAN_LOCATIONS.find((l) => l.city === 'Mumbai')!;
      const pnq = INDIAN_LOCATIONS.find((l) => l.city === 'Pune')!;

      const fromVal = getLocationDisplayInfo(bom, 'cabs').formattedValue; // "Mumbai"
      const toVal = getLocationDisplayInfo(pnq, 'cabs').formattedValue; // "Pune"

      const res = TravelSearchService.searchSync({
        service: 'cab',
        from: fromVal,
        to: toVal,
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      });

      expect(res.isValid).toBe(true);
      expect(res.routeSupported).toBe(true);
      expect(res.options.length).toBeGreaterThanOrEqual(1);
    });

    it('deterministically rejects identical origin and destination (Same Location Validation)', () => {
      const chennai = INDIAN_LOCATIONS.find((l) => l.city === 'Chennai')!;
      const val = getLocationDisplayInfo(chennai, 'flights').formattedValue;

      const res = TravelSearchService.searchSync({
        service: 'flight',
        from: val,
        to: val,
        departureDate: 'Tomorrow, 08:30 AM',
        tripType: 'oneway',
        passengers: 1,
      });

      expect(res.isValid).toBe(false);
      expect(res.emptyReason).toBe('VALIDATION_FAILED');
      expect(res.validationError).toContain('identical');
    });
  });
});
