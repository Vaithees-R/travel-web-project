export type TravelService = 'flights' | 'trains' | 'buses' | 'cabs';

export interface NavItem {
  label: string;
  path: string;
  description?: string;
  badge?: string;
}

export interface TravelServiceItem {
  id: TravelService;
  label: string;
  path: string;
  subtitle: string;
  icon: string;
}
