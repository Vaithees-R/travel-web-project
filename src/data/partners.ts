import { PartnerItem } from '../types/travel';

/**
 * Preserved from original slidData.js with corrected branding copy
 */
export const TRAVEL_PARTNERS: Record<'flights' | 'trains' | 'buses' | 'cabs', PartnerItem[]> = {
  flights: [
    { id: 'f-1', title: 'Air India', text: 'National carrier serving domestic & worldwide routes', category: 'flights' },
    { id: 'f-2', title: 'IndiGo Airlines', text: 'India’s largest on-time domestic network', category: 'flights' },
    { id: 'f-3', title: 'Emirates', text: 'Award-winning international luxury connectivity', category: 'flights' },
    { id: 'f-4', title: 'Singapore Airlines', text: 'Global standard for hospitality and comfort', category: 'flights' },
    { id: 'f-5', title: 'Akasa Air', text: 'Modern, fuel-efficient domestic fleet', category: 'flights' },
    { id: 'f-6', title: 'Lufthansa', text: 'Seamless European and transatlantic journeys', category: 'flights' },
  ],
  trains: [
    { id: 't-1', title: 'Vande Bharat Express', text: 'Semi-high-speed modern rail network', category: 'trains' },
    { id: 't-2', title: 'Rajdhani Express', text: 'Premium long-distance express corridors', category: 'trains' },
    { id: 't-3', title: 'Shatabdi Express', text: 'Fast daytime intercity business travel', category: 'trains' },
    { id: 't-4', title: 'Tejas Express', text: 'Modern air-conditioned executive chair cars', category: 'trains' },
  ],
  buses: [
    { id: 'b-1', title: 'KSRTC / APSRTC', text: 'State transport corporations with safety records', category: 'buses' },
    { id: 'b-2', title: 'Zingbus Electric', text: 'Zero-emission connected luxury intercity coaches', category: 'buses' },
    { id: 'b-3', title: 'VRL Travels', text: 'Extensive multi-axle sleeper bus connectivity', category: 'buses' },
    { id: 'b-4', title: 'IntrCity SmartBus', text: 'Standardized boarding lounges and live tracking', category: 'buses' },
  ],
  cabs: [
    { id: 'c-1', title: 'Sedan Prime', text: 'Comfortable air-conditioned city & airport rides', category: 'cabs' },
    { id: 'c-2', title: 'Outstation SUV', text: 'Spacious vehicles for long road trips and hills', category: 'cabs' },
    { id: 'c-3', title: 'Green Fleet EV', text: 'Quiet, eco-friendly electric airport transfers', category: 'cabs' },
    { id: 'c-4', title: 'Hourly Rental', text: 'Dedicated driver for multi-stop city errands', category: 'cabs' },
  ]
};
