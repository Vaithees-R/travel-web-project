import { TrainItem } from '../types/travel';

/**
 * Preserved from original traincards.js with structured fields
 */
export const POPULAR_INDIAN_TRAINS: TrainItem[] = [
  { id: '12952', name: 'New Delhi Mumbai Rajdhani Express', departureTime: '04:55 PM', startingPrice: 1850, classTypes: ['1A', '2A', '3A'], runsOn: 'Daily' },
  { id: '12002', name: 'Bhopal Shatabdi Express', departureTime: '06:00 AM', startingPrice: 950, classTypes: ['EC', 'CC'], runsOn: 'Daily except Fri' },
  { id: '22436', name: 'Vande Bharat Express (Varanasi)', departureTime: '06:00 AM', startingPrice: 1750, classTypes: ['EC', 'CC'], runsOn: 'Mon, Tue, Wed, Fri, Sat, Sun' },
  { id: '12260', name: 'Sealdah Duronto Express', departureTime: '08:15 PM', startingPrice: 1650, classTypes: ['1A', '2A', '3A', 'SL'], runsOn: 'Mon, Wed, Thu' },
  { id: '12204', name: 'Garib Rath Express', departureTime: '09:45 AM', startingPrice: 650, classTypes: ['3A'], runsOn: 'Tue, Wed, Sun' },
  { id: '82902', name: 'Tejas Express', departureTime: '03:40 PM', startingPrice: 1950, classTypes: ['EC', 'CC'], runsOn: 'Mon, Wed, Thu, Fri, Sat, Sun' },
];
