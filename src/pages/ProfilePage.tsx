import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  Compass,
  Shield,
  Ticket,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Booking } from '../types/booking';
import { api } from '../services/api';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileForm } from '../components/profile/ProfileForm';
import { TravelPreferencesSection } from '../components/profile/TravelPreferencesSection';
import { SecuritySection } from '../components/profile/SecuritySection';
import { AccountStats } from '../components/profile/AccountStats';
import { AccountActivity } from '../components/profile/AccountActivity';
import { AccountDangerZone } from '../components/profile/AccountDangerZone';
import { cn } from '../utils/cn';

type ProfileTab = 'personal' | 'preferences' | 'security' | 'activity' | 'danger';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as ProfileTab | null;
  const initialTab: ProfileTab =
    tabParam && ['personal', 'preferences', 'security', 'activity', 'danger'].includes(tabParam)
      ? tabParam
      : 'personal';

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Sync tab with URL search parameter if user navigates or changes it
  useEffect(() => {
    if (tabParam && tabParam !== activeTab && ['personal', 'preferences', 'security', 'activity', 'danger'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (user) {
      setIsLoadingBookings(true);
      api.bookings
        .list()
        .then((data) => {
          setBookings(data);
        })
        .catch((err) => {
          console.warn('Could not fetch user bookings for profile', err);
        })
        .finally(() => {
          setIsLoadingBookings(false);
        });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const totalTrips = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const tabs: Array<{
    id: ProfileTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    color?: string;
  }> = [
    { id: 'personal', label: 'Personal Information', icon: UserIcon },
    { id: 'preferences', label: 'Travel Preferences', icon: Compass },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'activity', label: 'Activity & Stats', icon: Ticket, badge: totalTrips },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, color: 'text-rose-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* 1. Header Passport Card */}
      <ProfileHeader
        user={user}
        totalTripsCount={totalTrips}
        upcomingTripsCount={upcomingCount}
      />

      {/* 2. Horizontal Navigation Tabs */}
      <div className="border-b border-neutral-200">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none"
          aria-label="Profile Sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none',
                  isActive
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5',
                    isActive ? 'text-emerald-400' : tab.color || 'text-neutral-400'
                  )}
                />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none font-bold',
                      isActive ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-700'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'personal' && (
          <ProfileForm user={user} onUpdateUser={updateUser} />
        )}

        {activeTab === 'preferences' && (
          <TravelPreferencesSection user={user} onUpdateUser={updateUser} />
        )}

        {activeTab === 'security' && (
          <SecuritySection user={user} onLogout={logout} />
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <AccountStats
              totalTrips={totalTrips}
              upcomingCount={upcomingCount}
              completedCount={completedCount}
              cancelledCount={cancelledCount}
            />
            {isLoadingBookings ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center flex items-center justify-center gap-2 text-neutral-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Loading latest travel activity from PostgreSQL...</span>
              </div>
            ) : (
              <AccountActivity bookings={bookings} />
            )}
          </div>
        )}

        {activeTab === 'danger' && (
          <AccountDangerZone userEmail={user.email} onLogout={logout} />
        )}
      </div>
    </div>
  );
};
