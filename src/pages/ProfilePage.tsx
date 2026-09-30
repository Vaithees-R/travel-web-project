import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Ticket,
  LogOut,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Loader2,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Booking } from '../types/booking';
import { TransportBadge } from '../components/ui/TransportBadge';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.fullName);
      setEditPhone(user.phone);
      api.bookings
        .list()
        .then((data) => setBookings(data))
        .catch((err) => console.warn('Could not fetch user bookings for profile', err));
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const totalTrips = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setIsSaving(true);

    try {
      const updated = await api.users.updateMe({
        full_name: editName,
        phone: editPhone,
      });
      updateUser(updated);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update profile', err);
      setEditError(err?.message || 'Failed to update traveler profile.');
      setIsSaving(false);
    }
  };

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* 1. Personal Travel Passport Header Card */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Traveler Profile</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {user.fullName}
              </h1>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Member since {formattedJoinDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Activity Summary Pills */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Total Journeys
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {totalTrips}
            </div>
            <span className="text-[10px] text-neutral-400">PostgreSQL itineraries</span>
          </div>

          <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Upcoming
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span>{upcomingCount}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400/80" />
            </div>
            <span className="text-[10px] text-neutral-400">Active reservations</span>
          </div>

          <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-neutral-300 tracking-wider block">
              Completed
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-neutral-200 mt-0.5 flex items-center gap-1.5">
              <span>{completedCount}</span>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            <span className="text-[10px] text-neutral-400">Past itineraries</span>
          </div>

          <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
              Cancelled
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-300 mt-0.5 flex items-center gap-1.5">
              <span>{cancelledCount}</span>
              <XCircle className="w-4 h-4 text-rose-400/80" />
            </div>
            <span className="text-[10px] text-neutral-400">Refunded bookings</span>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Personal Information</h2>
            <p className="text-xs text-neutral-500">Contact data automatically filled during ticket reservation</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            PostgreSQL Account
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>Full Name</span>
            </span>
            <div className="font-semibold text-neutral-900 text-sm">{user.fullName}</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>Email Address</span>
            </span>
            <div className="font-semibold text-neutral-900 text-sm font-mono">{user.email}</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>Mobile Phone</span>
            </span>
            <div className="font-semibold text-neutral-900 text-sm font-mono">{user.phone}</div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>Traveler Account ID</span>
            </span>
            <div className="font-semibold text-neutral-900 text-sm font-mono">{user.id}</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">Edit Traveler Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Update your legal name and contact phone. Email and account identifier are immutable for account integrity.
            </p>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1 opacity-70">
                <label className="text-xs font-semibold text-neutral-500 block">
                  Email Address (Immutable)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full h-10 px-3.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Direct Itinerary Access */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Ticket className="w-4 h-4 text-emerald-600" />
            <span>Passenger Itinerary Center</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            Access Your Boarding Passes & Documents
          </h3>
          <p className="text-xs text-neutral-500 max-w-md">
            View detailed station schematics, flight e-tickets, sleeper berth assignments, and cancellation controls.
          </p>
        </div>

        <Link
          to="/bookings"
          className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shrink-0 transition-all"
        >
          <span>View My Trips ({totalTrips})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4. Quick Travel Service Navigation */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Book New Journeys
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/flights"
            className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-sky-400 hover:shadow-xs transition-all text-left group"
          >
            <TransportBadge type="flight" size="sm" variant="subtle" className="mb-2" />
            <div className="font-bold text-xs text-neutral-900 group-hover:text-sky-700">Flights</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Air corridors</div>
          </Link>

          <Link
            to="/trains"
            className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 hover:shadow-xs transition-all text-left group"
          >
            <TransportBadge type="train" size="sm" variant="subtle" className="mb-2" />
            <div className="font-bold text-xs text-neutral-900 group-hover:text-amber-800">Trains</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">IRCTC berths</div>
          </Link>

          <Link
            to="/buses"
            className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-400 hover:shadow-xs transition-all text-left group"
          >
            <TransportBadge type="bus" size="sm" variant="subtle" className="mb-2" />
            <div className="font-bold text-xs text-neutral-900 group-hover:text-emerald-800">Buses</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Volvo sleepers</div>
          </Link>

          <Link
            to="/cabs"
            className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left group"
          >
            <TransportBadge type="cab" size="sm" variant="subtle" className="mb-2" />
            <div className="font-bold text-xs text-neutral-900 group-hover:text-indigo-800">Cabs</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Chauffeur outstation</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
