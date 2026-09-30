import React from 'react';
import { Train, Clock } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { POPULAR_INDIAN_TRAINS } from '../data/mockTrains';

export const TrainsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="Trains Vertical"
        title="Indian Railways (IRCTC) Booking"
        description="Book berths on Vande Bharat, Rajdhani, Shatabdi, and Superfast express trains across India."
      />

      {/* Placeholder Search Form Card */}
      <Card className="p-6 bg-white border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-neutral-800" />
            <span className="font-semibold text-sm text-neutral-900">IRCTC Railway Search Engine</span>
          </div>
          <Badge variant="accent">Ready for Phase 3 Implementation</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Origin Station</span>
            <span className="font-semibold text-neutral-800 text-sm">New Delhi (NDLS)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Destination Station</span>
            <span className="font-semibold text-neutral-800 text-sm">Varanasi Jn (BSB)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Journey Date</span>
            <span className="font-semibold text-neutral-800 text-sm">Select Date</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-neutral-400 font-medium block mb-1">Quota & Class</span>
            <span className="font-semibold text-neutral-800 text-sm">General • All Classes</span>
          </div>
        </div>
      </Card>

      {/* Preserved Train Fleet */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Featured Express Services</h2>
          <p className="text-xs text-neutral-500">Preserved from original traincards data</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_INDIAN_TRAINS.map((train) => (
            <Card key={train.id} className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900 text-sm">{train.name}</span>
                <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                  #{train.id}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-500 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Departs {train.departureTime}</span>
                </div>
                <span className="font-medium text-neutral-900">From ₹{train.startingPrice}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100">
                {train.classTypes.map((cls) => (
                  <span key={cls} className="text-[10px] px-1.5 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-700">
                    {cls}
                  </span>
                ))}
                <span className="text-[10px] text-neutral-400 ml-auto">{train.runsOn}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
