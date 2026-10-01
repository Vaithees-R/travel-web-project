import React, { useState } from 'react';
import { User, TravelPreferences } from '../../types/auth';
import { api } from '../../services/api';
import { Check, AlertCircle, Loader2, Save, Plane, Train, Bus, Car, Compass, Utensils, Bell } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TravelPreferencesSectionProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const TravelPreferencesSection: React.FC<TravelPreferencesSectionProps> = ({
  user,
  onUpdateUser,
}) => {
  const initialPrefs = user.preferences || {};
  const [preferredTransport, setPreferredTransport] = useState<'flight' | 'train' | 'bus' | 'cab'>(
    initialPrefs.preferred_transport || 'flight'
  );
  const [preferredCabin, setPreferredCabin] = useState<'Economy' | 'Premium Economy' | 'Business'>(
    initialPrefs.preferred_cabin || 'Economy'
  );
  const [preferredSeat, setPreferredSeat] = useState<'Window' | 'Aisle' | 'Any'>(
    initialPrefs.preferred_seat || 'Window'
  );
  const [mealPreference, setMealPreference] = useState<'Vegetarian' | 'Non-vegetarian' | 'No Preference'>(
    initialPrefs.meal_preference || 'No Preference'
  );
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>(
    initialPrefs.contact_method || 'email'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const updatedPrefs: TravelPreferences = {
        preferred_transport: preferredTransport,
        preferred_cabin: preferredCabin,
        preferred_seat: preferredSeat,
        meal_preference: mealPreference,
        contact_method: contactMethod,
      };

      const serverPrefs = await api.users.savePreferences(updatedPrefs);
      onUpdateUser({
        ...user,
        preferences: serverPrefs,
      });

      setSuccessMessage('Travel preferences saved and synced to your account.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to save travel preferences', err);
      setErrorMessage(err?.message || 'Unable to update travel preferences. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
          Travel Preferences
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Customize your default travel choices to streamline future bookings.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Preferred Transport Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 block">
            Primary Transport Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'flight', label: 'Flights', icon: Plane, color: 'text-sky-600' },
              { id: 'train', label: 'Trains', icon: Train, color: 'text-amber-600' },
              { id: 'bus', label: 'Buses', icon: Bus, color: 'text-emerald-600' },
              { id: 'cab', label: 'Cabs', icon: Car, color: 'text-indigo-600' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = preferredTransport === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPreferredTransport(mode.id as any)}
                  className={cn(
                    'p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5',
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs font-semibold'
                      : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isSelected ? 'text-emerald-400' : mode.color)} />
                  <span className="text-xs">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Cabin Class */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 block">
            Preferred Airline / Train Cabin
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['Economy', 'Premium Economy', 'Business'] as const).map((cabin) => {
              const isSelected = preferredCabin === cabin;
              return (
                <button
                  key={cabin}
                  type="button"
                  onClick={() => setPreferredCabin(cabin)}
                  className={cn(
                    'p-2.5 rounded-xl border text-center text-xs transition-all',
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-700'
                  )}
                >
                  {cabin}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seat & Meal Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Seat Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>Preferred Seating</span>
            </label>
            <select
              value={preferredSeat}
              onChange={(e) => setPreferredSeat(e.target.value as any)}
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="Window">Window Seat</option>
              <option value="Aisle">Aisle Seat</option>
              <option value="Any">No Preference / Any Seat</option>
            </select>
          </div>

          {/* Meal Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-neutral-400" />
              <span>In-Flight & Train Meal Preference</span>
            </label>
            <select
              value={mealPreference}
              onChange={(e) => setMealPreference(e.target.value as any)}
              className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="No Preference">No Dietary Preference</option>
              <option value="Vegetarian">Vegetarian (AVML)</option>
              <option value="Non-vegetarian">Non-Vegetarian Standard</option>
            </select>
          </div>
        </div>

        {/* Preferred Communication Channel */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-neutral-400" />
            <span>Preferred Communication Channel</span>
          </label>
          <div className="flex items-center gap-4 text-xs text-neutral-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={contactMethod === 'email'}
                onChange={() => setContactMethod('email')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Email ({user.email})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={contactMethod === 'phone'}
                onChange={() => setContactMethod('phone')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Mobile SMS ({user.phone || 'Phone'})</span>
            </label>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
          <strong>Smart Prefilling Note:</strong> These preferences are stored securely in PostgreSQL and used to auto-fill search forms and passenger fields. You can always override any value on a specific booking.
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-neutral-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Travel Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
