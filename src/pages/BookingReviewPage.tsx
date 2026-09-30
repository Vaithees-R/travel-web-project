import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Sparkles, Loader2, Calendar, Clock, MapPin, User, Luggage, AlertCircle, LogIn } from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { FareCalculatorService } from '../services/booking/fareCalculator';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const BookingReviewPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const service: CanonicalTransportType = 
    rawService === 'flights' || rawService === 'flight' ? 'flight' :
    rawService === 'trains' || rawService === 'train' ? 'train' :
    rawService === 'buses' || rawService === 'bus' ? 'bus' : 'cab';

  const session = BookingStorageService.getActiveSession();
  const selectedOption = session?.selectedOption;
  const searchCriteria = session?.searchCriteria;
  const passenger = session?.passenger;
  const selectedClass = session?.selectedClass || 'Standard';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If session is incomplete, redirect gracefully
  if (!selectedOption || !passenger) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Incomplete Booking Details</h2>
          <p className="text-xs text-neutral-500">
            It looks like some required booking details are missing. Please begin your search again.
          </p>
          <Link
            to={`/${service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs'}`}
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
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

  const passengersCount = searchCriteria?.passengers || 1;
  const fareBreakdown = FareCalculatorService.calculateFare(activeBaseFare, passengersCount, service);

  const handleConfirmBooking = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const bookingId = BookingStorageService.generateBookingId();
      const bookingRef = BookingStorageService.generateReference(service);
      const seatAllocation = BookingStorageService.generateSeatAllocation(service, selectedClass);

      const payload = {
        id: bookingId,
        bookingRef,
        service,
        travelOption: selectedOption,
        searchCriteria: searchCriteria || {
          service,
          from: selectedOption.originCity,
          to: selectedOption.destinationCity,
          departureDate: 'Tomorrow, 08:30 AM',
          tripType: 'oneway' as const,
          passengers: passengersCount,
        },
        primaryPassenger: passenger,
        passengersCount,
        seatOrBerthAllocated: seatAllocation,
        fareBreakdown,
      };

      const createdBooking = await api.bookings.create(payload);

      // Clear session only after successful API persistence
      BookingStorageService.clearActiveSession();

      const routePrefix = service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs';
      navigate(`/${routePrefix}/confirmation/${createdBooking.id}`);
    } catch (err: any) {
      console.error('Failed to persist booking to PostgreSQL API', err);
      setSubmitError('Unable to confirm your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Passenger Details</span>
          </button>
        </div>

        {/* Honest Simulation Disclaimer Banner */}
        <div className="p-4 sm:p-5 bg-amber-500/10 border border-amber-300 rounded-3xl flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-900">
              Interactive Frontend Simulation
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
              This booking simulation demonstrates the full end-to-end customer journey without requiring real credit cards or actual payment. Clicking <strong>Confirm & Issue Ticket</strong> will instantly generate simulated travel documents, allocate a seat/berth, and synchronize with your browser&apos;s itinerary record.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Review Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Journey Summary Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <TransportBadge type={service} size="md" variant="subtle" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{selectedOption.operator}</h3>
                    <p className="text-xs text-neutral-500 font-mono">{selectedOption.identifier} • {selectedClass}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/60">
                  Ready for Confirmation
                </span>
              </div>

              {/* Route Schedule Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Departure</span>
                  <div className="text-lg font-bold text-neutral-900">{selectedOption.departureTime}</div>
                  <div className="font-semibold text-neutral-800">{selectedOption.originCity} ({selectedOption.originCode})</div>
                  <div className="text-[11px] text-neutral-400">{selectedOption.originStationOrTerminal}</div>
                </div>

                <div className="flex flex-col items-center justify-center border-y sm:border-y-0 sm:border-x border-neutral-200/80 py-2 sm:py-0 px-2 text-center">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 mb-0.5" />
                  <span className="font-semibold text-neutral-700">{selectedOption.duration}</span>
                  <span className="text-[10px] text-neutral-400">{selectedOption.stops === 0 ? 'Non-Stop Direct' : `${selectedOption.stops} Stop`}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Arrival</span>
                  <div className="text-lg font-bold text-neutral-900">{selectedOption.arrivalTime}</div>
                  <div className="font-semibold text-neutral-800">{selectedOption.destinationCity} ({selectedOption.destinationCode})</div>
                  <div className="text-[11px] text-neutral-400">{selectedOption.destinationStationOrTerminal}</div>
                </div>
              </div>

              {/* Date & Terminal Info */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Date: <strong>{searchCriteria?.departureDate || 'Tomorrow'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Boarding Gate / Bay: Assigned at terminal</span>
                </div>
              </div>
            </div>

            {/* Passenger Information Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span>Passenger & Seating Record</span>
              </h4>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Full Name</span>
                  <strong className="text-neutral-900 text-sm">{passenger.fullName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Contact Email</span>
                  <span className="font-mono text-neutral-800">{passenger.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Mobile Phone</span>
                  <span className="font-mono text-neutral-800">{passenger.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Age & Gender</span>
                  <span className="text-neutral-800">{passenger.age} yrs • {passenger.gender?.toUpperCase()}</span>
                </div>
                {passenger.berthOrSeatPreference && (
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/70">
                    <span className="text-neutral-500">Seating / Meal Preference</span>
                    <span className="font-semibold text-neutral-800 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {passenger.berthOrSeatPreference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Cancellation & Baggage Policy */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Luggage className="w-4 h-4 text-neutral-500" />
                <span>Simulated Journey Policies</span>
              </h4>
              <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                <li>Free cancellation simulated directly from <strong>My Bookings</strong> up to 4 hours prior.</li>
                <li>Instant 100% simulated refund to simulated original payment method.</li>
                <li>Standard baggage allowance of 15 kg check-in and 7 kg hand luggage included.</li>
              </ul>
            </div>
          </div>

          {/* Right Sidebar: Fare Breakdown & Confirmation CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h4 className="text-sm font-bold text-neutral-900">Fare Summary</h4>
                <p className="text-[11px] text-neutral-400">Deterministic transparent pricing</p>
              </div>

              {/* Breakdown lines */}
              <div className="space-y-2.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Base Fare ({fareBreakdown.passengerCount} {fareBreakdown.passengerCount === 1 ? 'Pax' : 'Pax'})</span>
                  <span className="font-mono text-neutral-900">₹{fareBreakdown.subtotalBaseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Terminal Fees</span>
                  <span className="font-mono text-neutral-900">₹{fareBreakdown.taxesAndTerminalFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service & Passenger Safety</span>
                  <span className="font-mono text-neutral-900">₹{fareBreakdown.safetyOrServiceFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-neutral-400 block">Total Amount</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">All taxes included</span>
                </div>
                <div className="text-2xl font-extrabold text-neutral-900">
                  ₹{fareBreakdown.totalFare.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Error Alert */}
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Confirm & Book CTA */}
              <div className="pt-2 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="text-[11px] text-neutral-600 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200">
                      <span>Traveler Account: </span>
                      <strong className="text-neutral-900">{user.fullName}</strong>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleConfirmBooking}
                      className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Issuing Simulated Ticket...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Confirm & Issue Ticket</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                      Please sign in or register to link this booking with your personal travel account.
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Complete Booking</span>
                    </button>
                  </>
                )}
              </div>

              <div className="text-center text-[10px] text-neutral-400">
                Simulated booking • Real PostgreSQL persistence
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
