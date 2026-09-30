export type CanonicalTransportType = 'flight' | 'train' | 'bus' | 'cab';
export type TransportType = CanonicalTransportType | 'flights' | 'trains' | 'buses' | 'cabs';

export interface RouteItem {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  type: 'domestic' | 'international';
  startingFare: number;
  currency: 'INR' | 'USD';
}

export interface TrainItem {
  id: string;
  name: string;
  departureTime: string;
  startingPrice: number;
  classTypes: string[];
  runsOn: string;
}

export interface PartnerItem {
  id: string;
  title: string;
  text: string;
  category: 'flights' | 'cabs' | 'buses' | 'trains';
  assetName?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'flights' | 'trains' | 'buses' | 'cabs' | 'general';
}
