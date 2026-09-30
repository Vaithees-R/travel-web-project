import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { SCENIC_IMAGES, FLIGHT_IMAGES, TRAIN_IMAGES } from '../assets/travelImages';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const authImages = [
    SCENIC_IMAGES[0],
    FLIGHT_IMAGES[2],
    TRAIN_IMAGES[0],
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to bookings itinerary
    navigate('/bookings');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* LEFT: Travel Image Visual Panel */}
        <div className="lg:col-span-6 relative bg-neutral-950 flex flex-col justify-between overflow-hidden p-8 sm:p-12 text-white">
          {/* Subtle Carousel in Background */}
          <div className="absolute inset-0 z-0">
            <TravelImageCarousel
              images={authImages}
              intervalMs={6500}
              aspectRatio="auto"
              className="w-full h-full"
              showOverlay={true}
              overlayGradient="from-neutral-950 via-neutral-950/70 to-neutral-950/40"
              showCaption={false}
              showIndicators={false}
            />
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Voyage<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
          </div>

          {/* Bottom Editorial Narrative */}
          <div className="relative z-10 space-y-4 max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              The Journey Begins Here
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              One account for flights, trains, coaches, and chauffeur cabs.
            </h2>
            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instant access to synchronized PNRs and boarding passes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automatic flight delay alerts linked with your cab pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Saved co-passengers for faster IRCTC Tatkal bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Focused Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Traveler Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-neutral-500">
                Sign in to view your booked journeys, e-tickets, and itineraries
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@example.com"
                  className="w-full h-11 px-3.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 block">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-neutral-600 cursor-pointer select-none">
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Sign In to Traveler Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
              New to VoyageHub?{' '}
              <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
                Create your traveler account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
