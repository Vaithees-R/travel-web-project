import React from 'react';
import { Ticket, Search } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const BookingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="Trips Center"
        title="My Bookings & PNR Inquiry"
        description="View your upcoming and completed flight, train, bus, and cab tickets. Manage cancellations and download e-tickets."
      />

      {/* PNR Quick Search */}
      <Card className="p-6 bg-white border-neutral-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-neutral-900">Look Up PNR or Booking ID</h3>
            <p className="text-xs text-neutral-500">Enter your 10-digit IRCTC PNR or 8-character Booking Reference</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. 2489104820 or VOY-8910"
              className="h-10 px-3 text-xs bg-neutral-50 border border-neutral-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              readOnly
              value=""
            />
            <Button size="sm" className="gap-1.5 shrink-0">
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State / Phase 1 Notice */}
      <Card className="p-12 text-center bg-white border-dashed border-neutral-300 rounded-xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
          <Ticket className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-neutral-900">No active bookings yet</h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Your booked tickets will automatically synchronize here once booking functionality and session persistence are enabled in Phase 4.
          </p>
        </div>
        <div className="pt-2">
          <Badge variant="neutral">Persistence Engine • Phase 4</Badge>
        </div>
      </Card>
    </div>
  );
};
