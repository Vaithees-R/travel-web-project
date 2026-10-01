import React, { useState } from 'react';
import { User } from '../../types/auth';
import { api } from '../../services/api';
import { Shield, Key, Eye, EyeOff, Check, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SecuritySectionProps {
  user: User;
  onLogout: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      errors.currentPassword = 'You must enter your current password.';
    }

    if (!newPassword || newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long.';
    } else if (newPassword === currentPassword) {
      errors.newPassword = 'New password must be different from your current password.';
    }

    if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Password confirmation does not match new password.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.users.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setSuccessMessage('Password changed successfully. Your account is secured with bcrypt.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setValidationErrors({});
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Password change error', err);
      setErrorMessage(err?.message || 'Failed to change password. Please verify your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Authentication</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            Account Security & Password
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Update your account password with cryptographic verification.
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

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (validationErrors.currentPassword) {
                    setValidationErrors({ ...validationErrors, currentPassword: undefined });
                  }
                }}
                className="w-full h-10 pl-3.5 pr-10 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                placeholder="Enter existing password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <p className="text-[11px] text-rose-600">{validationErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 block">
              New Password (Minimum 8 Characters)
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (validationErrors.newPassword) {
                    setValidationErrors({ ...validationErrors, newPassword: undefined });
                  }
                }}
                className="w-full h-10 pl-3.5 pr-10 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
                placeholder="Enter at least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.newPassword && (
              <p className="text-[11px] text-rose-600">{validationErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) {
                  setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                }
              }}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
              placeholder="Re-type new password"
              required
            />
            {validationErrors.confirmPassword && (
              <p className="text-[11px] text-rose-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Session Management Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Active Session & Sign Out
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your current device session. Signing out disposes your client authentication token.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs">
            <span className="text-neutral-500 block">Signed in as:</span>
            <strong className="text-neutral-900 font-mono">{user.email}</strong>
            <span className="text-[11px] text-neutral-400 block">
              Cryptographically signed JWT bearer token session
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
