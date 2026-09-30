import { RouteItem } from '../types/travel';

/**
 * Curated from original PopularRoutes.js & National.js
 * Cleaned with correct standard IATA codes and realistic pricing.
 */
export const POPULAR_DOMESTIC_ROUTES: RouteItem[] = [
  { id: 'dom-1', from: 'Mumbai', fromCode: 'BOM', to: 'Goa', toCode: 'GOI', type: 'domestic', startingFare: 2499, currency: 'INR' },
  { id: 'dom-2', from: 'Mumbai', fromCode: 'BOM', to: 'Hyderabad', toCode: 'HYD', type: 'domestic', startingFare: 3199, currency: 'INR' },
  { id: 'dom-3', from: 'Hyderabad', fromCode: 'HYD', to: 'Delhi', toCode: 'DEL', type: 'domestic', startingFare: 3899, currency: 'INR' },
  { id: 'dom-4', from: 'Hyderabad', fromCode: 'HYD', to: 'Mumbai', toCode: 'BOM', type: 'domestic', startingFare: 3499, currency: 'INR' },
  { id: 'dom-5', from: 'Delhi', fromCode: 'DEL', to: 'Mumbai', toCode: 'BOM', type: 'domestic', startingFare: 4299, currency: 'INR' },
  { id: 'dom-6', from: 'Chennai', fromCode: 'MAA', to: 'Hyderabad', toCode: 'HYD', type: 'domestic', startingFare: 2999, currency: 'INR' },
  { id: 'dom-7', from: 'Chennai', fromCode: 'MAA', to: 'Delhi', toCode: 'DEL', type: 'domestic', startingFare: 4899, currency: 'INR' },
  { id: 'dom-8', from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM', type: 'domestic', startingFare: 3699, currency: 'INR' },
  { id: 'dom-9', from: 'Delhi', fromCode: 'DEL', to: 'Goa', toCode: 'GOI', type: 'domestic', startingFare: 4599, currency: 'INR' },
  { id: 'dom-10', from: 'Bengaluru', fromCode: 'BLR', to: 'Delhi', toCode: 'DEL', type: 'domestic', startingFare: 4399, currency: 'INR' },
];

export const POPULAR_INTERNATIONAL_ROUTES: RouteItem[] = [
  { id: 'int-1', from: 'Delhi', fromCode: 'DEL', to: 'Dubai', toCode: 'DXB', type: 'international', startingFare: 16499, currency: 'INR' },
  { id: 'int-2', from: 'Mumbai', fromCode: 'BOM', to: 'Singapore', toCode: 'SIN', type: 'international', startingFare: 18999, currency: 'INR' },
  { id: 'int-3', from: 'Delhi', fromCode: 'DEL', to: 'London', toCode: 'LHR', type: 'international', startingFare: 38500, currency: 'INR' },
  { id: 'int-4', from: 'Bengaluru', fromCode: 'BLR', to: 'Bangkok', toCode: 'BKK', type: 'international', startingFare: 14200, currency: 'INR' },
  { id: 'int-5', from: 'Mumbai', fromCode: 'BOM', to: 'New York', toCode: 'JFK', type: 'international', startingFare: 58000, currency: 'INR' },
  { id: 'int-6', from: 'Chennai', fromCode: 'MAA', to: 'Kuala Lumpur', toCode: 'KUL', type: 'international', startingFare: 13500, currency: 'INR' },
];
