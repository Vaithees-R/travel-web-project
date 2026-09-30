import React from 'react';
import { Car } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TRAVEL_PARTNERS } from '../data/partners';

export const CabsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="Cabs Vertical"
        title="Chauffeur & Outstation Cabs"
        description="Transparent fares for airport pickups, city hourly rentals, and one-way or round-trip outstation journeys across India."
      />

      {/* Placeholder Search Form Card */}
      <Card className="p-6 bg-white border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-neutral-800" />
            <span className="font-semibold text-sm text-neutral-900">Cab Booking Engine</span>
          </div>
          <Badge variant="accent">Ready for Phase 3 Implementation</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Pickup Location</span>
            <span className="font-semibold text-neutral-800 text-sm">Mumbai Airport (BOM)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Drop / Destination</span>
            <span className="font-semibold text-neutral-800 text-sm">Pune City</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Pickup Date & Time</span>
            <span className="font-semibold text-neutral-800 text-sm">Today • 02:00 PM</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Service Type</span>
            <span className="font-semibold text-neutral-800 text-sm">Outstation One-Way</span>
          </div>
        </div>
      </Card>

      {/* Available Fleet Categories */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Vehicle Tiers</h2>
          <p className="text-xs text-neutral-500">Chauffeur-driven vehicles with upfront pricing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TRAVEL_PARTNERS.cabs.map((partner) => (
            <Card key={partner.id} className="p-4 space-y-2 text-xs">
              <span className="font-semibold text-neutral-900 block text-sm">{partner.title}</span>
              <p className="text-neutral-500 leading-relaxed">{partner.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
