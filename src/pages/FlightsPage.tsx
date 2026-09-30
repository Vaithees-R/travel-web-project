import React from 'react';
import { Plane, MapPin, Globe } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { POPULAR_DOMESTIC_ROUTES, POPULAR_INTERNATIONAL_ROUTES } from '../data/mockRoutes';

export const FlightsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="Flights Vertical"
        title="Flight Booking Portal"
        description="Search and book scheduled domestic Indian carriers (IndiGo, Air India, Akasa) and international global routes."
      />

      {/* Placeholder Search Form Card */}
      <Card className="p-6 bg-white border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-neutral-800" />
            <span className="font-semibold text-sm text-neutral-900">Flight Search Engine</span>
          </div>
          <Badge variant="accent">Ready for Phase 3 Implementation</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Departure City</span>
            <span className="font-semibold text-neutral-800 text-sm">Delhi (DEL)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Destination</span>
            <span className="font-semibold text-neutral-800 text-sm">Mumbai (BOM)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Date</span>
            <span className="font-semibold text-neutral-800 text-sm">Tomorrow</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Travelers & Class</span>
            <span className="font-semibold text-neutral-800 text-sm">1 Adult, Economy</span>
          </div>
        </div>
      </Card>

      {/* Curated Routes Section (Preserved & Cleaned Data) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Popular Domestic Flight Routes</h2>
          <p className="text-xs text-neutral-500">Preserved from original dataset, updated with official IATA codes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_DOMESTIC_ROUTES.slice(0, 6).map((route) => (
            <Card key={route.id} className="p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <span className="font-medium text-neutral-900">{route.from}</span>
                  <span className="text-neutral-400 mx-1">→</span>
                  <span className="font-medium text-neutral-900">{route.to}</span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {route.fromCode} - {route.toCode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 text-[10px] block">Starting from</span>
                <span className="font-semibold text-neutral-900">₹{route.startingFare.toLocaleString('en-IN')}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Curated International Routes Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Popular International Flight Routes</h2>
          <p className="text-xs text-neutral-500">Major overseas corridors from Indian gateways</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_INTERNATIONAL_ROUTES.map((route) => (
            <Card key={route.id} className="p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <span className="font-medium text-neutral-900">{route.from}</span>
                  <span className="text-neutral-400 mx-1">→</span>
                  <span className="font-medium text-neutral-900">{route.to}</span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {route.fromCode} - {route.toCode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 text-[10px] block">Starting from</span>
                <span className="font-semibold text-neutral-900">₹{route.startingFare.toLocaleString('en-IN')}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
