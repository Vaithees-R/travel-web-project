import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  Globe,
  MapPin,
  Car,
  Train,
  Plane,
  Bus,
} from 'lucide-react';
import { CanonicalTransportType } from '../types/travel';
import { Passenger } from '../types/booking';
import { BookingStorageService } from '../services/booking/bookingStorage';
import { BookingStepIndicator } from '../components/booking/BookingStepIndicator';
import { TransportBadge } from '../components/ui/TransportBadge';
import { useAuth } from '../hooks/useAuth';

export const PassengerDetailsPage: React.FC = () => {
  const { service: rawService } = useParams<{ service: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const selectedClass = session?.selectedClass || selectedOption?.selectedClass || 'Standard';

  const isInternationalFlight =
    service === 'flight' && (selectedOption?.isInternational || selectedOption?.stops === 1 && false);

  const totalPassengersCount = searchCriteria?.passengers || 1;

  // Primary Passenger Form State
  const [fullName, setFullName] = useState(
    session?.passenger?.fullName || user?.fullName || ''
  );
  const [email, setEmail] = useState(
    session?.passenger?.email || user?.email || ''
  );
  const [phone, setPhone] = useState(
    session?.passenger?.phone || user?.phone || ''
  );
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    session?.passenger?.gender || 'male'
  );
  const [age, setAge] = useState<string>(
    session?.passenger?.age ? String(session.passenger.age) : '28'
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    session?.passenger?.dateOfBirth || '1996-05-14'
  );
  const [nationality, setNationality] = useState<string>(
    session?.passenger?.nationality || 'Indian'
  );
  const [passportNumber, setPassportNumber] = useState<string>(
    session?.passenger?.passportNumber || ''
  );
  const [passportExpiry, setPassportExpiry] = useState<string>(
    session?.passenger?.passportExpiry || '2030-08-15'
  );
  const [passportCountry, setPassportCountry] = useState<string>(
    session?.passenger?.passportCountry || 'India'
  );
  const [preference, setPreference] = useState(
    session?.passenger?.berthOrSeatPreference || 'No Preference'
  );

  // Cab-specific location fields
  const [pickupAddress, setPickupAddress] = useState(
    session?.passenger?.pickupAddress ||
      `${selectedOption?.originCity || 'City'} Airport Terminal Curbside Pickup`
  );
  const [dropAddress, setDropAddress] = useState(
    session?.passenger?.dropAddress ||
      `${selectedOption?.destinationCity || 'City'} Center Hotel / Office Drop`
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    session?.passenger?.specialInstructions || 'Call upon arrival; assist with luggage.'
  );

  // Additional passengers state (for 2nd, 3rd travellers)
  const initialAdditional: Passenger[] =
    session?.additionalPassengers ||
    Array.from({ length: Math.max(0, totalPassengersCount - 1) }, (_, i) => ({
      id: `pax-add-${i + 1}`,
      fullName: '',
      email: '',
      phone: '',
      gender: 'male',
      age: 25,
      berthOrSeatPreference: 'No Preference',
    }));

  const [additionalPassengers, setAdditionalPassengers] = useState<Passenger[]>(initialAdditional);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Primary Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter legal full name (minimum 2 characters).';
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address for your e-ticket & boarding pass.';
    }

    // 3. Phone
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please provide a valid contact phone number.';
    }

    // 4. Age
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      newErrors.age = 'Please enter a valid age between 1 and 120.';
    }

    // 5. International flight passport validation
    if (isInternationalFlight) {
      if (!passportNumber.trim() || passportNumber.trim().length < 6) {
        newErrors.passportNumber =
          'International travel requires a valid Passport Number (minimum 6 characters).';
      }
      if (!passportExpiry.trim()) {
        newErrors.passportExpiry = 'Passport expiry date is required.';
      }
      if (!passportCountry.trim()) {
        newErrors.passportCountry = 'Passport issuing country is required.';
      }
    }

    // 6. Cab pickup/drop validation
    if (service === 'cab') {
      if (!pickupAddress.trim()) {
        newErrors.pickupAddress = 'Please specify pickup address or landmark.';
      }
      if (!dropAddress.trim()) {
        newErrors.dropAddress = 'Please specify drop-off address.';
      }
    }

    // 7. Additional passengers validation
    additionalPassengers.forEach((pax, idx) => {
      if (!pax.fullName.trim() || pax.fullName.trim().length < 2) {
        newErrors[`pax_${idx}_name`] = `Passenger ${idx + 2}: Full legal name is required.`;
      }
      if (!pax.age || pax.age < 1 || pax.age > 120) {
        newErrors[`pax_${idx}_age`] = `Passenger ${idx + 2}: Valid age is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdditionalChange = (index: number, field: keyof Passenger, value: any) => {
    setAdditionalPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    // Clear specific error
    if (errors[`pax_${index}_${field === 'fullName' ? 'name' : field}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`pax_${index}_${field === 'fullName' ? 'name' : field}`];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const primaryPassenger: Passenger = {
      id: `pax-1-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      age: parseInt(age, 10),
      dateOfBirth: isInternationalFlight ? dateOfBirth : undefined,
      nationality: isInternationalFlight ? nationality : undefined,
      passportNumber: isInternationalFlight ? passportNumber.trim().toUpperCase() : undefined,
      passportExpiry: isInternationalFlight ? passportExpiry : undefined,
      passportCountry: isInternationalFlight ? passportCountry : undefined,
      berthOrSeatPreference: preference,
      pickupAddress: service === 'cab' ? pickupAddress.trim() : undefined,
      dropAddress: service === 'cab' ? dropAddress.trim() : undefined,
      specialInstructions: service === 'cab' ? specialInstructions.trim() : undefined,
    };

    // Update active session in storage
    BookingStorageService.saveActiveSession({
      ...session,
      passenger: primaryPassenger,
      additionalPassengers: additionalPassengers.length > 0 ? additionalPassengers : undefined,
      selectedClass,
      step: 'review',
    });

    const routePrefix =
      service === 'flight'
        ? 'flights'
        : service === 'train'
        ? 'trains'
        : service === 'bus'
        ? 'buses'
        : 'cabs';
    navigate(`/${routePrefix}/review`);
  };

  // If no option is selected in session, provide graceful fallback
  if (!selectedOption) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">No Travel Option Selected</h2>
          <p className="text-xs text-neutral-500">
            Please select a flight, train, bus, or cab from the search results to enter traveller
            information.
          </p>
          <Link
            to={`/${
              service === 'flight'
                ? 'flights'
                : service === 'train'
                ? 'trains'
                : service === 'bus'
                ? 'buses'
                : 'cabs'
            }`}
            className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
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
              <span className="font-semibold text-neutral-900 text-sm">
                {selectedOption.originCity} ({selectedOption.originCode})
              </span>
              <p className="text-[11px] text-neutral-500">
                {selectedOption.originStationOrTerminal || selectedOption.originCity}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">To</span>
              <span className="font-semibold text-neutral-900 text-sm">
                {selectedOption.destinationCity} ({selectedOption.destinationCode})
              </span>
              <p className="text-[11px] text-neutral-500">
                {selectedOption.destinationStationOrTerminal || selectedOption.destinationCity}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Schedule</span>
              <span className="font-semibold text-neutral-900 text-sm">
                {selectedOption.departureTime} → {selectedOption.arrivalTime}
              </span>
              <p className="text-[11px] text-neutral-500">
                {searchCriteria?.departureDate || 'Selected Departure'}
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Information Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-700" />
                <span>Primary Traveller Information</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Enter passenger details matching your government-issued photo identity card or
                passport.
              </p>
            </div>
            {isInternationalFlight && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-50 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
                <Globe className="w-3.5 h-3.5" />
                <span>International Flight Protocol</span>
              </span>
            )}
          </div>

          {/* Form Fields: Primary Passenger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Full Legal Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alexander Wright"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.fullName
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>E-Ticket & Boarding Pass Email *</span>
              </label>
              <input
                type="email"
                placeholder="alexander@voyagehub.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>Mobile Phone (SMS Gate & Chauffeur Updates) *</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98401 23456"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.phone
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
            </div>

            {/* Demographics: Gender & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Age (Years) *</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  className={`w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border bg-neutral-50/50 focus:bg-white focus:outline-none transition-all ${
                    errors.age
                      ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                      : 'border-neutral-200 focus:ring-2 focus:ring-neutral-900'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-red-600">{errors.age}</p>}
              </div>
            </div>
          </div>

          {/* International Passport Section (when Flight & International) */}
          {isInternationalFlight && (
            <div className="p-5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-sky-900">
                <Globe className="w-4 h-4 text-sky-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  International Passport & Immigration Data
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Z1234567"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  {errors.passportNumber && (
                    <p className="text-[10px] text-red-600">{errors.passportNumber}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Passport Expiry *
                  </label>
                  <input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  {errors.passportExpiry && (
                    <p className="text-[10px] text-red-600">{errors.passportExpiry}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Issuing Country *
                  </label>
                  <input
                    type="text"
                    placeholder="India / UAE / UK"
                    value={passportCountry}
                    onChange={(e) => setPassportCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  {errors.passportCountry && (
                    <p className="text-[10px] text-red-600">{errors.passportCountry}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Indian / British / Emirati"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Transport-specific Seating/Berth/Address Preferences */}
          <div className="pt-4 border-t border-neutral-100">
            {service === 'train' && (
              <div className="space-y-1.5 max-w-md">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-neutral-400" />
                  <span>IRCTC Berth Allocation Preference</span>
                </label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="No Preference">No Preference (System Automatic)</option>
                  <option value="Lower Berth">Lower Berth</option>
                  <option value="Middle Berth">Middle Berth</option>
                  <option value="Upper Berth">Upper Berth</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Side Upper">Side Upper</option>
                  <option value="Window Seat">Window Seat (Chair Car)</option>
                </select>
              </div>
            )}

            {service === 'bus' && (
              <div className="space-y-1.5 max-w-md">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Coach Seat / Berth Preference</span>
                </label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Lower Sleeper">Lower Sleeper Berth</option>
                  <option value="Upper Sleeper">Upper Sleeper Berth</option>
                  <option value="Window Seater">Window Seat (Forward Facing)</option>
                  <option value="Aisle Seater">Aisle Seat</option>
                </select>
              </div>
            )}

            {service === 'flight' && (
              <div className="space-y-1.5 max-w-md">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Seat Assignment Preference</span>
                </label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Window Seat">Window Seat</option>
                  <option value="Aisle Seat">Aisle Seat</option>
                  <option value="Extra Legroom">Extra Legroom (Complimentary eligible)</option>
                </select>
              </div>
            )}

            {service === 'cab' && (
              <div className="space-y-4 p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Car className="w-4 h-4 text-indigo-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Chauffeur Pickup & Drop Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Exact Pickup Address / Landmark *</span>
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="e.g. Apartment 402, Green Glen Road, Bellandur"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    {errors.pickupAddress && (
                      <p className="text-[10px] text-red-600">{errors.pickupAddress}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>Destination Drop Address *</span>
                    </label>
                    <input
                      type="text"
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      placeholder="e.g. Grand Hyatt Mumbai, Santacruz East"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    {errors.dropAddress && (
                      <p className="text-[10px] text-red-600">{errors.dropAddress}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Special Notes for Chauffeur
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Travelling with senior citizens; boot space needed for 2 large suitcases"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Multiple Passengers Section (if search criteria had > 1 passenger) */}
          {additionalPassengers.length > 0 && (
            <div className="pt-6 border-t border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Additional Travellers ({additionalPassengers.length})
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Details for accompanying passengers on this itinerary.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {additionalPassengers.map((pax, idx) => (
                  <div
                    key={pax.id}
                    className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700">
                        Passenger #{idx + 2}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          value={pax.fullName}
                          onChange={(e) => handleAdditionalChange(idx, 'fullName', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                        {errors[`pax_${idx}_name`] && (
                          <p className="text-[10px] text-red-600">{errors[`pax_${idx}_name`]}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">
                          Gender *
                        </label>
                        <select
                          value={pax.gender}
                          onChange={(e) => handleAdditionalChange(idx, 'gender', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={pax.age}
                          onChange={(e) =>
                            handleAdditionalChange(idx, 'age', parseInt(e.target.value, 10))
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                        {errors[`pax_${idx}_age`] && (
                          <p className="text-[10px] text-red-600">{errors[`pax_${idx}_age`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity encrypted with AES-256 travel compliance standards.</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Continue to Trip Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
