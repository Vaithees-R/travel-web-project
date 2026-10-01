import { Calendar, ShieldCheck, Mail, Phone } from 'lucide-react';
import { User } from '../../types/auth';

export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'VH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface ProfileHeaderProps {
  user: User;
  totalTripsCount: number;
  upcomingTripsCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalTripsCount,
  upcomingTripsCount,
}) => {
  const initials = getInitials(user.fullName);

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-neutral-800">
      {/* Subtle decorative glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Deterministic Initials Avatar */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-neutral-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shrink-0 select-none tracking-wider border-2 border-white/20"
            aria-label={`Avatar for ${user.fullName}`}
          >
            {initials}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {user.fullName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Traveler</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Member since {formattedJoinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Travel Badges */}
        <div className="flex items-center gap-3 sm:border-l sm:border-neutral-800 sm:pl-6">
          <div className="text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Total Trips
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-white">
              {totalTripsCount}
            </span>
          </div>
          <div className="text-center sm:text-right pl-3 border-l border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
              Upcoming
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
              {upcomingTripsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
