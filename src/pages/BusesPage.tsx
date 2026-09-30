import React from 'react';
import { Bus } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TRAVEL_PARTNERS } from '../data/partners';

export const BusesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="Buses Vertical"
        title="Intercity Bus Booking"
        description="Book luxury AC sleepers, semi-sleepers, and state transport buses connecting thousands of Indian towns and cities."
      />

      {/* Placeholder Search Form Card */}
      <Card className="p-6 bg-white border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-neutral-800" />
            <span className="font-semibold text-sm text-neutral-900">Intercity Bus Search Engine</span>
          </div>
          <Badge variant="accent">Ready for Phase 3 Implementation</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Boarding City</span>
            <span className="font-semibold text-neutral-800 text-sm">Bengaluru</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Dropping City</span>
            <span className="font-semibold text-neutral-800 text-sm">Chennai</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Travel Date</span>
            <span className="font-semibold text-neutral-800 text-sm">Select Date</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Bus Preference</span>
            <span className="font-semibold text-neutral-800 text-sm">AC Sleeper (2+1)</span>
          </div>
        </div>
      </Card>

      {/* Featured Bus Operators */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Partner Bus Operators</h2>
          <p className="text-xs text-neutral-500">Verified intercity luxury and state fleets</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TRAVEL_PARTNERS.buses.map((partner) => (
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
