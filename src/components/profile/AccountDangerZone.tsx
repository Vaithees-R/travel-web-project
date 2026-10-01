import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Lock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export interface AccountDangerZoneProps {
  userEmail: string;
  onLogout: () => void;
}

export const AccountDangerZone: React.FC<AccountDangerZoneProps> = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE' && password.trim().length > 0;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      setErrorMessage('You must type DELETE in all uppercase to confirm.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsDeleting(true);
    try {
      await api.users.deleteAccount({
        confirmation: 'DELETE',
        password,
      });

      // Clear authentication and session
      onLogout();
      navigate('/');
    } catch (err: any) {
      console.error('Account deletion error', err);
      setErrorMessage(err?.message || 'Failed to delete account. Please verify your password.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Danger Zone</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            Permanently Delete Account
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
            Irrevocably erase your traveler profile, personal preferences, and all associated booking itineraries from PostgreSQL. This action cannot be undone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setErrorMessage(null);
            setConfirmText('');
            setPassword('');
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-base sm:text-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Confirm Account Deletion</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                disabled={isDeleting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs text-rose-900 space-y-1.5 leading-relaxed">
              <p className="font-semibold">You are about to delete account: {userEmail}</p>
              <p className="text-[11px] text-rose-800">
                This will purge all booking records, boarding passes, and account history from our PostgreSQL database immediately.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleDelete} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Type <span className="font-mono font-bold text-rose-700">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-mono"
                  disabled={isDeleting}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Verify Account Password:</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-mono"
                  disabled={isDeleting}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isConfirmed || isDeleting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-300 disabled:text-neutral-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
