import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { FareCalculatorService } from '../services/booking/fareCalculator';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';
import { FareBreakdown } from '../components/booking/FareBreakdown';

export const BookingReviewPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const navigate = useNavigate();

  const service: CanonicalTransportType =
    rawService === 'flights' || rawService === 'flight'
      ? 'flight'
      : rawService === 'trains' || rawService === 'train'
      ? 'train'
      : rawService === 'buses' || rawService === 'bus'
      ? 'bus'
      : 'cab';

  const session = BookingStorageService.getActiveSession();
  const selectedOption = session?.selectedOption;
  const searchCriteria = session?.searchCriteria;
  const passenger = session?.passenger;
  const additionalPassengers = session?.additionalPassengers || [];
  const selectedClass = session?.selectedClass || selectedOption?.selectedClass || 'Standard';

  const routePrefix =
    service === 'flight'
      ? 'flights'
      : service === 'train'
      ? 'trains'
      : service === 'bus'
      ? 'buses'
      : 'cabs';

  // If session is incomplete, redirect gracefully
  if (!selectedOption || !passenger) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Incomplete Booking Details</h2>
          <p className="text-xs text-neutral-500">
            It looks like some required booking details are missing. Please begin your search again.
          </p>
          <Link
            to={`/${routePrefix}`}
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Start Search
          </Link>
        </div>
      </div>
    );
  }

  // Calculate fare breakdown
  let activeBaseFare = selectedOption.baseFare;
  if (selectedOption.cabinClasses) {
    const matched = selectedOption.cabinClasses.find((c) => c.className === selectedClass);
    if (matched) activeBaseFare = matched.fare;
  } else if (selectedOption.trainClasses) {
    const matched = selectedOption.trainClasses.find((c) => c.className === selectedClass);
    if (matched) activeBaseFare = matched.fare;
  }

  const passengersCount = searchCriteria?.passengers || 1 + additionalPassengers.length;
  const fareBreakdown = FareCalculatorService.calculateFare(activeBaseFare, passengersCount, service);

  const handleProceedToCheckout = () => {
    // Update step in session
    BookingStorageService.saveActiveSession({
      ...session,
      step: 'checkout',
    });
    navigate(`/${routePrefix}/checkout`);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BookingStepIndicator currentStep="review" service={service} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => navigate(`/${routePrefix}/passengers`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Passenger Details</span>
          </button>
        </div>

        {/* Header Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Step 3 of 5
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              Review Your Journey Details
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Please carefully verify passenger names and route schedules before proceeding to secure
              checkout.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/70">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prices Locked for 15 Mins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trip & Passenger Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Transport-Specific Detailed Trip Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 bg-neutral-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TransportBadge type={service} size="md" variant="subtle" />
                  <div>
                    <span className="text-xs text-neutral-400 block font-mono">
                      {selectedOption.identifier}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">{selectedOption.operator}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Class / Category</span>
                  <span className="text-xs font-bold bg-neutral-800 text-neutral-200 px-2.5 py-1 rounded-lg">
                    {selectedClass}
                  </span>
                </div>
              </div>

              {/* Schedule and corridor */}
              <div className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pb-6 border-b border-neutral-100">
                  {/* Origin */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Departure
                    </span>
                    <div className="text-2xl font-extrabold text-neutral-900">
                      {selectedOption.departureTime}
                    </div>
                    <div className="text-sm font-bold text-neutral-800">
                      {selectedOption.originCity} ({selectedOption.originCode})
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {selectedOption.originStationOrTerminal || selectedOption.originCity}
                    </div>
                  </div>

                  {/* Duration middle indicator */}
                  <div className="text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-neutral-100">
                    <span className="text-xs font-bold text-neutral-700 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{selectedOption.duration}</span>
                    </span>
                    <div className="w-20 mx-auto h-[1.5px] bg-neutral-200 my-1.5" />
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {selectedOption.stops === 0 ? 'Non-Stop Corridor' : `${selectedOption.stops} Stop`}
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Arrival
                    </span>
                    <div className="text-2xl font-extrabold text-neutral-900">
                      {selectedOption.arrivalTime}
                    </div>
                    <div className="text-sm font-bold text-neutral-800">
                      {selectedOption.destinationCity} ({selectedOption.destinationCode})
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {selectedOption.destinationStationOrTerminal || selectedOption.destinationCity}
                    </div>
                  </div>
                </div>

                {/* Specifics Grid depending on service */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {service === 'flight' && (
                    <>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Aircraft
                        </span>
                        <strong className="text-neutral-800">{selectedOption.subType || 'Airbus A320'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Baggage
                        </span>
                        <strong className="text-neutral-800">{selectedOption.baggage || 'Cabin 7kg'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Refund Policy
                        </span>
                        <strong className="text-emerald-700">
                          {selectedOption.isRefundable ? 'Refundable' : 'Standard'}
                        </strong>
                      </div>
                    </>
                  )}

                  {service === 'train' && (
                    <>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Train Service
                        </span>
                        <strong className="text-neutral-800">{selectedOption.trainType || 'Superfast'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          IRCTC Quota
                        </span>
                        <strong className="text-neutral-800">{searchCriteria?.trainQuota || 'General'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Seat/Berth Status
                        </span>
                        <strong className="text-emerald-700">Confirmed Allocation</strong>
                      </div>
                    </>
                  )}

                  {service === 'bus' && (
                    <>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Bus Coach
                        </span>
                        <strong className="text-neutral-800">{selectedOption.busType || 'Volvo Multi-Axle'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Boarding Lounge
                        </span>
                        <strong className="text-neutral-800">{selectedOption.originStationOrTerminal || 'Main Bay'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Dropping Terminal
                        </span>
                        <strong className="text-neutral-800">{selectedOption.destinationStationOrTerminal || 'City Terminus'}</strong>
                      </div>
                    </>
                  )}

                  {service === 'cab' && (
                    <>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Model Category
                        </span>
                        <strong className="text-neutral-800">{selectedOption.subType || 'Sedan Prime'}</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Route Distance
                        </span>
                        <strong className="text-neutral-800">{selectedOption.estimatedDistanceKm || 150} km</strong>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <span className="text-[10px] uppercase text-neutral-400 block font-bold">
                          Capacity & Luggage
                        </span>
                        <strong className="text-neutral-800">
                          {selectedOption.capacity || '4 Seater'} • {selectedOption.luggage || '2 Bags'}
                        </strong>
                      </div>
                    </>
                  )}
                </div>

                {/* Amenities List */}
                {selectedOption.amenities && selectedOption.amenities.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                      Included Travel Amenities:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedOption.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Passenger Summary Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span>Verified Passenger Roster ({passengersCount})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => navigate(`/${routePrefix}/passengers`)}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
                >
                  Edit Passengers
                </button>
              </div>

              {/* Primary Passenger */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-neutral-900">{passenger.fullName}</div>
                  <span className="bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Primary Contact
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-600">
                  <div>
                    <span className="text-neutral-400">Email: </span>
                    <span className="font-mono text-neutral-900">{passenger.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Phone: </span>
                    <span className="font-mono text-neutral-900">{passenger.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Demographics: </span>
                    <span>
                      {passenger.age} yrs • {passenger.gender?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Seat/Berth Preference: </span>
                    <span className="font-semibold text-neutral-800">
                      {passenger.berthOrSeatPreference || 'Auto Assign'}
                    </span>
                  </div>
                </div>

                {passenger.passportNumber && (
                  <div className="pt-2 border-t border-neutral-200 flex items-center gap-4 text-sky-900">
                    <div>
                      <span className="text-neutral-400">Passport: </span>
                      <strong className="font-mono">{passenger.passportNumber}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Country: </span>
                      <span>{passenger.passportCountry}</span>
                    </div>
                  </div>
                )}

                {service === 'cab' && passenger.pickupAddress && (
                  <div className="pt-2 border-t border-neutral-200 space-y-1 text-indigo-900">
                    <div>
                      <span className="text-neutral-400 font-bold">Pickup: </span>
                      <span>{passenger.pickupAddress}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold">Drop: </span>
                      <span>{passenger.dropAddress}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Passengers if any */}
              {additionalPassengers.map((pax, idx) => (
                <div
                  key={pax.id || idx}
                  className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      Passenger #{idx + 2}
                    </span>
                    <strong className="text-neutral-900">{pax.fullName}</strong>
                    <span className="text-neutral-500 ml-2">
                      ({pax.age} yrs, {pax.gender?.toUpperCase()})
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-600 bg-white px-2 py-1 rounded border border-neutral-200">
                    {pax.berthOrSeatPreference || 'Standard Seat'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Fare Breakdown & Checkout Action (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <FareBreakdown
              fareBreakdown={fareBreakdown}
              service={service}
              selectedOption={selectedOption}
              selectedClass={selectedClass}
            />

            {/* Checkout Action CTA Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="text-xs text-neutral-600 space-y-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>VoyageHub Instant Booking Protection</span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  By clicking Proceed to Checkout, your fare will be locked while you complete the
                  simulated test payment.
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Simulated Sandbox Environment • TLS 1.3 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
