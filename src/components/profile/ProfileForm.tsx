import React, { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { api } from '../../services/api';
import { Check, AlertCircle, Loader2, Save, User as UserIcon, Phone, Mail, Hash } from 'lucide-react';

export interface ProfileFormProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFullName(user.fullName);
    setPhone(user.phone);
  }, [user.fullName, user.phone]);

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; phone?: string }>({});

  const validate = () => {
    const errors: { fullName?: string; phone?: string } = {};
    if (!fullName || fullName.trim().length < 2) {
      errors.fullName = 'Full legal name must be at least 2 characters long.';
    }
    if (!phone || phone.trim().length < 8) {
      errors.phone = 'Please enter a valid contact phone number with country/area code.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!validate()) return;

    setIsSaving(true);
    try {
      const updated = await api.users.updateMe({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });
      onUpdateUser(updated);
      setSuccessMessage('Profile details updated successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to update profile', err);
      setErrorMessage(err?.message || 'Unable to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
          Personal Information
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Update your contact and legal passenger identification for future boarding passes.
        </p>
      </div>

      {successMessage && (
        <div role="status" aria-live="polite" className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="profile-fullName" className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span>Full Legal Name (Matches Travel ID)</span>
          </label>
          <input
            id="profile-fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: undefined });
            }}
            className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-medium text-neutral-900"
            placeholder="e.g. Alexander Wright"
            required
          />
          {fieldErrors.fullName && (
            <p className="text-[11px] text-rose-600">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="space-y-1">
          <label htmlFor="profile-phone" className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>Mobile Phone Number</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
            }}
            className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-medium text-neutral-900"
            placeholder="e.g. +91 98401 23456"
            required
          />
          {fieldErrors.phone && (
            <p className="text-[11px] text-rose-600">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Immutable Email */}
        <div className="space-y-1 opacity-75">
          <label htmlFor="profile-email" className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>Primary Email Address (Immutable)</span>
          </label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="w-full h-10 px-3.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed font-mono"
          />
          <span className="text-[10px] text-neutral-400">Account login emails cannot be modified directly.</span>
        </div>

        {/* Immutable Account Identifier */}
        <div className="space-y-1 opacity-75">
          <label htmlFor="profile-id" className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-neutral-400" />
            <span>Traveler Account ID</span>
          </label>
          <input
            id="profile-id"
            type="text"
            value={user.id}
            disabled
            className="w-full h-10 px-3.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed font-mono"
          />
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-neutral-100">
          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="px-5 py-2.5 min-h-[44px] bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs focus-ring cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
