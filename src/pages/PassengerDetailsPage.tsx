import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { Passenger } from '../types/booking';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';

export const PassengerDetailsPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const navigate = useNavigate();

  const service: CanonicalTransportType = 
    rawService === 'flights' || rawService === 'flight' ? 'flight' :
    rawService === 'trains' || rawService === 'train' ? 'train' :
    rawService === 'buses' || rawService === 'bus' ? 'bus' : 'cab';

  const session = BookingStorageService.getActiveSession();
  const selectedOption = session?.selectedOption;
  const searchCriteria = session?.searchCriteria;
  const selectedClass = session?.selectedClass || selectedOption?.selectedClass || 'Standard';

  // Form states
  const [fullName, setFullName] = useState(session?.passenger?.fullName || '');
  const [email, setEmail] = useState(session?.passenger?.email || '');
  const [phone, setPhone] = useState(session?.passenger?.phone || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(session?.passenger?.gender || 'male');
  const [age, setAge] = useState<string>(session?.passenger?.age ? String(session.passenger.age) : '28');
  const [preference, setPreference] = useState(session?.passenger?.berthOrSeatPreference || 'No Preference');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address for your e-ticket';
    }

    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please provide a valid contact phone number';
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const passenger: Passenger = {
      id: `pax-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      age: parseInt(age, 10),
      berthOrSeatPreference: preference,
    };

    // Update session
    BookingStorageService.saveActiveSession({
      ...session,
      passenger,
      selectedClass,
      step: 'review',
    });

    const routePrefix = service === 'flight' ? 'flights' : service === 'train' ? 'trains' : service === 'bus' ? 'buses' : 'cabs';
    navigate(`/${routePrefix}/review`);
  };

  // If no option is selected in session, provide graceful fallback
  if (!selectedOption) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">No Travel Option Selected</h2>
          <p className="text-xs text-neutral-500">
            Please select a flight, train, bus, or cab from the search results to enter traveller information.
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

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      {/* 1. Step Indicator Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BookingStepIndicator currentStep="passengers" service={service} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Search Results</span>
          </button>
        </div>

        {/* Selected Journey Recap Header */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <TransportBadge type={service} size="md" variant="subtle" />
              <div>
                <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                  Selected Itinerary
                </span>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  {selectedOption.operator} ({selectedOption.identifier})
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-neutral-400 block">Class / Service Tier</span>
              <span className="text-xs font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg inline-block">
                {selectedClass}
              </span>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">From</span>
              <span className="font-semibold text-neutral-900 text-sm">{selectedOption.originCity} ({selectedOption.originCode})</span>
              <p className="text-[11px] text-neutral-500">{selectedOption.originStationOrTerminal || selectedOption.originCity}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">To</span>
              <span className="font-semibold text-neutral-900 text-sm">{selectedOption.destinationCity} ({selectedOption.destinationCode})</span>
              <p className="text-[11px] text-neutral-500">{selectedOption.destinationStationOrTerminal || selectedOption.destinationCity}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Schedule</span>
              <span className="font-semibold text-neutral-900 text-sm">{selectedOption.departureTime} → {selectedOption.arrivalTime}</span>
              <p className="text-[11px] text-neutral-500">{searchCriteria?.departureDate || 'Selected Departure'}</p>
            </div>
          </div>
        </div>

        {/* Passenger Information Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-neutral-900">Primary Traveller Information</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter passenger details matching your government-issued photo identity card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Full Legal Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200 focus:border-neutral-900'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-rose-600 font-medium">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Email Address (For E-Ticket delivery) *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rahul.sharma@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200 focus:border-neutral-900'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>Mobile Contact Number *</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200 focus:border-neutral-900'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>}
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Age *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.age ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200 focus:border-neutral-900'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-rose-600 font-medium">{errors.age}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-neutral-900"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service-Specific Preference */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="text-xs font-bold text-neutral-800 block mb-2">
              {service === 'flight' ? 'In-Flight Seating & Meal Preference' :
               service === 'train' ? 'IRCTC Berth Preference' :
               service === 'bus' ? 'Highway Sleeper Berth Preference' :
               'Pickup Landmark & Special Chauffeur Instructions'}
            </label>

            {service === 'flight' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['No Preference', 'Window Seat', 'Aisle Seat', 'Vegetarian Meal'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreference(opt)}
                    className={`py-2 px-3 rounded-xl border font-medium transition-colors ${
                      preference === opt
                        ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {service === 'train' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['No Preference', 'Lower Berth', 'Middle Berth', 'Upper Berth', 'Side Lower'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreference(opt)}
                    className={`py-2 px-3 rounded-xl border font-medium transition-colors ${
                      preference === opt
                        ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {service === 'bus' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {['No Preference', 'Lower Deck Sleeper', 'Upper Deck Sleeper'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreference(opt)}
                    className={`py-2 px-3 rounded-xl border font-medium transition-colors ${
                      preference === opt
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {service === 'cab' && (
              <input
                type="text"
                value={preference === 'No Preference' ? '' : preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="e.g. Flight #6E 204 arrival pickup, Terminal 2 Pillar 4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
            )}
          </div>

          {/* Honest Simulation Notice */}
          <div className="p-4 bg-neutral-100/70 rounded-2xl border border-neutral-200/80 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              <strong>Simulated Travel Demo:</strong> No real payment card or sensitive personal credentials are collected. The entered contact information is used strictly to render your simulated itinerary and e-ticket documents locally in your browser.
            </p>
          </div>

          {/* Form Submit & Navigation */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
