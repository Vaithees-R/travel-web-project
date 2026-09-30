import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle, Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { TravelImageCarousel } from '../components/media/TravelImageCarousel';
import { SCENIC_IMAGES, FLIGHT_IMAGES, TRAIN_IMAGES } from '../assets/travelImages';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Destination after login
  const fromLocation = (location.state as { from?: { pathname: string; search?: string } })?.from;
  const returnUrl = fromLocation ? `${fromLocation.pathname}${fromLocation.search || ''}` : '/bookings';

  const authImages = [
    SCENIC_IMAGES[0],
    FLIGHT_IMAGES[2],
    TRAIN_IMAGES[0],
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      navigate(returnUrl, { replace: true });
    } else {
      setErrorMessage(result.error || 'Email or password is incorrect.');
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@voyagehub.com');
    setPassword('Traveler123!');
    setErrorMessage('');
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
                <span>Saved traveler records for faster checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Focused Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Traveler Portal
                </span>
                {/* 1-Click Demo Fill Action */}
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg transition-colors"
                  title="Auto-fill sample credentials for demonstration"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Use Demo Account</span>
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-neutral-500">
                Sign in to view your personal booked journeys, e-tickets, and itineraries
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-3.5 pr-10 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Traveler Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Full-Stack Notice */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-neutral-600 leading-normal">
                <strong>Full-Stack Authentication:</strong> Backed by FastAPI REST API, PostgreSQL persistence, bcrypt password hashing, and JWT authorization tokens.
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100 text-center text-xs text-neutral-500">
              New to VoyageHub?{' '}
              <Link to="/register" state={{ from: fromLocation }} className="font-semibold text-emerald-700 hover:underline">
                Create your traveler account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
